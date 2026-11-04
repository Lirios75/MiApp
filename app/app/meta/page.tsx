'use client';

// TU META — ahora admite VARIAS metas a la vez (pedido por la usuaria, Sesión 7): una lista
// con el avance de cada una, "+" para agregar otra, se toca una para ver su detalle o
// registrar avance. La PRIMERA meta sigue saliendo prellenada del onboarding (sin preguntar
// tipo, como siempre); desde la segunda en adelante se elige el tipo a mano. Modo 'monto'
// (ahorrar/salir de deuda) pide un objetivo en dinero; modo 'habito' (dejar impulso/entender)
// se mide en días de racha, sin pedir monto. Primera pantalla de este tipo → revisor-visual
// la evalúa también.

import { useEffect, useState, type FormEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowLeft, ChevronRight, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  calcularRacha,
  hoyISO,
  metaInicialDesdeOnboarding,
  metasSincronizadas,
  modoDeTipo,
  OPCIONES_FRECUENCIA,
  type EstadoApp,
  type Frecuencia,
  type Meta,
} from '@/lib/app';
import { LABEL_META, OPCIONES_META } from '@/lib/onboarding';
import {
  actualizarDetalleMetaSupabase,
  crearMetaHabitoSupabase,
  crearMetaMontoSupabase,
  eliminarMetaSupabase,
  obtenerEstadoApp,
  registrarAvanceMetaSupabase,
} from '@/lib/supabase/datos';
import { AnilloProgreso, ConteoAnimado, ErrorCarga, formatearMiles, soloDigitos } from '@/components/app/ui';

const PLACEHOLDER_NOMBRE: Record<string, string> = {
  ahorrar: 'Ej: viaje a la playa, fondo de emergencia...',
  salir_deuda: 'Ej: tarjeta de crédito, préstamo del carro...',
};

const FRECUENCIA_LABEL: Record<Frecuencia, string> = Object.fromEntries(
  OPCIONES_FRECUENCIA.map((o) => [o.value, o.label])
) as Record<Frecuencia, string>;

