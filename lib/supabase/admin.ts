// Cliente de Supabase con la llave SERVICE ROLE — tiene acceso total, sin RLS. SOLO se usa
// desde código que corre en el servidor (el webhook de Hotmart). Nunca importar este archivo
// desde un componente de cliente: la llave NO lleva el prefijo NEXT_PUBLIC_ a propósito, para
// que Next.js no la incluya en el bundle del navegador.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cliente: SupabaseClient | null = null;

/** El chequeo de la llave vive DENTRO de la función (no al importar el módulo) para que un
 * build sin el secreto a mano no tumbe el deploy — el fail-secure real pasa en cada request. */
export function supabaseAdmin(): SupabaseClient {
  if (cliente) return cliente;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('FALTA NEXT_PUBLIC_SUPABASE_URL');
  if (!llave) throw new Error('FALTA SUPABASE_SERVICE_ROLE_KEY — el webhook no puede operar de forma segura');
  cliente = createClient(url, llave, { auth: { persistSession: false, autoRefreshToken: false } });
  return cliente;
}

/** Busca una cuenta de Auth por correo exacto. supabase-js no trae un `getUserByEmail`
 * directo — se usa el endpoint admin de GoTrue (el mismo que hay detrás de `listUsers`). */
async function buscarUsuarioAuthPorCorreo(email: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !llave) throw new Error('FALTA configuración de Supabase para buscar la cuenta');
  const res = await fetch(`${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
    headers: { apikey: llave, Authorization: `Bearer ${llave}` },
  });
  if (!res.ok) return null;
  const datos = await res.json();
  const usuarios: Array<{ id: string; email?: string }> = Array.isArray(datos) ? datos : (datos.users ?? []);
  const encontrado = usuarios.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return encontrado?.id ?? null;
}

/** Crea la cuenta de quien compró (o reutiliza la que ya tenía, si vuelve a comprar con el
 * mismo correo) y devuelve su id — lo necesitamos ANTES de tocar `perfiles`, para nunca dejar
 * un pago "procesado" sin una cuenta real detrás (18-VENTA-HOTMART.md, "Pagó y no entra"). */
export async function crearOEncontrarUsuarioAuth(email: string, nombre: string): Promise<string> {
  const { data, error } = await supabaseAdmin().auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: nombre ? { full_name: nombre } : undefined,
  });
  if (!error && data.user) return data.user.id;

  const existente = await buscarUsuarioAuthPorCorreo(email);
  if (existente) return existente;

  throw error ?? new Error('No se pudo crear ni encontrar la cuenta de quien compró');
}

/** Cliente con la llave pública (anon), SIN persistir sesión — para disparar el enlace mágico
 * desde el servidor reusando el mismo camino de /entrar (Supabase Auth + SMTP de Resend ya
 * conectado), sin montar un envío de correo aparte. No usar `crearClienteSupabase()` (la de
 * `lib/supabase/client.ts`) aquí: esa está pensada para el navegador. */
export function supabaseAnonServidor(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !llave) throw new Error('FALTA configuración pública de Supabase');
  return createClient(url, llave, { auth: { persistSession: false, autoRefreshToken: false } });
}
