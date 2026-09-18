# VEREDICTO revisor-visual — Hoy (pantalla principal / M0)
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [app/app/page.tsx:148-150, sección VistaPreviaMeta] Vacío muerto notorio entre la tarjeta "Ahorrar para algo" y el nav inferior (~150px de fondo vacío visibles en el screenshot): la sección usa `flex-1` pero el `Link` que contiene no crece ni se centra, así que el espacio extra queda como hueco muerto sobre la barra de navegación → quitar `flex-1` de esa sección o envolver el contenido en un contenedor que centre/expanda verticalmente (`flex flex-1 flex-col justify-center`).
2. [lib/app.ts:65-74 localStorageDisponible + app/app/page.tsx:82-93 aviso] El texto dice "funcionan mientras tengas esta pestaña abierta, pero se pierden si la cierras", pero cada ruta (Hoy/Semana/Meta/Cuenta) relee el estado desde localStorage al montar (`asegurarInicioTrial`/`leerEstadoApp`) sin un estado compartido en memoria entre pantallas — si localStorage falla, el check-in también se pierde al cambiar de pestaña del nav inferior, no solo al cerrar la pestaña del navegador → corregir el copy ("se perderán si cambias de pantalla o cierras la app") o mantener el estado en un contexto compartido que sobreviva la navegación mientras la pestaña siga abierta, para que el aviso sea cierto.
3. [app/app/page.tsx:76, h1 "Hoy"] Sigue en 22px, tamaño no declarado en FICHA-ARTE.md (escala 34/19/15/12) — el fix de esta ronda corrigió 11px→12px y 17px→19px pero dejó sin tocar este mismo punto ya señalado en la ronda 1, y persisten ~13 usos de 13px dispersos (fecha, "Esta semana", "Ver semana/meta", subtextos) también fuera de la escala declarada → consolidar a 12/15/19/34 o ampliar formalmente la escala en la ficha.
4. [app/app/page.tsx, SelectorSemaforo, invocado desde ConfirmacionDia.onCambiar — estado no visible en este screenshot] Al tocar "Cambiar" se vuelve al selector sin ninguna opción de "cancelar": si el usuario abre el editor por error, su única salida es tocar una de las dos opciones (potencialmente distinta a la que ya tenía) → agregar un enlace "Cancelar" que regrese a ConfirmacionDia sin llamar a `marcar()`.
5. [app/app/page.tsx:141-146, tarjeta de reflexión] Bloque de texto plano con borde, sin ícono ni tratamiento — a diferencia de las demás tarjetas (chip de racha, anillo de meta, círculos de la semana) no tiene ningún dispositivo visual, se percibe como relleno de texto suelto → darle un tratamiento mínimo (ícono pequeño o fondo distinto) para consistencia con el resto de la pantalla.

## Verificación de los 5 cambios reportados (ronda 2)
1. Aviso si localStorage falla al guardar: VERIFICADO EN CÓDIGO — `localStorageDisponible()` (lib/app.ts:65-74) hace una escritura de prueba real (no solo `typeof window`), y `avisoGuardado` se calcula en cada mount y cada `marcar()` (app/app/page.tsx:40,45,51) mostrando un banner con `role="status"` e ícono. Correcto en el mecanismo; el TEXTO del aviso es impreciso (ver defecto #2 arriba).
2. Anillo de progreso en vez de barra lineal: VERIFICADO — `VistaPreviaMeta` usa `<AnilloProgreso>` (app/app/page.tsx:193), visible en el screenshot con "36%" centrado. Correcto, el dispositivo ownable ya aparece en la pantalla más visitada.
3. Contraste subido en los botones del selector (12%→22% + borde): VERIFICADO EN CÓDIGO (app/app/page.tsx:242-247, 259-264: `color-mix ... 22%` + borde 2px siempre visible, no solo al seleccionar) — pero NO VERIFICABLE VISUALMENTE esta ronda porque el screenshot entregado es el estado ya confirmado (ConfirmacionDia), no el selector. Pendiente confirmar en una próxima captura que muestre el estado sin marcar.
4. Racha agregada a la tarjeta de confirmación: VERIFICADO — "Llevas 5 días seguidos marcando tu Semáforo." visible en el screenshot y presente en código (app/app/page.tsx:298).
5. Consolidación tipográfica (11→12, 17→19): PARCIALMENTE VERIFICADO — ambos cambios puntuales están hechos (app/app/page.tsx:135 ahora 12px; :294 ahora 19px), pero el defecto de fondo (tamaños fuera de la escala de 4 declarada en FICHA-ARTE) sigue presente vía el h1 de 22px y el uso extendido de 13px (ver defecto #3 arriba) — no se resolvió la causa raíz, solo las 2 instancias citadas literalmente en la ronda 1.

## Detalle de rúbricas (ronda 2)
USABILIDAD 27/40 — h1:2 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:2 h10:3
(h1 y h9 bajan por el texto impreciso del aviso de guardado — defecto #2; h8 baja por el vacío muerto — defecto #1; h3 se mantiene en 3 pese a la falta de "cancelar" en modo edición porque el costo de equivocarse es bajo y no es una acción destructiva)

CRAFT 14/20 — jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:2
(identidad sube de 2→3 vs ronda 1 gracias al anillo de progreso ya visible en Hoy; encaje se mantiene bajo por el vacío muerto del final de la pantalla, que rompe el balance general de la composición)

Gate doble (≥36/40 y ≥16/20): NO CUMPLE. No pasa el TEST ANTI-CLON (paleta cream + azul-lila/verde/naranja no coincide con "Capítulo" ni "Umbral").

---

## Historial — Ronda 1 (2026-09-18, screenshot inválido)
Nota: el screenshot de esa ronda no correspondía al estado descrito (mostraba el selector sin marcar y racha "4 días" en vez del estado de confirmación con racha de 5 días) — ese veredicto quedó parcialmente invalidado por evidencia incorrecta, ver abajo tal como se emitió.

Usabilidad: 32/40 (sin desglose por heurística en esa ronda)
Craft: 12/20 (sin desglose por eje en esa ronda)
Veredicto: NO LISTA
Top defectos de ronda 1:
1. [lib/app.ts:51-58] localStorage podía fallar en silencio mostrando confirmación falsa → RESUELTO en ronda 2 (ver arriba, con matiz).
2. [Evidencia/proceso] Screenshot no coincidía con el estado declarado → CORREGIDO en ronda 2 (screenshot actual sí muestra el estado de confirmación).
3. [FICHA-ARTE vs código] El anillo de respiración (dispositivo ownable) no aparecía en Hoy, solo en /app/meta → RESUELTO en ronda 2 (ver arriba).
4. [app/app/page.tsx] Contraste bajo (~12%) en los botones del selector → CORREGIDO EN CÓDIGO en ronda 2 (22% + borde), pendiente de verificación visual (screenshot de esta ronda no muestra ese estado).
5. [Escala tipográfica] 6+ tamaños no declarados en FICHA-ARTE → PARCIALMENTE RESUELTO en ronda 2 (2 de 3 instancias citadas corregidas; persiste el h1 de 22px y el uso extendido de 13px — ver defecto #3 de ronda 2 arriba).
