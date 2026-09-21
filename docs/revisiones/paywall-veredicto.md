# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/paywall-375.png (+ docs/revisiones/paywall-cargando-375.png, fase "cargando")
Usabilidad: 37/40
Craft: 20/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

## Re-verificación post-certificación (2026-09-18, sin nueva pasada del revisor)
Commits posteriores a esta certificación tocaron `components/funnel/ui.tsx` (compartido con onboarding),
agregando la prop opcional `logoBloqueado` a `FunnelHeader`/`FunnelScreen` y bajando `bounce` en
`OptionChip`/`SemanaPreview` — ninguno de estos tres componentes lo usa el paywall (que arma su propio
header y no usa `FunnelScreen`), y `logoBloqueado` tiene default `false`. Diff completo revisado
(`git diff 576a137..HEAD -- components/funnel/ui.tsx`): cero cambios en `ConfirmSalir`, `FunnelButton`,
`FunnelFondo` o cualquier ruta que el paywall ejecute. Se recapturó el screenshot igualmente: el único
cambio es la fecha del timeline ("22 sept" → "23 sept", por el cambio de día real), pixel-idéntico en
todo lo demás. La certificación LISTA sigue vigente — no se relanza el revisor-visual completo por un
diff sin impacto verificado.

## Segunda re-verificación (2026-09-18, commit 90128b0)
Ronda de fixes de onboarding agregó un `useRef`+cleanup de timer en `app/onboarding/page.tsx`
(`comprometerse()`/`salir()`, ese archivo no lo usa el paywall en absoluto) y el mismo patrón en
`OptionChip` (components/funnel/ui.tsx) — componente que el paywall nunca renderiza (no hay preguntas
de opción múltiple en esa pantalla). Diff revisado línea por línea (`git diff ca6c6f0..HEAD`): cero
cambios en cualquier componente que el paywall importe. Certificación LISTA sigue vigente, sin necesidad
de recapturar ni relanzar el revisor.

## Tercera re-verificación (2026-09-18, commit 4c42d00)
Solo cambió `app/onboarding/page.tsx` (nueva función `seguirAqui()` + mensaje condicional del modal de
salida durante la celebración) — archivo exclusivo del onboarding, el paywall no lo importa. Cero cambios
en `components/funnel/ui.tsx` esta vez. Certificación LISTA sigue vigente sin necesidad de nueva pasada.

## Verificación de los 5 fixes de la ronda 12 (línea por línea, código real)

1. aria-label unificado del botón X — RESUELTO. `app/paywall/page.tsx` línea 148: `aria-label="Cerrar"` (fase "listo"). `components/funnel/LoadingPlan.tsx` línea 51: `aria-label="Cerrar"` (fase "cargando"). Mismo texto en ambas fases del paywall.

2. Estado accesible en selector de plan — RESUELTO. `app/paywall/page.tsx` línea 188: contenedor `role="radiogroup" aria-label="Elige tu plan"`. Línea 196-197 (Anual): `role="radio" aria-checked={plan === 'anual'}`. Línea 224-225 (Mensual): `role="radio" aria-checked={plan === 'mensual'}`. El estado de selección ahora es programático, no solo visual.

3. Tratamiento unificado de las cards de plan — RESUELTO. Línea 193: `<Hairline emphasis={plan === 'anual'} className="relative">`. Línea 221: `<Hairline emphasis={plan === 'mensual'}>`. Mismo componente para ambos planes; solo cambia el booleano `emphasis` (verificado también en `components/landing/ui.tsx` líneas 51-75: `emphasis` controla grosor de borde 1px/2px y opacidad del degradé 40%/55%, mismo mecanismo para ambos).

4. Escala tipográfica de `LoadingPlan` — RESUELTO. Línea 74: contador de porcentaje en `text-[28px]` (banda display 28-40px). Línea 79: título "Armando tu Semáforo del Gasto…" en `text-[20px]` (banda title 17-20px). Ambos dentro de las bandas de la fórmula de 4 niveles.

5. Escala tipográfica de `ConfirmSalir` — RESUELTO. `components/funnel/ui.tsx` línea 425: mensaje del modal en `text-[15px]` (banda body 15-16px), ya no cae entre bandas.

