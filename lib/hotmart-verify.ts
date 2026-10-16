// Verifica que un webhook venga de verdad de Hotmart — docs/sistema/18-VENTA-HOTMART.md.
// Camino principal (y único, salvo que tu cuenta documente una firma propia): comparar el
// hottok recibido contra HOTMART_HOTTOK en TIEMPO CONSTANTE, sobre HTTPS.

import crypto from 'node:crypto';

/** Comparación en tiempo constante (anti timing-attack): `!==` normal corta en el primer
 * byte distinto y el tiempo de respuesta filtra cuántos bytes acertó un atacante. */
function compararEnTiempoConstante(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Verifica el hottok en tiempo constante. El chequeo de la variable de entorno vive DENTRO
 * de la función (no al importar el módulo) para que un build sin el secreto a mano no tumbe
 * el deploy entero — el fail-secure real pasa en cada request: sin HOTMART_HOTTOK, el webhook
 * rechaza TODO, nunca acepta con un valor por defecto.
 */
export function verifyHotmart(opts: { hottok?: string }): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK) {
    throw new Error('FALTA HOTMART_HOTTOK — el webhook no puede operar de forma segura');
  }
  if (!opts.hottok) return false;
  return compararEnTiempoConstante(opts.hottok, HOTTOK);
}

/** Ventana anti-replay: una petición capturada y reenviada más tarde se rechaza aunque el
 * hottok sea válido. Defensa en profundidad — el dedupe por event_id ya frena el reproceso. */
const VENTANA_REPLAY_MS = 5 * 60 * 1000;

export function esReciente(marcaDeTiempoMs?: number): boolean {
  if (!marcaDeTiempoMs) return true; // sin fecha fiable en el payload, no bloquear por esto
  const antiguedad = Date.now() - marcaDeTiempoMs;
  return antiguedad >= 0 && antiguedad <= VENTANA_REPLAY_MS;
}
