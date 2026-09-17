# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Header — el botón de salir (X) cambia de lado entre "cargando" y "listo", en la misma sesión de <5s] `components/funnel/LoadingPlan.tsx` L46-56 (X en `absolute right-4 top-4`, esquina superior DERECHA) vs `app/paywall/page.tsx` L137-149 (X en la columna IZQUIERDA del header, logo centrado) → un usuario que mira la esquina superior mientras carga y luego llega al paywall ve el mismo control saltar de lado. Fix: fijar el X siempre al mismo lado (recomendado: derecha, como en `FunnelHeader` del resto del onboarding) en las 3 fases del funnel (onboarding / cargando / listo).
2. [Escala tipográfica — 8 tamaños de fuente en una sola pantalla, contra la escala de 4 que la propia FICHA-ARTE.md declara] `app/paywall/page.tsx` usa 11/12/13/14/15/17/20/28px (líneas 153,157,161,174,198,202-205,208,209,224-227,251,252,264,269,292); FICHA-ARTE.md línea 28 fija "display 34px / title 19px / body 15px / label 12px" (4 niveles) y DESIGN-CORE exige máx. 3 tamaños por pantalla. Fix: colapsar 13/14/15px en un solo "body" (15px) y 17/20/28px en máx. dos niveles de título (19-20px y el héroe).
3. [Modal `ConfirmSalir` — foco inicial correcto, pero sin trap de foco] `components/funnel/ui.tsx` L366-404 → el `useEffect` mueve el foco a "Seguir aquí" al abrir (bien) y Escape cierra (bien), pero nada impide que Tab saque el foco hacia el contenido de fondo (no hay `inert` ni `aria-hidden` en el resto del árbol mientras `abierto=true`) — un `role="dialog" aria-modal="true"` sin aislamiento real de foco es media implementación. Fix: envolver el contenido detrás en `inert` mientras el modal está abierto, o ciclar Tab manualmente entre los 2 botones del modal.
4. [Header propio de la fase "listo" no reutiliza `FunnelHeader" — evaluado, veredicto: aceptable EN SU LAYOUT, pero agrava el defecto #1] `app/paywall/page.tsx` L137-149 vs `components/funnel/ui.tsx` L16-75 → tiene sentido no forzar la barra de progreso (no aplica en el paywall) y centrar el logo aquí; el problema real no es el componente distinto, es la posición inconsistente del X (ver #1). No requiere unificar el componente completo — con corregir el lado del X alcanza.
5. [Acento usado en ~8 elementos distintos de la misma pantalla] `app/paywall/page.tsx`: headline resaltado, checkmarks (`CheckCustom`), badge "5 MESES GRATIS", borde+fondo del plan seleccionado, "Ahorras ~40%", CTA, puntos+línea de la timeline, anillo de fondo decorativo → FICHA-ARTE.md línea 25 limita el acento a "marca, anillo, CTA y selección". No es un error duro (todos son datos de conversión legítimos en una pantalla que vende) y no baja el gate; se anota como refinamiento, no como defecto bloqueante.

## Desglose de verificación (10ª ronda — fixes de la 9ª confirmados línea por línea)
- Fix 1 (titular partido): CONFIRMADO. `app/paywall/page.tsx` L154, `whitespace-nowrap` en el span "Semáforo del Gasto" — en el screenshot la frase de marca queda en una sola línea.
- Fix 2 (ConfirmSalir accesible): CONFIRMADO. `components/funnel/ui.tsx` L356-364 (ref + `useEffect` que hace foco en "Seguir aquí" al abrir), L362-364 (`onKeyDown` captura Escape → `onSeguir`), L378-380 (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="confirm-salir-titulo"` apuntando al `<h2 id="confirm-salir-titulo">` de L387). Funciona, pero ver defecto #3 (falta trap de foco).
- Fix 3 (`aria-live` en errorAvance): CONFIRMADO. `app/paywall/page.tsx` L292, `role="status" aria-live="polite"` en el párrafo de error de timeout.
- Puntos 4-5 de la ronda anterior (consolidar tamaños de fuente, reutilizar `FunnelHeader`): siguen sin tocar, tal como se declaró. Verificado: el primero SIGUE siendo un defecto de peso, verificable contra la propia ficha (ver defecto #2). El segundo, evaluado en contexto, es aceptable NO tocarlo (ver defecto #4) — el fix real y barato ahí es solo alinear el X, no fusionar componentes.

## Gate de carga cognitiva
Pasa: listas ≤4-5 ítems (3 beneficios, 3 nodos de timeline, 2 planes), 1 acción primaria + 2 secundarias (X, "Ahora no"), sin campos de formulario, texto por bloque ≤4 líneas, "qué sigue" obvio (CTA fijo al fondo), cero elementos interactivos mudos. Sin fallas críticas de sobrecarga.

## CTA héroe vivo (verificado en código)
- Contraste ≥3:1: CTA `bg-[var(--accent)]` con texto `text-[var(--bg)]` (crema sobre azul-lila) — pasa a ojo y por tokens de la ficha.
- Hover/tap definido: `whileTap={{ scale: 0.97 }}` + `hover:bg-color-mix(...)` en `FunnelButton` (`components/funnel/ui.tsx` L96,101).
- Nunca disabled por defecto: `disabled={avanzando}` — solo true durante el request, arranca habilitado (`app/paywall/page.tsx` L288).
- Área táctil: `h-[52px] w-full` (`components/funnel/ui.tsx` L104) — pasa el mínimo de 48px.
Los 4 checks pasan — el CTA no es un defecto en esta ronda.

## Detalle usabilidad (0-4 cada uno)
h1:3 h2:4 h3:3 h4:2 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4 → 33/40
- h4 (consistencia) es el más bajo: el salto de lado del botón X entre "cargando" y "listo" (defecto #1) es visible sin buscarlo, en segundos, dentro del mismo flujo — no es refinamiento subjetivo, es una regresión de layout concreta y reproducible en el screenshot.
- h3 (control y libertad) sube de ronda anterior gracias a los fixes de accesibilidad del modal, pero se queda en 3 por la falta de trap de foco (defecto #3, solo verificable en código).

## Detalle craft (0-4 cada eje)
jerarquía:3 (8 tamaños de fuente vs. máx. 3 del sistema — defecto #2, visible al entrecerrar los ojos si se compara contra la ficha, aunque la lectura general sigue siendo ordenada) · profundidad:4 (mesh + 3 niveles de superficie consistentes con el resto del funnel) · identidad:4 (anillo de respiración, Nunito, paleta cálida — no coincide con ninguna paleta vetada del test anti-clon) · movimiento:4 (stagger por bloque, anillo de carga que se dibuja, tap <150ms, modal con fade+scale, reduced-motion cubierto en los 4 componentes revisados) · encaje:4 (titular ya no se parte mal — fix de esta ronda —, radios consistentes vía tokens, padding simétrico) → 19/20

## Detalle copy (0-4 cada eje) — sin cambios respecto a la ronda 9, no se tocó copy esta ronda
idea:4 (mecanismo "Semáforo del Gasto" nombrado en headline/beneficios/loading) · especificidad:4 (precios exactos, timeline con fechas reales y monto de cobro, "sin conectar tu banco" responde la objeción #2 de FICHA-AVATAR.md) · emoción:4 (subtítulo cita casi textual el dolor #1 de la ficha: «gasto y no sé en qué se me fue») · oferta:3 (clara pero "Garantía de los Primeros 14 Días Sin Culpa" es una redacción un poco forzada como nombre propio) · acción:4 (un solo tipo de acción repetida, "Ahora no" no compite) → 19/20
Sub-checks: message-match N/A (no hay dato del creativo de origen) · garantía nombrada: PASA (nombre + plazo, cerca del CTA, L274).

## Conclusión
Craft (19/20) y copy (19/20) siguen pasando con margen. Usabilidad se mantiene en la banda 32-33/40 por CUARTA ronda consecutiva, y esta vez los defectos que la sostienen por debajo del gate NO son refinamiento subjetivo: el salto de lado del botón de salir entre dos pantallas consecutivas (defecto #1) es un bug de layout concreto, reproducible y visible en los propios screenshots entregados, y la escala de 8 tamaños de fuente (defecto #2) es una violación verificable contra la propia FICHA-ARTE.md del proyecto, no una opinión del revisor. Ambos son arreglables en minutos (alinear un `X`, colapsar 3-4 clases de tamaño). Recomendación: corregir #1 y #2 antes de la siguiente ronda — con eso, 33/40 sube razonablemente por encima del gate de 36. El punto #3 (focus trap) es más fino pero también objetivo y barato de cerrar. El punto #5 sí es zona de gusto y no bloquea.
