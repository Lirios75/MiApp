// APP INTERNA — shell con nav inferior (Sesión 5). Sin backend todavía: la
// sesión "real" llega en Sesión 6; por ahora cualquiera que entre a /app ve
// su Semáforo local. AppFondo necesita `isolate` en el padre (mismo bug ya
// documentado en components/funnel/ui.tsx: sin isolate, el bg del padre tapa
// el fondo decorativo).

import { AppFondo, BottomNav } from '@/components/app/ui';

export default function AppInternaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AppFondo />
      <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
