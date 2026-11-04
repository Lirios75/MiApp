'use client';

// SEMANA — vista de tendencia/histórico (obligatoria para apps de hábito, 04-ARQUITECTURA).
// Protagonista: cómo te fue cada día, con fechas reales y navegación entre semanas (regla 13).
// Primera pantalla de este tipo en el proyecto → revisor-visual la evalúa también.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { diasDeLaSemana, emocionPorValor, hoyISO, resumenUltimasSemanas, type EstadoApp } from '@/lib/app';
import { obtenerEstadoApp } from '@/lib/supabase/datos';
import { ErrorCarga, formatearFechaLarga, formatearRangoSemana, inicialDia } from '@/components/app/ui';

function useVariantes(): { contenedor: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    contenedor: { visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } } },
    item: {
      hidden: { opacity: 0, y: reduce ? 0 : 10 },
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.35, ease: [0.16, 1, 0.3, 1] } },
    },
  };
}

const MESES_LARGO = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** Año/mes (0-indexado) + etiqueta legible a partir de un desplazamiento en meses desde hoy —
 * mismo patrón que diasDeLaSemana() pero para meses (vista "Mes" pedida por la usuaria). */
function mesDesdeOffset(offsetMeses: number): { anio: number; mes: number; etiqueta: string } {
  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth() + offsetMeses, 1);
  const anio = base.getFullYear();
  const mes = base.getMonth();
  return { anio, mes, etiqueta: `${MESES_LARGO[mes]} ${anio}` };
}

