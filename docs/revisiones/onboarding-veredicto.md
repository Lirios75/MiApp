# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 31/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pasos con lista de opciones — paso 0/2/3/5, app/onboarding/page.tsx L60-80, L104-125, L126-147, L176-197] El contenedor de la pregunta no distribuye verticalmente (sin `justify-center` ni relleno) → ~35-40% de la pantalla queda vacío entre la última opción y el borde inferior, visible en onboarding-375.png y onboarding-paso2-375.png → Fix: envolver el bloque de pregunta en `flex flex-1 flex-col justify-center` (como ya hacen los pasos de reconocimiento, L153/L202) o sumar un elemento de apoyo que llene el espacio.
2. [Anillo decorativo de marca — components/funnel/ui.tsx L207-209] El "anillo de respiración" (dispositivo ownable de FICHA-ARTE L16/L30: "anillo que se expande") es un `<circle>` SVG 100% estático, sin animación de escala/opacidad — contradice la firma de movimiento propia de la marca en las 4 capturas → Fix: `motion.circle` con pulso sutil (scale 1↔1.03, opacity 0.12↔0.18, loop ~4s, respetando `useReducedMotion`).
3. [Todo el flujo — app/onboarding/page.tsx] No hay indicador textual de cuántas preguntas faltan (solo la barra abstracta) ni opción de omitir preguntas no críticas (momento del día, ya-intentaste) → Fix: micro-copy "Pregunta X de 6" junto al header o un link discreto de "omitir" en pasos no esenciales.
4. [lib/onboarding.ts L87-93, guardarRespuestas] El catch de `localStorage.setItem` es silencioso: si falla (modo privado/storage lleno), el usuario termina el quiz sin saber que nada se guardó y llega a /paywall con personalización genérica sin ninguna pista → viola heurística 9 (errores con solución) → Fix: aviso discreto no bloqueante si el guardado falla.
5. [Craft EJE5, mismo origen que #1 — paso 6, onboarding-paso6-375.png] La pantalla de compromiso (la de mayor conversión del onboarding) queda con vacío arriba Y abajo del bloque título+HoldButton; el botón de 112px se ve aislado en un lienzo casi vacío, sin sentirse como el momento culminante que promete el copy → Fix: acompañar el HoldButton con apoyo visual (mini-resumen de respuestas o iconografía del Semáforo).
