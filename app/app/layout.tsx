// APP INTERNA — shell con nav inferior. Protegida con sesión real de
// Supabase Auth (Sesión 6): sin sesión, redirige a /entrar — nadie ve datos
// de otra persona ni una app "vacía" haciéndose pasar por la de alguien más.
// AppFondo necesita `isolate` en el padre (mismo bug ya documentado en
// components/funnel/ui.tsx: sin isolate, el bg del padre tapa el fondo
// decorativo).
//
// GATE DE ACCESO (2026-11-25, hueco de seguridad real cerrado): tener sesión NO basta — hasta
// hoy cualquiera con una cuenta de Supabase (ej. entrando directo a /entrar sin tocar Hotmart
// nunca) tenía acceso completo gratis para siempre, porque nada volvía a mirar el estado de la
// membresía después del login. Ahora se lee `perfiles` y se decide con `tieneAccesoAhora` (FSM
// pura en lib/membership-fsm.ts): sin acceso vigente (prueba gratis vencida, sin pago, cancelada
// fuera de su ciclo ya pagado, etc.) → al paywall, no a la app.

import { redirect } from 'next/navigation';
import { AppFondo, BottomNav } from '@/components/app/ui';
import { crearClienteSupabaseServidor } from '@/lib/supabase/server';
import { tieneAccesoAhora, type EstadoMembresia } from '@/lib/membership-fsm';

export default async function AppInternaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await crearClienteSupabaseServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('status, trial_ends_at, access_until, grace_ends_at, fecha_inicio_trial')
    .eq('id', data.user.id)
    .maybeSingle();

  if (perfil) {
    const acceso = tieneAccesoAhora(
      {
        status: perfil.status as EstadoMembresia | null,
        trialEndsAt: perfil.trial_ends_at,
        accessUntil: perfil.access_until,
        graceEndsAt: perfil.grace_ends_at,
        fechaInicioTrial: perfil.fecha_inicio_trial,
      },
      new Date()
    );
    if (!acceso) redirect('/paywall');
  }

  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AppFondo />
      <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
