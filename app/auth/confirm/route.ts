// Recibe el clic del enlace mágico que envía Supabase Auth (26-AUTH-MODERNO.md):
// intercambia el token de un solo uso por una sesión real y redirige a /app.
// Sin esto, el enlace del correo no lleva a ningún lado.

import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/app';

  if (tokenHash && type) {
    const supabase = await crearClienteSupabaseServidor();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) redirect(next);
  }

  redirect('/entrar?error=enlace_invalido');
}
