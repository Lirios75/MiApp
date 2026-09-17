# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA "Empezar mis 7 días gratis", sin backend aún — app/paywall/page.tsx L224] No existe en código ningún patrón de error/reintento para cuando el checkout real (Hotmart, Sesión 6) falle; heurística 9 (errores claros) queda topada en 2/4 hasta que se defina y codee ese patrón antes de conectar el pago real.
2. [X arriba-izquierda L109 y "Ahora no" L235] Ambos siguen ejecutando `router.push('/')`, expulsando al usuario del flujo completo sin opción de volver a revisar/editar sus 5 respuestas ya invertidas → ofrecer un camino de regreso a las respuestas o una confirmación antes de perder ese progreso.
3. [Fondo con profundidad — mesh gradient + eco del anillo, L92-103] No se aprecia en este PNG a 375px; el código es idéntico al de FunnelScreen (ya usado y verificado en Hero), así que se acepta como limitación conocida del renderer headless y NO se cuenta como defecto — pero conviene una captura desde navegador real antes de confiar en el efecto en producción.
4. [Jerarquía de tamaños en cards de plan, L168 y L189] El precio (22px bold) compite en peso con el titular (28px bold + acento) — 4 escalas convivientes en una sola pantalla (28/22/15-16/11-13); reducir levemente el precio reforzaría que el titular es el único héroe visual.
5. [CTA principal sin bloqueo de doble-tap — FunnelButton/paywall onClick] El botón no se deshabilita ni muestra estado de envío tras el primer tap; falta un estado `enviando` antes de conectar el checkout real para prevenir doble-navegación.
