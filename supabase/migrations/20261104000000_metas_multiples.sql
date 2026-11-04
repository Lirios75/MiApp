-- Varias metas por usuario a la vez (pedido por la usuaria, Sesión 7) — antes `metas.user_id`
-- era la clave primaria, lo que forzaba UNA sola fila por usuario. Ahora cada meta es su propia
-- fila con su propio id; `user_id` deja de ser único (RLS sigue filtrando por user_id igual).

alter table public.metas add column if not exists id uuid default gen_random_uuid();
update public.metas set id = gen_random_uuid() where id is null;
alter table public.metas alter column id set not null;
alter table public.metas drop constraint if exists metas_pkey;
alter table public.metas add primary key (id);
create index if not exists metas_user_id_idx on public.metas (user_id);
alter table public.metas add column if not exists created_at timestamptz not null default now();
