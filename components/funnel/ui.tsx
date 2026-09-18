'use client';

// KIT DEL FUNNEL — onboarding + paywall + login (50-DISENO-ONBOARDING-PAYWALL.md)
// Piezas compartidas de las 3 pantallas que generan el dinero. Mismos tokens que
// el kit de landing (components/landing/tokens.css, ya global vía globals.css) —
// cero valores nuevos de marca aquí, solo estructura y comportamiento.

import { forwardRef, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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
  logoBloqueado = false,
}: {
  /** 0-100. */
  progreso: number;
  onBack?: () => void;
  /** Salida explícita del funnel — SIEMPRE visible, no solo en el primer paso
   * (sin esto, salir a mitad del quiz exige retroceder paso a paso). */
  onClose?: () => void;
  /** Sin onBack, el logo es un <a href="/"> que navega directo — un tap ahí
   * durante una transición automática (ej. los 700ms tras comprometerse())
   * salta el mismo `onClose`/confirmación que sí protege a la X. true lo
   * vuelve un logo estático sin navegación durante esos tramos cortos. */
  logoBloqueado?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[500px] px-4 pt-4">
      <div className="flex h-11 items-center gap-3">
        {onBack ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            aria-label="Atrás"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
          </motion.button>
        ) : logoBloqueado ? (
          <span className="flex size-11 shrink-0 items-center justify-center" aria-hidden="true">
            <RespiraMark estatico />
          </span>
        ) : (
          <a href="/" className="flex size-11 shrink-0 items-center justify-center [touch-action:manipulation]">
            <RespiraMark estatico />
          </a>
        )}
        <div
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuenow={Math.round(progreso)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)]"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        {onClose && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Salir"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <X size={18} strokeWidth={2.25} aria-hidden="true" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ── <FunnelButton> — el CTA del funnel (equivalente a CtaButton del kit de
   landing, pero como <button> con onClick — aquí no navegamos por href). ── */
export const FunnelButton = forwardRef<
  HTMLButtonElement,
  {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'solid' | 'outline';
    disabled?: boolean;
    /** Muestra un anillo girando junto al texto — sin esto, "disabled" a secas
     * se lee como congelado, no como "trabajando" (heurística 1). */
    cargando?: boolean;
    type?: 'button' | 'submit';
  }
