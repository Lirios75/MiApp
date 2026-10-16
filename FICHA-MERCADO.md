# FICHA DE MERCADO — Respira

## Alcance de esta ficha
- Nicho/categoría exacta: apps de bienestar financiero + hábito diario para mujeres 25-35 con ansiedad por gasto (no "finanzas personales" genérico)
- País(es) donde se va a vender: Colombia, México · Moneda de cobro: USD (Hotmart cobra en USD/tarjeta internacional por defecto salvo configuración local)
- Fecha de investigación: 2026-09-17 · Vence el: 2027-03-17
- Pasarela/plataforma de venta elegida: Hotmart (default del SO)

## 1. PRECIO — contra qué se compara el tuyo
- Mediana de precio de la categoría: NO ENCONTRADO con fuente propia y fecha — el usuario reporta de su propia investigación: journals digitales $8.99 (pago único), apps de finanzas $5.99-13/mes, sin cita de fuente ni fecha verificable.
- Rango que cobran los 3-5 líderes del nicho (16 PASO 0.2bis): pendiente de investigación en Sesión 2 (YNAB, Fintonic, Mobills mencionados por el usuario sin precio exacto citado).
- **Precio elegido para esta app:** $6.99/mes mensual · $49.99/año (dato del usuario) — **Desvío respecto a la mediana:** no calculable todavía sin mediana verificada con fuente.
- Si el desvío supera ±30%: pendiente de verificar cuando se confirme la mediana real.

## 2. CICLO DE DECISIÓN
- NO ENCONTRADO — pendiente de verificar con datos propios una vez haya tráfico. Se asume ciclo corto (impulsivo, ligado a un momento de ansiedad reciente) por la naturaleza emocional del disparador, a confirmar.

## 3. CÓMO PAGA ESTE MERCADO
- Medios de pago del checkout de Hotmart: se verifica en Sesión 6 (protocolo de checkout real, `18`) — pendiente, no se supone.
- Penetración de tarjeta de crédito: NO ENCONTRADO — pendiente.
- PIX/boleto: no aplica directamente (mercado objetivo es Colombia/México, no Brasil).

## 4. PRUEBA Y GARANTÍA
- Plazos que admite Hotmart: VERIFICADO en Sesión 6, panel real del producto "Respira" — el
  desplegable de "Plazo para solicitar el reembolso" solo ofrece 7 / 15 / 21 / 30 días (NO 14
  exactos, a diferencia de lo asumido antes de conectar Hotmart de verdad).
- Prueba elegida: 7 · Garantía elegida: **15** (se sube de 14 a 15 porque Hotmart no ofrece 14 —
  15 es la opción más cercana que sigue cumpliendo garantía > prueba; días de suscripción PAGADA,
  contados desde el primer cobro, no se solapan con los 7 de prueba gratis).
- Comprobación garantía > prueba: 15 > 7 → SÍ.
- Historial de esta decisión: el 2026-09-17 el usuario pidió bajar la garantía a 7 (igualándola
  con la prueba); tras ver la advertencia de cobertura cero, la mantuvo en 14. El 2026-10-16, al
  configurar el producto real en Hotmart, se descubrió que 14 no es una opción del panel — se
  subió a 15 (la más cercana por arriba) y se actualizó el código (`lib/pricing.ts`
  `GARANTIA_DIAS`, `app/page.tsx`, `app/reembolsos/page.tsx`) y el copy (`docs/copy/landing.md`,
  `docs/copy/onboarding-paywall.md`) para que todo diga 15 de forma consistente.

## 5. CONVERSIÓN ESPERABLE
- NO ENCONTRADO — se define umbral de muestra en Sesión 8 (Analítica) con datos propios.

## 6. ESTACIONALIDAD Y CONTEXTO
- Estacionalidad: NO ENCONTRADO — hipótesis a validar: enero (propósitos) y quincena (justo después de gastar el sueldo).
- Regulación: app no toca datos bancarios ni cuentas reales — reduce el alcance regulatorio de datos financieros sensibles; sí aplica protección de datos personales estándar (`47`).
