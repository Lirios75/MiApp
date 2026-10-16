-- Fix: faltaba el permiso de UPDATE en perfiles (el GRANT original de la Sesión 6 solo daba
-- select+insert — nadie había necesitado actualizar una fila de perfiles hasta la foto de
-- perfil). Mismo tipo de bug que el 403 de checkins/metas, esta vez en perfiles.
-- De paso, confirmamos (sin romper nada si ya estaban) los permisos base sobre el storage de
-- Supabase para el rol autenticado — por si la subida de la foto también los necesitaba.

grant update on public.perfiles to authenticated;

grant usage on schema storage to authenticated;
grant select, insert, update, delete on storage.objects to authenticated;
grant select on storage.buckets to authenticated;
