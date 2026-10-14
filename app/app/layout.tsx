// APP INTERNA — shell con nav inferior. Protegida con sesión real de
// Supabase Auth (Sesión 6): sin sesión, redirige a /entrar — nadie ve datos
// de otra persona ni una app "vacía" haciéndose pasar por la de alguien más.
// AppFondo necesita `isolate` en el padre (mismo bug ya documentado en
// components/funnel/ui.tsx: sin isolate, el bg del padre tapa el fondo
// decorativo).

import { redirect } from 'next/navigation';
import { AppFondo, BottomNav } from '@/components/app/ui';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';

export default async function AppInternaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await crearClienteSupabaseServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AppFondo />
      <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
