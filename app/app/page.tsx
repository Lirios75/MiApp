'use client';

// HOY — pantalla principal de la app interna (una de las 4 pantallas del dinero,
// revisor-visual obligatorio). Protagonista: marcar el Semáforo del día.
// Ver docs/sistema/PREFLIGHT-PANTALLA.md + FICHA-ARTE.md antes de tocar esto.

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { AlertTriangle, ArrowRight, Check, Pencil, Smile, AlertCircle, Share2, Target, X } from 'lucide-react';
import {
  calcularRacha,
  checkInDeHoy,
  emocionPorValor,
  EMOCIONES_ALERTA,
  EMOCIONES_TRANQUILO,
  hoyISO,
  metaSincronizada,
  reflexionDeHoy,
  type EstadoApp,
  type EstadoSemaforo,
} from '@/lib/app';
import {
  obtenerEstadoApp,
  registrarCheckInSupabase,
  registrarEmocionCheckInSupabase,
  registrarMontosDiaSupabase,
  registrarNotaCheckInSupabase,
} from '@/lib/supabase/datos';
import { AnilloProgreso, ErrorCarga, formatearFechaLarga, formatearMiles, inicialDia, RachaBadge, soloDigitos } from '@/components/app/ui';

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

export default function Hoy() {
  const [estado, setEstado] = useState<EstadoApp | null>(null);
  const [editando, setEditando] = useState(false);
  const [avisoGuardado, setAvisoGuardado] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);
  const { contenedor, item } = useVariantes();

  useEffect(() => {
    obtenerEstadoApp()
      .then(setEstado)
      .catch((e) => {
        console.error(e);
        setErrorCarga(true);
      });
  }, []);

  async function marcar(valor: EstadoSemaforo) {
    setEditando(false);
    try {
      setEstado(await registrarCheckInSupabase(valor));
      setAvisoGuardado(false);
    } catch {
      setAvisoGuardado(true);
    }
  }

  async function guardarNota(nota: string) {
    try {
      setEstado(await registrarNotaCheckInSupabase(nota));
      setAvisoGuardado(false);
    } catch {
      setAvisoGuardado(true);
    }
  }

  async function guardarEmocion(emocion: string | null) {
    try {
      setEstado(await registrarEmocionCheckInSupabase(emocion));
      setAvisoGuardado(false);
    } catch {
      setAvisoGuardado(true);
    }
  }

  async function guardarMontos(entradas: number | null, gastos: number | null) {
    try {
      setEstado(await registrarMontosDiaSupabase(entradas, gastos));
      setAvisoGuardado(false);
    } catch {
      setAvisoGuardado(true);
    }
  }

  if (errorCarga) {
    return <ErrorCarga />;
  }

  if (!estado) {
    return (
      <div className="flex flex-1 flex-col px-4 pt-8">
        <div className="h-6 w-24 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="mt-6 h-52 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const checkin = checkInDeHoy(estado);
  const racha = calcularRacha(estado.checkins);
  const semana = diasEstaSemana(estado);

  return (
    <motion.main
      variants={contenedor}
      initial="hidden"
      animate="visible"
      className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8"
    >
      <motion.header variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Hoy</h1>
          <p className="text-[13px] text-[var(--text-secondary)]">{formatearFechaLarga(hoyISO())}</p>
        </div>
        <RachaBadge dias={racha} />
      </motion.header>

      {avisoGuardado && (
        <motion.div
          variants={item}
          role="status"
          className="flex items-start gap-2.5 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_14%,transparent)] p-3"
        >
          <AlertTriangle size={16} strokeWidth={2} color="var(--accent-3)" aria-hidden="true" className="mt-0.5 shrink-0" />
          <p className="text-[13px] leading-snug text-[var(--accent-3-text)]">
            No pudimos guardar tu registro — revisa tu conexión e inténtalo de nuevo.
          </p>
        </motion.div>
      )}

      <motion.section variants={item}>
        {!checkin || editando ? (
          <SelectorSemaforo
            checkin={checkin}
            onElegir={marcar}
            onCancelar={checkin ? () => setEditando(false) : undefined}
          />
        ) : (
          <ConfirmacionDia
            estado={checkin.estado}
            racha={racha}
            nota={checkin.nota}
            emocion={checkin.emocion}
            entradas={checkin.entradas}
            gastos={checkin.gastos}
            onCambiar={() => setEditando(true)}
            onGuardarNota={guardarNota}
            onGuardarEmocion={guardarEmocion}
            onGuardarMontos={guardarMontos}
          />
        )}
      </motion.section>

      <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Esta semana</h2>
          <Link href="/app/semana" className="text-[13px] font-semibold text-[var(--accent)]">
            Ver semana →
          </Link>
        </div>
        <div className="mt-3 flex justify-between">
          {semana.map(({ iso, estadoDia }, i) => (
            <div key={iso} className="flex flex-col items-center gap-1.5">
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full"
                style={{
                  background:
                    estadoDia === 'tranquilo'
                      ? 'color-mix(in oklab, var(--accent-2) 16%, transparent)'
                      : estadoDia === 'alerta'
                        ? 'color-mix(in oklab, var(--accent-3) 16%, transparent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
                  border:
                    iso === hoyISO() ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                }}
              >
                {estadoDia && (
                  <span
                    className="size-2 rounded-full"
                    style={{ background: estadoDia === 'tranquilo' ? 'var(--accent-2)' : 'var(--accent-3)' }}
                  />
                )}
              </span>
              <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{inicialDia(i)}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={item}>
        <FraseDelDia texto={reflexionDeHoy()} />
      </motion.section>

      <motion.section variants={item}>
        <VistaPreviaMeta estado={estado} />
      </motion.section>
    </motion.main>
  );
}

function VistaPreviaMeta({ estado }: { estado: EstadoApp }) {
  const meta = metaSincronizada(estado);

  if (!meta) {
    return (
      <Link
        href="/app/meta"
        className="flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface)] p-4 [touch-action:manipulation]"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Target size={18} strokeWidth={2} color="var(--accent)" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">Configura tu meta</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Elige un número y síguele la pista</p>
          </div>
        </div>
        <ArrowRight size={18} strokeWidth={2} color="var(--text-tertiary)" aria-hidden="true" />
      </Link>
    );
  }

  const porcentaje = Math.min(100, Math.round((meta.actual / meta.objetivo) * 100));
  const unidad = meta.modo === 'habito' ? ' días' : '';

  return (
    <Link
      href="/app/meta"
      className="flex flex-col gap-2.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 [touch-action:manipulation]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{meta.nombre}</p>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)]">
          Ver meta <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <AnilloProgreso porcentaje={porcentaje} tamano={40} grosor={5}>
          <span className="text-[12px] font-bold [font-variant-numeric:tabular-nums] text-[var(--accent)]">{porcentaje}%</span>
        </AnilloProgreso>
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
          {meta.modo === 'monto' ? `$${meta.actual}` : `${meta.actual}${unidad}`} / {meta.modo === 'monto' ? '$' : ''}
          {meta.objetivo}
          {unidad}
        </span>
      </div>
    </Link>
  );
}

function diasEstaSemana(estado: EstadoApp): { iso: string; estadoDia: EstadoSemaforo | null }[] {
  const hoy = new Date();
  const diaSemanaLunes0 = (hoy.getDay() + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diaSemanaLunes0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    const offsetMs = d.getTimezoneOffset() * 60000;
    const iso = new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
    const registro = estado.checkins.find((c) => c.fecha === iso);
    return { iso, estadoDia: registro?.estado ?? null };
  });
}

function SelectorSemaforo({
  checkin,
  onElegir,
  onCancelar,
}: {
  checkin: { estado: EstadoSemaforo } | undefined;
  onElegir: (v: EstadoSemaforo) => void;
  onCancelar?: () => void;
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">
          ¿Cómo te sientes con tu gasto hoy?
        </h2>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cancelar y volver"
            className="shrink-0 rounded-full p-1 text-[var(--text-tertiary)] [touch-action:manipulation]"
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Un toque basta. Puedes cambiarlo después.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onElegir('tranquilo')}
          aria-pressed={checkin?.estado === 'tranquilo'}
          className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-[var(--radius-button)] [touch-action:manipulation]"
          style={{
            background: 'color-mix(in oklab, var(--accent-2) 22%, transparent)',
            border:
              checkin?.estado === 'tranquilo'
                ? '2px solid var(--accent-2)'
                : '2px solid color-mix(in oklab, var(--accent-2) 35%, transparent)',
          }}
        >
          <Smile size={26} strokeWidth={2} color="var(--accent-2)" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-[var(--accent-2-text)]">Día tranquilo</span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onElegir('alerta')}
          aria-pressed={checkin?.estado === 'alerta'}
          className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-[var(--radius-button)] [touch-action:manipulation]"
          style={{
            background: 'color-mix(in oklab, var(--accent-3) 22%, transparent)',
            border:
              checkin?.estado === 'alerta'
                ? '2px solid var(--accent-3)'
                : '2px solid color-mix(in oklab, var(--accent-3) 35%, transparent)',
          }}
        >
          <AlertCircle size={26} strokeWidth={2} color="var(--accent-3)" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-[var(--accent-3-text)]">Día de alerta</span>
        </motion.button>
      </div>
    </div>
  );
}

function ConfirmacionDia({
  estado,
  racha,
  nota,
  emocion,
  entradas,
  gastos,
  onCambiar,
  onGuardarNota,
  onGuardarEmocion,
  onGuardarMontos,
}: {
  estado: EstadoSemaforo;
  racha: number;
  nota: string | null;
  emocion: string | null;
  entradas: number | null;
  gastos: number | null;
  onCambiar: () => void;
  onGuardarNota: (nota: string) => Promise<void>;
  onGuardarEmocion: (emocion: string | null) => Promise<void>;
  onGuardarMontos: (entradas: number | null, gastos: number | null) => Promise<void>;
}) {
  const tranquilo = estado === 'tranquilo';
  const [editandoNota, setEditandoNota] = useState(false);
  const [texto, setTexto] = useState(nota ?? '');
  const [guardandoNota, setGuardandoNota] = useState(false);

  async function guardarNota(e: FormEvent) {
    e.preventDefault();
    if (guardandoNota) return;
    setGuardandoNota(true);
    try {
      await onGuardarNota(texto);
      setEditandoNota(false);
    } finally {
      setGuardandoNota(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full"
          style={{ background: `color-mix(in oklab, var(--accent-${tranquilo ? '2' : '3'}) 16%, transparent)` }}
        >
          <Check size={24} strokeWidth={2.5} color={tranquilo ? 'var(--accent-2)' : 'var(--accent-3)'} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[19px] font-bold [font-family:var(--font-display)]">
            Marcaste: {tranquilo ? 'día tranquilo' : 'día de alerta'}
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            {racha <= 1 ? 'Tu primer día registrado.' : `Llevas ${racha} días seguidos marcando tu Semáforo.`}
          </p>
          <button
            type="button"
            onClick={onCambiar}
            className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)]"
          >
            <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Cambiar
          </button>
        </div>
      </div>

      {editandoNota ? (
        <form onSubmit={guardarNota} className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
          <label htmlFor="nota-dia" className="text-[13px] font-semibold text-[var(--text-secondary)]">
            ¿En qué se te fue? (opcional)
          </label>
          <textarea
            id="nota-dia"
            rows={2}
            autoFocus
            placeholder="Ej: antojo de comida, ropa que no necesitaba..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="mt-2 w-full resize-none rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-4 py-3 text-[15px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          <div className="mt-2 flex gap-3">
            <motion.button
              type="submit"
              disabled={guardandoNota}
              whileTap={{ scale: 0.97 }}
              className="flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
            >
              {guardandoNota ? 'Guardando…' : 'Guardar'}
            </motion.button>
            <button
              type="button"
              onClick={() => {
                setTexto(nota ?? '');
                setEditandoNota(false);
              }}
              className="text-[13px] font-semibold text-[var(--text-tertiary)]"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : nota ? (
        <div className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
          <p className="text-[13px] font-semibold text-[var(--text-secondary)]">En qué se te fue</p>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-primary)]">{nota}</p>
          <button
            type="button"
            onClick={() => setEditandoNota(true)}
            className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)]"
          >
            <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Editar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditandoNota(true)}
          className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4 text-[13px] font-semibold text-[var(--accent)]"
        >
          + ¿En qué se te fue?
        </button>
      )}

      <div className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
        <SelectorEmocion tranquilo={tranquilo} valor={emocion} onElegir={onGuardarEmocion} />
      </div>

      <div className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
        <CamposMontosDia entradas={entradas} gastos={gastos} onGuardar={onGuardarMontos} />
      </div>
    </div>
  );
}

