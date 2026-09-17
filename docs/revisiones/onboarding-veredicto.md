# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 27/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Composición general, mitad superior de la pantalla] ~35-40% del alto (entre la barra de progreso y el título) queda vacío sin ningún elemento, fondo plano puro — un usuario cualquiera lo nota sin buscarlo → cambiar `justify-center` por `justify-start` con padding fijo, o llenar ese espacio con un elemento de contexto (no dejarlo como resultado accidental del centrado vertical).
2. [Las 4 opciones de respuesta] Aparecen todas juntas en un único bloque animado (mismo `stepKey` en FunnelScreen, sin stagger por ítem) — viola la animación baseline obligatoria "stagger de entrada 50-80ms" exigida para toda pantalla, y esta es la primera de su tipo en el proyecto → envolver el `.map(OPCIONES_DOLOR)` con delay incremental por índice (framer/motion `staggerChildren` o `delay: i * 0.06`) en app/onboarding/page.tsx u OptionChip.
3. [Header, esquina superior izquierda] `RespiraMark` anima su anillo de 0%→75% en 900ms al entrar; en un frame estático (como el capturado) se lee como un spinner de carga, ambigüedad de "¿se colgó?" → acortar a <400ms o encadenarlo al mismo stagger de entrada para no dejar un frame parecido a loading.
4. [Chips de opción vs. fondo] La superficie de los chips (#FFFDF8) y el fondo (#FAF6EF) son casi idénticos a la vista; solo se distinguen por un borde fino, sin la sombra tintada que exige FICHA-ARTE.md ("sombras suaves tintadas... nunca borde duro gris") → aplicar box-shadow sutil tintado (rgb 42,38,32 según ficha) a OptionChip en components/funnel/ui.tsx.
5. [Opción "Empiezo un presupuesto y lo dejo"] Usa la palabra "presupuesto", listada explícitamente como vetada en FICHA-AVATAR.md ("jerga financiera técnica... el ángulo es emocional, no contable"); aunque ecoa la cita literal del dolor #3 de la propia ficha, hay una contradicción sin resolver entre el veto y el copy → reescribir en registro emocional (ej. "Intento organizarme y lo dejo a la semana") o resolver la contradicción en la ficha misma.

Nota de método (no cuenta como defecto de diseño): el screenshot incluye el ícono de dev tools de Next.js (círculo negro "N", esquina inferior izquierda) — recapturar en modo producción o recortando ese overlay antes de la próxima revisión, para no contaminar el juicio visual.
