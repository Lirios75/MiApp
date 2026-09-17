# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-paso2-375.png, onboarding-paso6-375.png, onboarding-celebracion-375.png)
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pasos 0/2/3/5, pregunta] Vacío grande en la mitad inferior del viewport (título+opciones ocupan ~55%, el resto es fondo liso + arco decorativo apenas visible en la esquina) — se ve pantalla sin terminar → components/funnel/ui.tsx L254-266 (FunnelScreen, contenedor flex-1 sin contenido que lo llene) + L202-230 (FunnelFondo, decoración muy tenue y solo en la esquina). Fix: rellenar con contenido real (mini-contexto, ilustración) o recentrar verticalmente el bloque cuando el contenido es corto.
2. [HoldButton, paso 6] aria-label={label} solo dice el texto del compromiso, nunca que hay que MANTENER presionado 900ms, y no hay aria-live anunciando el progreso — un usuario de lector de pantalla que presiona Enter una vez no completa el paso y no recibe ningún aviso de qué pasó ni qué hacer → components/funnel/ui.tsx L396-419. Fix: agregar aria-live="polite" con el % de avance y mencionar "mantén presionado" en el aria-label o en un texto asociado (aria-describedby).
3. [Paso 6, antes de sostener] El título "¿Lista para tu primer Semáforo?" queda flotando a mitad de pantalla con un vacío de ~40% arriba y otro vacío grande abajo antes del anillo decorativo — composición desbalanceada → app/onboarding/page.tsx L202 (div flex-1 items-center justify-center). Fix: anclar el bloque arriba como los demás pasos o llenar el tercio superior con un resumen visual de las respuestas ya dadas.
4. [FunnelHeader, barra de progreso] El div de progreso (components/funnel/ui.tsx L46-53) no tiene role="progressbar" ni aria-valuenow/min/max — un usuario de lector de pantalla no tiene ninguna forma de saber en qué paso del onboarding va. Fix: agregar los atributos ARIA de progressbar con el % actual.
5. [lib/onboarding.ts L87-93] guardarRespuestas() traga en silencio el error si localStorage falla (modo privado/cupo lleno) — el usuario llega al paywall sin personalización y sin ningún aviso de que algo no se guardó. Fix: mostrar un mensaje breve ("no pudimos guardar tus respuestas en este navegador") en vez de solo comentar el catch.