/* ── <FraseDelDia> — vestida como tarjeta propia (pedido de la usuaria, Sesión 7):
   etiqueta + frase grande en cursiva + compartir real (Web Share API con fallback de
   copiar). Reusa el mismo texto de reflexionDeHoy(), solo cambia el vestido visual. ── */
function FraseDelDia({ texto }: { texto: string }) {
  const [copiada, setCopiada] = useState(false);

  async function compartir() {
    const mensaje = `"${texto}" — Respira`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text: mensaje });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(mensaje);
        setCopiada(true);
        setTimeout(() => setCopiada(false), 2000);
      }
    } catch {
      // la persona cerró el panel nativo de compartir — no es un error que avisar.
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] p-5" style={{ background: 'color-mix(in oklab, var(--accent-2) 14%, var(--surface))' }}>
      <span className="inline-flex items-center rounded-full bg-[var(--surface)] px-3 py-1.5 text-[12px] font-bold text-[var(--text-primary)] shadow-[var(--shadow-1)]">
        Frase del día
      </span>
      <p className="mt-4 text-[19px] font-semibold italic leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
        &ldquo;{texto}&rdquo;
      </p>
      <div className="mt-4 flex items-center justify-end gap-2">
        {copiada && <span className="text-[12px] font-semibold text-[var(--accent-2-text)]">¡Copiada!</span>}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={compartir}
          aria-label="Compartir esta frase"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)] [touch-action:manipulation]"
        >
          <Share2 size={16} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}

