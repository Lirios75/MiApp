// Cliente de Supabase para Componentes de Cliente ('use client'). La URL y la
// clave publicable son públicas por diseño (62 §3.1) — la seguridad real la
// da RLS en la base de datos, no el secreto de esta clave.

import { createBrowserClient } from '@supabase/ssr';

export function crearClienteSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