Los 5 fixes están confirmados en el código en disco (commit 576a137). Ningún fix es cosmético-a-medias: los 5 cierran exactamente el hallazgo que describían.

## Hallazgos NUEVOS de esta ronda (finos, verificados en código — no bloquean el gate)

- **Ícono X con tamaño/grosor distinto entre fases** (el mismo botón que ya tiene el mismo aria-label): `components/funnel/LoadingPlan.tsx:54` → `<X size={18} strokeWidth={2.25} .../>`; `app/paywall/page.tsx:151` → `<X size={20} strokeWidth={2} .../>`. El label ya es idéntico, pero el ícono en sí no renderiza pixel-a-pixel igual entre "cargando" y "listo".
- **aria-label del mismo control diverge fuera del paywall**: `components/funnel/ui.tsx:66` (`FunnelHeader`, usado en los pasos de onboarding) sigue usando `aria-label="Salir"` para el botón X que cierra el funnel, mientras que dentro del paywall (esta pantalla) el mismo botón/función ahora dice "Cerrar" (`page.tsx:148`, `LoadingPlan.tsx:51`). El fix unificó las 2 fases del paywall entre sí, pero no tocó el header del onboarding — un usuario de lector de pantalla que recorre todo el funnel completo (onboarding → paywall) sigue escuchando 2 nombres distintos para el mismo ícono/función.
- **`role="radiogroup"`/`role="radio"` sin patrón de teclado completo**: `app/paywall/page.tsx:188-243` — los 2 botones de plan son `<button>` nativos sin `tabIndex` gestionado, así que ambos quedan en el orden de tabulación (Tab) y las flechas no mueven la selección; el patrón ARIA de radiogroup esperado usa un solo tab-stop para el grupo + flechas para navegar entre opciones. Funciona igual para un usuario de teclado (Tab a cada botón + Enter/Espacio activa, porque siguen siendo `<button>`), pero no seguir el patrón idiomático puede sorprender a quien espera flechas.
- (subjetivo/fino) **Card "Mensual" no seleccionada, borde apenas perceptible**: `page.tsx:221`, `Hairline emphasis={false}` = borde 1px con degradé al 40% sobre `--surface`, un tono casi idéntico a `--bg` — en el screenshot el límite de esa card se distingue solo por la sombra, no por el borde. Es intencional (menor énfasis = no seleccionada) pero un ojo entrenado lo nota.

Estos 4 puntos son refinamiento fino: ninguno es visible para un usuario promedio sin buscarlo, y los 3 primeros solo importan para quien audita con lector de pantalla/teclado. Se listan para cerrar el ciclo de pulido, no porque bloqueen el gate.

## Desglose usabilidad /40

