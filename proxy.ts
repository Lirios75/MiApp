import { NextResponse, type NextRequest } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';

// Mientras Supabase no esté configurado (Sesión 6 en curso), deja pasar todo
// sin tocar nada — así el sitio sigue funcionando con localStorage mientras
// se conecta el backend real.
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.next();
  return actualizarSesion(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
