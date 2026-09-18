# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-paso2-375.png, onboarding-paso6-375.png, onboarding-celebracion-375.png)
Usabilidad: 29/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (0-4 c/u): h1:3 h2:3 h3:3 h4:2 h5:3 h6:4 h7:3 h8:2 h9:3 h10:3
Detalle craft (0-4 c/u): jerarquía:3 profundidad:3 identidad:4 movimiento:4 encaje:3

## Veredicto sobre la familia de bugs de timer/rutas de escape (rondas 14-16)
CERRADA — verificado en código, no en confianza ajena. Tracé a mano las tres rutas:
1. `comprometerse()` (app/onboarding/page.tsx:48-52) guarda en localStorage y agenda el
   `setTimeout` a 700ms.
2. `salir()` (líneas 54-68): si hay respuestas, cancela ese timeout ANTES de abrir el
   modal — no hay carrera entre el timer y el modal.
3. `seguirAqui()` (líneas 75-78): si `comprometido===true`, hace `router.push('/paywall')`
   de inmediato al cerrar el modal — ya no existe el dead-end de la ronda 15 (celebración
   sin botón ni auto-avance). Si `comprometido===false`, solo cierra el modal, sin efecto
   secundario, igual que siempre.
4. El mensaje del modal (líneas 285-289) ahora es condicional y veraz en ambos casos: ya
   no dice "perderás las respuestas" cuando las respuestas y el compromiso ya están en
   localStorage.
No se abrió una cuarta puerta: recorrí double-tap en X, Escape (mapea a `onSeguir`),
Tab-trap (cicla entre los 2 botones del modal), y el cleanup del timer en unmount
(línea 31-35, sigue intacto). Ningún estado queda inalcanzable.

CONCLUSIÓN PARA EL USUARIO: no tiene sentido seguir iterando esta familia específica
(timer + X + HoldButton) — está genuinely resuelta. Lo que falta para el gate de 36/40
son heurísticas SIN relación con timers/rutas (ver defectos 2-4 abajo: espacio muerto,
falta de aviso pre-compromiso, jerarquía de progreso). Recomiendo cerrar esta ronda de
bugs y abrir la próxima contra esos ejes, no contra el mismo flujo de salida.

## TOP DEFECTOS

1. [components/funnel/ui.tsx `ConfirmSalir` default `labelSalir` + app/onboarding/page.tsx:281-290]
   Cuando `comprometido===true`, el modal dice "Tu compromiso ya quedó guardado — puedes
   seguir a tu plan cuando quieras" pero el botón de salir sigue leyendo el default
   "Salir sin guardar" (la llamada en onboarding no pasa `labelSalir`, a diferencia de
   app/paywall/page.tsx:310-316 que sí lo sobreescribe a "Salir"). Contradice el propio
   mensaje en la misma pantalla → fix: pasar `labelSalir="Salir"` en la llamada de
   onboarding cuando `comprometido` sea true (mismo patrón que ya usa paywall).

2. [Pantallas de paso 6 "antes de sostener" y celebración — onboarding-paso6-375.png,
   onboarding-celebracion-375.png] Más de la mitad del alto de pantalla queda vacío
   (bloque grande arriba del título y otro debajo de los círculos de la semana, con solo
   el anillo decorativo tenue) — contrasta fuerte con los pasos de pregunta (0/2), que sí
   llenan el alto con la card VistaSemaforo. Es el mismo "aire muerto" que el propio
   código ya documentó y resolvió para las preguntas cortas (comentario en
   components/funnel/ui.tsx:200-205) pero nunca se aplicó a estos dos pasos → fix:
   mover el contenido a alineación superior (quitar `justify-center` del contenedor
   flex-1 en estos dos bloques de app/onboarding/page.tsx:261 y 241) o sumar un elemento
   de valor real (refuerzo del mecanismo, testimonio corto, etc.) en el tercio inferior.

3. [app/onboarding/page.tsx paso 6, rama `!comprometido`, línea ~261-272] Una vez que se
   sostiene el botón y se dispara `comprometerse()`, ya no hay forma de volver a las
   preguntas (`onBack` se oculta permanentemente cuando `comprometido` es true, línea 231)
   — decisión de producto válida (ritual sin marcha atrás), pero no se avisa ANTES de
   soltar el dedo: el usuario no sabe que este gesto es un punto sin retorno dentro del
   quiz → fix: una línea de micro-copy bajo el HoldButton, ej. "Ya no podrás volver a las
   preguntas después de esto".

4. [Barra de progreso, onboarding-paso6-375.png] En el paso 6, ANTES de sostener el botón
   (osea antes de completar la acción obligatoria de esta pantalla), la barra ya se ve
   100% llena (`progresoDePaso(6)` = 100, línea 18-20) — visualmente comunica "ya
   terminaste" cuando todavía falta el paso más importante (el compromiso). Un ojo
   entrenado lo nota comparando contra los demás pasos, donde la barra sube gradual y
   consistente con lo que falta → fix: reservar el 100% para el estado ya comprometido
   (p.ej. tope en ~92% mientras `!comprometido`, saltando a 100% recién tras el hold).

5. [components/funnel/ui.tsx `ConfirmSalir`, botón "Seguir aquí" / `seguirAqui()`] Cuando
   `comprometido===true`, presionar "Seguir aquí" NO te deja "aquí" — navega de
   inmediato a /paywall. La etiqueta (heredada sin cambios del branch no-comprometido,
   donde sí te quedas en la misma pantalla) ya no describe con precisión lo que hace en
   este branch → fix: pasar un label específico para este caso (ej. "Seguir a mi plan")
   en vez de reutilizar el genérico "Seguir aquí" cuando `comprometido` es true.

## Decisión de la usuaria (2026-09-18)

Tras esta 16ª pasada, la usuaria pidió ver capturas reales del estado actual (tomadas en
vivo, navegador a 375px, en `docs/revisiones/vivo/`) en vez de seguir el ciclo automático
de rondas. Confirmó a simple vista el defecto 2 (espacio vacío en las 2 pantallas del
compromiso) y revisó los 5 defectos de esta lista en lenguaje simple. Decisión: **avanzar
a la Sesión 5 dejando estos 5 puntos anotados como pendientes conocidos**, sin seguir
iterando esta pantalla ahora. No re-abrir esta pantalla ni volver a lanzar el
revisor-visual sobre ella sin que la usuaria lo pida — queda **APROBADA POR LA USUARIA EN
SUSTANCIA**, igual que la landing en la Sesión 3.
