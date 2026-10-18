'use client';

// El dispositivo ownable de FICHA-ARTE.md: dos anillos de respiración, uno
// adentro del otro (inhalas/exhalas) — verde afuera (progreso/calma), naranja
// adentro (alerta leve/racha), cada uno con su propia abertura. Reemplaza al
// anillo único azul anterior (logo elegido por la usuaria, Opción B, 2026-10-18).

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

// Cada anillo cubre 270° con una abertura de 90° (como fracción del círculo:
// pathLength 0.75). pathOffset ubica dónde empieza: afuera, la abertura queda
// abajo (pathOffset 0.375); adentro, arriba (pathOffset 0.875) — opuestas,
// como el ritmo de inhalar/exhalar.
const BARRIDO = 0.75;
const OFFSET_EXTERIOR = 0.375;
const OFFSET_INTERIOR = 0.875;

export function RespiraMark({
  duracionS = 0.9,
  estatico = false,
}: {
  duracionS?: number;
  /** true = marca en reposo, anillos CERRADOS y quietos — para headers junto a una
   * barra de progreso real (dos elementos "a medio llenar" a la vez se leen como
   * loaders duplicados). Sin esto, el gesto de "se dibuja al entrar" es el correcto
   * (Hero, /entrar). */
  estatico?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  if (estatico) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9.3"
          stroke="var(--accent-2)"
          strokeWidth="2.2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${BARRIDO} ${1 - BARRIDO}`}
          strokeDashoffset={-OFFSET_EXTERIOR}
        />
        <circle
          cx="12"
          cy="12"
          r="5.7"
          stroke="var(--accent-3)"
          strokeWidth="2.2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${BARRIDO} ${1 - BARRIDO}`}
          strokeDashoffset={-OFFSET_INTERIOR}
        />
      </svg>
    );
  }

  return (
    <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.circle
        cx="12"
        cy="12"
        r="9.3"
        stroke="var(--accent-2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ pathOffset: OFFSET_EXTERIOR, pathSpacing: 1 - BARRIDO }}
        initial={{ pathLength: reduce ? BARRIDO : 0 }}
        animate={{ pathLength: inView ? BARRIDO : reduce ? BARRIDO : 0 }}
        transition={{ duration: reduce ? 0 : duracionS, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="5.7"
        stroke="var(--accent-3)"
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{ pathOffset: OFFSET_INTERIOR, pathSpacing: 1 - BARRIDO }}
        initial={{ pathLength: reduce ? BARRIDO : 0 }}
        animate={{ pathLength: inView ? BARRIDO : reduce ? BARRIDO : 0 }}
        transition={{
          duration: reduce ? 0 : duracionS,
          delay: reduce ? 0 : 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}
