'use client';

// HOY — pantalla principal de la app interna (una de las 4 pantallas del dinero,
// revisor-visual obligatorio). Protagonista: marcar el Semáforo del día.
// Ver docs/sistema/PREFLIGHT-PANTALLA.md + FICHA-ARTE.md antes de tocar esto.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Check, Pencil, Smile, AlertCircle } from 'lucide-react';
import {
  asegurarInicioTrial,
  calcularRacha,
  checkInDeHoy,
  hoyISO,
  leerEstadoApp,
  metaSincronizada,
  reflexionDeHoy,
  registrarCheckIn,
  type EstadoApp,
  type EstadoSemaforo,
} from '@/lib/app';
import { formatearFechaLarga, inicialDia, RachaBadge } from '@/components/app/ui';
import { ArrowRight, Target } from 'lucide-react';

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
  const { contenedor, item } = useVariantes();

  useEffect(() => {
    setEstado(asegurarInicioTrial());
  }, []);

  function marcar(valor: EstadoSemaforo) {
    setEstado(registrarCheckIn(valor));
    setEditando(false);
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

      <motion.section variants={item}>
        {!checkin || editando ? (
          <SelectorSemaforo checkin={checkin} onElegir={marcar} />
        ) : (
          <ConfirmacionDia estado={checkin.estado} onCambiar={() => setEditando(true)} />
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
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{inicialDia(i)}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={item}
        className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[var(--surface)] p-4"
      >
        <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{reflexionDeHoy()}</p>
      </motion.section>

      <motion.section variants={item} className="flex-1">
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
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-[var(--text-primary)]">
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
}: {
  checkin: { estado: EstadoSemaforo } | undefined;
  onElegir: (v: EstadoSemaforo) => void;
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <h2 className="text-[19px] font-bold leading-[1.25] [font-family:var(--font-display)]">
        ¿Cómo te sientes con tu gasto hoy?
      </h2>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Un toque basta. Puedes cambiarlo después.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onElegir('tranquilo')}
          aria-pressed={checkin?.estado === 'tranquilo'}
          className="flex h-[104px] flex-col items-center justify-center gap-2 rounded-[var(--radius-button)] [touch-action:manipulation]"
          style={{
            background: 'color-mix(in oklab, var(--accent-2) 12%, transparent)',
            border:
              checkin?.estado === 'tranquilo' ? '2px solid var(--accent-2)' : '2px solid transparent',
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
            background: 'color-mix(in oklab, var(--accent-3) 12%, transparent)',
            border: checkin?.estado === 'alerta' ? '2px solid var(--accent-3)' : '2px solid transparent',
          }}
        >
          <AlertCircle size={26} strokeWidth={2} color="var(--accent-3)" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-[var(--accent-3-text)]">Día de alerta</span>
        </motion.button>
      </div>
    </div>
  );
}

function ConfirmacionDia({ estado, onCambiar }: { estado: EstadoSemaforo; onCambiar: () => void }) {
  const tranquilo = estado === 'tranquilo';
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-full"
        style={{ background: `color-mix(in oklab, var(--accent-${tranquilo ? '2' : '3'}) 16%, transparent)` }}
      >
        <Check size={24} strokeWidth={2.5} color={tranquilo ? 'var(--accent-2)' : 'var(--accent-3)'} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-bold [font-family:var(--font-display)]">
          Marcaste: {tranquilo ? 'día tranquilo' : 'día de alerta'}
        </p>
        <button
          type="button"
          onClick={onCambiar}
          className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent)]"
        >
          <Pencil size={13} strokeWidth={2} aria-hidden="true" /> Cambiar
        </button>
      </div>
    </div>
  );
}