function SelectorFrecuencia({
  valor,
  onElegir,
}: {
  valor: Frecuencia;
  onElegir: (f: Frecuencia) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Cada cuánto quieres ahorrar">
      {OPCIONES_FRECUENCIA.map((opcion) => {
        const activa = opcion.value === valor;
        return (
          <button
            key={opcion.value}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => onElegir(opcion.value)}
            className="flex h-8 items-center rounded-full px-3 text-[13px] font-semibold [touch-action:manipulation]"
            style={{
              background: activa ? 'var(--accent)' : 'var(--surface-2)',
              color: activa ? 'var(--bg)' : 'var(--text-secondary)',
            }}
          >
            {opcion.label}
          </button>
        );
      })}
    </div>
  );
}

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
  const [error, setError] = useState(false);
  const [metaSeleccionadaId, setMetaSeleccionadaId] = useState<string | null>(null);
  const [creandoNueva, setCreandoNueva] = useState(false);
  const [tipoNuevaMeta, setTipoNuevaMeta] = useState<string | null>(null);
  const { contenedor, item } = useVariantes();

  useEffect(() => {
    obtenerEstadoApp()
      .then(setEstado)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  if (error) {
    return <ErrorCarga />;
  }

  if (!estado) {
    return (
      <div className="flex flex-1 flex-col px-4 pt-8">
        <div className="h-6 w-24 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="mt-6 h-72 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const metas = metasSincronizadas(estado);
  const metaActiva = metas.find((m) => m.id === metaSeleccionadaId) ?? null;
  const hayVarias = metas.length > 0;
  const mostrandoSubpantalla = Boolean(metaActiva) || creandoNueva;

  function volver() {
    setMetaSeleccionadaId(null);
    setCreandoNueva(false);
    setTipoNuevaMeta(null);
  }

  const inicial = metaInicialDesdeOnboarding();

  return (
    <motion.main variants={contenedor} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <motion.header variants={item} className="flex items-center gap-3">
        {hayVarias && mostrandoSubpantalla && (
          <button
            type="button"
            onClick={volver}
            aria-label="Volver a tus metas"
            className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] [touch-action:manipulation]"
          >
            <ArrowLeft size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
          </button>
        )}
        <h1 className="min-w-0 truncate text-[22px] font-bold [font-family:var(--font-display)]">
          {!hayVarias ? 'Tu meta' : metaActiva ? metaActiva.nombre : creandoNueva ? 'Meta nueva' : 'Tus metas'}
        </h1>
      </motion.header>

      <motion.section variants={item}>
        {!hayVarias ? (
          <ConfigurarMeta tipo={inicial.tipo} nombreHabito={inicial.nombre} checkins={estado.checkins} onCreada={setEstado} />
        ) : metaActiva ? (
          <ProgresoMeta
            meta={metaActiva}
            onActualizar={setEstado}
            onEliminada={(e) => {
              setEstado(e);
              setMetaSeleccionadaId(null);
            }}
          />
        ) : creandoNueva ? (
          !tipoNuevaMeta ? (
            <SelectorTipoMeta onElegir={setTipoNuevaMeta} />
          ) : (
            <ConfigurarMeta
              tipo={tipoNuevaMeta}
              nombreHabito={LABEL_META[tipoNuevaMeta] ?? 'Mi meta'}
              checkins={estado.checkins}
              onCreada={(e) => {
                setEstado(e);
                setCreandoNueva(false);
                setTipoNuevaMeta(null);
              }}
            />
          )
        ) : (
          <ListaMetas metas={metas} onSeleccionar={setMetaSeleccionadaId} onNueva={() => setCreandoNueva(true)} />
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

/* ── <ListaMetas> — una tarjeta por meta con su anillo de avance (pedido de la usuaria,
   Sesión 7: "ver todas las metas en una lista y ver el avance de cada una"). ── */
function ListaMetas({
  metas,
  onSeleccionar,
  onNueva,
}: {
  metas: Meta[];
  onSeleccionar: (id: string) => void;
  onNueva: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {metas.map((meta) => {
        const porcentaje = Math.min(100, Math.round((meta.actual / meta.objetivo) * 100));
        const unidad = meta.modo === 'habito' ? ' días' : '';
        return (
          <button
            key={meta.id}
            type="button"
            onClick={() => onSeleccionar(meta.id)}
            className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
          >
            <AnilloProgreso porcentaje={porcentaje} tamano={48} grosor={6}>
              <span className="text-[11px] font-bold [font-variant-numeric:tabular-nums] text-[var(--accent)]">{porcentaje}%</span>
            </AnilloProgreso>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">{meta.nombre}</p>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {meta.modo === 'monto'
                  ? `$${meta.actual.toLocaleString('es')} / $${meta.objetivo.toLocaleString('es')}`
                  : `${meta.actual}${unidad} / ${meta.objetivo}${unidad}`}
              </p>
            </div>
            <ChevronRight size={18} strokeWidth={2} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
          </button>
        );
      })}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onNueva}
        className="flex h-[52px] items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 border-dashed border-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[14px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
      >
        <Plus size={18} strokeWidth={2} aria-hidden="true" /> Meta nueva
      </motion.button>
    </div>
  );
}

/* ── <SelectorTipoMeta> — solo aparece desde la 2ª meta en adelante (la primera sale del
   onboarding, sin preguntar). ── */
function SelectorTipoMeta({ onElegir }: { onElegir: (tipo: string) => void }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">¿Para qué es esta meta nueva?</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {OPCIONES_META.map((opcion) => {
          const Icono = opcion.icon;
          return (
            <motion.button
              key={opcion.value}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onElegir(opcion.value)}
              className="flex flex-col items-center gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-4 text-center [touch-action:manipulation]"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                <Icono size={18} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
              </span>
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">{opcion.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ConfigurarMeta({
  tipo,
  nombreHabito,
  checkins,
  onCreada,
}: {
  tipo: string;
  nombreHabito: string;
  checkins: EstadoApp['checkins'];
  onCreada: (estado: EstadoApp) => void;
}) {
  const modo = modoDeTipo(tipo);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [frecuencia, setFrecuencia] = useState<Frecuencia>('mensual');
  const [fechaLimite, setFechaLimite] = useState('');
  const [guardando, setGuardando] = useState(false);
  const esHabito = modo === 'habito';

  async function confirmar(e: FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    try {
      if (esHabito) {
        onCreada(await crearMetaHabitoSupabase(tipo, nombreHabito, checkins));
      } else {
        const objetivo = Number(monto);
        if (!objetivo || objetivo <= 0 || !nombre.trim()) return;
        onCreada(await crearMetaMontoSupabase(tipo, nombre.trim(), objetivo, 0, frecuencia, fechaLimite || null));
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={confirmar}
      className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]"
    >
      <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">
        {esHabito ? 'Vamos a medir tu constancia' : '¿Para qué es tu meta?'}
      </h2>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
        {esHabito
          ? `Tu meta "${nombreHabito.toLowerCase()}" se va a medir en días seguidos marcando tu Semáforo.`
          : 'Ponle un nombre que reconozcas — puedes cambiarlo después.'}
      </p>
      {!esHabito && (
        <>
          <input
            type="text"
            required
            autoFocus
            placeholder={PLACEHOLDER_NOMBRE[tipo] ?? 'Ej: mi meta de ahorro'}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-label="Para qué es tu meta"
            className="mt-4 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />

          <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">
            {COPY_TIPO[tipo]?.pregunta ?? '¿Cuánto quieres ahorrar en total?'}
          </p>
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="Ej: 500.000"
            value={formatearMiles(monto)}
            onChange={(e) => setMonto(soloDigitos(e.target.value))}
            aria-label="Monto objetivo"
            className="mt-2 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />

          <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">¿Para cuándo quieres lograrla? (opcional)</p>
          <input
            type="date"
            min={hoyISO()}
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            aria-label="Fecha límite de la meta"
            className="mt-2 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
        </>
      )}
      <motion.button
        type="submit"
        disabled={guardando}
        whileTap={{ scale: 0.97 }}
        className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
      >
        {guardando ? 'Guardando…' : 'Guardar meta'}
      </motion.button>
    </form>
  );
}

function formatearFechaCorta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  return fecha.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

function copyFechaLimite(fechaLimite: string): string {
  const dias = Math.ceil((new Date(fechaLimite).getTime() - new Date(hoyISO()).getTime()) / 86_400_000);
  if (dias < 0) return `Tu fecha límite ya pasó (${formatearFechaCorta(fechaLimite)})`;
  if (dias === 0) return `Tu fecha límite es hoy`;
  return `Te quedan ${dias} días (${formatearFechaCorta(fechaLimite)})`;
}

function ProgresoMeta({
  meta,
  onActualizar,
  onEliminada,
}: {
  meta: Meta;
  onActualizar: (estado: EstadoApp) => void;
  onEliminada: (estado: EstadoApp) => void;
}) {
  const [avance, setAvance] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const porcentaje = Math.min(100, Math.round((meta.actual / meta.objetivo) * 100));
  const unidad = meta.modo === 'habito' ? 'días' : '$';
  const copy = COPY_TIPO[meta.tipo]?.motivacion(meta) ?? `Vas en el ${porcentaje}% de tu meta.`;

  async function registrar(e: FormEvent) {
    e.preventDefault();
    const delta = Number(avance);
    if (!delta || delta <= 0 || guardando) return;
    setGuardando(true);
    try {
      onActualizar(await registrarAvanceMetaSupabase(meta.id, delta));
      setAvance('');
    } finally {
      setGuardando(false);
    }
  }

  async function borrar() {
    if (borrando) return;
    setBorrando(true);
    try {
      onEliminada(await eliminarMetaSupabase(meta.id));
    } finally {
      setBorrando(false);
    }
  }

  if (editando && meta.modo === 'monto') {
    return (
      <EditarDetalleMeta
        meta={meta}
        onGuardada={(estado) => {
          setEditando(false);
          onActualizar(estado);
        }}
        onCancelar={() => setEditando(false)}
      />
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{meta.nombre}</p>
          {meta.modo === 'monto' && meta.frecuencia && (
            <span className="mt-1 inline-flex h-6 items-center rounded-full bg-[var(--chip-bg)] px-2 text-[12px] font-semibold text-[var(--accent)]">
              {FRECUENCIA_LABEL[meta.frecuencia]}
            </span>
          )}
        </div>
        {meta.modo === 'monto' && (
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[var(--accent)] [touch-action:manipulation]"
          >
            <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Editar
          </button>
        )}
      </div>
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
      {meta.modo === 'monto' && meta.fechaLimite && (
        <p className="mt-1 text-center text-[13px] text-[var(--text-tertiary)]">{copyFechaLimite(meta.fechaLimite)}</p>
      )}

      {meta.modo === 'monto' ? (
        <form onSubmit={registrar} className="mt-5 flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Registrar avance"
            value={formatearMiles(avance)}
            onChange={(e) => setAvance(soloDigitos(e.target.value))}
            aria-label="Cuánto quieres sumar a tu meta"
            className="h-[48px] flex-1 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          <motion.button
            type="submit"
            disabled={guardando}
            whileTap={{ scale: 0.97 }}
            aria-label="Sumar a la meta"
            className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] disabled:opacity-60 [touch-action:manipulation]"
          >
            <Plus size={20} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
          </motion.button>
        </form>
      ) : (
        <p className="mt-5 text-center text-[12px] text-[var(--text-tertiary)]">
          Este número se actualiza solo con tu racha de Hoy.
        </p>
      )}

      <div className="mt-5 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
        {confirmandoBorrar ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] text-[var(--text-secondary)]">¿Borrar esta meta? No se puede deshacer.</p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                disabled={borrando}
                onClick={borrar}
                className="text-[13px] font-semibold text-[var(--accent-3-text)] disabled:opacity-60 [touch-action:manipulation]"
              >
                {borrando ? 'Borrando…' : 'Sí, borrar'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoBorrar(false)}
                className="text-[13px] font-semibold text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoBorrar(true)}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--text-tertiary)] [touch-action:manipulation]"
          >
            <Trash2 size={13} strokeWidth={2} aria-hidden="true" /> Borrar esta meta
          </button>
        )}
      </div>
    </div>
  );
}

function EditarDetalleMeta({
  meta,
  onGuardada,
  onCancelar,
}: {
  meta: Meta;
  onGuardada: (estado: EstadoApp) => void;
  onCancelar: () => void;
}) {
  const [nombre, setNombre] = useState(meta.nombre);
  const [frecuencia, setFrecuencia] = useState<Frecuencia>(meta.frecuencia ?? 'mensual');
  const [objetivo, setObjetivo] = useState(String(meta.objetivo));
  const [fechaLimite, setFechaLimite] = useState(meta.fechaLimite ?? '');
  const [guardando, setGuardando] = useState(false);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    const nuevoObjetivo = Number(objetivo);
    if (guardando || !nombre.trim() || !nuevoObjetivo || nuevoObjetivo <= 0) return;
    setGuardando(true);
    try {
      onGuardada(await actualizarDetalleMetaSupabase(meta.id, nombre.trim(), frecuencia, nuevoObjetivo, fechaLimite || null));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">Editar tu meta</h2>
        <button
          type="button"
          onClick={onCancelar}
          aria-label="Cancelar edición"
          className="shrink-0 rounded-full p-1 text-[var(--text-tertiary)] [touch-action:manipulation]"
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">¿Para qué es tu meta?</p>
      <input
        type="text"
        required
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        aria-label="Para qué es tu meta"
        className="mt-2 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />

      <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">¿Cuánto quieres ahorrar en total?</p>
      <input
        type="text"
        inputMode="numeric"
        required
        value={formatearMiles(objetivo)}
        onChange={(e) => setObjetivo(soloDigitos(e.target.value))}
        aria-label="Monto total de la meta"
        className="mt-2 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />

      <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">¿Cada cuánto quieres ahorrar?</p>
      <SelectorFrecuencia valor={frecuencia} onElegir={setFrecuencia} />

      <p className="mt-4 text-[13px] font-semibold text-[var(--text-secondary)]">¿Para cuándo quieres lograrla? (opcional)</p>
      <input
        type="date"
        min={hoyISO()}
        value={fechaLimite}
        onChange={(e) => setFechaLimite(e.target.value)}
        aria-label="Fecha límite de la meta"
        className="mt-2 h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />

      <motion.button
        type="submit"
        disabled={guardando}
        whileTap={{ scale: 0.97 }}
        className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
      >
        {guardando ? 'Guardando…' : 'Guardar cambios'}
      </motion.button>
    </form>
  );
}
