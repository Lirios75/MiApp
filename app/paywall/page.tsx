'use client';

// PAYWALL — loading (labor illusion) + planes (50-DISENO-ONBOARDING-PAYWALL.md §B/§C).
// El checkout real de Hotmart se conecta en la Sesión 6 (ver ESTADO.md); por ahora
// el CTA lleva a /entrar, simulando el paso siguiente sin fingir un cobro real
// (C3ter: "mockups honestos" — nunca un checkout falso que parezca procesar un pago).

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { CheckCustom } from '@/components/landing/ui';
import { LoadingPlan } from '@/components/funnel/LoadingPlan';
import { FunnelButton } from '@/components/funnel/ui';
import { RespiraMark } from '@/components/RespiraMark';
import { LABEL_DOLOR, LABEL_META, LABEL_MOMENTO, leerRespuestas, type RespuestasOnboarding } from '@/lib/onboarding';
import { GARANTIA_DIAS, PLAN_ANUAL, PLAN_MENSUAL, TRIAL_DIAS } from '@/lib/pricing';

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export default function Paywall() {
  const router = useRouter();
  const [fase, setFase] = useState<'cargando' | 'listo'>('cargando');
  const [respuestas, setRespuestas] = useState<RespuestasOnboarding>({});
  const [plan, setPlan] = useState<'anual' | 'mensual'>('anual');
  const reduce = useReducedMotion();

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
  const metaLabel = respuestas.meta ? LABEL_META[respuestas.meta] : 'tu plata';

  const hoy = useMemo(() => new Date(), []);
  const dia5 = useMemo(() => new Date(hoy.getTime() + 5 * 86400000), [hoy]);
  const dia7 = useMemo(() => new Date(hoy.getTime() + TRIAL_DIAS * 86400000), [hoy]);
  const montoCobro = plan === 'anual' ? PLAN_ANUAL.montoCobro : PLAN_MENSUAL.montoCobro;

  if (fase === 'cargando') {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        <LoadingPlan lineas={lineas} onDone={() => setFase('listo')} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto flex w-full max-w-[500px] flex-col px-4 pb-10 pt-4">
        <div className="flex h-11 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Cerrar"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
          <RespiraMark />
          <span className="size-11" aria-hidden="true" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex flex-col gap-6"
        >
          <div>
            <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
              Tu <span className="text-[var(--accent)]">Semáforo del Gasto</span> para {metaLabel.toLowerCase()} está listo
            </h1>
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
              {nRespuestas > 0 ? `Hecho con tus ${nRespuestas} respuestas.` : 'Hecho con tus respuestas del quiz.'}
            </p>
          </div>

          {/* Value stack — 3 beneficios en lenguaje de resultado, checks custom (50 §C2 variante d) */}
          <ul className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5">
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

          {/* Cards de plan */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setPlan('anual')}
              className={`relative rounded-[var(--radius-card)] border p-5 text-left transition-colors ${
                plan === 'anual'
                  ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]'
                  : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
              }`}
            >
              <span className="absolute -top-[10px] left-5 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
                {PLAN_ANUAL.badge}
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[16px] font-semibold text-[var(--text-primary)]">{PLAN_ANUAL.nombre}</span>
                <span className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {PLAN_ANUAL.precioMes}
                  <span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{PLAN_ANUAL.totalAnual}</p>
              <p className="mt-1 text-[13px] font-semibold text-[var(--accent)]">{PLAN_ANUAL.ahorro}</p>
            </button>

            <button
              type="button"
              onClick={() => setPlan('mensual')}
              className={`rounded-[var(--radius-card)] border p-5 text-left transition-colors ${
                plan === 'mensual'
                  ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]'
                  : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[16px] font-semibold text-[var(--text-primary)]">{PLAN_MENSUAL.nombre}</span>
                <span className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {PLAN_MENSUAL.precioMes}
                  <span className="text-[13px] font-normal text-[var(--text-secondary)]">/mes</span>
                </span>
              </div>
            </button>
          </div>

          {/* Timeline del trial — visual default con trial (50 §C4) */}
          <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5">
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

          <FunnelButton onClick={() => router.push('/entrar')}>Empezar mis {TRIAL_DIAS} días gratis</FunnelButton>

          <p className="-mt-2 text-center text-[13px] text-[var(--text-secondary)]">
            Cancela cuando quieras · te avisamos antes del cobro
          </p>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-center text-[14px] font-medium text-[var(--text-tertiary)] [touch-action:manipulation]"
          >
            Ahora no
          </button>

          <p className="flex items-center justify-center gap-4 text-[12px] text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1">
              <Lock size={14} strokeWidth={2} aria-hidden="true" /> Pago seguro
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" /> Garantía de {GARANTIA_DIAS} días
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