export default function Semana() {
  const [estado, setEstado] = useState<EstadoApp | null>(null);
  const [error, setError] = useState(false);
  const [vista, setVista] = useState<'semana' | 'mes'>('semana');
  const [offset, setOffset] = useState(0);
  const [offsetMes, setOffsetMes] = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
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
        <div className="h-6 w-32 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="mt-6 h-64 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const fechas = diasDeLaSemana(offset);
  const hoy = hoyISO();
  const dias = fechas.map((iso) => {
    const checkin = estado.checkins.find((c) => c.fecha === iso);
    return {
      iso,
      estadoDia: checkin?.estado ?? null,
      nota: checkin?.nota ?? null,
      emocion: checkin?.emocion ?? null,
      entradas: checkin?.entradas ?? null,
      gastos: checkin?.gastos ?? null,
      esFuturo: iso > hoy,
    };
  });
  const tranquilos = dias.filter((d) => d.estadoDia === 'tranquilo').length;
  const alertas = dias.filter((d) => d.estadoDia === 'alerta').length;
  const marcados = tranquilos + alertas;
  const seleccionado = dias.find((d) => d.iso === diaSeleccionado) ?? null;
  const totalEntradas = dias.reduce((suma, d) => suma + (d.entradas ?? 0), 0);
  const totalGastos = dias.reduce((suma, d) => suma + (d.gastos ?? 0), 0);
  const hayMontos = dias.some((d) => d.entradas !== null || d.gastos !== null);

  const { anio: anioMes, mes, etiqueta: etiquetaMes } = mesDesdeOffset(offsetMes);
  const prefijoMes = `${anioMes}-${String(mes + 1).padStart(2, '0')}`;
  const checkinsDelMes = estado.checkins.filter((c) => c.fecha.startsWith(prefijoMes));
  const tranquilosMes = checkinsDelMes.filter((c) => c.estado === 'tranquilo').length;
  const alertasMes = checkinsDelMes.filter((c) => c.estado === 'alerta').length;
  const marcadosMes = tranquilosMes + alertasMes;
  const entradasMes = checkinsDelMes.reduce((suma, c) => suma + (c.entradas ?? 0), 0);
  const gastosMes = checkinsDelMes.reduce((suma, c) => suma + (c.gastos ?? 0), 0);
  const hayMontosMes = checkinsDelMes.some((c) => c.entradas !== null || c.gastos !== null);

  return (
    <motion.main variants={contenedor} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <motion.header variants={item}>
        <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Semana</h1>

        <div className="mt-3 flex gap-2" role="tablist" aria-label="Ver por semana o por mes">
          {(['semana', 'mes'] as const).map((v) => {
            const activo = vista === v;
            return (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setVista(v)}
                className="flex h-8 items-center rounded-full px-3 text-[13px] font-semibold [touch-action:manipulation]"
                style={{
                  background: activo ? 'var(--accent)' : 'var(--surface-2)',
                  color: activo ? 'var(--bg)' : 'var(--text-secondary)',
                }}
              >
                {v === 'semana' ? 'Semana' : 'Mes'}
              </button>
            );
          })}
        </div>

        {vista === 'semana' ? (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOffset((o) => o - 1)}
              aria-label="Semana anterior"
              className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] [touch-action:manipulation]"
            >
              <ChevronLeft size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
            </button>
            <span className="text-[15px] font-semibold text-[var(--text-secondary)]">{formatearRangoSemana(fechas)}</span>
            <button
              type="button"
              onClick={() => setOffset((o) => Math.min(0, o + 1))}
              disabled={offset === 0}
              aria-label="Semana siguiente"
              className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] disabled:opacity-40 [touch-action:manipulation]"
            >
              <ChevronRight size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOffsetMes((o) => o - 1)}
              aria-label="Mes anterior"
              className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] [touch-action:manipulation]"
            >
              <ChevronLeft size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
            </button>
            <span className="text-[15px] font-semibold capitalize text-[var(--text-secondary)]">{etiquetaMes}</span>
            <button
              type="button"
              onClick={() => setOffsetMes((o) => Math.min(0, o + 1))}
              disabled={offsetMes === 0}
              aria-label="Mes siguiente"
              className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] disabled:opacity-40 [touch-action:manipulation]"
            >
              <ChevronRight size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
            </button>
          </div>
        )}
      </motion.header>

      {vista === 'mes' ? (
        <>
          <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
            <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Cómo te fue</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">
              {marcadosMes === 0
                ? 'Aún no marcaste ningún día de este mes. Hazlo desde Hoy.'
                : alertasMes === 0
                  ? `Marcaste ${tranquilosMes} de ${marcadosMes} días como tranquilos este mes. Vas muy bien.`
                  : tranquilosMes === 0
                    ? `Marcaste ${alertasMes} de ${marcadosMes} días de alerta este mes — es información, no un juicio.`
                    : `${tranquilosMes} días tranquilos y ${alertasMes} de alerta este mes. Notar la diferencia ya es la mitad del trabajo.`}
            </p>
          </motion.section>

          {hayMontosMes ? (
            <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
              <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu mes en números</h2>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Entró</p>
                  <p className="text-[17px] font-bold text-[var(--accent-2-text)] [font-variant-numeric:tabular-nums]">
                    +${entradasMes.toLocaleString('es')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Salió</p>
                  <p className="text-[17px] font-bold text-[var(--accent-3-text)] [font-variant-numeric:tabular-nums]">
                    -${gastosMes.toLocaleString('es')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Neto</p>
                  <p className="text-[17px] font-bold text-[var(--text-primary)] [font-variant-numeric:tabular-nums]">
                    {entradasMes - gastosMes >= 0 ? '+' : '-'}${Math.abs(entradasMes - gastosMes).toLocaleString('es')}
                  </p>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section variants={item} className="flex-1 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
              <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu mes en números</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                Aquí vas a ver cuánto entró y salió este mes apenas lo anotes un par de veces desde Hoy.
              </p>
            </motion.section>
          )}
        </>
      ) : (
      <>
      <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
        <div className="flex justify-between">
          {dias.map(({ iso, estadoDia, esFuturo }, i) => {
            const tocable = !esFuturo && estadoDia !== null;
            const activo = iso === diaSeleccionado;
            const circulo = (
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full"
                style={{
                  background: esFuturo
                    ? 'transparent'
                    : estadoDia === 'tranquilo'
                      ? 'color-mix(in oklab, var(--accent-2) 18%, transparent)'
                      : estadoDia === 'alerta'
                        ? 'color-mix(in oklab, var(--accent-3) 18%, transparent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
                  border: esFuturo
                    ? '1.5px dashed color-mix(in oklab, var(--text-tertiary) 30%, transparent)'
                    : activo
                      ? '1.5px solid var(--accent)'
                      : iso === hoy
                        ? '1.5px solid var(--accent)'
                        : '1.5px solid transparent',
                  boxShadow: activo ? '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)' : 'none',
                }}
              >
                {!esFuturo && estadoDia && (
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: estadoDia === 'tranquilo' ? 'var(--accent-2)' : 'var(--accent-3)' }}
                  />
                )}
              </span>
            );
            return (
              <div key={iso} className="flex flex-col items-center gap-2">
                {tocable ? (
                  <button
                    type="button"
                    onClick={() => setDiaSeleccionado((d) => (d === iso ? null : iso))}
                    aria-pressed={activo}
                    aria-label={`Ver el ${formatearFechaLarga(iso)}`}
                    className="[touch-action:manipulation]"
                  >
                    {circulo}
                  </button>
                ) : (
                  circulo
                )}
                <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
                  {inicialDia(i)} {Number(iso.slice(8, 10))}
                </span>
              </div>
            );
          })}
        </div>

        {seleccionado && (
          <div className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-secondary)]">
                  {formatearFechaLarga(seleccionado.iso)}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold" style={{ color: seleccionado.estadoDia === 'tranquilo' ? 'var(--accent-2-text)' : 'var(--accent-3-text)' }}>
                  {seleccionado.estadoDia === 'tranquilo' ? 'Día tranquilo' : 'Día de alerta'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDiaSeleccionado(null)}
                aria-label="Cerrar detalle del día"
                className="shrink-0 rounded-full p-1 text-[var(--text-tertiary)] [touch-action:manipulation]"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">
              {seleccionado.nota ?? 'No escribiste en qué se te fue ese día.'}
            </p>
            {emocionPorValor(seleccionado.emocion) && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
                <span aria-hidden="true">{emocionPorValor(seleccionado.emocion)?.emoji}</span>
                {emocionPorValor(seleccionado.emocion)?.label}
              </p>
            )}
            {(seleccionado.entradas !== null || seleccionado.gastos !== null) && (
              <div className="mt-2 flex gap-4">
                {seleccionado.entradas !== null && (
                  <span className="text-[13px] font-semibold text-[var(--accent-2-text)]">+${seleccionado.entradas.toLocaleString('es')}</span>
                )}
                {seleccionado.gastos !== null && (
                  <span className="text-[13px] font-semibold text-[var(--accent-3-text)]">-${seleccionado.gastos.toLocaleString('es')}</span>
                )}
              </div>
            )}
          </div>
        )}
      </motion.section>

      <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Cómo te fue</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">
          {marcados === 0
            ? 'Aún no marcaste ningún día de esta semana. Hazlo desde Hoy.'
            : alertas === 0
              ? `Marcaste ${tranquilos} de ${marcados} días como tranquilos. Vas muy bien.`
              : tranquilos === 0
                ? `Marcaste ${alertas} de ${marcados} días de alerta esta semana — es información, no un juicio.`
                : `${tranquilos} días tranquilos y ${alertas} de alerta esta semana. Notar la diferencia ya es la mitad del trabajo.`}
        </p>
      </motion.section>

      {hayMontos && (
        <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
          <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Tu semana en números</h2>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Entró</p>
              <p className="text-[17px] font-bold text-[var(--accent-2-text)] [font-variant-numeric:tabular-nums]">
                +${totalEntradas.toLocaleString('es')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Salió</p>
              <p className="text-[17px] font-bold text-[var(--accent-3-text)] [font-variant-numeric:tabular-nums]">
                -${totalGastos.toLocaleString('es')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-[var(--text-tertiary)]">Neto</p>
              <p className="text-[17px] font-bold text-[var(--text-primary)] [font-variant-numeric:tabular-nums]">
                {totalEntradas - totalGastos >= 0 ? '+' : '-'}${Math.abs(totalEntradas - totalGastos).toLocaleString('es')}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section variants={item} className="flex-1 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <TendenciaSemanas estado={estado} />
      </motion.section>
      </>
      )}
    </motion.main>
  );
}

