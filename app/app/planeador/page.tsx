'use client';

// PLANEADOR SEMANAL — 5to ícono de la app interna (pedido de la usuaria, Sesión 8, cierre de
// año): objetivos de la semana, agua, hábitos L-D, notas, gratitud y tareas por día — inspirado
// en un planeador de papel que mostró. A diferencia de "Semana" (que mira hacia atrás, el
// historial del Semáforo), este mira hacia ADELANTE: se llena por anticipado, por eso SÍ deja
// navegar a semanas futuras sin límite (el "→" nunca se deshabilita). Primera pantalla de este
// tipo en el proyecto → revisor-visual la evalúa también.
//
// Ronda 2 (tras veredicto NO LISTA del revisor-visual, 27/40·12/20): tarjetas colapsables (solo
// Agua y Tareas abren por defecto — antes eran 6 tarjetas abiertas a la vez, sin una acción
// primaria reconocible), anillo de respiración en el header (el dispositivo ownable de
// FICHA-ARTE, ausente en la v1) mostrando % de la semana cumplida, feedback de tap (whileTap) en
// TODO control de esta pantalla (antes solo el contenedor tenía stagger de entrada), borrar una
// tarea ahora pide el mismo 2do-toque de confirmación que borrar un hábito (antes era instantáneo
// e inconsistente), y cada guardado que falla AVISA y revierte el cambio optimista (antes fallaba
// en silencio — catch(console.error) sin avisar a la usuaria).
//
// Ronda 3 (tras veredicto NO LISTA #2, 33/40·13/20): el anillo pasó a ser el doble-anillo real
// de RespiraMark (verde afuera = % hábitos, naranja adentro = % tareas — antes era un círculo de
// un solo color, genérico), el aviso de guardado fallido ahora es `fixed` arriba de la pantalla
// (antes quedaba fuera de vista si se editaba una tarjeta del fondo), los títulos de cada tarjeta
// subieron a 16px (antes 13px, más chicos que su propio contenido), borrar un hábito o tarea
// ahora ofrece "Deshacer" unos segundos antes de persistir el borrado (antes era definitivo al
// confirmar), y cambiar de día en "Tus tareas" anima la lista + se celebra al llegar a 100% de
// la semana.

import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Flag,
  Heart,
  ListChecks,
  NotebookPen,
  PartyPopper,
  Plus,
  Repeat,
  WifiOff,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  diasDeLaSemana,
  DIAS_SEMANA_LARGO,
  hoyISO,
  MAX_GRATITUD_SEMANA,
  MAX_OBJETIVOS_SEMANA,
  VASOS_AGUA_META,
  type HabitoSemanal,
  type ObjetivoSemanal,
  type PlanificadorSemana,
  type TareaDia,
} from '@/lib/app';
import {
  actualizarAguaSemana,
  actualizarGratitudSemana,
  actualizarHabitosSemana,
  actualizarNotasSemana,
  actualizarObjetivosSemana,
  actualizarTareasSemana,
  obtenerPlanificadorSemana,
} from '@/lib/supabase/datos';
import { ConteoAnimado, ErrorCarga, formatearRangoSemana, inicialDia } from '@/components/app/ui';

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

// Mismas constantes EXACTAS de components/RespiraMark.tsx — ronda 3 del revisor-visual marcó
// que un barrido 0-360° se lee como un "Activity Ring" genérico, no como el logo real (que
// SIEMPRE tiene una abertura de 270°, nunca un círculo cerrado). Reusar los mismos números hace
// que este anillo sea reconociblemente "el mismo dispositivo", solo con datos en vez de decorar.
const BARRIDO_ANILLO = 0.75;
const OFFSET_EXTERIOR_ANILLO = 0.375;
const OFFSET_INTERIOR_ANILLO = 0.875;

/* ── <AnilloSemana> — el dispositivo ownable de FICHA-ARTE (el doble anillo de RespiraMark:
   verde afuera, naranja adentro), con la MISMA abertura de 270° que el logo real, llevado a un
   indicador de progreso: el anillo EXTERIOR verde es el % de hábitos marcados esta semana, el
   INTERIOR naranja el % de tareas hechas — el check de "tarea hecha" en <TareasCard> usa el
   mismo naranja, para que el color no contradiga lo que mide. Una leyenda chica debajo aclara
   qué mide cada color (antes no había ninguna). ── */
