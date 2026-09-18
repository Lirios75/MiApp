# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 25/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. app/onboarding/page.tsx líneas 41-45 (comprometerse) + 47-54 (salir) + 257 (ConfirmSalir onSalir) — el setTimeout(700ms) que empuja a /paywall nunca se cancela: si el usuario toca la X durante esos 700ms y elige "Seguir aquí" o "Salir sin guardar" en ConfirmSalir, el temporizador sigue corriendo y fuerza router.push('/paywall') igual, por encima de la elección explícita del usuario (incluso después de haber navegado a "/"). El fix de la ronda 14 cerró el escape por el logo pero NO cerró la causa raíz (temporizador sin cancelar) — el mismo bug de control-y-libertad sigue vivo por otra puerta. Fix: guardar el id en useRef y clearTimeout al abrir ConfirmSalir / en onSeguir / onSalir, más cleanup en useEffect al desmontar.
2. app/onboarding/page.tsx línea 237 (paso 6, rama !comprometido) — el bloque título+HoldButton+SemanaPreview no usa `flex-1 justify-center` como sí hacen los pasos de reconocimiento (1 y 4), queda pegado arriba y deja un tramo de espacio vacío antes de que aparezca el anillo decorativo del fondo (visible en docs/revisiones/onboarding-paso6-375.png). Fix: envolver el bloque con `flex flex-1 flex-col items-center justify-center` igual que en los pasos 1/4.
3. components/funnel/ui.tsx ConfirmSalir con mensaje por defecto usado en app/onboarding/page.tsx línea 257 — si la X se toca durante/tras comprometerse() (paso 6), el modal dice "Perderás las respuestas de tu quiz" pese a que guardarRespuestas ya las persistió en localStorage un instante antes (línea 42): el texto ya no es cierto en ese estado puntual (matiz solo visible en código, heurística 9).
4. components/funnel/ui.tsx OptionChip (líneas 149-153) — el setTimeout(onSelect, 300) tampoco se cancela en unmount; mismo patrón arquitectónico de riesgo que el defecto #1 (temporizador suelto que puede disparar una acción tras desmontar/cambiar de paso), baja probabilidad de impacto real pero es el mismo antipatrón repetido en el mismo archivo — recomendar useRef+cleanup como práctica sistemática en todo el kit de funnel, no parche puntual.
