// Datos y lógica de la app interna (Sesión 5) — Semáforo diario, racha y meta.
// Persistencia local (sin backend todavía — Sesión 6 conecta Supabase, ver ESTADO.md).

import { leerRespuestas, LABEL_META } from '@/lib/onboarding';

export type EstadoSemaforo = 'tranquilo' | 'alerta';

export interface CheckIn {
  fecha: string; // YYYY-MM-DD en hora local
  estado: EstadoSemaforo;
}

export type ModoMeta = 'monto' | 'habito';

export interface Meta {
  tipo: string; // value de OPCIONES_META
  nombre: string; // label a mostrar
  modo: ModoMeta;
  objetivo: number; // monto objetivo (modo monto) o días objetivo (modo habito)
  actual: number; // monto actual (modo monto) o días actuales (modo habito)
}

export interface EstadoApp {
  checkins: CheckIn[];
  meta: Meta | null;
  fechaInicioTrial: string | null;
}

const CLAVE = 'respira_app';
const ESTADO_VACIO: EstadoApp = { checkins: [], meta: null, fechaInicioTrial: null };

function isoDeFecha(d: Date): string {
  const offsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function hoyISO(): string {
  return isoDeFecha(new Date());
}

export function leerEstadoApp(): EstadoApp {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return ESTADO_VACIO;
    return { ...ESTADO_VACIO, ...(JSON.parse(crudo) as Partial<EstadoApp>) };
  } catch {
    return ESTADO_VACIO;
  }
}

function guardarEstadoApp(estado: EstadoApp): EstadoApp {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // localStorage no disponible (privado/bloqueado) — la sesión sigue en memoria.
  }
  return estado;
}

/** Se llama una vez al entrar a la app interna: marca el inicio de la prueba
 * gratis (para Cuenta) si es la primera vez, sin tocar nada más. */
export function asegurarInicioTrial(): EstadoApp {
  const actual = leerEstadoApp();
  if (actual.fechaInicioTrial) return actual;
  return guardarEstadoApp({ ...actual, fechaInicioTrial: hoyISO() });
}

export function checkInDeHoy(estado: EstadoApp): CheckIn | undefined {
  const hoy = hoyISO();
  return estado.checkins.find((c) => c.fecha === hoy);
}

export function registrarCheckIn(estadoSemaforo: EstadoSemaforo): EstadoApp {
  const actual = leerEstadoApp();
  const hoy = hoyISO();
  const sinHoy = actual.checkins.filter((c) => c.fecha !== hoy);
  return guardarEstadoApp({ ...actual, checkins: [...sinHoy, { fecha: hoy, estado: estadoSemaforo }] });
}

/** Días consecutivos con check-in, terminando hoy (o ayer si hoy aún no se marcó
 * — así la racha no se ve "rota" antes de medianoche). */
export function calcularRacha(checkins: readonly CheckIn[]): number {
  const fechas = new Set(checkins.map((c) => c.fecha));
  const cursor = new Date();
  if (!fechas.has(hoyISO())) cursor.setDate(cursor.getDate() - 1);
  let racha = 0;
  while (fechas.has(isoDeFecha(cursor))) {
    racha++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return racha;
}

/** Fechas ISO (lunes a domingo) de la semana actual + un desplazamiento en semanas. */
export function diasDeLaSemana(offsetSemanas = 0): string[] {
  const hoy = new Date();
  const diaSemanaLunes0 = (hoy.getDay() + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - diaSemanaLunes0 + offsetSemanas * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return isoDeFecha(d);
  });
}

export interface ResumenSemana {
  inicioISO: string;
  tranquilos: number;
  alertas: number;
  marcados: number;
}

/** Resumen de las últimas N semanas (incluye la actual), para el bloque de
 * tendencia de /app/semana — evita que la pantalla se quede corta con solo
 * la semana visible en el navegador de fechas. */
export function resumenUltimasSemanas(checkins: readonly CheckIn[], n = 4): ResumenSemana[] {
  const resumenes: ResumenSemana[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const fechas = new Set(diasDeLaSemana(-i));
    const enSemana = checkins.filter((c) => fechas.has(c.fecha));
    const primero = diasDeLaSemana(-i)[0] ?? hoyISO();
    resumenes.push({
      inicioISO: primero,
      tranquilos: enSemana.filter((c) => c.estado === 'tranquilo').length,
      alertas: enSemana.filter((c) => c.estado === 'alerta').length,
      marcados: enSemana.length,
    });
  }
  return resumenes;
}

