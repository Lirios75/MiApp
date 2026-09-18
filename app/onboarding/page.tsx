'use client';

// ONBOARDING — quiz de 4 preguntas + 2 reconocimientos + 1 compromiso (Sesión 4).
// Cada pregunta ecoa un dolor/objeción de FICHA-AVATAR.md (02B: "el onboarding se
// deriva de la ficha, no se improvisa"). Respuestas en localStorage (sin backend
// todavía — Sesión 6 conecta Supabase) y se leen en /paywall para personalizar.

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Lightbulb, HeartHandshake, Sprout } from 'lucide-react';
import { ConfirmSalir, FunnelButton, FunnelScreen, HoldButton, OptionChip, SemanaPreview, VistaSemaforo } from '@/components/funnel/ui';
import { OPCIONES_DOLOR, OPCIONES_INTENTO, OPCIONES_META, OPCIONES_MOMENTO, guardarRespuestas, type RespuestasOnboarding } from '@/lib/onboarding';

const TOTAL_PASOS = 6; // 0-indexado: 6 pasos entre el inicio (8%) y el compromiso (100%)
const PROGRESO_INICIAL = 8; // endowed progress — nunca arranca en 0 (Nunes & Drèze 2006)

function progresoDePaso(paso: number): number {
  return PROGRESO_INICIAL + (paso / TOTAL_PASOS) * (100 - PROGRESO_INICIAL);
}

