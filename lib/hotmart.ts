// Constantes de la integración con Hotmart — docs/sistema/18-VENTA-HOTMART.md.
// No son secretas (el product id y los links de cobro están pensados para compartirse), por
// eso van como constantes normales y no como variables de entorno.

export const HOTMART_PRODUCT_ID = '8740950'; // producto "RESPIRA" en Hotmart

// Links reales de checkout (Hotmart → menú del producto → "Ver mis Hotlinks"). Mientras estén
// vacíos, el paywall sigue llevando a /entrar (comportamiento honesto que ya tenía, nunca un
// checkout falso) — se completan en cuanto la usuaria los comparta.
export const HOTMART_CHECKOUT_MENSUAL = '';
export const HOTMART_CHECKOUT_ANUAL = '';