const MODO_POR_TIPO: Record<string, ModoMeta> = {
  ahorrar: 'monto',
  salir_deuda: 'monto',
  dejar_impulso: 'habito',
  entender: 'habito',
};

const OBJETIVO_HABITO_DIAS = 30;

/** Arma una meta nueva a partir del tipo elegido en el onboarding (o 'ahorrar'
 * por defecto si no respondió). El monto lo confirma el usuario en /app/meta;
 * el modo hábito no pide monto — se mide en días de racha. */
export function metaInicialDesdeOnboarding(): Pick<Meta, 'tipo' | 'nombre' | 'modo'> {
  const { meta: tipo } = leerRespuestas();
  const tipoFinal = tipo && tipo in LABEL_META ? tipo : 'ahorrar';
  return {
    tipo: tipoFinal,
    nombre: LABEL_META[tipoFinal] ?? LABEL_META.ahorrar,
    modo: MODO_POR_TIPO[tipoFinal] ?? 'monto',
  };
}

export function crearMetaMonto(tipo: string, nombre: string, objetivo: number, actual: number): EstadoApp {
  const estadoActual = leerEstadoApp();
  const meta: Meta = { tipo, nombre, modo: 'monto', objetivo: Math.max(1, objetivo), actual: Math.max(0, actual) };
  return guardarEstadoApp({ ...estadoActual, meta });
}

export function crearMetaHabito(tipo: string, nombre: string): EstadoApp {
  const estadoActual = leerEstadoApp();
  const racha = calcularRacha(estadoActual.checkins);
  const meta: Meta = { tipo, nombre, modo: 'habito', objetivo: OBJETIVO_HABITO_DIAS, actual: racha };
  return guardarEstadoApp({ ...estadoActual, meta });
}

export function registrarAvanceMeta(delta: number): EstadoApp {
  const actual = leerEstadoApp();
  if (!actual.meta) return actual;
  const metaActualizada: Meta = { ...actual.meta, actual: Math.max(0, actual.meta.actual + delta) };
  return guardarEstadoApp({ ...actual, meta: metaActualizada });
}

/** El modo hábito no se "registra a mano": se sincroniza con la racha real
 * cada vez que se lee la meta, para que nunca quede desactualizada. */
export function metaSincronizada(estado: EstadoApp): Meta | null {
  if (!estado.meta) return null;
  if (estado.meta.modo !== 'habito') return estado.meta;
  return { ...estado.meta, actual: calcularRacha(estado.checkins) };
}

export function borrarMeta(): EstadoApp {
  const actual = leerEstadoApp();
  return guardarEstadoApp({ ...actual, meta: null });
}

export function cerrarSesionLocal(): void {
  try {
    window.localStorage.removeItem(CLAVE);
    window.localStorage.removeItem('respira_plan');
    window.localStorage.removeItem('respira_onboarding');
  } catch {
    // localStorage no disponible — no hay nada que limpiar.
  }
}

/** Reflexiones cortas del día (feature #4 del MVP) — una por día, estable
 * (no cambia si el usuario recarga la pantalla el mismo día). Ecoan los
 * dolores/deseos de FICHA-AVATAR.md, nunca genéricas de finanzas. */
const REFLEXIONES_DEL_DIA: readonly string[] = [
  'Notar el patrón ya es la mitad del trabajo — no hace falta cambiarlo todo hoy.',
  'Un día de alerta no borra tus días tranquilos. Es solo información para mañana.',
  'No necesitas categorizar cada gasto. Con notar cómo te sentiste, ya vas adelante.',
  'La ansiedad de revisar la cuenta baja cuando la revisas seguido, no cuando la evitas.',
  'Tu racha no mide perfección — mide que seguiste mostrándote.',
  'Un gasto por impulso no define tu semana. Lo que haces después, sí.',
  'Entender en qué se va tu plata empieza por notar cómo te sentiste al gastarla.',
  'Ir despacio y seguido gana más que un cambio drástico que no dura.',
  'Hoy no tienes que resolver tu relación con el dinero. Solo marcar cómo vas.',
  'Cada día marcado es un dato menos que se te escapa.',
];

export function reflexionDeHoy(): string {
  const dia = new Date();
  const inicioAno = new Date(dia.getFullYear(), 0, 0);
  const diaDelAno = Math.floor((dia.getTime() - inicioAno.getTime()) / 86_400_000);
  return REFLEXIONES_DEL_DIA[diaDelAno % REFLEXIONES_DEL_DIA.length];
}
