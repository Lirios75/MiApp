'use client';

// KIT DEL FUNNEL — onboarding + paywall + login (50-DISENO-ONBOARDING-PAYWALL.md)
// Piezas compartidas de las 3 pantallas que generan el dinero. Mismos tokens que
// el kit de landing (components/landing/tokens.css, ya global vía globals.css) —
// cero valores nuevos de marca aquí, solo estructura y comportamiento.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RespiraMark } from '@/components/RespiraMark';

/* ── <FunnelHeader> — logo + atrás + barra de progreso (50 §A2, regla de marca).
   ENDOWED PROGRESS: el % nunca arranca en 0 — quien lo llama ya suma 5-8%. ── */
export function FunnelHeader({
  progreso,
  onBack,
}: {
  /** 0-100. */
  progreso: number;
  onBack?: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[500px] px-4 pt-4">
      <div className="flex h-11 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Atrás"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
          </button>
        ) : (
          <a href="/" className="flex size-11 shrink-0 items-center justify-center [touch-action:manipulation]">
            <RespiraMark />
          </a>
        )}
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── <FunnelButton> — el CTA del funnel (equivalente a CtaButton del kit de
   landing, pero como <button> con onClick — aquí no navegamos por href). ── */
export function FunnelButton({
  children,
  onClick,
  variant = 'solid',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const estilo =
    variant === 'outline'
      ? 'border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[var(--accent)] hover:bg-[var(--chip-bg)]'
      : 'bg-[var(--accent)] text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))]';
  return (
    <motion.button
      type={type}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] px-8 text-[17px] font-semibold transition-colors duration-150 [touch-action:manipulation] disabled:opacity-40 ${estilo}`}
    >
      {children}
    </motion.button>
  );
}

/* ── <OptionChip> — chip de opción única, ancho completo (50 §A2/A3).
   Tap → marca seleccionado → pausa 300ms visible → onSelect (auto-avance). ── */
export function OptionChip({
  icon: Icono,
  label,
  seleccionado,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  seleccionado: boolean;
  onSelect: () => void;
}) {
  const [marcando, setMarcando] = useState(false);
  const bloqueado = marcando || seleccionado;

  function handleTap() {
    if (bloqueado) return;
    setMarcando(true);
    setTimeout(onSelect, 300);
  }

  const activo = seleccionado || marcando;

  return (
    <motion.button
      type="button"
      whileTap={bloqueado ? undefined : { scale: 0.98 }}
      onClick={handleTap}
      className={`flex h-16 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left transition-colors duration-150 [touch-action:manipulation] ${
        activo
          ? 'border-[1.5px] border-[var(--accent)] bg-[var(--chip-bg)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] ${
          activo ? 'bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)]'
        }`}
      >
        <Icono size={20} strokeWidth={2} color={activo ? 'var(--accent)' : 'var(--text-secondary)'} aria-hidden="true" />
      </span>
      <span className="flex-1 text-[16px] font-medium text-[var(--text-primary)]">{label}</span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scale: activo ? 1 : 0.5, opacity: activo ? 1 : 0 }}
        transition={{ duration: 0.2, type: 'spring', bounce: 0.4 }}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
      >
        <Check size={13} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}

/* ── <FunnelScreen> — contenedor de una pantalla del funnel: header + contenido
   con transición horizontal de paso a paso (50 §A4). ── */
export function FunnelScreen({
  progreso,
  onBack,
  children,
  stepKey,
}: {
  progreso: number;
  onBack?: () => void;
  children: ReactNode;
  /** Cambia con cada pantalla para disparar la transición de entrada. */
  stepKey: string | number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <FunnelHeader progreso={progreso} onBack={onBack} />
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: reduce ? 0 : 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-[500px] flex-1 flex-col px-4 pb-8 pt-8"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── <HoldButton> — ritual de micro-compromiso (50 §C3bis). Mantener presionado
   900ms llena el círculo de acento; al completar, dispara onCommit. ── */
export function HoldButton({ onCommit, label }: { onCommit: () => void; label: string }) {
  const reduce = useReducedMotion();
  const [progreso, setProgreso] = useState(0);
  const rafRef = useRef<number | null>(null);
  const inicioRef = useRef(0);
  const DURACION = 900;

  function limpiar() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function empezar() {
    if (reduce) {
      onCommit();
      return;
    }
    inicioRef.current = performance.now();
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicioRef.current) / DURACION);
      setProgreso(t * 100);
      if (t >= 1) {
        onCommit();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function soltar() {
    limpiar();
    setProgreso(0);
  }

  useEffect(() => limpiar, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onPointerDown={empezar}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        aria-label={label}
        className="relative flex size-28 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] [touch-action:manipulation]"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="color-mix(in oklab, var(--accent) 18%, transparent)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={276.5}
            strokeDashoffset={276.5 - (276.5 * progreso) / 100}
          />
        </svg>
        <span className="text-[13px] font-semibold leading-tight text-[var(--accent)]">
          Mantén
          <br />
          presionado
        </span>
      </button>
      <p className="text-[13px] text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}
