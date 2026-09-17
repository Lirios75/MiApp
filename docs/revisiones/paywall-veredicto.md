# VEREDICTO revisor-visual — Paywall (Respira)
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Desglose usabilidad /40
1. Visibilidad del estado del sistema: 3/4 — el CTA cambia a "Un momento…" + disabled al tocar, con salvaguarda de 7s (app/paywall/page.tsx L65-72). Falta un ícono/spinner visible, solo cambia el texto.
2. Lenguaje del usuario: 4/4 — cero jerga, copy 100% en el mundo de Camila ("gasto y no sé en qué se me fue", "sin conectar tu banco").
3. Control y libertad (código): 3/4 — `ConfirmSalir` (components/funnel/ui.tsx L227-269) reemplaza el `window.confirm` nativo y solo aparece si `hayRespuestas`; X y "Ahora no" comparten la misma salida. Resta puntos que la selección de plan se pierda silenciosamente al avanzar (ver defecto 4).
4. Consistencia: 3/4 — reutiliza FunnelButton/CheckCustom/RespiraMark, pero el botón "X" tiene `whileTap` en paywall (page.tsx L131-139) y NO lo tiene en `FunnelHeader` (ui.tsx L53-62) para el mismo ícono/función en onboarding.
5. Prevención de errores: 4/4 — plan "Anual" pre-seleccionado por defecto (no exige elección), doble-tap bloqueado con `avanzando`.
6. Reconocer vs recordar: 4/4 — fechas reales calculadas (`formatearFecha`, "22 sept", "24 sept"), no fechas relativas vagas; todo el contexto del quiz (dolor, meta, nº respuestas) visible sin que el usuario tenga que recordarlo.
7. Flexibilidad y eficiencia (código): 3/4 — default inteligente (plan anual preseleccionado); sin atajos de teclado, pero es una pantalla mobile de un solo flujo, no aplica mucho más.
8. Estético y minimalista: 3/4 — 1 CTA primario + 2 secundarios (X, "Ahora no"), cada bloque se gana su lugar; usa 7 tamaños de texto distintos en una sola vista (28/20/15/14/13/12/11px) cuando el sistema pide máx. 3.
9. Errores claros con solución: 2/4 — el ÚNICO manejo de error de la pantalla (`setTimeout` de 7s en `empezarPrueba`, page.tsx L69-71) revierte el botón en silencio, sin ningún mensaje "qué pasó + qué hacer". Esto es la misma brecha marcada NO CERRADA de la ronda 4 ("falta de patrón de error/reintento visible"): se agregó una salvaguarda técnica, no un patrón de error visible.
10. Ayuda contextual: 4/4 — timeline con fechas reales + explicación de cada hito, microcopy bajo el CTA anticipa la objeción de cobro sorpresa, trust row (pago seguro + garantía).

