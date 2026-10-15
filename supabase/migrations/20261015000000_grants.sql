-- Permisos de acceso a las tablas para el rol autenticado (Sesión 6, fix).
-- RLS ya filtra QUÉ filas puede ver cada usuaria; esto es el permiso base que
-- faltaba para que el rol "authenticated" pueda tocar estas tablas en absoluto
-- (sin esto, PostgREST devuelve 403 "permission denied" antes de llegar a RLS).

grant usage on schema public to authenticated;

grant select, insert on public.perfiles to authenticated;
grant select, insert, update on public.checkins to authenticated;
grant select, insert, update, delete on public.metas to authenticated;