>(function FunnelButton({ children, onClick, variant = 'solid', disabled = false, cargando = false, type = 'button' }, ref) {
  const reduce = useReducedMotion();
  const estilo =
    variant === 'outline'
      ? 'border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[var(--accent)] hover:bg-[var(--chip-bg)]'
      : 'bg-[var(--accent)] text-[var(--bg)] shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))]';
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] px-8 text-[17px] font-semibold transition-colors duration-150 [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-40 ${estilo}`}
    >
      {cargando && (
        <motion.span
          aria-hidden="true"
          className="inline-flex size-4 shrink-0 rounded-full border-2 border-current border-t-transparent"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { duration: 0.7, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {children}
    </motion.button>
  );
});

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleTap() {
    if (bloqueado) return;
    setMarcando(true);
    timeoutRef.current = setTimeout(onSelect, 300);
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
        transition={{ duration: 0.2, type: 'spring', bounce: 0.1 }}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
      >
        <Check size={13} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}

/* ── <VistaSemaforo> — preview FUNCIONAL del mecanismo bautizado (no decoración):
   varias rondas del revisor confirmaron que el tercio inferior de las preguntas
   cortas quedaba vacío pese a reposicionar/agrandar el fondo — la causa raíz
   era falta de CONTENIDO, no de posición. Esta card enseña el check-in
   tranquilo/alerta que la app usa a diario, dándole a esa franja una función
   real (anticipar el mecanismo) en vez de solo llenar espacio. ── */
const CONTEXTO_SEMAFORO: Record<string, string> = {
  dolor: 'Así funciona: cada día, marcas cuál de los dos te describe.',
  momento: 'Justo en ese momento del día, un solo toque basta.',
  intento: 'A diferencia de un presupuesto o un journal, esto no lleva más de 2 segundos.',
  meta: 'Cada día marcado te acerca a tu meta.',
};

export function VistaSemaforo({ contexto }: { contexto: 'dolor' | 'momento' | 'intento' | 'meta' }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
      <p className="text-[13px] font-medium text-[var(--text-secondary)]">Así se ve tu Semáforo del Gasto</p>
      <div className="flex items-center gap-8">
        <span className="flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] ring-2 ring-[var(--accent-2)]"
          >
            <span className="size-4 rounded-full bg-[var(--accent-2)]" />
          </span>
          <span className="text-[12px] text-[var(--text-tertiary)]">Día tranquilo</span>
        </span>
        <span className="flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-3)_16%,transparent)] ring-2 ring-[var(--accent-3)]"
          >
            <span className="size-4 rounded-full bg-[var(--accent-3)]" />
          </span>
          <span className="text-[12px] text-[var(--text-tertiary)]">Día de alerta</span>
        </span>
      </div>
      {/* Copy descriptivo, no imperativo: "tú eliges cuál te describe HOY" invitaba
          a tocar un elemento que no responde (regla UX #11) — ahora es solo
          explicativo, y cambia según la pregunta para no sentirse repetido
          idéntico 4 veces seguidas. */}
      <p className="text-center text-[12px] leading-snug text-[var(--text-tertiary)]">{CONTEXTO_SEMAFORO[contexto]}</p>
    </div>
  );
}

/* ── <SemanaPreview> — fila de 7 días (L-D) vacíos, previsualizando el
   compromiso ("marcarlo todos los días esta semana") con contenido real en
   vez de dejar el paso de compromiso con un vacío grande bajo el HoldButton. ── */
export function SemanaPreview({ diaCompletado }: { diaCompletado?: number }) {
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[var(--text-tertiary)]">
        {diaCompletado !== undefined ? '¡Día 1 listo!' : 'Tu semana de compromiso'}
      </p>
      <div className="flex items-center gap-3">
        {dias.map((dia, i) =>
          i === diaCompletado ? (
            <motion.span
              key={i}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4, delay: 0.3 }}
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full bg-[var(--accent-2)]"
            >
              <Check size={14} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
            </motion.span>
          ) : (
            <span
              key={i}
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full border-2 border-[color-mix(in_oklab,var(--accent)_30%,transparent)] text-[11px] font-semibold text-[var(--text-tertiary)]"
            >
              {dia}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/* ── <FunnelFondo> — mesh + anillo decorativo compartido por TODAS las pantallas
   del funnel (onboarding vía FunnelScreen, y paywall directo — antes duplicado
   en los dos archivos, con el mismo bug arreglándose dos veces). Un solo lugar
   de verdad de aquí en adelante. ── */
export function FunnelFondo() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Fondo con profundidad (FICHA-ARTE: "sombras suaves tintadas") — mesh sutil
          + eco del anillo de marca a baja opacidad, para que ningún paso corto
          quede en un plano vacío.
          FIXED (no absolute): el contenedor padre es min-h-dvh y crece con el
          contenido, así que "absolute -bottom-24" quedaba anclado al fondo del
          contenedor completo, no del viewport — en pasos altos el anillo caía
          fuera de lo visible sin scroll. fixed lo ancla siempre a la esquina
          real de la pantalla.
          El padre necesita además `relative isolate`: sin `isolate`, un
          `position:relative` con `z-index:auto` NO crea contexto de apilamiento
          propio — los hijos con -z-10 escapan al contexto raíz y el propio
          bg-[var(--bg)] del contenedor padre (que pinta dentro del contexto
          raíz, en el nivel de "contenido en flujo") termina tapando este fondo
          por completo. isolate los mantiene anidados, así se pintan encima del
          fondo del contenedor y debajo de su contenido. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(760px 480px at 50% -10%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 60%), ' +
            /* Mesh inferior agrandado (560x420 -> 900x700): en pasos cortos (una sola
               pregunta corta o el paso de compromiso) el tercio inferior del viewport
               quedaba en cream plano — este alcance mayor lo cubre con textura real
               en vez de solo mover el contenido. */
            'radial-gradient(900px 700px at 100% 100%, color-mix(in oklab, var(--accent-2) 13%, transparent) 0%, transparent 65%)',
        }}
      />
      <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none fixed -bottom-16 -right-12 -z-10 size-[420px]">
        {/* Pulso sutil (FICHA-ARTE: "anillo que se expande" — la firma de movimiento
            de la marca, no solo un círculo estático). */}
        <motion.circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="14"
          initial={{ scale: 1, opacity: 0.14 }}
          animate={reduce ? { scale: 1, opacity: 0.16 } : { scale: [1, 1.03, 1], opacity: [0.13, 0.18, 0.13] }}
          transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 100px' }}
        />
      </svg>
    </>
  );
}

/* ── <FunnelScreen> — contenedor de una pantalla del funnel: header + contenido
   con transición horizontal de paso a paso (50 §A4). ── */
export function FunnelScreen({
  progreso,
  onBack,
  onClose,
  logoBloqueado,
  children,
  stepKey,
}: {
  progreso: number;
  onBack?: () => void;
  /** Salida explícita del funnel, visible en todos los pasos (no solo el primero). */
  onClose?: () => void;
  /** Ver FunnelHeader — bloquea el logo durante transiciones automáticas. */
  logoBloqueado?: boolean;
  children: ReactNode;
  /** Cambia con cada pantalla para disparar la transición de entrada. */
  stepKey: string | number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <FunnelFondo />
      <FunnelHeader progreso={progreso} onBack={onBack} onClose={onClose} logoBloqueado={logoBloqueado} />
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
  mensaje = 'Perderás las respuestas de tu quiz.',
  labelSalir = 'Salir sin guardar',
}: {
  abierto: boolean;
  onSeguir: () => void;
  onSalir: () => void;
  /** El texto por defecto solo es cierto a mitad del quiz (las respuestas viven
   * en estado de React hasta el paso de compromiso). En el paywall las
   * respuestas YA están en localStorage — ahí se pasa un mensaje que no
   * afirma una pérdida de datos que no ocurre. */
  mensaje?: string;
  labelSalir?: string;
}) {
  const reduce = useReducedMotion();
  const botonSeguirRef = useRef<HTMLButtonElement>(null);
  const botonSalirRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (abierto) botonSeguirRef.current?.focus();
  }, [abierto]);

  function alPresionarTecla(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      onSeguir(); // Escape = quedarse, no perder el progreso por accidente
      return;
    }
    // Trap de foco: solo 2 botones en el modal — Tab/Shift+Tab cicla entre
    // ellos en vez de escapar al contenido de fondo (que sigue montado detrás
    // del overlay).
    if (e.key === 'Tab') {
      e.preventDefault();
      const siguiente = document.activeElement === botonSeguirRef.current ? botonSalirRef.current : botonSeguirRef.current;
      siguiente?.focus();
    }
  }

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.2 }}
          onKeyDown={alPresionarTecla}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_oklab,var(--text-primary)_45%,transparent)] px-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-salir-titulo"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 8 }}
            transition={{ duration: reduce ? 0.1 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
          >
            <h2 id="confirm-salir-titulo" className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
              ¿Salir?
            </h2>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{mensaje}</p>
            <div className="mt-5 flex flex-col gap-2">
              <FunnelButton ref={botonSeguirRef} onClick={onSeguir}>
                Seguir aquí
              </FunnelButton>
              <FunnelButton ref={botonSalirRef} onClick={onSalir} variant="outline">
                {labelSalir}
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inicioRef = useRef(0);
  const presionandoRef = useRef(false);
  const DURACION = 900;
  const PASO_REDUCE = 150; // reduced-motion: progreso en pasos discretos, no un tween continuo

  function limpiar() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function empezar() {
    if (presionandoRef.current) return; // evita reinicios por key-repeat del teclado
    presionandoRef.current = true;
    if (reduce) {
      // Sin tween, pero SÍ con feedback: el anillo avanza en pasos discretos
      // cada 150ms — antes quedaba inmóvil al 0% los 900ms completos, sin
      // ninguna señal de que el gesto se estaba registrando.
      inicioRef.current = performance.now();
      intervalRef.current = setInterval(() => {
        const t = Math.min(1, (performance.now() - inicioRef.current) / DURACION);
        setProgreso(t * 100);
        if (t >= 1) {
          limpiar();
          presionandoRef.current = false;
          onCommit();
        }
      }, PASO_REDUCE);
      return;
    }
    inicioRef.current = performance.now();
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicioRef.current) / DURACION);
      setProgreso(t * 100);
      if (t >= 1) {
        presionandoRef.current = false;
        onCommit();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function soltar() {
    limpiar();
    presionandoRef.current = false;
    setProgreso(0);
  }

  function alSoltarTecla(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') soltar();
  }
  function alPresionarTecla(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Space no debe scrollear la página
      empezar();
    }
  }

  useEffect(() => limpiar, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onPointerDown={empezar}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        onKeyDown={alPresionarTecla}
        onKeyUp={alSoltarTecla}
        aria-label={`Mantén presionado (o Enter/Espacio) para: ${label}`}
        aria-describedby="hold-button-progreso"
        className="relative flex size-28 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
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
      <p id="hold-button-progreso" aria-live="polite" className="text-[13px] text-[var(--text-secondary)]">
        {/* Redondeado a pasos de 20% — a 60fps el aria-live actualizaría ~54
            veces en 900ms, saturando un lector de pantalla real. */}
        {progreso > 0 && progreso < 100 ? `Sosteniendo… ${Math.round(progreso / 20) * 20}%` : label}
      </p>
    </div>
  );
}
