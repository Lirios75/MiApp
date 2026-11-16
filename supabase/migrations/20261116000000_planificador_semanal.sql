-- Planeador Semanal (pedido de la usuaria, Sesión 8, cierre de año) — 5to ícono de la app
-- interna: objetivos de la semana, agua, hábitos L-D, notas, gratitud y tareas por día.
-- Una fila por usuaria y semana (semana_inicio = el lunes de esa semana, mismo criterio que
-- diasDeLaSemana() en lib/app.ts). Los campos compuestos (hábitos/tareas, que son listas
-- variables definidas por la usuaria) van en jsonb en vez de tablas aparte — evita 3 tablas
-- normalizadas más para un dato que siempre se lee/escribe junto, por semana completa.

create table if not exists public.planificador_semanas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  semana_inicio date not null,
  objetivos jsonb not null default '[]'::jsonb,
  agua jsonb not null default '[0,0,0,0,0,0,0]'::jsonb,
  habitos jsonb not null default '[]'::jsonb,
  tareas jsonb not null default '[[],[],[],[],[],[],[]]'::jsonb,
  notas text,
  gratitud jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, semana_inicio)
);

create index if not exists planificador_semanas_user_id_idx on public.planificador_semanas (user_id);

alter table public.planificador_semanas enable row level security;

create policy "planificador: la usuaria ve el suyo" on public.planificador_semanas
  for select using ((select auth.uid()) = user_id);

create policy "planificador: la usuaria crea el suyo" on public.planificador_semanas
  for insert with check ((select auth.uid()) = user_id);

create policy "planificador: la usuaria actualiza el suyo" on public.planificador_semanas
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Grant base (sin esto el rol "authenticated" recibe 403 antes de llegar a RLS — mismo bug que
-- ya pasó con perfiles/checkins/metas, ver supabase/migrations/20261015000000_grants.sql).
grant select, insert, update on public.planificador_semanas to authenticated;