/* ── <SelectorEmocion> — emoción opcional DESPUÉS del Semáforo (pedido de la usuaria,
   Sesión 7): el set que se ofrece calza con lo que ya marcó (tranquilo/alerta), así nunca
   son 10 opciones de golpe — solo las 4 que tienen sentido con ese día. Tocar la misma
   emoción otra vez la quita (no es obligatorio dejar una marcada). ── */
function SelectorEmocion({
  tranquilo,
  valor,
  onElegir,
}: {
  tranquilo: boolean;
  valor: string | null;
  onElegir: (emocion: string | null) => Promise<void>;
}) {
  const opciones = tranquilo ? EMOCIONES_TRANQUILO : EMOCIONES_ALERTA;
  const [guardando, setGuardando] = useState(false);

  async function elegir(value: string) {
    if (guardando) return;
    setGuardando(true);
    try {
      await onElegir(valor === value ? null : value);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-[var(--text-secondary)]">¿Quieres agregar una emoción? (opcional)</p>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {opciones.map((emocion) => {
          const activo = valor === emocion.value;
          return (
            <motion.button
              key={emocion.value}
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={guardando}
              onClick={() => elegir(emocion.value)}
              aria-pressed={activo}
              aria-label={emocion.label}
              className="flex flex-col items-center gap-1 rounded-[var(--radius-button)] py-2.5 [touch-action:manipulation] disabled:opacity-60"
              style={{
                background: activo ? 'color-mix(in oklab, var(--accent) 16%, transparent)' : 'var(--surface-2)',
                border: activo ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              }}
            >
              <span aria-hidden="true" className="text-[20px] leading-none">
                {emocion.emoji}
              </span>
              <span className="text-[11px] font-medium leading-tight text-[var(--text-primary)]">{emocion.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── <CamposMontosDia> — "cuánto entró y salió hoy" (pedido de la usuaria, Sesión 7):
   un numerito simple junto al registro, NO un presupuesto detallado por categorías —
   mismo patrón colapsado/expandido que la nota "¿en qué se te fue?" de arriba. ── */
function CamposMontosDia({
  entradas,
  gastos,
  onGuardar,
}: {
  entradas: number | null;
  gastos: number | null;
  onGuardar: (entradas: number | null, gastos: number | null) => Promise<void>;
}) {
  const [editando, setEditando] = useState(false);
  const [textoEntradas, setTextoEntradas] = useState(entradas !== null ? String(entradas) : '');
  const [textoGastos, setTextoGastos] = useState(gastos !== null ? String(gastos) : '');
  const [guardando, setGuardando] = useState(false);
  const hayDatos = entradas !== null || gastos !== null;

  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    try {
      await onGuardar(textoEntradas ? Number(textoEntradas) : null, textoGastos ? Number(textoGastos) : null);
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  }

  if (editando) {
    return (
      <form onSubmit={guardar}>
        <p className="text-[13px] font-semibold text-[var(--text-secondary)]">¿Cuánto entró y cuánto salió hoy? (opcional)</p>
        <div className="mt-2 flex gap-3">
          <div className="flex-1">
            <label htmlFor="entradas-dia" className="text-[11px] font-medium text-[var(--text-tertiary)]">
              Entró
            </label>
            <input
              id="entradas-dia"
              type="text"
              inputMode="numeric"
              placeholder="$0"
              autoFocus
              value={formatearMiles(textoEntradas)}
              onChange={(e) => setTextoEntradas(soloDigitos(e.target.value))}
              className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-3 text-[15px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="gastos-dia" className="text-[11px] font-medium text-[var(--text-tertiary)]">
              Salió
            </label>
            <input
              id="gastos-dia"
              type="text"
              inputMode="numeric"
              placeholder="$0"
              value={formatearMiles(textoGastos)}
              onChange={(e) => setTextoGastos(soloDigitos(e.target.value))}
              className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--bg)] px-3 text-[15px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>
        <div className="mt-2 flex gap-3">
          <motion.button
            type="submit"
            disabled={guardando}
            whileTap={{ scale: 0.97 }}
            className="flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--bg)] disabled:opacity-60 [touch-action:manipulation]"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </motion.button>
          <button
            type="button"
            onClick={() => {
              setTextoEntradas(entradas !== null ? String(entradas) : '');
              setTextoGastos(gastos !== null ? String(gastos) : '');
              setEditando(false);
            }}
            className="text-[13px] font-semibold text-[var(--text-tertiary)]"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  if (hayDatos) {
    return (
      <div>
        <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Cuánto entró y salió hoy</p>
        <div className="mt-1.5 flex gap-4">
          {entradas !== null && (
            <span className="text-[15px] font-semibold text-[var(--accent-2-text)]">+${entradas.toLocaleString('es')}</span>
          )}
          {gastos !== null && (
            <span className="text-[15px] font-semibold text-[var(--accent-3-text)]">-${gastos.toLocaleString('es')}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)]"
        >
          <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Editar
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setEditando(true)} className="text-[13px] font-semibold text-[var(--accent)]">
      + ¿Cuánto entró y salió hoy?
    </button>
  );
}
