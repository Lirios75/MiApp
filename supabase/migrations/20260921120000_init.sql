-- Esquema inicial de Respira (Sesión 6 — 25-BASE-DE-DATOS.md / 62-PUBLICACION-SEGURA-Y-CONTINUA.md).
-- Reemplaza el localStorage de lib/app.ts: mismo modelo de datos, ahora con RLS real por usuario.
-- Cómo aplicarla: se ejecuta UNA vez en el SQL Editor de Supabase (dashboard) del proyecto que
-- cree la usuaria — este sandbox no tiene acceso de red a Supabase para hacerlo por CLI.

-- ── perfiles: 1 fila por usuario, fecha en que empezó su prueba gratis ─────────────────────────
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  fecha_inicio_trial date not null default (now() at time zone 'utc')::date,
  created_at timestamptz not null default now()
);

alter table public.perfiles enable row level security;

create policy "perfiles: el usuario ve el suyo" on public.perfiles
  for select using ((select auth.uid()) = id);

create policy "perfiles: el usuario crea el suyo" on public.perfiles
  for insert with check ((select auth.uid()) = id);

-- ── checkins: el Semáforo del Gasto, un registro por día ───────────────────────────────────────
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fecha date not null,
  estado text not null check (estado in ('tranquilo', 'alerta')),
  created_at timestamptz not null default now(),
  unique (user_id, fecha)
);

alter table public.checkins enable row level security;

create policy "checkins: el usuario ve los suyos" on public.checkins
  for select using ((select auth.uid()) = user_id);

create policy "checkins: el usuario crea los suyos" on public.checkins
  for insert with check ((select auth.uid()) = user_id);

create policy "checkins: el usuario corrige el de hoy" on public.checkins
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ── metas: una meta activa por usuario (ahorro en monto, o hábito en días de racha) ────────────
create table if not exists public.metas (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tipo text not null,
  nombre text not null,
  modo text not null check (modo in ('monto', 'habito')),
  objetivo numeric not null check (objetivo > 0),
  actual numeric not null default 0 check (actual >= 0),
  updated_at timestamptz not null default now()
);

alter table public.metas enable row level security;

create policy "metas: el usuario ve la suya" on public.metas
  for select using ((select auth.uid()) = user_id);

create policy "metas: el usuario crea la suya" on public.metas
  for insert with check ((select auth.uid()) = user_id);

create policy "metas: el usuario actualiza la suya" on public.metas
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "metas: el usuario borra la suya" on public.metas
  for delete using ((select auth.uid()) = user_id);
