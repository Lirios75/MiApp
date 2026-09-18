'use client';

// KIT DE LA APP INTERNA — piezas compartidas por Hoy / Semana / Meta / Cuenta.
// Consume SOLO los tokens de components/landing/tokens.css (ya global vía
// app/globals.css) — nada de hex nuevos aquí.

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays, Flame, Home, Target, CircleUserRound, type LucideIcon } from 'lucide-react';

/* ── <AppFondo> — mesh sutil compartido, más calmo que el del funnel (esta es
   una pantalla que se abre varias veces al día: nada que "llame la atención"
   de más). Misma técnica de FunnelFondo (fixed + el padre necesita `isolate`,
   si no el bg-[var(--bg)] del padre tapa este fondo — ver components/funnel/ui.tsx). ── */
export function AppFondo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(680px 420px at 15% -8%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 60%), ' +
          'radial-gradient(620px 480px at 100% 100%, color-mix(in oklab, var(--accent-2) 9%, transparent) 0%, transparent 65%)',
      }}
    />
  );
}

const DESTINOS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/app', label: 'Hoy', icon: Home },
  { href: '/app/semana', label: 'Semana', icon: CalendarDays },
  { href: '/app/meta', label: 'Meta', icon: Target },
  { href: '/app/cuenta', label: 'Cuenta', icon: CircleUserRound },
];

/* ── <BottomNav> — 4 destinos (regla de 3-5), activo con chip de fondo +
   ícono/label en acento (nunca del mismo color que su contenedor). "Isla
   flotante": la barra se despega de los bordes y del fondo con margen
   visible alrededor y sombra propia — elegida por la usuaria el 2026-09-18
   entre 3 variantes de relieve (ver docs/revisiones/vivo/nav-variante-*.png). ── */
export function BottomNav() {
  const ruta = usePathname();
  return (
    <div className="px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Navegación principal"
        className="flex h-16 items-stretch rounded-[var(--radius-card)] bg-[var(--surface)] px-1 shadow-[var(--shadow-2)]"
      >
        {DESTINOS.map(({ href, label, icon: Icono }) => {
          const activo = href === '/app' ? ruta === '/app' : ruta.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={activo ? 'page' : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 [touch-action:manipulation]"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-[var(--radius-button)] ${
                  activo ? 'bg-[var(--chip-bg)]' : ''
                }`}
              >
                <Icono size={20} strokeWidth={activo ? 2.25 : 2} color={activo ? 'var(--accent)' : 'var(--text-tertiary)'} aria-hidden="true" />
              </span>
              <span className={`text-[11px] font-medium ${activo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* ── <AnilloProgreso> — el dispositivo ownable de FICHA-ARTE (el mismo anillo
   de RespiraMark) aplicado a datos reales: racha o avance de meta. Se dibuja
   de 0 al valor real (baseline #3 de DESIGN-CORE), nunca aparece ya lleno. ── */
export function AnilloProgreso({
  porcentaje,
  tamano = 96,
  grosor = 10,
  color = 'var(--accent)',
  children,
}: {
  porcentaje: number; // 0-100
  tamano?: number;
  grosor?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const objetivo = Math.min(100, Math.max(0, porcentaje));
  const offsetObjetivo = circunferencia * (1 - objetivo / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} className="-rotate-90">
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="color-mix(in oklab, var(--text-tertiary) 18%, transparent)"
          strokeWidth={grosor}
        />
        <motion.circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          initial={{ strokeDashoffset: circunferencia }}
          animate={{ strokeDashoffset: reduce ? offsetObjetivo : offsetObjetivo }}
          transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ── <ConteoAnimado> — número héroe que cuenta de 0 al valor (baseline #2).
   Respeta reduced-motion (salta directo al valor). ── */
export function ConteoAnimado({ valor, sufijo = '' }: { valor: number; sufijo?: string }) {
  const reduce = useReducedMotion();
  const [mostrado, setMostrado] = useState(reduce ? valor : 0);

  useEffect(() => {
    if (reduce) {
      setMostrado(valor);
      return;
    }
    const duracionMs = 700;
    const inicio = performance.now();
    let raf = 0;
    function paso(ahora: number) {
      const t = Math.min(1, (ahora - inicio) / duracionMs);
      const easeOut = 1 - (1 - t) * (1 - t);
      setMostrado(Math.round(easeOut * valor));
      if (t < 1) raf = requestAnimationFrame(paso);
    }
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <span className="[font-variant-numeric:tabular-nums]">
      {mostrado}
      {sufijo}
    </span>
  );
}

/* ── <RachaBadge> — chip pequeño de racha (3ª nota de FICHA-ARTE: naranja =
   racha/hito), visible desde el día 1 en la app interna (a diferencia del
   onboarding, aquí SÍ hay racha real que mostrar). ── */
export function RachaBadge({ dias }: { dias: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_14%,transparent)] px-3 py-1.5">
      <Flame size={15} strokeWidth={2.25} color="var(--accent-3)" aria-hidden="true" />
      <span className="text-[13px] font-semibold text-[var(--accent-3-text)]">
        <ConteoAnimado valor={dias} /> {dias === 1 ? 'día' : 'días'}
      </span>
    </span>
  );
}

const DIAS_SEMANA_CORTOS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export function inicialDia(index: number): string {
  return DIAS_SEMANA_CORTOS[index] ?? '';
}

export function formatearFechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  const texto = fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatearRangoSemana(fechas: readonly string[]): string {
  const [inicio] = fechas;
  const fin = fechas[fechas.length - 1];
  if (!inicio || !fin) return '';
  const [, mi, di] = inicio.split('-').map(Number);
  const [, mf, df] = fin.split('-').map(Number);
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  if (mi === mf) return `${di}-${df} ${meses[mi - 1]}`;
  return `${di} ${meses[mi - 1]} - ${df} ${meses[mf - 1]}`;
}
