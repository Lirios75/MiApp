# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png (+ docs/revisiones/paywall-cargando-375.png, fase "cargando")
Usabilidad: 31/40
Craft: 19/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Verificación de los 3 defectos de la ronda 10 (línea por línea, código real)

1. X saltaba de lado — RESUELTO. `app/paywall/page.tsx` líneas 141-153: fase "listo" ahora es spacer(size-11) → RespiraMark → botón X, X queda a la derecha. `components/funnel/LoadingPlan.tsx` líneas 47-56: X con `absolute right-4 top-4`, también a la derecha. Confirmado en ambos screenshots: X arriba-derecha en "cargando" y en "listo".

2. 8 tamaños de fuente vs. escala de 4 niveles — PARCIALMENTE RESUELTO. En `page.tsx` los 3 elementos señalados quedaron consolidados: "Hecho con tus N respuestas" → `text-[15px]` (línea 166, nivel body), nombre del plan y "Ahora no" → `text-[13px]` (líneas 206, 228, 268, nivel label), badge "5 MESES GRATIS" → `text-[12px]` (línea 202, piso del nivel label). Las 5 tallas resultantes en la fase "listo" (28/20/15/13/12) sí caben en las bandas de la fórmula de 4 niveles del sistema (display 28-40 / title 17-20 / body 15-16 / label 12-13). PERO el resto del mismo flujo de paywall no se tocó y queda fuera de esas bandas: `LoadingPlan.tsx` línea 74 (`text-[24px]`, el contador %) y línea 79 (`text-[22px]`, el h1 "Armando tu Semáforo…") no encajan en ninguna banda; `components/funnel/ui.tsx` línea 425 (mensaje del modal ConfirmSalir, `text-[14px]`) tampoco encaja. Es el mismo tipo de problema, en archivos distintos a los que tocó el fix.

3. ConfirmSalir sin trap de foco — RESUELTO. `components/funnel/ui.tsx` función `alPresionarTecla` (líneas 386-399): captura `Tab`, hace `preventDefault()` y cicla el foco entre `botonSeguirRef` y `botonSalirRef` (los 2 únicos botones del modal); `Escape` cierra sin perder progreso. Foco inicial en el botón seguro ("Seguir aquí", línea 383). Correcto: con solo 2 elementos focosables, ciclar sin distinguir Shift+Tab es funcionalmente equivalente a un trap real.

## Defectos NUEVOS encontrados en esta ronda (no reportados antes, verificados en código)

- El propio botón X que se acaba de unificar visualmente quedó con **aria-label distinto entre fases**: "Cerrar" en `page.tsx` línea 148 vs "Salir" en `LoadingPlan.tsx` línea 51 — mismo botón, mismo handler (`salirConfirmando`), misma posición, mismo resultado, pero un lector de pantalla anuncia dos acciones distintas para lo mismo.
- Los botones de plan (Anual/Mensual, `page.tsx` líneas 192-234) no tienen `aria-pressed`/`role="radio"`+`aria-checked` — el estado de selección solo existe visualmente (fondo/sombra/borde), no es programático. Un usuario de lector de pantalla no puede saber cuál plan está seleccionado.

## Desglose usabilidad /40
h1 Visibilidad del sistema: 2 — feedback visual excelente (progreso animado, spinner+"Un momento…", guard anti doble-tap, timeout a los 7s con aria-live), pero el estado de selección de plan es invisible para lectores de pantalla (ver defecto nuevo arriba) — falla real de visibilidad de estado para ese segmento de usuarios, no una sutileza.
h2 Lenguaje del usuario: 4 — cero jerga, copy 100% en español natural y personalizado ("Para que no vuelvas a decir «gasto y no sé en qué se me fue»").
h3 Control y libertad: 4 — X en ambas fases, modal ConfirmSalir con mensaje preciso (no miente sobre pérdida de datos), Escape para cancelar, trap de foco verificado en código.
h4 Consistencia y estándares: 3 — X ya unificado en posición, pero aria-label inconsistente del mismo botón (ver arriba) y tamaños de fuente sin consolidar fuera de `page.tsx` (LoadingPlan, ConfirmSalir).
h5 Prevención de errores: 3 — CTA nunca disabled por defecto, guard anti doble-submit, default de plan sensato (Anual preseleccionado).
h6 Reconocer vs. recordar: 3 — toda la info (precios, fechas, plan) visible, nada que recordar de otra pantalla.
h7 Flexibilidad y eficiencia: 3 — sin atajos de teclado propios más allá del tab/Enter nativo; el único "default inteligente" es el plan Anual preseleccionado.
h8 Estético y minimalista: 3 — 1 CTA primario fijo siempre alcanzable, "Ahora no" subordinado, secciones con contenido real (sin relleno); las 2 cards de plan usan técnicas de borde distintas (hairline degradé vs. borde sólido), un detalle que un ojo entrenado nota.
h9 Errores claros con solución: 3 — el único error mostrado (timeout de 7s) explica qué pasó y qué hacer, en lenguaje simple.
h10 Ayuda contextual: 3 — value stack, timeline del trial con fechas reales, garantía nombrada; cero pantalla muda.

