'use client';

// El dispositivo ownable de FICHA-ARTE.md: el anillo de respiración se llena
// al entrar en pantalla (75%, el mismo gesto que la pantalla principal de la
// app) — la marca en vez de un cuadrado genérico, y con movimiento propio.

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const CIRC = 44.7;
const OBJETIVO = 11.2; // ~75% lleno

export function RespiraMark() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

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
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
