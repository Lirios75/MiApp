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
import { AnilloProgreso, ConteoAnimado, ErrorCarga, formatearRangoSemana, inicialDia } from '@/components/app/ui';

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
  const porcentajeSemana = totalPosible > 0 ? Math.round(((hechosHabitos + hechasTareas) / totalPosible) * 100) : 0;

  function avisarErrorGuardado() {
    setErrorGuardado(true);
  }

  function guardarObjetivos(objetivos: string[]) {
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
          <AnilloProgreso porcentaje={porcentajeSemana} tamano={52} grosor={5}>
            <span className="text-[13px] font-bold [font-variant-numeric:tabular-nums] [font-family:var(--font-display)]">
              <ConteoAnimado valor={porcentajeSemana} sufijo="%" />
            </span>
          </AnilloProgreso>
        </div>
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

      <AnimatePresence>
        {errorGuardado && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-3)_12%,transparent)] px-3 py-2.5"
          >
            <WifiOff size={15} strokeWidth={2} color="var(--accent-3)" aria-hidden="true" />
            <span className="text-[13px] text-[var(--text-secondary)]">No se pudo guardar. Revisa tu conexión e intenta de nuevo.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ObjetivosCard
        titulo="Tus 3 objetivos de la semana"
        icono={Flag}
        colorVar="var(--accent)"
        placeholder={(i) => `Objetivo ${i + 1}`}
        valores={plan.objetivos}
        max={MAX_OBJETIVOS_SEMANA}
        onGuardar={guardarObjetivos}
        item={item}
      />

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
          <span className="truncate text-[13px] font-semibold text-[var(--text-secondary)]">{titulo}</span>
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
    onCambiar(habitos.filter((h) => h.id !== id));
    setConfirmandoId(null);
  }

  return (
    <Tarjeta
      titulo="Tus hábitos"
      icono={Repeat}
      colorVar="var(--accent-2)"
      resumen={habitos.length === 0 ? 'Ninguno' : `${habitos.length} hábito${habitos.length === 1 ? '' : 's'}`}
      item={item}
    >
      {habitos.length === 0 ? (
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
          {habitos.map((h) =>
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
                    className="h-7 rounded-[var(--radius-button)] bg-[var(--accent-3)] px-2 text-[12px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
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
  const listaDia = tareas[diaIndex] ?? [];
  const pendientes = tareas.flat().filter((t) => !t.hecho).length;

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
    onCambiar(tareas.map((lista, i) => (i === diaIndex ? lista.filter((t) => t.id !== id) : lista)));
    setConfirmandoId(null);
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
                    className="h-7 rounded-[var(--radius-button)] bg-[var(--accent-3)] px-2 text-[12px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
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
                    background: t.hecho ? 'var(--accent-2)' : 'transparent',
                    border: t.hecho ? 'none' : '1.5px solid color-mix(in oklab, var(--text-tertiary) 40%, transparent)',
                  }}
                >
                  {t.hecho && <Check size={13} strokeWidth={3} color="var(--bg)" aria-hidden="true" />}
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
