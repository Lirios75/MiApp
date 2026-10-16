-- Fix real del bug de la foto de perfil: el GRANT de UPDATE (migración anterior) no bastaba
-- porque a `perfiles` nunca se le había creado una POLÍTICA de RLS para "update" (solo existían
-- las de select e insert, desde la migración inicial). Sin esa política, RLS bloquea la fila en
-- silencio: el PATCH devuelve 204 "éxito" pero no actualiza ninguna fila — por eso avatar_url
-- seguía en NULL aunque la consola no mostrara ningún error.

drop policy if exists "perfiles: el usuario actualiza el suyo" on public.perfiles;
create policy "perfiles: el usuario actualiza el suyo" on public.perfiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
