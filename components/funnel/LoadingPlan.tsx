'use client';

// LOADING "CONSTRUYENDO TU PLAN" — 50-DISENO-ONBOARDING-PAYWALL.md §B.
// No es relleno: es el argumento de apertura del paywall (labor illusion,
// Buell & Norton 2011). 4-6s totales, nunca spinner genérico.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';

const INTERVALO_MS = 1100;
const PAUSA_FINAL_MS = 400;
const CIRC = 2 * Math.PI * 44; // r=44 en un viewBox de 100

export function LoadingPlan({
  lineas,
  onDone,
  onClose,
}: {
  lineas: string[];
  onDone: () => void;
  /** Salida durante la carga — sin esto no hay forma de salir en los ~4.4s
   * que dura esta pantalla (heurística 3: control y libertad). */
  onClose?: () => void;
}) {
  const reduce = useReducedMotion();
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    if (activa >= lineas.length) {
      const t = setTimeout(onDone, PAUSA_FINAL_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiva((i) => i + 1), INTERVALO_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, lineas.length, reduce]);

  const porcentaje = Math.round((Math.min(activa, lineas.length) / lineas.length) * 100);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Salir"
          className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <X size={18} strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="relative flex size-28 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" strokeWidth="9" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            animate={{ strokeDashoffset: CIRC - (CIRC * porcentaje) / 100 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {porcentaje}%
        </span>
      </div>

      <h1 className="mt-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Armando tu Semáforo del Gasto…
      </h1>

      <ul className="mt-8 flex w-full flex-col gap-4 text-left" aria-live="polite" aria-busy={activa < lineas.length}>
        {lineas.map((linea, i) => {
          const estado = i < activa ? 'completada' : i === activa ? 'activa' : 'pendiente';
          return (
            <li key={i} className="flex items-start gap-3">
              {estado === 'completada' ? (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
                  className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
                >
                  <Check size={12} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
                </motion.span>
              ) : estado === 'activa' ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="mt-1.5 inline-flex size-3 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex size-4 shrink-0 rounded-full border-2 border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]"
                />
              )}
              <span
                className={`text-[15px] leading-snug ${
                  estado === 'pendiente' ? 'text-[var(--text-secondary)] opacity-40' : 'text-[var(--text-primary)]'
                }`}
              >
                {linea}
              </span>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}
