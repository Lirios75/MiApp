'use client';

// El dispositivo ownable de FICHA-ARTE.md: el anillo de respiración se llena
// al entrar en pantalla (75%, el mismo gesto que la pantalla principal de la
// app) — la marca en vez de un cuadrado genérico, y con movimiento propio.

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const CIRC = 44.7;
const OBJETIVO = 11.2; // ~75% lleno

export function RespiraMark({
  duracionS = 0.9,
  estatico = false,
}: {
  duracionS?: number;
  /** true = marca en reposo, anillo CERRADO y quieto — para headers junto a una
   * barra de progreso real (dos elementos "a medio llenar" a la vez se leen como
   * loaders duplicados). Sin esto, el gesto de "se llena al entrar" es el correcto
   * (Hero, /entrar). */
  estatico?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  if (estatico) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="3" />
      <motion.circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: reduce ? OBJETIVO : CIRC }}
        animate={{ strokeDashoffset: inView ? OBJETIVO : reduce ? OBJETIVO : CIRC }}
        transition={{ duration: reduce ? 0 : duracionS, ease: [0.16, 1, 0.3, 1] }}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
