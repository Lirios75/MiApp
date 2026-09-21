// Cliente de Supabase para Componentes de Servidor / Server Actions — lee y
// escribe la sesión en las cookies de Next.js (patrón SSR oficial de Supabase).
// `setAll` puede fallar en un Componente de Servidor puro (no puede escribir
// cookies); se ignora ahí porque `middleware.ts` ya refresca la sesión.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function crearClienteSupabaseServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component sin permiso de escritura — middleware.ts refresca la sesión.
          }
        },
      },
    }
  );
}
