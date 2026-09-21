// Refresca el token de sesión de Supabase en cada request (patrón SSR oficial):
// sin esto, la sesión del usuario expira en silencio y lo saca de /app sin avisar.

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
        },
      },
    }
  );

  // IMPORTANTE: no borrar esta línea (getUser revalida el token contra el
  // servidor; getSession solo lee la cookie local, sin verificar si expiró).
  await supabase.auth.getUser();

  return respuesta;
}
