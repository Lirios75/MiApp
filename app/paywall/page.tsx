'use client';

// PAYWALL — loading (labor illusion) + planes (50-DISENO-ONBOARDING-PAYWALL.md §B/§C).
// El checkout real de Hotmart se conecta en la Sesión 6 (ver ESTADO.md); por ahora
// el CTA lleva a /entrar, simulando el paso siguiente sin fingir un cobro real
// (C3ter: "mockups honestos" — nunca un checkout falso que parezca procesar un pago).

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { CheckCustom, Hairline } from '@/components/landing/ui';
import { LoadingPlan } from '@/components/funnel/LoadingPlan';
import { ConfirmSalir, FunnelButton, FunnelFondo } from '@/components/funnel/ui';
import { RespiraMark } from '@/components/RespiraMark';
import { LABEL_DOLOR, LABEL_META, LABEL_META_HEADLINE, LABEL_MOMENTO, leerRespuestas, type RespuestasOnboarding } from '@/lib/onboarding';
import { GARANTIA_DIAS, PLAN_ANUAL, PLAN_MENSUAL, TRIAL_DIAS } from '@/lib/pricing';

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

/** Stagger por bloque (14: 50-80ms entre elementos) — cada sección del paywall
 * entra por su cuenta en vez de un solo fade del contenedor completo. */