function TendenciaSemanas({ estado }: { estado: EstadoApp }) {
  const semanas = resumenUltimasSemanas(estado.checkins, 4);
  const hayDatos = semanas.some((s) => s.marcados > 0);

  return (
    <>
      <h2 className="text-[13px] font-semibold text-[var(--text-secondary)]">Últimas 4 semanas</h2>
      {!hayDatos ? (
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Aquí vas a ver tu tendencia apenas marques un par de semanas.
        </p>
      ) : (
        <div className="mt-4 flex h-24 items-end justify-between gap-3">
          {semanas.map((s) => {
            const alturaPct = s.marcados === 0 ? 4 : Math.max(10, Math.round((s.tranquilos / s.marcados) * 100));
            const color = s.marcados === 0 ? 'var(--text-tertiary)' : s.tranquilos >= s.alertas ? 'var(--accent-2)' : 'var(--accent-3)';
            const [, m, d] = s.inicioISO.split('-').map(Number);
            return (
              <div key={s.inicioISO} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-16 w-full items-end overflow-hidden rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)]">
                  <motion.div
                    className="w-full rounded-t-[var(--radius-button)]"
                    style={{ background: color, opacity: s.marcados === 0 ? 0.25 : 1 }}
                    initial={{ height: 0 }}
                    animate={{ height: `${alturaPct}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{d}/{m}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