## Desglose craft /20
- Jerarquía: 3/4 — 4 niveles legibles (héroe 28px → precio 20px → cuerpo 15px → labels 12-13px), pero hay demasiadas variantes de tamaño compitiendo (7 valores distintos de font-size en una sola pantalla).
- Profundidad: 3/4 — 3 niveles de superficie correctos y verificados en tokens.css (`--bg` #faf6ef / `--surface` #fffdf8 / `--surface-2` #f1eadc), fondo decorativo con `isolate`+`fixed` ya visible en el screenshot (fix real, confirmado). El mesh de fondo sigue siendo muy sutil (casi imperceptible salvo el círculo inferior derecho).
- Identidad ownable: 2/4 — el anillo de respiración (dispositivo ownable) está presente (SVG circular decorativo), y los checks son custom (sin emoji). Pero el componente `<Hairline>` del propio kit (components/landing/ui.tsx L48-75), pensado explícitamente para "plan recomendado", NO se usa en ningún lado del paywall: las 3 cards (value-stack, plan Anual, plan Mensual) usan bordes sólidos planos. Esto incumple el ancla binaria de conversión "≥1 hairline degradé" y penaliza este eje.
- Movimiento (código + screenshot): 3/4 — stagger de entrada por bloque (`Bloque`, page.tsx L23-46), whileTap en todos los botones, modal con fade+scale, reduced-motion respetado en los 4 componentes revisados (Bloque, ConfirmSalir, LoadingPlan, HoldButton). Sin conteo animado de número héroe ni anillo/barra dibujándose EN esta pantalla en particular (aplican en LoadingPlan, pero esa pantalla no se pudo verificar visualmente — ver defecto 1).
- Encaje óptico: 3/4 — radios consistentes (22px cards / 16px botones, verificado en tokens.css), badge y precios bien alineados, sin desencajes visibles a simple vista en el screenshot.

## Desglose copy /20 (trazado a FICHA-AVATAR.md)
- Idea única dominante: 4/4 — "Semáforo del Gasto" como mecanismo bautizado, presente en hero + value stack + CTA implícito, consistente en todo el copy.
- Especificidad y prueba: 3/4 — precios y ahorro con números verificables ($4.16/mes, $49.99/año, ~40%, verificado contra lib/pricing.ts), cero claims de ingresos/salud. Los 3 beneficios del value stack son afirmaciones de producto sin prueba/demo adicional.
- Emoción/dolor real: 4/4 — cita casi literal el dolor ★ de la ficha ("Para que no vuelvas a decir «gasto y no sé en qué se me fue»" ← dolor #1 "Otra vez gasté sin darme cuenta y ahora no sé en qué se me fue la plata"), y el check "sin conectar tu banco" responde directo a la objeción #2 de la ficha.
- Claridad de oferta: 4/4 — stack explícito, precio anclado (mensual vs. anual con % de ahorro), trial de 7 días con timeline de fechas reales, garantía nombrada con plazo ("Garantía de 14 días") cerca del CTA.
- Dirección a una acción: 4/4 — un solo tipo de acción primaria ("Empezar mis 7 días gratis"), "Ahora no" y "X" son la única salida, sin CTAs que compitan.
- Sub-check garantía nombrada: PASA (nombre + plazo, visible junto al CTA).
- Sub-check message-match: no verificable (no hay dato del creativo de origen).

## Top defectos
1. [proceso/evidencia] El screenshot `docs/revisiones/paywall-cargando-375.png` entregado para esta ronda NO es la pantalla de loading del paywall (`components/funnel/LoadingPlan.tsx`, "Armando tu Semáforo del Gasto…" con anillo %) — es la pantalla de compromiso del ONBOARDING ("¡Listo, quedó registrado!", `app/onboarding/page.tsx` línea ~220). La pantalla de labor illusion del paywall NUNCA fue verificada visualmente en esta ronda → volver a capturar el screenshot correcto desde `/paywall` justo tras terminar el quiz antes de dar por buena esa fase.
2. [CTA "Empezar mis X días gratis", `app/paywall/page.tsx` L65-72] El manejo de error del CTA es un `setTimeout` mudo de 7s que revierte el botón sin ningún mensaje ("qué pasó + qué hacer") — la brecha de la ronda 4 ("falta de patrón de error/reintento visible") sigue sin un patrón de error real → agregar un mensaje inline visible (ej. "No pudimos continuar, intenta de nuevo") cuando el timeout se dispara.
3. [Cards de plan y value-stack, `app/paywall/page.tsx` L161-219] Ninguna card usa el componente `<Hairline>` (borde degradé) que el propio kit define para "plan recomendado" (`components/landing/ui.tsx` L48-75) — todas usan bordes sólidos planos, incumpliendo el gate binario de conversión "≥1 hairline degradé" → envolver la card del plan Anual con `<Hairline emphasis>`.
4. [`empezarPrueba()`, `app/paywall/page.tsx` L65-72] El plan seleccionado (`anual`/`mensual`) nunca se persiste ni se pasa a `/entrar` — el usuario elige "Mensual" y esa elección desaparece antes del login/checkout → guardar `plan` en localStorage (mismo patrón que `guardarRespuestas`) o pasarlo por query param.
5. [Botón "X" de cerrar — `app/paywall/page.tsx` L131-139 vs. `components/funnel/ui.tsx` L53-62] Mismo ícono/función con comportamiento de tap distinto entre pantallas (con `whileTap` en paywall, sin él en `FunnelHeader` de onboarding) → unificar el componente.
