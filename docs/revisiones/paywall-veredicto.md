# VEREDICTO revisor-visual — paywall (8ª ronda)
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png (+ docs/revisiones/paywall-cargando-375.png)
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Desglose usabilidad /40
h1 Visibilidad del estado: 3 — spinner en CTA (`cargando`), anillo+checklist con aria-live en LoadingPlan, feedback de selección de plan inmediato. Falta pulir la combinación disabled+opacity-40 durante "Un momento…" (se ve algo apagado a la vez que gira el spinner).
h2 Lenguaje del usuario: 4 — cero jerga, copy natural en todo el flujo.
h3 Control y libertad: 2 — el cierre (X) en la fase "cargando" navega directo sin confirmar (page.tsx L113), pero el mismo ícono en la fase "listo" sí confirma con un modal que además AFIRMA una pérdida de datos que no ocurre (las respuestas se persisten en localStorage — lib/onboarding.ts L87-93). Comportamiento inconsistente y mensaje inexacto.
h4 Consistencia: 2 — la fase "cargando" no comparte el fondo con textura (`FunnelFondo`) que sí tiene el resto del funnel/paywall; salto visual brusco de plano a texturado al terminar de cargar. Sumado al punto anterior (mismo ícono X, dos comportamientos).
h5 Prevención de errores: 4 — guard contra doble-tap (`if (avanzando) return`), selección de plan sin posibilidad de error, timeout con recuperación.
h6 Reconocer vs recordar: 4 — precios, fechas reales y oferta siempre visibles, cero memoria requerida.
h7 Flexibilidad: 3 — buen default (plan anual preseleccionado), navegación por teclado nativa en los botones; sin atajos adicionales para el usuario avanzado (esperable en este tipo de pantalla).
h8 Estético y minimalista: 3 — una sola acción primaria, secundaria de bajo peso ("Ahora no"); la dispersión de tamaños tipográficos (ver craft eje 1) y el fondo plano de "cargando" restan algo de pulido.
h9 Errores con solución: 4 — mensaje de error de avance claro (qué pasó + qué hacer), sin jerga técnica.
h10 Ayuda contextual: 4 — el loading personaliza con las respuestas reales del usuario, trust row explica seguridad/garantía.

## Desglose craft /20
Jerarquía: 3 — se lee bien en el squint test, pero la pantalla usa 7 tamaños de texto (28/20/15/14/13/12/11px) que no coinciden con los 4 valores declarados en FICHA-ARTE.md (34/19/15/12).
Profundidad: 2 — la fase "listo" tiene 3 niveles correctos (bg/surface/surface-2 + mesh + anillo), pero la fase "cargando" (primera pantalla que ve el usuario en esta ruta) es un fill plano total, sin ningún tratamiento — coincide con el ancla "0 = fondo de un fill plano" del eje.
Identidad ownable: 3 — anillo de respiración consistente (logo, fondo, progreso de carga), paleta/tipografía fiel a FICHA-ARTE, sin coincidir con las paletas vetadas del test anti-clon. Sólido pero no extraordinario.
Movimiento: 3 — stagger de entrada, dibujado de anillo, tap feedback, modal con AnimatePresence y reduced-motion respetados; falta transición entre la fase "cargando" y "listo" (corte duro, sin fade) — una de las 7 baseline queda incompleta en el momento más importante de la pantalla.
Encaje óptico: 3 — radios y paddings consistentes, badge y chips bien encajados; el mensaje de error dentro de la barra fija puede crecer más de lo que reserva el `pb-32` del contenido y tapar el bloque de confianza.

