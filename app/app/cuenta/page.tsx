'use client';

// CUENTA — pantalla secundaria (ajustes/plan), sin revisor-visual obligatorio.
// Protagonista: estado del plan y la prueba gratis.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Bell, Globe, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { PLAN_ANUAL, PLAN_MENSUAL, TRIAL_DIAS } from '@/lib/pricing';
import { cerrarSesionLocal, leerEstadoApp } from '@/lib/app';

const SOPORTE_EMAIL = 'lina.rios@ikigaihumano.com';

function diasDeTrialRestantes(fechaInicioTrial: string | null): number {
  if (!fechaInicioTrial) return TRIAL_DIAS;
  const inicio = new Date(fechaInicioTrial);
  const hoy = new Date();
  const transcurridos = Math.floor((hoy.getTime() - inicio.getTime()) / 86_400_000);
  return Math.max(0, TRIAL_DIAS - transcurridos);
}

export default function Cuenta() {
  const router = useRouter();
  const [plan, setPlan] = useState<'anual' | 'mensual' | null>(null);
  const [diasRestantes, setDiasRestantes] = useState(TRIAL_DIAS);
  const [notificaciones, setNotificaciones] = useState(true);

  useEffect(() => {
    const guardado = window.localStorage.getItem('respira_plan');
    setPlan(guardado === 'anual' ? 'anual' : 'mensual');
    setDiasRestantes(diasDeTrialRestantes(leerEstadoApp().fechaInicioTrial));
    setNotificaciones(window.localStorage.getItem('respira_notificaciones') !== 'no');
  }, []);

  function alternarNotificaciones() {
    setNotificaciones((actual) => {
      const nuevo = !actual;
      window.localStorage.setItem('respira_notificaciones', nuevo ? 'si' : 'no');
      return nuevo;
    });
  }

  const infoPlan = plan === 'anual' ? PLAN_ANUAL : PLAN_MENSUAL;

  function salir() {
    cerrarSesionLocal();
    router.push('/');
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <header>
        <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Cuenta</h1>
      </header>

      <section className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu plan</p>
            <p className="mt-0.5 text-[19px] font-bold [font-family:var(--font-display)]">{infoPlan.nombre}</p>
          </div>
          <p className="text-[17px] font-bold text-[var(--accent)]">{infoPlan.precioMes}/mes</p>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-2)_10%,transparent)] px-3 py-2.5">
          <ShieldCheck size={16} strokeWidth={2} color="var(--accent-2)" aria-hidden="true" />
          <p className="text-[13px] font-medium text-[var(--accent-2-text)]">
            {diasRestantes > 0
              ? `Prueba gratis: te quedan ${diasRestantes} de ${TRIAL_DIAS} días`
              : 'Tu prueba gratis terminó'}
          </p>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] bg-[var(--surface)] p-2 shadow-[var(--shadow-1)]">
        <p className="px-3 pt-2 text-[13px] font-semibold text-[var(--text-secondary)]">Ajustes</p>
        <button
          type="button"
          onClick={alternarNotificaciones}
          role="switch"
          aria-checked={notificaciones}
          className="flex h-12 w-full items-center gap-3 rounded-[var(--radius-button)] px-3 text-left text-[15px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
        >
          <Bell size={18} strokeWidth={2} color="var(--text-secondary)" aria-hidden="true" />
          <span className="flex-1">Recordatorio diario</span>
          <span
            aria-hidden="true"
            className="flex h-6 w-10 items-center rounded-full p-0.5 transition-colors"
            style={{ background: notificaciones ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }}
          >
            <motion.span
              className="size-5 rounded-full bg-[var(--bg)]"
              animate={{ x: notificaciones ? 16 : 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        </button>
        <div className="flex h-12 w-full items-center gap-3 rounded-[var(--radius-button)] px-3 text-[15px] font-medium text-[var(--text-primary)]">
          <Globe size={18} strokeWidth={2} color="var(--text-secondary)" aria-hidden="true" />
          <span className="flex-1">Idioma</span>
          <span className="text-[13px] text-[var(--text-tertiary)]">Español</span>
        </div>
        <a
          href={`mailto:${SOPORTE_EMAIL}`}
          className="flex h-12 w-full items-center gap-3 rounded-[var(--radius-button)] px-3 text-[15px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
        >
          <Mail size={18} strokeWidth={2} color="var(--text-secondary)" aria-hidden="true" />
          <span className="flex-1">Escribir a soporte</span>
        </a>
      </section>

      <section className="flex-1 rounded-[var(--radius-card)] bg-[var(--surface)] p-2 shadow-[var(--shadow-1)]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={salir}
          className="flex h-12 w-full items-center gap-3 rounded-[var(--radius-button)] px-3 text-[15px] font-semibold text-[var(--accent-3-text)] [touch-action:manipulation]"
        >
          <LogOut size={18} strokeWidth={2} aria-hidden="true" />
          Cerrar sesión
        </motion.button>
      </section>
    </main>
  );
}
