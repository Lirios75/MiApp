// Constantes de la integración con Hotmart — docs/sistema/18-VENTA-HOTMART.md.
// No son secretas (el product id y los links de cobro están pensados para compartirse), por
// eso van como constantes normales y no como variables de entorno.

export const HOTMART_PRODUCT_ID = '8740950'; // producto "RESPIRA" en Hotmart

// Links reales de checkout (Hotmart → menú del producto → "Ver mis Hotlinks" → "Página de Pago"
// de cada plan) — compartidos por la usuaria el 2026-10-16.
export const HOTMART_CHECKOUT_MENSUAL = 'https://pay.hotmart.com/A108052335O?off=aarlhwza';
export const HOTMART_CHECKOUT_ANUAL = 'https://pay.hotmart.com/A108052335O?off=wslidftp';
