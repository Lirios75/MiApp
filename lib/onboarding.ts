// Datos del quiz de onboarding — compartidos entre app/onboarding y app/paywall.
// Cada opción ecoa un dolor/deseo de FICHA-AVATAR.md (02B).

import {
  AlertCircle,
  Frown,
  RotateCcw,
  Wallet,
  Sun,
  Sunset,
  Moon,
  CalendarDays,
  BookOpen,
  Smartphone,
  FileSpreadsheet,
  Sparkles,
  PiggyBank,
  Landmark,
  HandCoins,
  Search,
  type LucideIcon,
} from 'lucide-react';

export interface OpcionOnboarding {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const OPCIONES_DOLOR: readonly OpcionOnboarding[] = [
  { value: 'gasto_sin_saber', label: 'Gasto y no sé en qué se me fue', icon: Wallet },
  { value: 'ansiedad_cuenta', label: 'Reviso mi cuenta y me da ansiedad', icon: AlertCircle },
  { value: 'presupuesto_abandonado', label: 'Empiezo un presupuesto y lo dejo', icon: RotateCcw },
  { value: 'sin_control', label: 'Siento que no tengo control', icon: Frown },
];

export const OPCIONES_MOMENTO: readonly OpcionOnboarding[] = [
  { value: 'mañana', label: 'En la mañana', icon: Sun },
  { value: 'tarde', label: 'En la tarde', icon: Sunset },
  { value: 'noche', label: 'En la noche', icon: Moon },
  { value: 'fin_de_semana', label: 'El fin de semana', icon: CalendarDays },
];

export const OPCIONES_INTENTO: readonly OpcionOnboarding[] = [
  { value: 'curso_journal', label: 'Sí, con un curso o journal', icon: BookOpen },
  { value: 'otra_app', label: 'Sí, con otra app', icon: Smartphone },
  { value: 'excel', label: 'Sí, a mano o en Excel', icon: FileSpreadsheet },
  { value: 'primera_vez', label: 'No, es la primera vez', icon: Sparkles },
];

export const OPCIONES_META: readonly OpcionOnboarding[] = [
  { value: 'ahorrar', label: 'Ahorrar para algo', icon: PiggyBank },
  { value: 'salir_deuda', label: 'Salir de una deuda', icon: Landmark },
  { value: 'dejar_impulso', label: 'Dejar de gastar por impulso', icon: HandCoins },
  { value: 'entender', label: 'Solo entender en qué se va la plata', icon: Search },
];

function mapaDeLabels(opciones: readonly OpcionOnboarding[]): Record<string, string> {
  return Object.fromEntries(opciones.map((o) => [o.value, o.label]));
}

export const LABEL_DOLOR = mapaDeLabels(OPCIONES_DOLOR);
export const LABEL_MOMENTO = mapaDeLabels(OPCIONES_MOMENTO);
export const LABEL_INTENTO = mapaDeLabels(OPCIONES_INTENTO);
export const LABEL_META = mapaDeLabels(OPCIONES_META);

/** Variante de la meta para insertar después de "para" en el headline del paywall
 * (LABEL_META ya empieza con un verbo — "Ahorrar para algo" duplicaría la palabra
 * "para" si se concatena directo: "para ahorrar para algo"). */
export const LABEL_META_HEADLINE: Record<string, string> = {
  ahorrar: 'ahorrar más',
  salir_deuda: 'salir de tu deuda',
  dejar_impulso: 'dejar de gastar por impulso',
  entender: 'entender en qué se va tu plata',
};

export interface RespuestasOnboarding {
  dolor?: string;
  momento?: string;
  intento?: string;
  meta?: string;
  comprometido?: boolean;
}

const CLAVE_STORAGE = 'respira_onboarding';

export function guardarRespuestas(respuestas: RespuestasOnboarding): void {
  try {
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(respuestas));
  } catch {
    // localStorage no disponible (privado/bloqueado) — /paywall usa sus defaults.
  }
}

export function leerRespuestas(): RespuestasOnboarding {
  try {
    const crudo = window.localStorage.getItem(CLAVE_STORAGE);
    if (!crudo) return {};
    return JSON.parse(crudo) as RespuestasOnboarding;
  } catch {
    return {};
  }
}