function AnilloSemana({
  porcentajeHabitos,
  porcentajeTareas,
  porcentajeTotal,
}: {
  porcentajeHabitos: number;
  porcentajeTareas: number;
  porcentajeTotal: number;
}) {
  const reduce = useReducedMotion();
  const tamano = 52;
  const centro = tamano / 2;
  const grosor = 5;
  const rExterior = centro - grosor / 2 - 1;
  const rInterior = rExterior - grosor - 2;
  const avanceExterior = BARRIDO_ANILLO * (Math.min(100, Math.max(0, porcentajeHabitos)) / 100);
  const avanceInterior = BARRIDO_ANILLO * (Math.min(100, Math.max(0, porcentajeTareas)) / 100);

  return (
    <div className="relative shrink-0" style={{ width: tamano, height: tamano }} role="img" aria-label={`${porcentajeTotal}% de tu semana — ${porcentajeHabitos}% de hábitos, ${porcentajeTareas}% de tareas`}>
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} aria-hidden="true">
        {/* pistas (el resto de la abertura de 270°, en tono tenue) */}
        <circle
          cx={centro}
          cy={centro}
          r={rExterior}
          stroke="color-mix(in oklab, var(--accent-2) 16%, transparent)"
          strokeWidth={grosor}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={`${BARRIDO_ANILLO} ${1 - BARRIDO_ANILLO}`}
          strokeDashoffset={-OFFSET_EXTERIOR_ANILLO}
        />
        <circle
          cx={centro}
          cy={centro}
          r={rInterior}
          stroke="color-mix(in oklab, var(--accent-3) 16%, transparent)"
          strokeWidth={grosor}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={`${BARRIDO_ANILLO} ${1 - BARRIDO_ANILLO}`}
          strokeDashoffset={-OFFSET_INTERIOR_ANILLO}
        />
        {/* progreso real, mismo punto de partida que el logo */}
        <motion.circle
          cx={centro}
          cy={centro}
          r={rExterior}
          stroke="var(--accent-2)"
          strokeWidth={grosor}
          strokeLinecap="round"
          fill="none"
          style={{ pathOffset: OFFSET_EXTERIOR_ANILLO, pathSpacing: 1 - BARRIDO_ANILLO }}
          initial={{ pathLength: reduce ? avanceExterior : 0 }}
          animate={{ pathLength: avanceExterior }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx={centro}
          cy={centro}
          r={rInterior}
          stroke="var(--accent-3)"
          strokeWidth={grosor}
          strokeLinecap="round"
          fill="none"
          style={{ pathOffset: OFFSET_INTERIOR_ANILLO, pathSpacing: 1 - BARRIDO_ANILLO }}
          initial={{ pathLength: reduce ? avanceInterior : 0 }}
          animate={{ pathLength: avanceInterior }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[13px] font-bold [font-variant-numeric:tabular-nums] [font-family:var(--font-display)]"
      >
        <ConteoAnimado valor={porcentajeTotal} sufijo="%" />
      </span>
    </div>
  );
}

const ESTILO_INPUT =
  'h-11 w-full rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent)]';
const TAP = { scale: 0.93 };
const TAP_TRANSICION = { duration: 0.12 };

export default function PlaneadorPage() {
  const [plan, setPlan] = useState<PlanificadorSemana | null>(null);
  const [error, setError] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [offset, setOffset] = useState(0);
  const [diaTareaIndex, setDiaTareaIndex] = useState<number | null>(null);
  const { contenedor, item } = useVariantes();

  const fechas = diasDeLaSemana(offset);
  const semanaInicio = fechas[0] ?? hoyISO();

  useEffect(() => {
    setPlan(null);
    obtenerPlanificadorSemana(semanaInicio)
      .then(setPlan)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaInicio]);

  useEffect(() => {
    if (!errorGuardado) return;
    const t = setTimeout(() => setErrorGuardado(false), 4000);
    return () => clearTimeout(t);
  }, [errorGuardado]);

  if (error) {
    return <ErrorCarga />;
  }

  if (!plan) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-4 pt-8">
        <div className="h-6 w-36 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="h-28 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-28 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-44 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const hoyIndex = fechas.indexOf(hoyISO());
  const diaActivo = diaTareaIndex ?? (hoyIndex >= 0 ? hoyIndex : 0);

  // Alias no-nulo: los `function` declarados abajo son closures que TS no narrowea a partir del
  // guard `if (!plan) return` de arriba (solo narrowea el scope síncrono), así que necesitan su
  // propia referencia ya angosta a `PlanificadorSemana` (sin el `| null`) para leer el valor
  // "anterior" al revertir un guardado fallido.
  const planActual = plan;

  const totalHabitos = plan.habitos.length * 7;
  const hechosHabitos = plan.habitos.reduce((acc, h) => acc + h.dias.filter(Boolean).length, 0);
  const todasTareas = plan.tareas.flat();
  const hechasTareas = todasTareas.filter((t) => t.hecho).length;
  const totalPosible = totalHabitos + todasTareas.length;
  const porcentajeHabitos = totalHabitos > 0 ? Math.round((hechosHabitos / totalHabitos) * 100) : 0;
  const porcentajeTareas = todasTareas.length > 0 ? Math.round((hechasTareas / todasTareas.length) * 100) : 0;
  const porcentajeSemana = totalPosible > 0 ? Math.round(((hechosHabitos + hechasTareas) / totalPosible) * 100) : 0;

  function avisarErrorGuardado() {
    setErrorGuardado(true);
  }

  function guardarObjetivos(objetivos: ObjetivoSemanal[]) {
    const anterior = planActual.objetivos;
    setPlan((p) => (p ? { ...p, objetivos } : p));
    actualizarObjetivosSemana(semanaInicio, objetivos).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, objetivos: anterior } : p));
      avisarErrorGuardado();
    });
  }

  function cambiarAgua(dia: number, vasos: number) {
    const anterior = planActual.agua;
    const agua = anterior.map((v, i) => (i === dia ? vasos : v));
    setPlan((p) => (p ? { ...p, agua } : p));
    actualizarAguaSemana(semanaInicio, agua).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, agua: anterior } : p));
      avisarErrorGuardado();
    });
  }

  function guardarHabitos(habitos: HabitoSemanal[]) {
    const anterior = planActual.habitos;
    setPlan((p) => (p ? { ...p, habitos } : p));
    actualizarHabitosSemana(semanaInicio, habitos).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, habitos: anterior } : p));
      avisarErrorGuardado();
    });
  }

  function guardarTareas(tareas: TareaDia[][]) {
    const anterior = planActual.tareas;
    setPlan((p) => (p ? { ...p, tareas } : p));
    actualizarTareasSemana(semanaInicio, tareas).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, tareas: anterior } : p));
      avisarErrorGuardado();
    });
  }

  function guardarNotas(notas: string) {
    const anterior = planActual.notas;
    setPlan((p) => (p ? { ...p, notas } : p));
    actualizarNotasSemana(semanaInicio, notas).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, notas: anterior } : p));
      avisarErrorGuardado();
    });
  }

  function guardarGratitud(gratitud: string[]) {
    const anterior = planActual.gratitud;
    setPlan((p) => (p ? { ...p, gratitud } : p));
    actualizarGratitudSemana(semanaInicio, gratitud).catch((e) => {
      console.error(e);
      setPlan((p) => (p ? { ...p, gratitud: anterior } : p));
      avisarErrorGuardado();
    });
  }

  return (
    <motion.main variants={contenedor} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-8">
      <motion.header variants={item}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[22px] font-bold [font-family:var(--font-display)]">Tu semana</h1>
          <div className="flex flex-col items-end gap-1">
            <AnilloSemana porcentajeHabitos={porcentajeHabitos} porcentajeTareas={porcentajeTareas} porcentajeTotal={porcentajeSemana} />
            <div className="flex gap-2 text-[11px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <span aria-hidden="true" className="size-2 rounded-full" style={{ background: 'var(--accent-2)' }} />
                Hábitos
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden="true" className="size-2 rounded-full" style={{ background: 'var(--accent-3)' }} />
                Tareas
              </span>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {porcentajeSemana === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
              className="mt-2 flex items-center gap-2 overflow-hidden rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-2)_12%,transparent)] px-3 py-2"
            >
              <PartyPopper size={15} strokeWidth={2} color="var(--accent-2-text)" aria-hidden="true" />
              <span className="text-[13px] font-semibold text-[var(--accent-2-text)]">¡Semana completa! Cumpliste todo lo que planeaste.</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-3 flex items-center justify-between">
          <motion.button
            type="button"
            whileTap={TAP}
            transition={TAP_TRANSICION}
            onClick={() => {
              setOffset((o) => o - 1);
              setDiaTareaIndex(null);
            }}
            aria-label="Semana anterior"
            className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] [touch-action:manipulation]"
          >
            <ChevronLeft size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
          </motion.button>
          <span className="text-[15px] font-semibold text-[var(--text-secondary)]">{formatearRangoSemana(fechas)}</span>
          <motion.button
            type="button"
            whileTap={TAP}
            transition={TAP_TRANSICION}
            onClick={() => {
              setOffset((o) => o + 1);
              setDiaTareaIndex(null);
            }}
            aria-label="Semana siguiente"
            className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] [touch-action:manipulation]"
          >
            <ChevronRight size={18} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.header>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <div className="w-full max-w-[468px]">
          <AnimatePresence>
            {errorGuardado && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent-3)] px-3 py-2.5 shadow-[var(--shadow-2)]"
              >
                <WifiOff size={15} strokeWidth={2} color="var(--text-primary)" aria-hidden="true" />
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">No se pudo guardar. Revisa tu conexión e intenta de nuevo.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ObjetivosSemanaCard objetivos={plan.objetivos} onGuardar={guardarObjetivos} item={item} />

      <AguaCard agua={plan.agua} fechas={fechas} onCambiar={cambiarAgua} item={item} />

      <HabitosCard habitos={plan.habitos} fechas={fechas} onCambiar={guardarHabitos} item={item} />

      <TareasCard
        tareas={plan.tareas}
        fechas={fechas}
        diaIndex={diaActivo}
        onCambiarDia={setDiaTareaIndex}
        onCambiar={guardarTareas}
        item={item}
      />

      <ObjetivosCard
        titulo="Gratitud de la semana"
        icono={Heart}
        colorVar="var(--accent-3)"
        placeholder={(i) => `Agradezco por... (${i + 1})`}
        valores={plan.gratitud}
        max={MAX_GRATITUD_SEMANA}
        onGuardar={guardarGratitud}
        item={item}
      />

      <NotasCard notas={plan.notas} onGuardar={guardarNotas} item={item} />
    </motion.main>
  );
}