## Desglose copy /20 (FICHA-AVATAR.md — nota: ficha marcada BORRADOR, no aprobada por el usuario)
Idea única: 4 — "Semáforo del Gasto" nombrado y sostenido en hero + bullets.
Especificidad y prueba: 3 — claims concretos y sin adjetivos vacíos, pero sin número verificable ni prueba social en esta pantalla.
Emoción/dolor real: 4 — el subtítulo cita casi textual el dolor #1 de la ficha ("gasto y no sé en qué se me fue").
Claridad de oferta: 4 — plan, precio, fechas de cobro y garantía (nombrada, con plazo, cerca del CTA) explícitos.
Dirección a una acción: 4 — un solo tipo de CTA, primera persona ("mis 7 días gratis"), sin competencia visual.
Sub-checks: garantía nombrada con plazo cerca del CTA de compra — CUMPLE (coincide textualmente con la landing: "Garantía de los Primeros 14 Días Sin Culpa").

## Verificación de los 5 fixes reportados de la ronda 7
1. CTA fijo `fixed inset-x-0 bottom-0` con `pb-32` en el contenido — CONFIRMADO, ya no depende de scroll. Contraste del CTA (#5468d4 sobre #faf6ef) ≈4.6:1, área táctil 52px de alto x ancho completo — pasa las 4 anclas del CTA héroe vivo.
2. Nombre de garantía igualado a la landing ("Garantía de los Primeros 14 Días Sin Culpa") — CONFIRMADO, coincide letra por letra con app/page.tsx L139.
3. `cargando` en FunnelButton con anillo girando + `prefers-reduced-motion` — CONFIRMADO (components/funnel/ui.tsx L102-109).
4. `onClose` en LoadingPlan con X visible — CONFIRMADO que existe, pero es INCONSISTENTE con el cierre de la pantalla "listo" (ver h3/h4 arriba) y el mensaje de confirmación de la otra pantalla es inexacto.
5. Línea redundante bajo el CTA eliminada — CONFIRMADO, solo quedan las 2 menciones del timeline (Día 5 / Día 7).

## Top defectos
1. [Pantalla "cargando", fondo completo] Fill plano sin ningún tratamiento de profundidad mientras el resto del funnel usa `FunnelFondo` (mesh+anillo) → app/paywall/page.tsx L110-116 no invoca `<FunnelFondo />`, components/funnel/LoadingPlan.tsx no la importa. Fix: envolver LoadingPlan con el mismo `<FunnelFondo />` compartido.
2. [Botón X — fase "cargando" vs. fase "listo"] Comportamiento inconsistente: LoadingPlan.onClose navega directo sin confirmar (page.tsx L113: `onClose={() => router.push('/')}`) mientras el X de la fase "listo" dispara un modal de confirmación (L126-138) que además AFIRMA pérdida de datos que no ocurre (las respuestas se guardan en localStorage — lib/onboarding.ts L87-93). Fix: usar el mismo `salirConfirmando` en ambas fases y corregir el texto del modal (ConfirmSalir en components/funnel/ui.tsx L300-303) para no prometer una pérdida que no sucede.
3. [Barra de error bajo el CTA fijo] El mensaje de `errorAvance` (2 líneas) se inserta dentro de la barra `fixed` (page.tsx L280-284) sin que el `pb-32` del contenido (L125) reserve espacio extra para ese caso — puede tapar el bloque de confianza/garantía. Fix: aumentar el padding inferior condicionalmente cuando `errorAvance` es true.
4. [Escala tipográfica de toda la pantalla] 7 tamaños de texto en uso (28/20/15/14/13/12/11px) que no coinciden con los 4 declarados en FICHA-ARTE.md ("display 34 / title 19 / body 15 / label 12") → page.tsx L142 (h1 28px), L192/L214 (precio 20px), L187 (badge 11px). Fix: alinear el h1 a 34px o documentar formalmente una escala de funnel distinta a la de display; consolidar los tamaños secundarios a 2-3 valores.
5. [Transición de fase cargando→listo] Corte duro sin fade/slide entre los dos `return` de Paywall (page.tsx L110-116 vs. L118+) — rompe la baseline de "transición suave entre pantallas" justo cuando aparece la oferta. Fix: envolver ambos estados en `AnimatePresence` con una transición de 200-300ms.
