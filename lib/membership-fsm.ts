// Máquina de estados de la membresía de Hotmart — docs/sistema/18-VENTA-HOTMART.md §4.
// Pura (sin I/O): traduce un evento de Hotmart a un estado, y dice si una transición es legal.

export type EstadoMembresia =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'chargeback';

const TERMINAL_NEGATIVO: readonly EstadoMembresia[] = ['refunded', 'chargeback'];
const ACCESO_COMPLETO: readonly EstadoMembresia[] = ['trialing', 'active'];

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

/** ¿Tiene acceso completo HOY? 'trialing'/'active' siempre; 'cancelled' hasta `accessUntil`
 * (lo que ya pagó); 'past_due' hasta `graceEndsAt` (días de gracia del dunning). */
export function tieneAccesoCompleto(
  estado: EstadoMembresia,
  ahora: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null
): boolean {
  if (ACCESO_COMPLETO.includes(estado)) return true;
  if (estado === 'cancelled') return !!accessUntil && ahora < accessUntil;
  if (estado === 'past_due') return !!graceEndsAt && ahora < graceEndsAt;
  return false;
}
