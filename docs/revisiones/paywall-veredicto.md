# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [RespiraMark, header superior — app/paywall/page.tsx L100] Se usa la variante animada (anillo abierto al 75%, gap visible arriba-derecha) justo después de la pantalla de carga real; visualmente es indistinguible de un spinner de carga a simple vista, y el propio componente ya tiene una variante `estatico` (anillo cerrado y quieto) pensada para "headers junto a una barra de progreso real" para evitar leerse como loader duplicado (components/RespiraMark.tsx L18-21) → usar `<RespiraMark estatico />` aquí, igual que en FunnelHeader.
2. [Fondo de toda la pantalla — app/paywall/page.tsx L89] El paywall usa un `bg-[var(--bg)]` plano sin el mesh gradient + anillo-marca de fondo que sí tiene `FunnelScreen` (components/funnel/ui.tsx L166-181), el contenedor que onboarding sí usa (app/onboarding/page.tsx L47 `<FunnelScreen>`). Al pasar de onboarding → paywall el fondo pierde su textura y se siente un escalón más plano en el mismo flujo → envolver el contenido en `FunnelScreen` (o replicar su fondo) para que las 3 pantallas del funnel compartan la misma profundidad base.
3. [Botón X "cerrar" y enlace "Ahora no" — app/paywall/page.tsx L92-99 y L217-223] A diferencia del CTA y las 2 cards de plan (que ya tienen `whileTap`), estos 2 controles siguen siendo `<button>` planos sin ningún feedback visual al tap → agregar `whileTap={{ scale: 0.97 }}` para que TODo elemento tapeable de la pantalla responda igual.
4. [CTA "Empezar mis 7 días gratis" → onClick, sin backend aún] Sigue sin existir ningún patrón de error/reintento en código para cuando se conecte el checkout real (Sesión 6) — aceptado como pendiente de proceso, no de esta pantalla; igual limita el techo de la heurística 9 hasta que se documente el patrón en ESTADO.md antes de conectar Hotmart.
5. [X arriba-izquierda y "Ahora no" abajo] Ambos siguen ejecutando `router.push('/')` — aceptado por ahora (no existe todavía una app-lite a la que mandar a quien duda), pero sigue sin ofrecer un camino distinto para quien solo quiere revisar/editar sus respuestas del quiz antes de decidir.

Nota de proceso (no cuenta como defecto de esta pantalla): FICHA-AVATAR.md sigue en BORRADOR/no aprobada; el copy de esta pantalla ya se deriva de ella (p. ej. la línea "no sé en qué se me fue"). No bloquea el puntaje de craft/copy de esta revisión, pero sigue pendiente aprobarla antes de vender de verdad.
