# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 15:40
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 31/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 0, franja bajo el 4º chip hasta el pie de pantalla] El vacío inferior sigue sin resolverse a nivel de RESULTADO PERCIBIDO: incluso si el mesh + eco del anillo renderizaran a 7-8% de opacidad (código correcto, no verificable en este sandbox por el artefacto de z-index negativo bajo software rendering ya documentado en el Hero de la landing), esa opacidad es demasiado sutil para llenar ~40% de la pantalla con sensación de profundidad real. → Subir el mesh/anillo a 12-15% de opacidad (rango perceptible) y volver a capturar en un navegador real para confirmar antes de cerrar el defecto; no basta con que el código sea correcto si el efecto es imperceptible incluso renderizado.
2. [Pasos 1-6, header] No hay ninguna salida visible del funnel una vez pasado el paso 0: `onBack` solo retrocede un paso a la vez y no existe un botón de cerrar/salir al lado del logo. Heurística 3 (control y libertad) verificada en código: `FunnelHeader` no ofrece afordancia de cierre en pasos intermedios. → Agregar un ícono de cerrar (X) junto al progreso que lleve a landing con una confirmación breve si ya hay respuestas guardadas.
3. [Toda la pantalla, código: `guardarRespuestas` en page.tsx] Cero manejo de error visible si falla el guardado (localStorage lleno/deshabilitado en modo incógnito) antes de `router.push('/paywall')` — heurística 9 sin evidencia de cobertura. → Envolver `guardarRespuestas` en try/catch con un mensaje breve y no bloquear la navegación si falla.
4. [Paso 0, chips de opción] El dispositivo ownable de la ficha (el anillo de respiración) no aparece en ningún elemento visible de este paso — los chips usan un ícono genérico en círculo (recurso correcto y prolijo, pero no distintivo de marca). → Traer el motivo del anillo a un lugar que sí sea visible sin depender del mesh de fondo (p. ej. como marco del ícono seleccionado, o en el header).
5. [Toda la pantalla, teclado] Sin acelerador para usuario experto más allá del tab nativo: sin navegación por flechas entre chips ni confirmación con Enter documentada aparte del comportamiento nativo del `<button>`. → Aceptable como piso, pero un ojo entrenado lo nota; agregar `onKeyDown` con flechas arriba/abajo entre chips si se quiere subir a 4.

NOTA PARA EL EQUIPO: el defecto de fondo/profundidad (ítem 1) es real pero NO es el único freno — aun descontándolo por completo (dándole el máximo de Craft-Profundidad), el gate seguiría sin cumplirse porque Usabilidad (31/40) está 5 puntos bajo el mínimo de 36, y Craft quedaría en 15/20, todavía bajo el mínimo de 16. El techo real de esta pasada es de la PANTALLA (control/salida, manejo de error, dead space, atajos), no solo de la herramienta de captura.
