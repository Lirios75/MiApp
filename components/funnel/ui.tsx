'use client';

// KIT DEL FUNNEL — onboarding + paywall + login (50-DISENO-ONBOARDING-PAYWALL.md)
// Piezas compartidas de las 3 pantallas que generan el dinero. Mismos tokens que
// el kit de landing (components/landing/tokens.css, ya global vía globals.css) —
// cero valores nuevos de marca aquí, solo estructura y comportamiento.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Check, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RespiraMark } from '@/components/RespiraMark';

/* ── <FunnelHeader> — logo + atrás + barra de progreso (50 §A2, regla de marca).
   ENDOWED PROGRESS: el % nunca arranca en 0 — quien lo llama ya suma 5-8%. ── */
export function FunnelHeader({
  progreso,
  onBack,
  onClose,
}: {
  /** 0-100. */
  progreso: number;
  onBack?: () => void;
  /** Salida explícita del funnel — SIEMPRE visible, no solo en el primer paso
   * (sin esto, salir a mitad del quiz exige retroceder paso a paso). */
  onClose?: () => void;
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
            <RespiraMark estatico />
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
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Salir"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <X size={18} strokeWidth={2.25} aria-hidden="true" />
          </button>
        )}
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
  indice = 0,
}: {
  icon: LucideIcon;
  label: string;
  seleccionado: boolean;
  onSelect: () => void;
  /** Posición en la lista — dispara el stagger de entrada (14: 50-80ms entre ítems). */
  indice?: number;
}) {
  const reduce = useReducedMotion();
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
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.3, delay: reduce ? 0 : indice * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileTap={bloqueado ? undefined : { scale: 0.98 }}
      onClick={handleTap}
      className={`flex h-16 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 text-left shadow-[var(--shadow-1)] transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
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
  onClose,
  children,
  stepKey,
}: {
  progreso: number;
  onBack?: () => void;
  /** Salida explícita del funnel, visible en todos los pasos (no solo el primero). */
  onClose?: () => void;
  children: ReactNode;
  /** Cambia con cada pantalla para disparar la transición de entrada. */
  stepKey: string | number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Fondo con profundidad (FICHA-ARTE: "sombras suaves tintadas") — mesh sutil
          + eco del anillo de marca a baja opacidad, para que ningún paso corto
          quede en un plano vacío.
          FIXED (no absolute): el contenedor es min-h-dvh y crece con el contenido
          (p.ej. paso 0 con la lista de chips), así que "absolute -bottom-24" quedaba
          anclado al fondo del contenedor completo, no del viewport — en pasos altos
          el anillo caía fuera de lo visible sin scroll. fixed lo ancla siempre a la
          esquina real de la pantalla.
          ISOLATE es la pieza que faltaba: sin esto, "relative" con z-index:auto NO
          crea contexto de apilamiento propio — los hijos con -z-10 escapan al
          contexto raíz y el bg-[var(--bg)] de ESTE MISMO div (que sí pinta dentro
          del contexto raíz, en el nivel de "contenido en flujo") termina tapando el
          fondo decorativo por completo. isolate los mantiene anidados, así se
          pintan encima del propio fondo del contenedor y debajo de su contenido. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(760px 480px at 50% -10%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(560px 420px at 100% 100%, color-mix(in oklab, var(--accent-2) 12%, transparent) 0%, transparent 55%)',
        }}
      />
      <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none fixed -bottom-24 -right-16 -z-10 size-[320px] opacity-[0.15]">
        <circle cx="100" cy="100" r="86" fill="none" stroke="var(--accent)" strokeWidth="14" />
      </svg>
      <FunnelHeader progreso={progreso} onBack={onBack} onClose={onClose} />
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

/* ── <ConfirmSalir> — modal propio para confirmar la salida del funnel cuando
   ya hay respuestas invertidas (nunca window.confirm: rompe la identidad y no
   anima — 14/49). Overlay + card centrada, mismos tokens del kit. ── */
export function ConfirmSalir({
  abierto,
  onSeguir,
  onSalir,
}: {
  abierto: boolean;
  onSeguir: () => void;
  onSalir: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_oklab,var(--text-primary)_45%,transparent)] px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 8 }}
            transition={{ duration: reduce ? 0.1 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
          >
            <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">¿Salir?</h2>
            <p className="mt-2 text-[14px] leading-snug text-[var(--text-secondary)]">
              Perderás las respuestas de tu quiz.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <FunnelButton onClick={onSeguir}>Seguir aquí</FunnelButton>
              <FunnelButton onClick={onSalir} variant="outline">
                Salir sin guardar
              </FunnelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
