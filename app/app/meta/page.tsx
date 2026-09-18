'use client';

// META — protagonista: avance de la meta elegida en el onboarding. Modo 'monto'
// (ahorrar/salir de deuda) pide un objetivo en dinero; modo 'habito' (dejar
// impulso/entender) se mide en días de racha, sin pedir monto. Primera pantalla
// de este tipo → revisor-visual la evalúa también.

import { useEffect, useState, type FormEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Plus } from 'lucide-react';
import {
  calcularRacha,
  crearMetaHabito,
  crearMetaMonto,
  leerEstadoApp,
  metaInicialDesdeOnboarding,
  metaSincronizada,
  registrarAvanceMeta,
  type EstadoApp,
  type Meta,
} from '@/lib/app';
import { AnilloProgreso, ConteoAnimado } from '@/components/app/ui';

function useVariantes(): { contenedor: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    contenedor: { visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } } },
    item: {
      hidden: { opacity: 0, y: reduce ? 0 : 10 },
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.35, ease: [0.16, 1, 0.3, 1] } },
    },
  };
}

const COPY_TIPO: Record<string, { pregunta: string; motivacion: (m: Meta) => string }> = {
  ahorrar: {
    pregunta: '¿Cuánto quieres ahorrar en total?',
    motivacion: (m) => `Te faltan $${Math.max(0, m.objetivo - m.actual).toLocaleString('es')} para tu meta.`,
  },
  salir_deuda: {
    pregunta: '¿Cuánto es la deuda que quieres pagar?',
    motivacion: (m) => `Te faltan $${Math.max(0, m.objetivo - m.actual).toLocaleString('es')} para terminar de pagarla.`,
  },
};

export default function MetaPage() {
  const [estado, setEstado] = useState<EstadoApp | null>(null);
  const { contenedor, item } = useVariantes();

  useEffect(() => {
    setEstado(leerEstadoApp());
  }, []);

  if (!estado) {
    return (
      <div className="flex flex-1 flex-col px-4 pt-8">
        <div className="h-6 w-24 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="mt-6 h-72 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const meta = metaSincronizada(estado);

  return (
    <motion.main variants={contenedor} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <motion.header variants={item}>
        <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Tu meta</h1>
      </motion.header>

      <motion.section variants={item}>
        {meta ? (
          <ProgresoMeta meta={meta} onActualizar={() => setEstado(leerEstadoApp())} />
        ) : (
          <ConfigurarMeta onCreada={() => setEstado(leerEstadoApp())} />
        )}
      </motion.section>

      <motion.section variants={item} className="flex-1 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <TuConstancia estado={estado} />
      </motion.section>
    </motion.main>
  );
}

function TuConstancia({ estado }: { estado: EstadoApp }) {
  const racha = calcularRacha(estado.checkins);
  const totalRegistros = estado.checkins.length;
  return (
    <>
      <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu constancia</h2>
      <div className="mt-3 flex gap-3">
        <div className="flex-1 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_10%,transparent)] p-4 text-center">
          <p className="text-[24px] font-bold [font-variant-numeric:tabular-nums] [font-family:var(--font-display)] text-[var(--accent-3-text)]">
            {racha}
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">días de racha</p>
        </div>
        <div className="flex-1 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] p-4 text-center">
          <p className="text-[24px] font-bold [font-variant-numeric:tabular-nums] [font-family:var(--font-display)] text-[var(--accent)]">
            {totalRegistros}
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">Semáforos marcados</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-[var(--text-tertiary)]">
        {racha === 0
          ? 'Marca tu Semáforo hoy para empezar tu racha.'
          : `Cada día que marcas te acerca más a tu meta — no hace falta que sea perfecto.`}
      </p>
    </>
  );
}

function ConfigurarMeta({ onCreada }: { onCreada: () => void }) {
  const inicial = metaInicialDesdeOnboarding();
  const [monto, setMonto] = useState('');
  const esHabito = inicial.modo === 'habito';

  function confirmar(e: FormEvent) {
    e.preventDefault();
    if (esHabito) {
      crearMetaHabito(inicial.tipo, inicial.nombre);
    } else {
      const objetivo = Number(monto);
      if (!objetivo || objetivo <= 0) return;
      crearMetaMonto(inicial.tipo, inicial.nombre, objetivo, 0);
    }
    onCreada();
  }

  return (
    <form
      onSubmit={confirmar}
      className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]"
    >
      <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">
        {esHabito ? 'Vamos a medir tu constancia' : (COPY_TIPO[inicial.tipo]?.pregunta ?? '¿Cuánto quieres ahorrar en total?')}
      </h2>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
        {esHabito
          ? `Tu meta "${inicial.nombre.toLowerCase()}" se va a medir en días seguidos marcando tu Semáforo.`
          : 'Puedes cambiar este número después.'}
      </p>
      {!esHabito && (
        <input
          type="number"
          inputMode="decimal"
          min={1}
          required
          autoFocus
          placeholder="Ej: 500"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="mt-4 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        />
      )}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Guardar meta
      </motion.button>
    </form>
  );
}

function ProgresoMeta({ meta, onActualizar }: { meta: Meta; onActualizar: () => void }) {
  const [avance, setAvance] = useState('');
  const porcentaje = Math.min(100, Math.round((meta.actual / meta.objetivo) * 100));
  const unidad = meta.modo === 'habito' ? 'días' : '$';
  const copy = COPY_TIPO[meta.tipo]?.motivacion(meta) ?? `Vas en el ${porcentaje}% de tu meta.`;

  function registrar(e: FormEvent) {
    e.preventDefault();
    const delta = Number(avance);
    if (!delta || delta <= 0) return;
    registrarAvanceMeta(delta);
    setAvance('');
    onActualizar();
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{meta.nombre}</p>
      <div className="mt-4 flex items-center justify-center">
        <AnilloProgreso porcentaje={porcentaje} tamano={128} grosor={12}>
          <div className="flex flex-col items-center">
            <span className="text-[28px] font-bold [font-variant-numeric:tabular-nums] [font-family:var(--font-display)]">
              {meta.modo === 'monto' ? unidad : ''}
              <ConteoAnimado valor={meta.actual} />
              {meta.modo === 'habito' ? ` ${unidad}` : ''}
            </span>
            <span className="text-[12px] text-[var(--text-tertiary)]">
              de {meta.modo === 'monto' ? unidad : ''}
              {meta.objetivo.toLocaleString('es')}
              {meta.modo === 'habito' ? ` ${unidad}` : ''}
            </span>
          </div>
        </AnilloProgreso>
      </div>
      <p className="mt-4 text-center text-[15px] leading-relaxed text-[var(--text-primary)]">{copy}</p>

      {meta.modo === 'monto' ? (
        <form onSubmit={registrar} className="mt-5 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={1}
            placeholder="Registrar avance"
            value={avance}
            onChange={(e) => setAvance(e.target.value)}
            aria-label="Cuánto quieres sumar a tu meta"
            className="h-[48px] flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            aria-label="Sumar a la meta"
            className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] [touch-action:manipulation]"
          >
            <Plus size={20} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
          </motion.button>
        </form>
      ) : (
        <p className="mt-5 text-center text-[12px] text-[var(--text-tertiary)]">
          Este número se actualiza solo con tu racha de Hoy.
        </p>
      )}
    </div>
  );
}
