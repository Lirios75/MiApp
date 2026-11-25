// Máquina de estados de la membresía de Hotmart — docs/sistema/18-VENTA-HOTMART.md §4.
// Pura (sin I/O): traduce un evento de Hotmart a un estado, y dice si una transición es legal.

import { TRIAL_DIAS } from './pricing';

export type EstadoMembresia =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'chargeback';

const TERMINAL_NEGATIVO: readonly EstadoMembresia[] = ['refunded', 'chargeback'];

/** ¿Es legal pasar de `desde` a `hacia`? Bloquea el bug clásico: un evento viejo reentregado
 * (ej. un PURCHASE_APPROVED tardío) NO puede reactivar a alguien que ya reembolsó. */
export function transicionValida(desde: EstadoMembresia | null, hacia: EstadoMembresia): boolean {
  if (desde === null) return true; // usuaria nueva
  if (TERMINAL_NEGATIVO.includes(desde) && (hacia === 'active' || hacia === 'trialing')) return false;
  return true;
}

/**
 * Evento de Hotmart + el valor cobrado → estado de membresía.
 * ⚠️ VERIFICAR con el primer webhook real: es plausible que Hotmart mande PURCHASE_APPROVED
 * con valor 0 al INICIAR la prueba gratis (no hay un evento propio de "empezó el trial"
 * confirmado en la documentación pública) — por eso trial vs. pago real se distingue por el
 * MONTO cobrado, no solo por el nombre del evento. Si el primer webhook real llega distinto,
 * ajustar aquí (ver docs/sistema/18-VENTA-HOTMART.md, "El evento de inicio de trial es un
 * PLACEHOLDER").
 */
export function estadoParaEvento(evento: string, valorCobrado: number): EstadoMembresia | null {
  switch (evento) {
    case 'PURCHASE_APPROVED':
    case 'PURCHASE_COMPLETE':
      return valorCobrado > 0 ? 'active' : 'trialing';
    case 'PURCHASE_DELAYED':
      return 'past_due';
    case 'SUBSCRIPTION_CANCELLATION':
      return 'cancelled';
    case 'PURCHASE_EXPIRED':
      return 'expired';
    case 'PURCHASE_REFUNDED':
      return 'refunded';
    case 'PURCHASE_CHARGEBACK':
    case 'PURCHASE_PROTEST':
      return 'chargeback';
    default:
      return null; // evento que no mapeamos (ej. SWITCH_PLAN) — se ignora, 200, sin tocar nada
  }
}

/** ¿Tiene acceso completo HOY? 'active' siempre; 'trialing' hasta `trialEndsAt` (el trial de
 * Hotmart SÍ vence — bug corregido: antes esta función nunca se llamaba desde ningún lado y
 * trataba 'trialing' como acceso eterno); 'cancelled' hasta `accessUntil` (lo que ya pagó);
 * 'past_due' hasta `graceEndsAt` (días de gracia del dunning). */
export function tieneAccesoCompleto(
  estado: EstadoMembresia,
  ahora: Date,
  opciones: { trialEndsAt?: Date | null; accessUntil?: Date | null; graceEndsAt?: Date | null } = {}
): boolean {
  if (estado === 'active') return true;
  if (estado === 'trialing') return !opciones.trialEndsAt || ahora < opciones.trialEndsAt;
  if (estado === 'cancelled') return !!opciones.accessUntil && ahora < opciones.accessUntil;
  if (estado === 'past_due') return !!opciones.graceEndsAt && ahora < opciones.graceEndsAt;
  return false;
}

/** Perfil mínimo (tal como se lee de la tabla `perfiles`) necesario para decidir acceso. */
export interface PerfilParaAcceso {
  status: EstadoMembresia | null;
  trialEndsAt: string | null;
  accessUntil: string | null;
  graceEndsAt: string | null;
  /** Fecha del PRIMER ingreso a la app interna — la pone obtenerEstadoApp() sola, sin Hotmart.
   * Es la única prueba gratis válida para quien nunca pasó por un evento de Hotmart. */
  fechaInicioTrial: string | null;
}

/** La función que SÍ se usa en vivo (app/app/layout.tsx) para decidir si alguien entra a la
 * app interna o se le manda al paywall. Antes del fix de 2026-11-25 NADA llamaba a
 * tieneAccesoCompleto: cualquiera con sesión de Supabase (ej. entrando directo a /entrar sin
 * jamás tocar Hotmart) tenía acceso completo gratis para siempre — hueco real de seguridad,
 * no solo un bug de UI. */
export function tieneAccesoAhora(perfil: PerfilParaAcceso, ahora: Date): boolean {
  if (perfil.status) {
    return tieneAccesoCompleto(perfil.status, ahora, {
      trialEndsAt: perfil.trialEndsAt ? new Date(perfil.trialEndsAt) : null,
      accessUntil: perfil.accessUntil ? new Date(perfil.accessUntil) : null,
      graceEndsAt: perfil.graceEndsAt ? new Date(perfil.graceEndsAt) : null,
    });
  }
  // Nunca llegó un evento de Hotmart para esta cuenta (ni siquiera el de "empezó el trial") —
  // sin fila de perfil todavía es la usuaria MÁS nueva posible (su primerísimo request, antes
  // de que el cliente cree la fila): se deja pasar, igual que `transicionValida(null, ...)`.
  if (!perfil.fechaInicioTrial) return true;
  const diasTranscurridos = Math.floor((ahora.getTime() - new Date(perfil.fechaInicioTrial).getTime()) / 86_400_000);
  return diasTranscurridos < TRIAL_DIAS;
}
