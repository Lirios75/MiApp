// Píxel de Meta (Facebook/Instagram Ads) — conectado el 2026-11-04 para medir el camino
// completo (landing → onboarding → paywall) antes de la primera campaña paga, siguiendo el
// gate de docs/sistema/34-ADQUISICION-Y-TRAFICO.md ("SIN PÍXEL VERIFICADO, NO SE LANZA PAID").
// El ID del píxel NO es secreto (va embebido en el HTML de cualquier página que lo use) — por
// eso va como constante normal, igual que HOTMART_PRODUCT_ID en lib/hotmart.ts.

export const META_PIXEL_ID = '1079795125061777';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function pixelPageview() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function pixelTrack(evento: string, parametros?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', evento, parametros);
  }
}