export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestasOnboarding>({});
  const [comprometido, setComprometido] = useState(false);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const reduce = useReducedMotion();

  function avanzar() {
    setPaso((p) => p + 1);
  }
  function retroceder() {
    setPaso((p) => Math.max(0, p - 1));
  }
  function guardarYAvanzar<K extends keyof RespuestasOnboarding>(campo: K, valor: RespuestasOnboarding[K]) {
    setRespuestas((r) => ({ ...r, [campo]: valor }));
    avanzar();
  }

  function comprometerse() {
    guardarRespuestas({ ...respuestas, comprometido: true });
    setComprometido(true);
    setTimeout(() => router.push('/paywall'), 700);
  }

  function salir() {
    const hayRespuestas = Object.keys(respuestas).length > 0;
    if (hayRespuestas) {
      setConfirmandoSalida(true);
      return;
    }
    router.push('/');
  }

  const progreso = progresoDePaso(paso);
  let pantalla: ReactNode;

  // ── Paso 0: pregunta del dolor (eco de la landing) ──
  if (paso === 0) {
    pantalla = (
      <FunnelScreen progreso={progreso} onClose={salir} stepKey={paso}>
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Qué te pasa más seguido?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así armamos tu Semáforo del Gasto a tu medida.</p>
        <div className="mt-8 flex flex-col gap-3">
          {OPCIONES_DOLOR.map((o, i) => (
            <OptionChip
              key={o.value}
              icon={o.icon}
              label={o.label}
              indice={i}
              seleccionado={respuestas.dolor === o.value}
              onSelect={() => guardarYAvanzar('dolor', o.value)}
            />
          ))}
        </div>
        <VistaSemaforo contexto="dolor" />
      </FunnelScreen>
    );
  } else if (paso === 1) {
    // ── Paso 1: reconocimiento — nombra el mecanismo (regla b, escalera 02B) ──
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={retroceder} onClose={salir} stepKey={paso}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span
            aria-hidden="true"
            className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
          >
            <Lightbulb size={30} strokeWidth={1.75} color="var(--accent)" aria-hidden="true" />
          </span>
          <h2 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
            No es falta de disciplina
          </h2>
          <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">
            Lo que marcaste no es un problema de fuerza de voluntad — es que nadie te acompaña justo el
            día que decides gastar. <span className="font-semibold text-[var(--accent)]">El Semáforo del Gasto</span> te
            acompaña antes de que pase, no después.
          </p>
        </div>
        <FunnelButton onClick={avanzar}>Continuar</FunnelButton>
      </FunnelScreen>
    );
  } else if (paso === 2) {
    // ── Paso 2: momento del día (ancla contextual, 02B) ──
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={retroceder} onClose={salir} stepKey={paso}>
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿En qué momento te pasa más?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así ajustamos cuándo te recordamos marcar tu Semáforo.</p>
        <div className="mt-8 flex flex-col gap-3">
          {OPCIONES_MOMENTO.map((o, i) => (
            <OptionChip
              key={o.value}
              icon={o.icon}
              label={o.label}
              indice={i}
              seleccionado={respuestas.momento === o.value}
              onSelect={() => guardarYAvanzar('momento', o.value)}
            />
          ))}
        </div>
        <VistaSemaforo contexto="momento" />
      </FunnelScreen>
    );
  } else if (paso === 3) {
    // ── Paso 3: ¿ya lo intentaste? (objeción #1 de FICHA-AVATAR) ──
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={retroceder} onClose={salir} stepKey={paso}>
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Ya intentaste controlar tus gastos antes?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Así sabemos qué ya no funcionó, para no repetirlo.</p>
        <div className="mt-8 flex flex-col gap-3">
          {OPCIONES_INTENTO.map((o, i) => (
            <OptionChip
              key={o.value}
              icon={o.icon}
              label={o.label}
              indice={i}
              seleccionado={respuestas.intento === o.value}
              onSelect={() => guardarYAvanzar('intento', o.value)}
            />
          ))}
        </div>
        <VistaSemaforo contexto="intento" />
      </FunnelScreen>
    );
  } else if (paso === 4) {
    // ── Paso 4: reconocimiento — quita la culpa con la causa real (fórmula 50 §A5) ──
    const yaIntento = respuestas.intento !== 'primera_vez';
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={retroceder} onClose={salir} stepKey={paso}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span
            aria-hidden="true"
            className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
          >
            {yaIntento ? (
              <HeartHandshake size={30} strokeWidth={1.75} color="var(--accent)" aria-hidden="true" />
            ) : (
              <Sprout size={30} strokeWidth={1.75} color="var(--accent)" aria-hidden="true" />
            )}
          </span>
          <h2 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {yaIntento ? 'Eso no fue tu culpa' : 'Buena señal empezar así'}
          </h2>
          <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">
            {yaIntento
              ? 'Los presupuestos y los journals solo llevan el registro — ninguno te avisa el momento exacto en que estás por gastar por ansiedad. El Semáforo del Gasto sí: te frena 30 segundos antes de que pase, cada día.'
              : 'Vas a construir el hábito desde cero, sin tener que desaprender nada — con el Semáforo del Gasto notando el patrón contigo desde el primer día.'}
          </p>
        </div>
        <FunnelButton onClick={avanzar}>Continuar</FunnelButton>
      </FunnelScreen>
    );
  } else if (paso === 5) {
    // ── Paso 5: meta principal (personaliza el paywall) ──
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={retroceder} onClose={salir} stepKey={paso}>
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Cuál es tu meta principal?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Tu Semáforo se enfoca en esto primero.</p>
        <div className="mt-8 flex flex-col gap-3">
          {OPCIONES_META.map((o, i) => (
            <OptionChip
              key={o.value}
              icon={o.icon}
              label={o.label}
              indice={i}
              seleccionado={respuestas.meta === o.value}
              onSelect={() => guardarYAvanzar('meta', o.value)}
            />
          ))}
        </div>
        <VistaSemaforo contexto="meta" />
      </FunnelScreen>
    );
  } else {
    // ── Paso 6: compromiso (ritual pre-loading, 50 §C3bis) ──
    pantalla = (
      <FunnelScreen progreso={progreso} onBack={comprometido ? undefined : retroceder} onClose={salir} stepKey={paso}>
        {comprometido ? (
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            <motion.span
              aria-hidden="true"
              initial={{ scale: reduce ? 1 : 0.6 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0.1 : 0.4, type: 'spring', bounce: 0.1 }}
              className="inline-flex size-16 items-center justify-center rounded-full bg-[var(--accent)]"
            >
              <Check size={30} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
            </motion.span>
            <h2 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
              ¡Listo, quedó registrado!
            </h2>
            <SemanaPreview diaCompletado={(new Date().getDay() + 6) % 7} />
            <p className="max-w-[30ch] text-[13px] text-[var(--text-tertiary)]">
              Repite esto 6 días más y tendrás tu primera semana completa.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-10 pt-4 text-center">
            <div>
              <h2 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
                ¿Lista para tu primer Semáforo?
              </h2>
              <p className="mt-2 max-w-[34ch] text-[15px] text-[var(--text-secondary)]">
                Mantén presionado para comprometerte a marcarlo todos los días esta semana.
              </p>
            </div>
            <HoldButton onCommit={comprometerse} label="Me comprometo esta semana" />
            <SemanaPreview />
          </div>
        )}
      </FunnelScreen>
    );
  }

  return (
    <>
      {pantalla}
      <ConfirmSalir abierto={confirmandoSalida} onSeguir={() => setConfirmandoSalida(false)} onSalir={() => router.push('/')} />
    </>
  );
}
