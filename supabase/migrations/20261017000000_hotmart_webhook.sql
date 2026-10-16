-- Fase 2 de Hotmart (18-VENTA-HOTMART.md): el webhook que conecta el pago real con la cuenta
-- de la usuaria. Agrega las columnas de membresía a `perfiles`, las tablas de seguridad del
-- webhook (dedupe + log) y la función que aplica cada evento de forma atómica.

-- ── perfiles: columnas de membresía real (hoy el plan se "adivinaba" en el navegador) ──────────
alter table public.perfiles
  add column if not exists email text,
  add column if not exists status text
    check (status is null or status in
      ('trialing', 'active', 'past_due', 'cancelled', 'expired', 'refunded', 'chargeback')),
  add column if not exists plan text not null default 'free' check (plan in ('free', 'pro')),
  add column if not exists hotmart_subscriber_code text,
  add column if not exists hotmart_plan_name text,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists first_paid_at timestamptz,
  add column if not exists access_until timestamptz,
  add column if not exists grace_ends_at timestamptz;

create unique index if not exists perfiles_email_key on public.perfiles (email) where email is not null;
create unique index if not exists perfiles_hotmart_subscriber_code_key
  on public.perfiles (hotmart_subscriber_code) where hotmart_subscriber_code is not null;

-- ⚠️ CIERRE DE SEGURIDAD: las políticas de RLS ya permitían a cualquier usuaria autenticada
-- hacer update/insert sobre SU PROPIA fila de `perfiles` (para la foto de perfil). Eso dejaba
-- una puerta abierta: con la clave pública, cualquiera podía llamar
-- `supabase.from('perfiles').update({status:'active', plan:'pro'})` y auto-otorgarse Pro gratis
-- — RLS protege la FILA, no la COLUMNA. Se cierra con permisos a nivel de columna (Postgres sí
-- los soporta junto a RLS): el rol `authenticated` solo puede tocar las columnas que su propio
-- código necesita de verdad; el resto (status/plan/fechas de membresía) solo lo escribe la
-- función de abajo, que corre como `service_role`.
revoke update on public.perfiles from authenticated;
grant update (avatar_url) on public.perfiles to authenticated;
revoke insert on public.perfiles from authenticated;
grant insert (id, fecha_inicio_trial) on public.perfiles to authenticated;

-- ── processed_events: dedupe — Hotmart REENVÍA el mismo evento si el endpoint tarda o falla ────
create table if not exists public.processed_events (
  event_id     text primary key,
  event_type   text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);
alter table public.processed_events enable row level security;
-- Sin políticas a propósito: solo `service_role` (el webhook) lo toca, y ese rol salta RLS.

-- ── webhook_log: registro de CADA intento (éxito y fallo) — para diagnosticar "pagó y no entra" ─
create table if not exists public.webhook_log (
  id          bigserial primary key,
  event_id    text,
  type        text,
  result      text not null check (result in ('applied', 'duplicate', 'illegal', 'unauthorized', 'error')),
  received_at timestamptz not null default now()
);
alter table public.webhook_log enable row level security;
create index if not exists webhook_log_received_idx on public.webhook_log (received_at desc);

-- ── apply_hotmart_event: aplica UN evento de forma atómica (dedupe + cambio de estado juntos) ──
-- El `user_id` ya viene resuelto por el endpoint (la cuenta de Auth se crea/encuentra ANTES de
-- llamar esta función) — así evitamos el caso "el evento quedó procesado pero la cuenta nunca
-- se creó" (18-VENTA-HOTMART.md, "Pagó y no entra").
create or replace function public.apply_hotmart_event(
  p_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_user_id uuid,
  p_email text,
  p_subscriber_code text,
  p_plan_name text,
  p_new_status text,
  p_trial_ends_at timestamptz,
  p_access_until timestamptz,
  p_grace_ends_at timestamptz
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare v_current text;
begin
  -- (a) IDEMPOTENCIA: si este event_id ya se procesó, salir sin tocar nada más.
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  select status into v_current from public.perfiles where id = p_user_id;

  -- (b) TRANSICIÓN ILEGAL: no resucitar un reembolso/contracargo con un evento viejo reentregado.
  if v_current in ('refunded', 'chargeback') and p_new_status in ('active', 'trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_current);
  end if;

  insert into public.perfiles (
    id, email, plan, status, hotmart_subscriber_code, hotmart_plan_name,
    trial_ends_at, access_until, grace_ends_at, first_paid_at, fecha_inicio_trial
  )
  values (
    p_user_id, p_email,
    case when p_new_status in ('refunded', 'chargeback') then 'free' else 'pro' end,
    p_new_status, p_subscriber_code, p_plan_name,
    p_trial_ends_at, p_access_until, p_grace_ends_at,
    case when p_new_status = 'active' then now() else null end,
    (now() at time zone 'utc')::date
  )
  on conflict (id) do update
    set email = excluded.email,
        plan = case when excluded.status in ('refunded', 'chargeback') then 'free' else 'pro' end,
        status = excluded.status,
        hotmart_subscriber_code = coalesce(excluded.hotmart_subscriber_code, public.perfiles.hotmart_subscriber_code),
        hotmart_plan_name = coalesce(excluded.hotmart_plan_name, public.perfiles.hotmart_plan_name),
        trial_ends_at = coalesce(excluded.trial_ends_at, public.perfiles.trial_ends_at),
        access_until = excluded.access_until,
        grace_ends_at = excluded.grace_ends_at,
        -- first_paid_at se fija SOLO la primera vez que llega un cobro real (mide trial→pago)
        first_paid_at = coalesce(public.perfiles.first_paid_at,
                          case when excluded.status = 'active' then now() else null end);

  return jsonb_build_object('status', 'applied', 'new_status', p_new_status);
end;
$$;

revoke all on function public.apply_hotmart_event from public, anon, authenticated;
grant execute on function public.apply_hotmart_event to service_role;