/* ── <Tarjeta> — envoltorio colapsable compartido por las 6 secciones (ronda 2: antes las 6
   estaban siempre abiertas a la vez, sin una acción primaria clara). El encabezado (ícono +
   título + resumen + flecha) siempre se ve y es el toggle; el contenido se anima con altura
   "auto" vía AnimatePresence. Solo Agua y Tareas abren por defecto (abiertaInicial=true) — las
   dos que se usan día a día; el resto se revisa con menos frecuencia. ── */
function Tarjeta({
  titulo,
  icono: Icono,
  colorVar,
  resumen,
  abiertaInicial = false,
  item,
  children,
}: {
  titulo: string;
  icono: LucideIcon;
  colorVar: string;
  resumen: string;
  abiertaInicial?: boolean;
  item: Variants;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(abiertaInicial);
  return (
    <motion.section variants={item} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <motion.button
        type="button"
        whileTap={TAP}
        transition={TAP_TRANSICION}
        onClick={() => setAbierta((a) => !a)}
        aria-expanded={abierta}
        className="flex w-full items-center justify-between gap-2 [touch-action:manipulation]"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icono size={16} strokeWidth={2} color={colorVar} aria-hidden="true" />
          <span className="truncate text-[19px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">{titulo}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-[12px] text-[var(--text-tertiary)]">{resumen}</span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            color="var(--text-tertiary)"
            aria-hidden="true"
            className={`transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
          />
        </span>
      </motion.button>
      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div
            key="contenido"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ── <SnackbarDeshacer> — tras confirmar un borrado (hábito o tarea), el ítem desaparece de la
   vista YA pero el borrado real se demora unos segundos: esta barra ofrece "Deshacer" mientras
   tanto. Antes el borrado tras el 2do toque era definitivo al instante. ── */
function SnackbarDeshacer({ texto, onDeshacer }: { texto: string; onDeshacer: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18 }}
      className="mt-2 flex items-center justify-between gap-2 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-3 py-2"
    >
      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--bg)]">{texto}</span>
      <motion.button
        type="button"
        whileTap={TAP}
        transition={TAP_TRANSICION}
        onClick={onDeshacer}
        className="shrink-0 text-[13px] font-bold text-[var(--accent-3)] [touch-action:manipulation]"
      >
        Deshacer
      </motion.button>
    </motion.div>
  );
}

/* ── <ObjetivosSemanaCard> — los 3 objetivos reales de la semana, los ÚNICOS que SÍ se marcan
   como cumplidos (pedido explícito de la usuaria) — a diferencia de Gratitud (que es solo texto,
   nunca "se cumple"), por eso es un componente aparte y no un caso más de <ObjetivosCard>. El
   mismo círculo numerado (1/2/3) es el botón para marcar: toca y se convierte en un check, el
   texto queda tachado — mismo lenguaje visual que el check de "tarea hecha". No se puede marcar
   un objetivo vacío. ── */
function ObjetivosSemanaCard({
  objetivos,
  onGuardar,
  item,
}: {
  objetivos: ObjetivoSemanal[];
  onGuardar: (objetivos: ObjetivoSemanal[]) => void;
  item: Variants;
}) {
  const [textos, setTextos] = useState<string[]>(() =>
    Array.from({ length: MAX_OBJETIVOS_SEMANA }, (_, i) => objetivos[i]?.texto ?? '')
  );

  useEffect(() => {
    setTextos(Array.from({ length: MAX_OBJETIVOS_SEMANA }, (_, i) => objetivos[i]?.texto ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objetivos.map((o) => `${o.texto}|${o.hecho}`).join(',')]);

  function alSalirTexto(i: number) {
    const valor = (textos[i] ?? '').trim();
    if (valor === (objetivos[i]?.texto ?? '')) return;
    onGuardar(
      Array.from({ length: MAX_OBJETIVOS_SEMANA }, (_, idx) =>
        idx === i ? { texto: valor, hecho: valor ? (objetivos[idx]?.hecho ?? false) : false } : objetivos[idx] ?? { texto: '', hecho: false }
      )
    );
  }

  function alternarHecho(i: number) {
    onGuardar(
      Array.from({ length: MAX_OBJETIVOS_SEMANA }, (_, idx) =>
        idx === i
          ? { texto: objetivos[idx]?.texto ?? '', hecho: !(objetivos[idx]?.hecho ?? false) }
          : objetivos[idx] ?? { texto: '', hecho: false }
      )
    );
  }

  const llenos = objetivos.filter((o) => o.texto.trim()).length;
  const cumplidos = objetivos.filter((o) => o.texto.trim() && o.hecho).length;

  return (
    <Tarjeta titulo="Objetivos" icono={Flag} colorVar="var(--accent)" resumen={`${cumplidos}/${llenos || MAX_OBJETIVOS_SEMANA} cumplidos`} item={item}>
      <div className="flex flex-col gap-2">
        {textos.map((texto, i) => {
          const hecho = objetivos[i]?.hecho ?? false;
          const tieneTexto = texto.trim().length > 0;
          return (
            <div key={i} className="flex items-center gap-2">
              <motion.button
                type="button"
                whileTap={tieneTexto ? TAP : undefined}
                transition={TAP_TRANSICION}
                onClick={() => tieneTexto && alternarHecho(i)}
                disabled={!tieneTexto}
                aria-pressed={hecho}
                aria-label={
                  tieneTexto
                    ? hecho
                      ? `Marcar "${texto}" como pendiente`
                      : `Marcar "${texto}" como cumplido`
                    : `Objetivo ${i + 1} vacío`
                }
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold disabled:opacity-60 [touch-action:manipulation]"
                style={{
                  background: hecho ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 14%, transparent)',
                  color: hecho ? 'var(--bg)' : 'var(--accent)',
                }}
              >
                {hecho ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : i + 1}
              </motion.button>
              <input
                type="text"
                value={texto}
                placeholder={`Objetivo ${i + 1}`}
                onChange={(e) => setTextos((t) => t.map((v, idx) => (idx === i ? e.target.value : v)))}
                onBlur={() => alSalirTexto(i)}
                aria-label={`Objetivo ${i + 1}`}
                className={`${ESTILO_INPUT} ${hecho ? 'text-[var(--text-tertiary)] line-through' : ''}`}
              />
            </div>
          );
        })}
      </div>
    </Tarjeta>
  );
}

/* ── <ObjetivosCard> — 3 líneas fijas numeradas (objetivos o gratitud, mismo patrón que el
   planeador de papel: siempre 3 espacios, se llenan o se dejan en blanco). Reusada para ambas
   tarjetas con ícono/color distintos. ── */
function ObjetivosCard({
  titulo,
  icono,
  colorVar,
  placeholder,
  valores,
  max,
  onGuardar,
  item,
}: {
  titulo: string;
  icono: LucideIcon;
  colorVar: string;
  placeholder: (i: number) => string;
  valores: string[];
  max: number;
  onGuardar: (valores: string[]) => void;
  item: Variants;
}) {
  const [textos, setTextos] = useState<string[]>(() => Array.from({ length: max }, (_, i) => valores[i] ?? ''));

  useEffect(() => {
    setTextos(Array.from({ length: max }, (_, i) => valores[i] ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valores.join('|')]);

  function alSalir(i: number) {
    const valor = (textos[i] ?? '').trim();
    if (valor === (valores[i] ?? '')) return;
    onGuardar(Array.from({ length: max }, (_, idx) => (idx === i ? valor : valores[idx] ?? '')));
  }

  const llenos = valores.filter((v) => v.trim()).length;

  return (
    <Tarjeta titulo={titulo} icono={icono} colorVar={colorVar} resumen={`${llenos}/${max} escritos`} item={item}>
      <div className="flex flex-col gap-2">
        {textos.map((texto, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
              style={{ background: `color-mix(in oklab, ${colorVar} 14%, transparent)`, color: colorVar }}
            >
              {i + 1}
            </span>
            <input
              type="text"
              value={texto}
              placeholder={placeholder(i)}
              onChange={(e) => setTextos((t) => t.map((v, idx) => (idx === i ? e.target.value : v)))}
              onBlur={() => alSalir(i)}
              aria-label={placeholder(i)}
              className={ESTILO_INPUT}
            />
          </div>
        ))}
      </div>
    </Tarjeta>
  );
}

/* ── <AguaCard> — un vaso por día, toca para sumar uno (cicla a 0 al llegar a la meta, así
   también sirve para corregir sin un botón "-" aparte). Abierta por defecto (es la acción más
   rápida y diaria de la pantalla). ── */
function AguaCard({
  agua,
  fechas,
  onCambiar,
  item,
}: {
  agua: number[];
  fechas: string[];
  onCambiar: (dia: number, vasos: number) => void;
  item: Variants;
}) {
  const totalSemana = agua.reduce((a, b) => a + b, 0);
  return (
    <Tarjeta titulo="Agua" icono={Droplet} colorVar="var(--accent)" resumen={`${totalSemana} vasos`} abiertaInicial item={item}>
      <div className="flex items-center justify-end">
        <span className="text-[11px] text-[var(--text-tertiary)]">Meta: {VASOS_AGUA_META} vasos/día</span>
      </div>
      <div className="mt-3 flex justify-between">
        {fechas.map((iso, i) => {
          const vasos = agua[i] ?? 0;
          const lleno = vasos >= VASOS_AGUA_META;
          return (
            <motion.button
              key={iso}
              type="button"
              whileTap={TAP}
              transition={TAP_TRANSICION}
              onClick={() => onCambiar(i, lleno ? 0 : vasos + 1)}
              aria-label={`${DIAS_SEMANA_LARGO[i]}: ${vasos} de ${VASOS_AGUA_META} vasos de agua. Toca para sumar uno.`}
              className="flex flex-col items-center gap-1.5 [touch-action:manipulation]"
            >
              <span
                className="flex size-9 items-center justify-center rounded-full text-[12px] font-bold [font-variant-numeric:tabular-nums]"
                style={{
                  background: lleno
                    ? 'var(--accent)'
                    : vasos > 0
                      ? 'color-mix(in oklab, var(--accent) 35%, var(--surface-2))'
                      : 'var(--surface-2)',
                  color: lleno ? 'var(--bg)' : 'var(--text-primary)',
                }}
              >
                {vasos}
              </span>
              <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{inicialDia(i)}</span>
            </motion.button>
          );
        })}
      </div>
    </Tarjeta>
  );
}

/* ── <HabitosCard> — la usuaria nombra sus propios hábitos (no hay catálogo fijo, cada quien
   tiene los suyos) y marca día por día. Borrar pide un segundo toque de confirmación (es
   irreversible) en vez de un modal aparte — más liviano para una lista potencialmente larga. ── */
function HabitosCard({
  habitos,
  fechas,
  onCambiar,
  item,
}: {
  habitos: HabitoSemanal[];
  fechas: string[];
  onCambiar: (habitos: HabitoSemanal[]) => void;
  item: Variants;
}) {
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [ocultosId, setOcultosId] = useState<Set<string>>(new Set());
  const [pendienteBorrar, setPendienteBorrar] = useState<{ id: string; nombre: string; timeout: ReturnType<typeof setTimeout> } | null>(null);

  useEffect(() => {
    return () => {
      if (pendienteBorrar) clearTimeout(pendienteBorrar.timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function agregarHabito(e: FormEvent) {
    e.preventDefault();
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    onCambiar([...habitos, { id: crypto.randomUUID(), nombre, dias: [false, false, false, false, false, false, false] }]);
    setNuevoNombre('');
  }

  function alternarDia(habitoId: string, dia: number) {
    onCambiar(
      habitos.map((h) => (h.id === habitoId ? { ...h, dias: h.dias.map((d, i) => (i === dia ? !d : d)) } : h))
    );
  }

  function borrarHabito(id: string) {
    setConfirmandoId(null);
    const habito = habitos.find((h) => h.id === id);
    if (!habito) return;
    setOcultosId((s) => new Set(s).add(id));
    const timeout = setTimeout(() => {
      onCambiar(habitos.filter((h) => h.id !== id));
      setPendienteBorrar(null);
    }, 4000);
    setPendienteBorrar({ id, nombre: habito.nombre, timeout });
  }

  function deshacerBorrado() {
    if (!pendienteBorrar) return;
    clearTimeout(pendienteBorrar.timeout);
    setOcultosId((s) => {
      const copia = new Set(s);
      copia.delete(pendienteBorrar.id);
      return copia;
    });
    setPendienteBorrar(null);
  }

  const habitosVisibles = habitos.filter((h) => !ocultosId.has(h.id));

  return (
    <Tarjeta
      titulo="Tus hábitos"
      icono={Repeat}
      colorVar="var(--accent-2)"
      resumen={habitosVisibles.length === 0 ? 'Ninguno' : `${habitosVisibles.length} hábito${habitosVisibles.length === 1 ? '' : 's'}`}
      item={item}
    >
      {habitosVisibles.length === 0 ? (
        <p className="text-[13px] text-[var(--text-tertiary)]">
          Agrega un hábito que quieras repetir esta semana — lo vas marcando día a día.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="min-w-0 flex-1" />
            {fechas.map((iso, i) => (
              <span key={iso} className="w-6 shrink-0 text-center text-[10px] font-semibold uppercase text-[var(--text-tertiary)]">
                {inicialDia(i)}
              </span>
            ))}
          </div>
          {habitosVisibles.map((h) =>
            confirmandoId === h.id ? (
              <div
                key={h.id}
                className="flex items-center justify-between gap-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_10%,transparent)] px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-secondary)]">¿Borrar &quot;{h.nombre}&quot;?</span>
                <div className="flex shrink-0 gap-1">
                  <motion.button
                    type="button"
                    whileTap={TAP}
                    transition={TAP_TRANSICION}
                    onClick={() => setConfirmandoId(null)}
                    className="h-7 rounded-[var(--radius-button)] px-2 text-[12px] font-semibold text-[var(--text-secondary)] [touch-action:manipulation]"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={TAP}
                    transition={TAP_TRANSICION}
                    onClick={() => borrarHabito(h.id)}
                    className="h-7 rounded-[var(--radius-button)] bg-[var(--accent-3)] px-2 text-[12px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
                  >
                    Borrar
                  </motion.button>
                </div>
              </div>
            ) : (
              <div key={h.id} className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  whileTap={TAP}
                  transition={TAP_TRANSICION}
                  onClick={() => setConfirmandoId(h.id)}
                  aria-label={`Borrar hábito ${h.nombre}`}
                  className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-[var(--text-primary)] [touch-action:manipulation]"
                >
                  {h.nombre}
                </motion.button>
                {h.dias.map((hecho, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={TAP}
                    transition={TAP_TRANSICION}
                    onClick={() => alternarDia(h.id, i)}
                    aria-pressed={hecho}
                    aria-label={`${h.nombre} — ${DIAS_SEMANA_LARGO[i]}: ${hecho ? 'cumplido' : 'sin marcar'}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
                    style={{ background: hecho ? 'var(--accent-2)' : 'var(--surface-2)' }}
                  >
                    {hecho && <Check size={12} strokeWidth={3} color="var(--bg)" aria-hidden="true" />}
                  </motion.button>
                ))}
              </div>
            )
          )}
        </div>
      )}

      <form onSubmit={agregarHabito} className="mt-4 flex gap-2">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Ej: Caminar 20 minutos"
          aria-label="Nombre del hábito nuevo"
          className={ESTILO_INPUT}
        />
        <motion.button
          type="submit"
          whileTap={nuevoNombre.trim() ? TAP : undefined}
          transition={TAP_TRANSICION}
          disabled={!nuevoNombre.trim()}
          aria-label="Agregar hábito"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] disabled:opacity-40 [touch-action:manipulation]"
        >
          <Plus size={20} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
        </motion.button>
      </form>

      <AnimatePresence>
        {pendienteBorrar && <SnackbarDeshacer texto={`"${pendienteBorrar.nombre}" borrado`} onDeshacer={deshacerBorrado} />}
      </AnimatePresence>
    </Tarjeta>
  );
}