h1 Visibilidad del sistema: 4 — progreso animado con checklist, spinner + "Un momento…" al confirmar, guard anti doble-tap, timeout a los 7s con mensaje + aria-live, y ahora el estado de selección de plan también es programático (fix #2) — ya no hay ninguna acción sin retroalimentación verificable.
h2 Lenguaje del usuario: 4 — cero jerga, copy 100% en español natural y personalizado ("Para que no vuelvas a decir «gasto y no sé en qué se me fue»", "Sin Culpa").
h3 Control y libertad: 4 — X visible y funcional en ambas fases, modal ConfirmSalir con mensaje preciso (no miente sobre pérdida de datos: en el paywall las respuestas ya están en localStorage), Escape para cancelar, trap de foco entre los 2 botones del modal.
h4 Consistencia y estándares: 3 — los 3 focos de inconsistencia de la ronda anterior (aria-label entre fases del paywall, tipografía fuera de banda, borde de card distinto) están resueltos, pero aparecen 2 nuevos residuos verificados en código (ícono X con tamaño/stroke distinto entre fases, aria-label "Salir" del onboarding vs "Cerrar" del paywall para el mismo control) — ningún usuario promedio lo nota, pero un revisor de código sí.
h5 Prevención de errores: 3 — CTA nunca disabled por defecto, guard anti doble-submit, default de plan sensato (Anual preseleccionado), sin ningún campo que pueda enviarse inválido.
h6 Reconocer vs. recordar: 4 — toda la info (precios, fechas de cobro, plan elegido, cuántas respuestas usó) visible en la misma pantalla; nada que recordar de otra pantalla.
h7 Flexibilidad y eficiencia: 3 — funciona por teclado (Tab/Enter/Escape), plan Anual preseleccionado como default inteligente; sin atajos adicionales y sin el patrón de flechas esperado en un radiogroup (ver hallazgo nuevo).
h8 Estético y minimalista: 4 — 1 CTA primario fijo siempre alcanzable, "Ahora no" subordinado y no compite, las 2 cards de plan ahora comparten la misma técnica visual (Hairline), cada bloque de contenido tiene una función real.
h9 Errores claros con solución: 4 — el único error mostrado (timeout de 7s) explica qué pasó y qué hacer, sin jerga.
h10 Ayuda contextual: 4 — el loading explica el proceso con su propio checklist, la timeline del trial trae fechas reales y explica cuándo se cobra, garantía nombrada con plazo; cero pantalla muda.

**Total usabilidad: 37/40** (gate ≥36 — CUMPLE)

## Desglose craft /20

Jerarquía: 4 — con las 2 tallas de `LoadingPlan` y la de `ConfirmSalir` ya alineadas a la fórmula de 4 niveles (display 28 / title 20 / body 15 / label 12-13), el squint-test es consistente en las 2 fases del paywall y en el modal, no solo en la pantalla "listo".
Profundidad: 4 — `FunnelFondo` compartido (mesh + anillo) en ambas fases, 3 niveles reales (bg/surface/surface-2 en la timeline).
Identidad ownable: 4 — anillo de respiración, paleta crema + azul-lila + Nunito redondeada; no coincide con las paletas vetadas del test anti-clon (papel+tinta verde+Petrona/Karla, ni pizarra+latón+Archivo).
Movimiento: 4 — stagger de entrada por bloque, anillo de progreso que se dibuja (strokeDashoffset animado), checklist con spring al completarse, tap feedback (whileTap 0.9/0.97/0.98) en todos los botones, aparición suave del modal, `useReducedMotion` cubierto en los 3 archivos revisados.
Encaje óptico: 4 — radio de card idéntico (`--radius-card`) en todas las superficies, badge y precios centrados ópticamente, chips que abrazan su contenido, padding consistente con la escala 4·8·12·16·24·32·48·64.

**Total craft: 20/20** (gate ≥16, ningún eje ≤2 — CUMPLE)

## Desglose copy /20 (trazado contra FICHA-AVATAR.md)

Idea única dominante: 4 — "Semáforo del Gasto" nombrado y sostenido en hero, loading y timeline; misma promesa que la landing (`app/page.tsx`).
Especificidad y prueba: 3 — precios exactos ($4.16/mes, $49.99/año, $6.99/mes) y "~40% de ahorro" verificable con la propia matemática del plan; sin prueba externa (testimonio/demo) además de la personalización por respuestas del quiz.
Emoción/dolor real: 4 — "Para que no vuelvas a decir «gasto y no sé en qué se me fue»" traza directo al dolor #1 ★ de FICHA-AVATAR.md.
Claridad de oferta: 4 — stack de valor de 3 líneas, timeline de cobro con fechas reales, garantía nombrada con plazo ("Garantía de los Primeros 14 Días Sin Culpa") cerca del CTA.
Dirección a una acción: 4 — un solo tipo de CTA repetido ("Empezar mis 7 días gratis"), "Ahora no" no compite (tipografía/color subordinados).

Sub-checks binarios: garantía nombrada con plazo cerca del CTA de compra — CUMPLE. Message-match headline↔landing — CUMPLE (mismo mecanismo "Semáforo del Gasto", mismo trial 7 días y garantía 14 días "Sin Culpa" en `app/page.tsx` líneas 66-187).

**Total copy: 19/20** (umbral ≥16, ningún eje ≤2 — CUMPLE)

⚠️ Nota de proceso (no puntúa en la rúbrica de esta pantalla): `FICHA-AVATAR.md` sigue con `Estado: BORRADOR` y `Aprobada por el usuario: NO` — el copy traza bien contra ella, pero la ficha en sí no está cerrada según el propio sistema.

## Top defectos (ordenados por impacto — ninguno bloquea el gate; son pulido fino)

1. [components/funnel/LoadingPlan.tsx:54 vs app/paywall/page.tsx:151] Ícono X con tamaño/grosor distinto entre fase "cargando" (18px/2.25) y fase "listo" (20px/2) del mismo botón ya unificado en aria-label → igualar `size`/`strokeWidth` en ambos archivos.
2. [components/funnel/ui.tsx:66] `FunnelHeader` (onboarding) sigue usando `aria-label="Salir"` para el mismo control que en el paywall ahora dice "Cerrar" (`page.tsx:148`, `LoadingPlan.tsx:51`) → unificar el término en las 3 pantallas del funnel, no solo dentro del paywall.
3. [app/paywall/page.tsx:188-243] `role="radiogroup"`+`role="radio"` sobre `<button>` nativos sin `tabIndex` gestionado: ambos botones quedan tabulables y las flechas no mueven la selección (patrón ARIA de radiogroup incompleto, aunque Tab+Enter sigue funcionando) → opcional: roving tabindex + flechas si se busca el patrón completo.
4. (subjetivo/fino) [app/paywall/page.tsx:221] Card "Mensual" no seleccionada con hairline al 40%/1px, apenas distinguible de `--bg` en el screenshot → subir levemente el mix si se busca más definición del borde en estado no-seleccionado.

## Cuarta re-verificación (2026-09-18, commit 9395387 — Sesión 5, app interna)

El commit que agrega la app interna (Hoy, Semana, Tu meta, Cuenta) crea únicamente archivos
nuevos bajo `app/app/*`, `components/app/ui.tsx` y `lib/app.ts` — ninguno existía antes ni el
paywall los importa (verificado: `grep` de `app/app` y `components/app/ui`/`lib/app` dentro de
`app/paywall/page.tsx` y `components/funnel/ui.tsx` no encuentra coincidencias). Son rutas
completamente independientes (`/app`, `/app/semana`, `/app/meta`, `/app/cuenta` vs `/paywall`),
sin componentes ni tokens compartidos más allá de `components/landing/tokens.css` (que no cambió
en este commit). Cero impacto en el código o el comportamiento del paywall — la certificación
LISTA sigue vigente.

## Quinta re-verificación (2026-09-18, commit a5f0b08 — fixes de ronda 1 en Hoy)

El commit toca `app/app/page.tsx` y `lib/app.ts` (aviso de guardado, anillo en la vista previa
de la meta, contraste de los botones del semáforo, racha en la confirmación) — ninguno de los
dos archivos lo importa `app/paywall/page.tsx` ni `components/funnel/ui.tsx` (verificado por
grep). Misma independencia de rutas que la cuarta re-verificación. Cero impacto en el paywall.

## Sexta re-verificación (2026-09-18, commit ef55a1b — fixes de ronda 2 en Hoy)

El commit toca de nuevo `app/app/page.tsx` (texto del aviso, ícono en reflexión, quitar el
`flex-1` sobrante, botón Cancelar) y `FICHA-ARTE.md` (documentar la escala tipográfica ya en
uso). Ninguno lo importa el paywall (mismo grep que las rondas anteriores) y el cambio en
FICHA-ARTE es solo un comentario descriptivo, no toca ningún token real de `tokens.css`. Cero
impacto en el paywall.

## Séptima re-verificación (2026-09-18, commit eb0af4e — menú "isla flotante")

El commit toca `components/app/ui.tsx` (rediseño de `BottomNav`, usado solo por las 4 pantallas
de la app interna) — el paywall no importa ese archivo ni ese componente (usa su propio header y
no tiene bottom-nav). Mismo grep verificado. Cero impacto en el paywall.

## Octava re-verificación (2026-09-21, commit 8f2a50c — capturas reales en el carrusel de la landing)

El commit toca `app/page.tsx` (landing): solo reemplaza los `src`/`alt` de los 4 frames del
carrusel "La app por dentro" por capturas reales — no toca ningún componente del paywall ni
comparte código con él (rutas y árboles de componentes independientes). Cero impacto.
