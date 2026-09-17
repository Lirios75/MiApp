# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 12/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Headline, app/paywall/page.tsx L86] Bug de copy verificado en código: cuando meta="ahorrar", el template genera "Tu Semáforo del Gasto para ahorrar para algo está listo" (doble "para" en el texto más visible de la pantalla) → reformular el template o los labels de meta para evitar la duplicación.
2. [Zona timeline/CTA, esquina inferior izquierda] Insignia negra circular "N" (indicador de dev de Next.js) queda superpuesta sobre el bloque de trial y el botón CTA en la captura oficial de revisión → desactivar devIndicators o capturar desde build de producción.
3. [Value-stack, plan cards, timeline — toda la pantalla] Las 3 cards usan solo borde plano de 1px; --shadow-1/--shadow-2 de FICHA-ARTE nunca se aplican, contradiciendo "sombras suaves tintadas" documentadas → aplicar shadow-[var(--shadow-1)] a las superficies elevadas.
4. [Bloque completo tras el header] Value-stack, planes, timeline y CTA entran en un único motion.div sin stagger entre bloques, incumpliendo la baseline no negociable de entrada escalonada → envolver cada bloque en su propio motion con delay incremental de 60-80ms.
5. [Copy, pantalla completa] El copy describe el producto (Semáforo, planes, precios) sin re-nombrar la escena de dolor exacta del avatar (gasto por ansiedad/culpa) antes de resolver → eje EMOCIÓN queda en 2/4, incumple "ningún eje ≤2" del gate de copy → agregar una línea corta de dolor bajo el subtítulo antes del value-stack.