/* ── <TareasCard> — una lista por día (no una sola lista mezclada de toda la semana), elegida
   con los mismos chips de fecha que ya usa "Semana" para moverse entre días. Borrar pide el mismo
   2do toque de confirmación que borrar un hábito (antes era instantáneo — inconsistente con la
   tarjeta de arriba para la misma clase de acción: destructiva e irreversible). Abierta por
   defecto junto con Agua (las dos acciones del día a día). ── */
function TareasCard({
  tareas,
  fechas,
  diaIndex,
  onCambiarDia,
  onCambiar,
  item,
}: {
  tareas: TareaDia[][];
  fechas: string[];
  diaIndex: number;
  onCambiarDia: (i: number) => void;
  onCambiar: (tareas: TareaDia[][]) => void;
  item: Variants;
}) {
  const [texto, setTexto] = useState('');
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [ocultosId, setOcultosId] = useState<Set<string>>(new Set());
  const [pendienteBorrar, setPendienteBorrar] = useState<{ id: string; texto: string; timeout: ReturnType<typeof setTimeout> } | null>(null);
  const listaDia = (tareas[diaIndex] ?? []).filter((t) => !ocultosId.has(t.id));
  const pendientes = tareas.flat().filter((t) => !t.hecho).length;

  useEffect(() => {
    return () => {
      if (pendienteBorrar) clearTimeout(pendienteBorrar.timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function agregar(e: FormEvent) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    const nueva: TareaDia = { id: crypto.randomUUID(), texto: limpio, hecho: false };
    onCambiar(tareas.map((lista, i) => (i === diaIndex ? [...lista, nueva] : lista)));
    setTexto('');
  }

  function alternar(id: string) {
    onCambiar(tareas.map((lista, i) => (i === diaIndex ? lista.map((t) => (t.id === id ? { ...t, hecho: !t.hecho } : t)) : lista)));
  }

  function borrar(id: string) {
    setConfirmandoId(null);
    const tarea = (tareas[diaIndex] ?? []).find((t) => t.id === id);
    if (!tarea) return;
    setOcultosId((s) => new Set(s).add(id));
    const timeout = setTimeout(() => {
      onCambiar(tareas.map((lista, i) => (i === diaIndex ? lista.filter((t) => t.id !== id) : lista)));
      setPendienteBorrar(null);
    }, 4000);
    setPendienteBorrar({ id, texto: tarea.texto, timeout });
  }

  function deshacerBorrado() {
    if (!pendienteBorrar) return;
    clearTimeout(pendienteBorrar.timeout);
    setOcultosId((s) => {
      const copia = new Set(s);
      copia.delete(pendienteBorrar.id);
      return copia;
    });
    setPendienteBorrar(null);
  }

  return (
    <Tarjeta
      titulo="Tus tareas"
      icono={ListChecks}
      colorVar="var(--accent)"
      resumen={`${pendientes} pendiente${pendientes === 1 ? '' : 's'}`}
      abiertaInicial
      item={item}
    >
      <div className="relative">
        <div role="tablist" aria-label="Elegir día" className="flex gap-1.5 overflow-x-auto pb-1">
          {fechas.map((iso, i) => {
            const activo = i === diaIndex;
            return (
              <motion.button
                key={iso}
                type="button"
                whileTap={TAP}
                transition={TAP_TRANSICION}
                role="tab"
                aria-selected={activo}
                onClick={() => onCambiarDia(i)}
                className="flex h-8 shrink-0 items-center rounded-full px-3 text-[12px] font-semibold [touch-action:manipulation]"
                style={{ background: activo ? 'var(--accent)' : 'var(--surface-2)', color: activo ? 'var(--bg)' : 'var(--text-secondary)' }}
              >
                {inicialDia(i)} {Number(iso.slice(8, 10))}
              </motion.button>
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8"
          style={{ background: 'linear-gradient(to right, transparent, var(--surface))' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={diaIndex}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
        >
          {listaDia.length === 0 ? (
            <p className="mt-4 text-[13px] text-[var(--text-tertiary)]">Sin tareas para este día todavía.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {listaDia.map((t) =>
                confirmandoId === t.id ? (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_10%,transparent)] px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-secondary)]">¿Borrar &quot;{t.texto}&quot;?</span>
                    <div className="flex shrink-0 gap-1">
                      <motion.button
                        type="button"
                        whileTap={TAP}
                        transition={TAP_TRANSICION}
                        onClick={() => setConfirmandoId(null)}
                        className="h-7 rounded-[var(--radius-button)] px-2 text-[12px] font-semibold text-[var(--text-secondary)] [touch-action:manipulation]"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={TAP}
                        transition={TAP_TRANSICION}
                        onClick={() => borrar(t.id)}
                        className="h-7 rounded-[var(--radius-button)] bg-[var(--accent-3)] px-2 text-[12px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
                      >
                        Borrar
                      </motion.button>
                    </div>
                  </li>
                ) : (
                  <li key={t.id} className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      whileTap={TAP}
                      transition={TAP_TRANSICION}
                      onClick={() => alternar(t.id)}
                      aria-pressed={t.hecho}
                      aria-label={t.hecho ? `Marcar "${t.texto}" como pendiente` : `Marcar "${t.texto}" como hecha`}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
                      style={{
                        background: t.hecho ? 'var(--accent-3)' : 'transparent',
                        border: t.hecho ? 'none' : '1.5px solid color-mix(in oklab, var(--text-tertiary) 40%, transparent)',
                      }}
                    >
                      {t.hecho && <Check size={13} strokeWidth={3} color="var(--text-primary)" aria-hidden="true" />}
                    </motion.button>
                    <span
                      className={`min-w-0 flex-1 truncate text-[14px] ${
                        t.hecho ? 'text-[var(--text-tertiary)] line-through' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {t.texto}
                    </span>
                    <motion.button
                      type="button"
                      whileTap={TAP}
                      transition={TAP_TRANSICION}
                      onClick={() => setConfirmandoId(t.id)}
                      aria-label={`Borrar tarea "${t.texto}"`}
                      className="flex size-7 shrink-0 items-center justify-center [touch-action:manipulation]"
                    >
                      <X size={15} strokeWidth={2} color="var(--text-tertiary)" aria-hidden="true" />
                    </motion.button>
                  </li>
                )
              )}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      <form onSubmit={agregar} className="mt-4 flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Nueva tarea para ${DIAS_SEMANA_LARGO[diaIndex]?.toLowerCase() ?? 'hoy'}...`}
          aria-label="Nueva tarea"
          className={ESTILO_INPUT}
        />
        <motion.button
          type="submit"
          whileTap={texto.trim() ? TAP : undefined}
          transition={TAP_TRANSICION}
          disabled={!texto.trim()}
          aria-label="Agregar tarea"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] disabled:opacity-40 [touch-action:manipulation]"
        >
          <Plus size={20} strokeWidth={2.5} color="var(--bg)" aria-hidden="true" />
        </motion.button>
      </form>

      <AnimatePresence>
        {pendienteBorrar && <SnackbarDeshacer texto={`"${pendienteBorrar.texto}" borrada`} onDeshacer={deshacerBorrado} />}
      </AnimatePresence>
    </Tarjeta>
  );
}

function NotasCard({ notas, onGuardar, item }: { notas: string; onGuardar: (notas: string) => void; item: Variants }) {
  const [texto, setTexto] = useState(notas);

  useEffect(() => setTexto(notas), [notas]);

  return (
    <Tarjeta titulo="Notas" icono={NotebookPen} colorVar="var(--text-tertiary)" resumen={notas.trim() ? 'Con nota' : 'Sin nota'} item={item}>
      <textarea
        rows={4}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          if (texto.trim() !== notas) onGuardar(texto.trim());
        }}
        placeholder="Lo que quieras apuntar de esta semana..."
        aria-label="Notas de la semana"
        className="w-full resize-none rounded-[var(--radius-button)] bg-[var(--surface-2)] p-3 text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--accent)]"
      />
    </Tarjeta>
  );
}