## Desglose craft /20
Jerarquía: 3 — el squint-test pasa en cada fase por separado, pero la fórmula numérica de 4 niveles no se respeta de forma uniforme entre "cargando"/modal y "listo" (ver defecto de tamaños).
Profundidad: 4 — FunnelFondo compartido (mesh + anillo), 3 niveles reales (bg/surface/surface-2 en el timeline).
Identidad ownable: 4 — anillo de respiración, paleta crema+azul-lila+Nunito, no coincide con las paletas vetadas del test anti-clon.
Movimiento: 4 — stagger de entrada por bloque, anillo de progreso que se dibuja, tap feedback en todos los botones, aparición suave del modal, reduced-motion cubierto en todos los componentes revisados.
Encaje óptico: 4 — radio de card idéntico en todas las superficies, X ahora alineado consistentemente, badge y precios bien encajados.

## Desglose copy /20 (trazado contra FICHA-AVATAR.md — estado: BORRADOR, no aprobada por el usuario)
Idea única dominante: 4 — "Semáforo del Gasto" nombrado y sostenido en hero, loading y timeline.
Especificidad y prueba: 3 — precios exactos y "~40%" de ahorro, sin adjetivos vacíos; sin prueba externa (testimonio/demo) más allá de la personalización por respuestas.
Emoción/dolor real: 4 — "para que no vuelvas a decir «gasto y no sé en qué se me fue»" traza directo al dolor #1 ★ de FICHA-AVATAR.md.
Claridad de oferta: 4 — stack de valor, timeline de cobro con fechas reales, garantía nombrada con plazo.
Dirección a una acción: 4 — un solo tipo de CTA repetido, "Ahora no" no compite.
Sub-checks: garantía nombrada con plazo cerca del CTA — CUMPLE ("Garantía de los Primeros 14 Días Sin Culpa"). Message-match: N/A (sin creativo de origen dado).

⚠️ Nota de proceso (no puntúa en la rúbrica de esta pantalla): FICHA-AVATAR.md indica explícitamente `Estado: BORRADOR` y `Aprobada por el usuario: NO` — el copy de este paywall se apoya en una ficha que el propio sistema aún no da por cerrada.

## Top defectos (ordenados por impacto)
1. [Botón X — app/paywall/page.tsx:148 vs components/funnel/LoadingPlan.tsx:51] Mismo botón/handler con aria-label distinto ("Cerrar" vs "Salir") entre fases → unificar a un solo texto en ambos archivos.
2. [Selector de plan — app/paywall/page.tsx:192-234] Sin aria-pressed/role="radio"+aria-checked → un lector de pantalla no sabe qué plan está seleccionado → agregar el atributo de estado a ambos botones (o agruparlos en role="radiogroup").
3. [Fase "cargando" — components/funnel/LoadingPlan.tsx:74 y 79] El contador "24%" y el título "22px" no encajan en ninguna banda de la fórmula de 4 niveles que la fase "listo" ya sigue → subir a 28px (display) y 20px (title).
4. [Modal ConfirmSalir — components/funnel/ui.tsx:425] El mensaje a 14px cae entre las bandas body(15-16) y label(12-13) → subir a 15px.
5. [Cards de plan — app/paywall/page.tsx:191-234] Anual usa hairline degradé y Mensual usa borde sólido simple — tratamiento visual distinto entre 2 ítems de la misma lista → unificar la técnica de borde.
