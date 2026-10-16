'use client';

// CUENTA — pantalla secundaria (ajustes/plan), sin revisor-visual obligatorio.
// Protagonista: estado del plan y la prueba gratis.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Bell, Camera, Globe, LogOut, Mail, ShieldCheck, User } from 'lucide-react';
import { PLAN_ANUAL, PLAN_MENSUAL, TRIAL_DIAS } from '@/lib/pricing';
import { cerrarSesionSupabase, obtenerEstadoApp, subirFotoPerfilSupabase } from '@/lib/supabase/datos';
import type { EstadoMembresiaApp } from '@/lib/app';

const SOPORTE_EMAIL = 'lina.rios@ikigaihumano.com';

function diasDeTrialRestantes(fechaInicioTrial: string | null): number {
  if (!fechaInicioTrial) return TRIAL_DIAS;
  const inicio = new Date(fechaInicioTrial);
  const hoy = new Date();
  const transcurridos = Math.floor((hoy.getTime() - inicio.getTime()) / 86_400_000);
  return Math.max(0, TRIAL_DIAS - transcurridos);
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

/** Mensaje de la tarjeta del plan — una vez que Hotmart confirmó una compra real
 * (estadoMembresia no es null), reemplaza la estimación local de siempre. */
function mensajeMembresia(estado: Exclude<EstadoMembresiaApp, null>, trialTerminaEl: string | null, accesoHasta: string | null): string {
  switch (estado) {
    case 'trialing':
      return trialTerminaEl ? `Prueba gratis activa — termina el ${formatearFecha(trialTerminaEl)}` : 'Prueba gratis activa';
    case 'active':
      return 'Tu plan está activo';
    case 'past_due':
      return 'Tu último pago no pasó — actualiza tu método para no perder el acceso';
    case 'cancelled':
      return accesoHasta ? `Cancelaste — tienes acceso hasta el ${formatearFecha(accesoHasta)}` : 'Cancelaste tu plan';
    case 'expired':
      return 'Tu plan venció';
    case 'refunded':
    case 'chargeback':
      return 'Tu plan ya no está activo';
    default:
      return '';
  }
}

export default function Cuenta() {
  const router = useRouter();
  const [plan, setPlan] = useState<'anual' | 'mensual' | null>(null);
  const [diasRestantes, setDiasRestantes] = useState(TRIAL_DIAS);
  const [notificaciones, setNotificaciones] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [membresia, setMembresia] = useState<{
    estado: EstadoMembresiaApp;
    planHotmart: string | null;
    trialTerminaEl: string | null;
    accesoHasta: string | null;
  }>({ estado: null, planHotmart: null, trialTerminaEl: null, accesoHasta: null });
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const guardado = window.localStorage.getItem('respira_plan');
    setPlan(guardado === 'anual' ? 'anual' : 'mensual');
    setNotificaciones(window.localStorage.getItem('respira_notificaciones') !== 'no');
    obtenerEstadoApp().then((estado) => {
      setDiasRestantes(diasDeTrialRestantes(estado.fechaInicioTrial));
      setAvatarUrl(estado.avatarUrl);
      setMembresia({
        estado: estado.estadoMembresia,
        planHotmart: estado.planHotmart,
        trialTerminaEl: estado.trialTerminaEl,
        accesoHasta: estado.accesoHasta,
      });
    });
  }, []);

  const tienePlanReal = membresia.estado !== null;

  async function cambiarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    setErrorFoto(null);
    setSubiendoFoto(true);
    try {
      const estado = await subirFotoPerfilSupabase(archivo);
      setAvatarUrl(estado.avatarUrl);
    } catch (error) {
      setErrorFoto(error instanceof Error ? error.message : 'No pudimos subir tu foto. Intenta de nuevo.');
    } finally {
      setSubiendoFoto(false);
    }
  }

  function alternarNotificaciones() {
    setNotificaciones((actual) => {
      const nuevo = !actual;
      window.localStorage.setItem('respira_notificaciones', nuevo ? 'si' : 'no');
      return nuevo;
    });
  }

  const infoPlan = tienePlanReal
    ? (membresia.planHotmart === 'Anual' ? PLAN_ANUAL : PLAN_MENSUAL)
    : (plan === 'anual' ? PLAN_ANUAL : PLAN_MENSUAL);

  async function salir() {
    await cerrarSesionSupabase();
    router.push('/');
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <header>
        <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Cuenta</h1>
      </header>

      <section className="flex flex-col items-center gap-2">
        <div className="relative">
          <span
            aria-hidden="true"
            className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-[var(--chip-bg)]"
            style={{ opacity: subiendoFoto ? 0.5 : 1 }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <User size={36} strokeWidth={1.75} color="var(--accent)" aria-hidden="true" />
            )}
          </span>
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            disabled={subiendoFoto}
            aria-label="Cambiar foto de perfil"
            className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[var(--accent)] disabled:opacity-60 [touch-action:manipulation]"
          >
            <Camera size={15} strokeWidth={2} color="var(--bg)" aria-hidden="true" />
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={cambiarFoto}
            className="hidden"
          />
        </div>
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">
          {subiendoFoto ? 'Subiendo foto…' : avatarUrl ? 'Toca el ícono para cambiarla' : 'Toca el ícono para subir tu foto'}
        </p>
        {errorFoto && <p className="text-[13px] text-[var(--accent-3-text)]">{errorFoto}</p>}
      </section>

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
            {tienePlanReal
              ? mensajeMembresia(membresia.estado!, membresia.trialTerminaEl, membresia.accesoHasta)
              : diasRestantes > 0
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
