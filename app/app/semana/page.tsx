'use client';

// SEMANA — vista de tendencia/histórico (obligatoria para apps de hábito, 04-ARQUITECTURA).
// Protagonista: cómo te fue cada día, con fechas reales y navegación entre semanas (regla 13).
// Primera pantalla de este tipo en el proyecto → revisor-visual la evalúa también.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { diasDeLaSemana, hoyISO, leerEstadoApp, resumenUltimasSemanas, type EstadoApp } from '@/lib/app';
import { formatearRangoSemana, inicialDia } from '@/components/app/ui';

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

export default function Semana() {
  const [estado, setEstado] = useState<EstadoApp | null>(null);
  const [offset, setOffset] = useState(0);
  const { contenedor, item } = useVariantes();

  useEffect(() => {
    setEstado(leerEstadoApp());
  }, []);

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
  const dias = fechas.map((iso) => ({
    iso,
    estadoDia: estado.checkins.find((c) => c.fecha === iso)?.estado ?? null,
    esFuturo: iso > hoy,
  }));
  const tranquilos = dias.filter((d) => d.estadoDia === 'tranquilo').length;
  const alertas = dias.filter((d) => d.estadoDia === 'alerta').length;
  const marcados = tranquilos + alertas;

  return (
    <motion.main variants={contenedor} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <motion.header variants={item}>
        <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Semana</h1>
        <div className="mt-2 flex items-center justify-between">
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
      </motion.header>

      <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
        <div className="flex justify-between">
          {dias.map(({ iso, estadoDia, esFuturo }, i) => (
            <div key={iso} className="flex flex-col items-center gap-2">
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
                    : iso === hoy
                      ? '1.5px solid var(--accent)'
                      : '1.5px solid transparent',
                }}
              >
                {!esFuturo && estadoDia && (
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: estadoDia === 'tranquilo' ? 'var(--accent-2)' : 'var(--accent-3)' }}
                  />
                )}
              </span>
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">
                {inicialDia(i)} {Number(iso.slice(8, 10))}
              </span>
            </div>
          ))}
        </div>
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

      <motion.section variants={item} className="flex-1 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
        <TendenciaSemanas estado={estado} />
      </motion.section>
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
