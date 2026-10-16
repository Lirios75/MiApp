// Precios de Respira — DEBE coincidir con los props de <Oferta> en app/page.tsx
// (la landing, ya aprobada). Si el precio cambia, se actualiza AQUÍ y en app/page.tsx.

export const TRIAL_DIAS = 7;
export const GARANTIA_DIAS = 15; // Hotmart no ofrece 14 — opciones reales: 7/15/21/30 (Sesión 6)

export const PLAN_ANUAL = {
  nombre: 'Anual',
  precioMes: '$4.16',
  totalAnual: 'Se cobra $49.99/año',
  montoCobro: '$49.99',
  ahorro: 'Ahorras ~40% vs. mensual',
  badge: '5 MESES GRATIS',
};

export const PLAN_MENSUAL = {
  nombre: 'Mensual',
  precioMes: '$6.99',
  montoCobro: '$6.99',
};
