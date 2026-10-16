-- Foto de perfil (Sesión 6, feature pedida por la usuaria). Dos piezas:
-- 1) una columna en perfiles para guardar la URL pública de la foto.
-- 2) un "almacén" (bucket) de Supabase Storage donde viven los archivos de las fotos,
--    con permisos para que cada usuaria solo pueda subir/cambiar/borrar la suya.

alter table public.perfiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars: cualquiera puede ver" on storage.objects;
create policy "avatars: cualquiera puede ver" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars: la usuaria sube el suyo" on storage.objects;
create policy "avatars: la usuaria sube el suyo" on storage.objects
  for insert with check (bucket_id = 'avatars' and (select auth.uid()::text) = (storage.foldername(name))[1]);

drop policy if exists "avatars: la usuaria actualiza el suyo" on storage.objects;
create policy "avatars: la usuaria actualiza el suyo" on storage.objects
  for update using (bucket_id = 'avatars' and (select auth.uid()::text) = (storage.foldername(name))[1]);

drop policy if exists "avatars: la usuaria borra el suyo" on storage.objects;
create policy "avatars: la usuaria borra el suyo" on storage.objects
  for delete using (bucket_id = 'avatars' and (select auth.uid()::text) = (storage.foldername(name))[1]);
