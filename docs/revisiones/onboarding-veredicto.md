# VEREDICTO revisor-visual — onboarding (ronda 11)
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-paso2-375.png, onboarding-paso6-375.png, onboarding-celebracion-375.png)
Usabilidad: 34/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Celebración (app/onboarding/page.tsx L206-227, SemanaPreview en components/funnel/ui.tsx L232-265) — sigue siendo el vacío más grande del funnel (menos contenido que el paso 6 previo al compromiso) → sumar 1 frase de refuerzo/próximo paso bajo el tracker.
2. Checkmarks con spring bounce 0.4-0.5 (ui.tsx L174/L246, page.tsx L218) — viola la propia FICHA-ARTE ("spring casi sin rebote 0-0.1") y el umbral del SO (41-CRAFT-DE-ANIMACION.md: ">0.3 se ve de juguete") → bajar a bounce 0.1-0.2.
3. VistaSemaforo (ui.tsx L200-219) usa íconos en círculo completo mientras OptionChip (ui.tsx L161-168) usa el mismo patrón en squircle — mismo componente conceptual, dos formas distintas en la misma pantalla → unificar a rounded-[var(--radius-button)].
4. guardarRespuestas (lib/onboarding.ts L87-93) traga en silencio el fallo de localStorage (privado/bloqueado) sin avisar ni degradar visiblemente → agregar aviso o guardar fallback en memoria con indicación mínima.
5. Transición de celebración → /paywall (page.tsx L44, router.push tras 700ms) es un corte seco sin fade de salida → animar exit con AnimatePresence antes de navegar.

## Detalle usabilidad (Nielsen, /4 c/u)
h1 Visibilidad del estado: 3 — feedback fuerte en cada tap (chip, hold-button con anillo real, aria-live throttled); el corte final a /paywall es abrupto.
h2 Lenguaje del usuario: 4 — cero jerga, copy conversacional y en el idioma de Camila.
h3 Control y libertad: 4 — ConfirmSalir con Escape=quedarse, back por paso, se puede re-elegir una respuesta yendo atrás (verificado en código: guardarYAvanzar sobreescribe el campo).
h4 Consistencia: 3 — mismo OptionChip/FunnelButton en las 4 preguntas; pero icono-en-contenedor cambia de forma entre OptionChip y VistaSemaforo (defecto 3).
h5 Prevención de errores: 4 — bloqueado en doble-tap (OptionChip), guardas contra key-repeat en HoldButton, disabled con opacity clara.
h6 Reconocer vs recordar: 4 — opciones siempre visibles, tracker de semana visual, nada que memorizar entre pasos.
h7 Flexibilidad: 3 — soporte de teclado real en HoldButton (Enter/Espacio) y botones nativos, pero sin atajos adicionales para usuario experto.
h8 Estético y minimalista: 2 — 1 acción primaria por pantalla y VistaSemaforo se gana su lugar (ya no es filler), pero el vacío de la celebración y el bounce fuera de tono rompen "movimiento consistente consigo mismo" — un usuario cualquiera nota el vacío al ver la captura.
h9 Errores con solución: 3 — no hay estados de error visibles en el flujo normal, pero el fallo silencioso de localStorage (defecto 4) es un hueco real, aunque de baja incidencia.
h10 Ayuda contextual: 4 — VistaSemaforo ahora enseña el mecanismo con texto distinto por paso (contexto: dolor/momento/intento/meta verificado en CONTEXTO_SEMAFORO), ya no se siente repetido.

## Detalle craft (/4 c/u)
Jerarquía: 3 — título > subtítulo > opción > label se lee claro al entrecerrar los ojos; VistaSemaforo compite un poco de peso visual con el bloque principal.
Profundidad: 3 — mesh + anillo fijo + shadow-1 en cards da 2 planos claros; sin plano "hundido" pero no hace falta en esta pantalla (no hay inputs).
Identidad ownable: 3 — Nunito + semáforo + anillo de respiración + paleta crema/azul-lila no coincide con los clones vetados (Capítulo/Umbral) — pasa el test anti-clon.
Movimiento: 2 — stagger de entrada, dibujado del anillo del hold-button, transición de pasos y modal suave están todos presentes y correctos; pero el bounce 0.4-0.5 en las 4 celebraciones (defecto 2) es una desviación medida y documentada contra la propia ficha y contra el criterio del SO.
Encaje óptico: 3 — radios idénticos (22px card / 16px botón, verificado en tokens.css), padding simétrico, círculos de días centrados; sin desencajes evidentes en las 4 capturas.

## Verificación de los 3 defectos puntuales de la ronda 10
1. VistaSemaforo repetida idéntica → RESUELTO. `CONTEXTO_SEMAFORO` (ui.tsx L189-194) da texto distinto por paso, confirmado en código y en las capturas del paso 0 ("Así funciona: cada día, marcas cuál de los dos te describe") vs paso 2 ("Justo en ese momento del día, un solo toque basta").
2. Copy que invitaba a tocar algo inerte → RESUELTO. El copy pasó de imperativo/interactivo a descriptivo en las 4 variantes; los círculos no tienen `<button>`, `cursor-pointer` ni `whileTap`, y viven bajo el encabezado explícito "Así se ve tu Semáforo del Gasto" que los enmarca como ejemplo, no como control. (Queda un matiz menor no bloqueante: el anillo + punto relleno sigue usando el mismo lenguaje visual de un selector, lo cual un ojo entrenado podría seguir asociando con algo tocable — no amerita defecto propio, es refinamiento fino).
3. Celebración con el vacío más grande sin contenido → PARCIALMENTE RESUELTO. `SemanaPreview` con `diaCompletado` (ui.tsx L232-265) sí agrega contenido real (check verde animado en el día de hoy), pero comparado con el paso 6 previo al compromiso (que tiene más bloques: headline+subtítulo+hold-button+label+tracker), la celebración termina su contenido notablemente antes, dejando el tramo de cream vacío más largo de las 4 capturas antes de que aparezca el anillo decorativo fijo. Ver defecto TOP #1.

## Nota sobre el resto de hallazgos
Los defectos 1 y 2 son concretos y medibles (asimetría de contenido visible en captura; valor numérico de bounce documentado contra la propia FICHA-ARTE y contra 41-CRAFT-DE-ANIMACION.md) — no son gusto personal. Los defectos 3, 4 y 5 sí son ya refinamiento fino: dos revisores podrían discrepar en si ameritan bajar puntaje o solo anotarse para la próxima pasada. El gate de carga cognitiva (≤4-5 ítems, ≤4 opciones, 1 acción primaria, nada que recordar entre pantallas, texto en 3-4 líneas, "qué sigue" obvio, cero elementos fantasma) pasa completo — no hay sobrecarga cognitiva en esta pantalla.