function Bloque({
  indice,
  reduce,
  className,
  children,
}: {
  indice: number;
  reduce: boolean | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.35, delay: reduce ? 0 : indice * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Paywall() {
  const router = useRouter();
  const [fase, setFase] = useState<'cargando' | 'listo'>('cargando');
  const [respuestas, setRespuestas] = useState<RespuestasOnboarding>({});
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const [avanzando, setAvanzando] = useState(false);
  const [errorAvance, setErrorAvance] = useState(false);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const reduce = useReducedMotion();

  const hayRespuestas = Object.keys(respuestas).length > 0;
  function salirConfirmando() {
    if (hayRespuestas) {
      setConfirmandoSalida(true);
      return;
    }
    router.push('/');
  }
  function empezarPrueba() {
    if (avanzando) return;
    setAvanzando(true);
    setErrorAvance(false);
    try {
      window.localStorage.setItem('respira_plan', plan);
    } catch {
      // no bloquea el avance — /entrar simplemente no tendrá el plan preseleccionado.
    }
    router.push('/entrar');
    // Salvaguarda: si la navegación no ocurre (falla o queda pendiente),
    // el CTA no se queda congelado en "Un momento…" para siempre (h9) — y esta
    // vez con un mensaje visible + forma de reintentar, no solo el botón mudo.
    setTimeout(() => {
      setAvanzando(false);
      setErrorAvance(true);
    }, 7000);
  }

  useEffect(() => {
    setRespuestas(leerRespuestas());
  }, []);

  const lineas = useMemo(() => {
    const dolor = respuestas.dolor ? LABEL_DOLOR[respuestas.dolor] : 'tu ansiedad con el dinero';
    const momento = respuestas.momento ? LABEL_MOMENTO[respuestas.momento] : 'tu rutina diaria';
    const meta = respuestas.meta ? LABEL_META[respuestas.meta] : 'tu meta con el dinero';
    return [
      `Analizando tu patrón: ${dolor}`,
      `Ajustando la hora: ${momento}`,
      `Preparando tu meta: ${meta}`,
      'Guardando tu compromiso diario',
    ];
  }, [respuestas]);

  const nRespuestas = Object.values(respuestas).filter(Boolean).length;
  const metaHeadline = respuestas.meta ? LABEL_META_HEADLINE[respuestas.meta] : 'tu plata';
  const dolorLabel = respuestas.dolor ? LABEL_DOLOR[respuestas.dolor] : null;

  const hoy = useMemo(() => new Date(), []);
  const dia5 = useMemo(() => new Date(hoy.getTime() + 5 * 86400000), [hoy]);
  const dia7 = useMemo(() => new Date(hoy.getTime() + TRIAL_DIAS * 86400000), [hoy]);
  const montoCobro = plan === 'anual' ? PLAN_ANUAL.montoCobro : PLAN_MENSUAL.montoCobro;

  if (fase === 'cargando') {
    return (
      <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        {/* Mismo fondo que el resto del funnel — antes esta fase era un fill
            plano (0 en el eje de profundidad de craft), un corte brusco justo
            antes de que aparezca la oferta. */}
        <FunnelFondo />
        <LoadingPlan lineas={lineas} onDone={() => setFase('listo')} onClose={salirConfirmando} />
        <ConfirmSalir
          abierto={confirmandoSalida}
          onSeguir={() => setConfirmandoSalida(false)}
          onSalir={() => router.push('/')}
          mensaje="Tus respuestas ya están guardadas — puedes volver a esto cuando quieras."
          labelSalir="Salir"
        />
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Mismo fondo que el resto del funnel — un solo componente compartido
          (FunnelFondo) en vez de dos copias divergiendo con cada fix. El
          `isolate` del contenedor padre sigue siendo necesario (ver su
          definición en components/funnel/ui.tsx). */}
      <FunnelFondo />
      <div className="mx-auto flex w-full max-w-[500px] flex-col px-4 pb-40 pt-4">
        <div className="flex h-11 items-center justify-between">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={salirConfirmando}
            aria-label="Cerrar"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </motion.button>
          <RespiraMark estatico />
          <span className="size-11" aria-hidden="true" />
        </div>

        <div className="mt-4 flex flex-col gap-6">
          <Bloque indice={0} reduce={reduce}>
            <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
              Tu <span className="whitespace-nowrap text-[var(--accent)]">Semáforo del Gasto</span> para {metaHeadline} está listo
            </h1>
            {dolorLabel && (
              <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
                Para que no vuelvas a decir «{dolorLabel.toLowerCase()}».
              </p>
            )}
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
              {nRespuestas > 0 ? `Hecho con tus ${nRespuestas} respuestas.` : 'Hecho con tus respuestas del quiz.'}
            </p>
          </Bloque>

          {/* Value stack — 3 beneficios en lenguaje de resultado, checks custom (50 §C2 variante d) */}
          <Bloque indice={1} reduce={reduce}>
            <ul className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
              {[
                'Tu Semáforo diario, sin conectar tu banco',
                'Notas el patrón antes de que se repita',
                'Tu racha y tu meta siempre visibles',
              ].map((texto) => (
                <li key={texto} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                  <CheckCustom />
                  <span>{texto}</span>
                </li>
              ))}
            </ul>
          </Bloque>

          {/* Cards de plan */}
          <Bloque indice={2} reduce={reduce}>
            <div className="flex flex-col gap-3">
              {/* Hairline degradé (gate binario de conversión, 55): el plan
                  recomendado es EL elemento de la vista que "esto importa". */}
              <Hairline emphasis={plan === 'anual'} className="relative">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPlan('anual')}
                  className={`w-full rounded-[var(--radius-card)] p-5 text-left transition-colors [touch-action:manipulation] ${
                    plan === 'anual'
                      ? 'bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] shadow-[var(--shadow-2)]'
                      : 'bg-[var(--surface)] shadow-[var(--shadow-1)]'
                  }`}
                >
                  <span className="absolute -top-[10px] left-5 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
                    {PLAN_ANUAL.badge}
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] font-semibold text-[var(--text-secondary)]">{PLAN_ANUAL.nombre}</span>
                    <span className="text-[20px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                      {PLAN_ANUAL.precioMes}
                      <span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
                  <p className="mt-1 text-[13px] font-semibold text-[var(--accent)]">{PLAN_ANUAL.ahorro}</p>
                </motion.button>
              </Hairline>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlan('mensual')}
                className={`rounded-[var(--radius-card)] border p-5 text-left transition-colors [touch-action:manipulation] ${
                  plan === 'mensual'
                    ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] shadow-[var(--shadow-2)]'
                    : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[var(--text-secondary)]">{PLAN_MENSUAL.nombre}</span>
                  <span className="text-[20px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {PLAN_MENSUAL.precioMes}
                    <span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                  </span>
                </div>
              </motion.button>
            </div>
          </Bloque>

          {/* Timeline del trial — visual default con trial (50 §C4) */}
          <Bloque indice={3} reduce={reduce}>
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-1)]">
              {[
                { activo: true, titulo: 'Hoy — acceso completo', detalle: 'Todo tu Semáforo, sin límites' },
                { activo: true, titulo: `Día 5 — ${formatearFecha(dia5)}, te avisamos`, detalle: 'Correo antes de cualquier cobro' },
                { activo: false, titulo: `Día 7 — ${formatearFecha(dia7)}, 1er cobro: ${montoCobro}`, detalle: 'Cancela antes sin costo' },
              ].map((nodo, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={`mt-1 size-3 shrink-0 rounded-full ${nodo.activo ? 'bg-[var(--accent)]' : 'border-2 border-[var(--accent)] bg-transparent'}`}
                    />
                    {i < 2 && <span aria-hidden="true" className="w-[2px] flex-1 bg-[color-mix(in_oklab,var(--accent)_30%,transparent)]" />}
                  </div>
                  <div className={i < 2 ? 'pb-5' : ''}>
                    <p className="text-[15px] font-semibold text-[var(--text-primary)]">{nodo.titulo}</p>
                    <p className="text-[13px] text-[var(--text-secondary)]">{nodo.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Bloque>

          <Bloque indice={4} reduce={reduce} className="flex flex-col items-center gap-4">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={salirConfirmando}
              className="text-center text-[14px] font-medium text-[var(--text-tertiary)] [touch-action:manipulation]"
            >
              Ahora no
            </motion.button>

            <p className="flex items-center justify-center gap-4 text-[12px] text-[var(--text-tertiary)]">
              <span className="inline-flex items-center gap-1">
                <Lock size={14} strokeWidth={2} aria-hidden="true" /> Pago seguro
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" /> Garantía de los Primeros {GARANTIA_DIAS} Días Sin Culpa
              </span>
            </p>
          </Bloque>
        </div>
      </div>

      {/* CTA fijo al fondo (no en el flujo del scroll): la 7ª pasada del revisor
          midió que el botón principal quedaba a ~88% del alto de la página sin
          ninguna forma de alcanzarlo sin desplazarse — en la pantalla que más
          dinero decide, la acción primaria no puede depender de que alguien
          llegue hasta el final. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)] bg-[var(--bg)] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 shadow-[var(--shadow-2)]">
        <div className="mx-auto w-full max-w-[500px]">
          <FunnelButton onClick={empezarPrueba} disabled={avanzando} cargando={avanzando}>
            {avanzando ? 'Un momento…' : `Empezar mis ${TRIAL_DIAS} días gratis`}
          </FunnelButton>
          {errorAvance && (
            <p role="status" aria-live="polite" className="mt-2 text-center text-[13px] text-[var(--text-secondary)]">
              Esto está tardando más de lo normal. Vuelve a intentarlo — si sigue sin avanzar, revisa tu conexión.
            </p>
          )}
        </div>
      </div>
      <ConfirmSalir
        abierto={confirmandoSalida}
        onSeguir={() => setConfirmandoSalida(false)}
        onSalir={() => router.push('/')}
        mensaje="Tus respuestas ya están guardadas — puedes volver a esto cuando quieras."
        labelSalir="Salir"
      />
    </div>
  );
}
