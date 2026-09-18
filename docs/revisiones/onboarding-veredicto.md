# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-paso2-375.png, onboarding-paso6-375.png, onboarding-celebracion-375.png)
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (Nielsen /4 c/u):
h1 Visibilidad del estado: 3 — feedback consistente (chip marcado, barra de progreso animada, anillo+aria-live del HoldButton throttled a pasos de 20%); sin indicador explícito durante los 700ms antes de /paywall (la propia celebración hace de feedback).
h2 Lenguaje del usuario: 4 — copy 100% humano, sin jerga, en español LATAM neutro.
h3 Control y libertad: 3 — ConfirmSalir con focus-trap + Escape=quedarse está bien resuelto; PERO ver defecto #1 (control sin confirmar sigue vivo, solo se movió de sitio).
h4 Consistencia: 3 — chips/botones/radios uniformes en las 4 capturas; el único hueco es documental (ver defecto #3), no de render.
h5 Prevención de errores: 3 — OptionChip bloquea doble-tap durante el auto-avance (estado `marcando`), HoldButton evita reinicio por key-repeat; no hay debounce explícito en "Continuar" pero el riesgo es bajo.
h6 Reconocer vs recordar: 4 — VistaSemaforo reintroduce el mecanismo en cada pregunta, SemanaPreview muestra la semana completa sin pedir memoria.
h7 Flexibilidad (verificado en código): 3 — Enter/Espacio alternativo en HoldButton, focus-visible en todo elemento interactivo, useReducedMotion aplicado de forma consistente en las 7 animaciones revisadas.
h8 Estético y minimalista: 3 — 1 acción primaria por pantalla en las 4 capturas; el desbalance vertical de la celebración (defecto #2) resta un punto.
h9 Errores con solución: 2 — sin cambios desde ronda 12: `guardarRespuestas` (lib/onboarding.ts L87-93) traga el error de localStorage en silencio, cero aviso al usuario si no se guardó.
h10 Ayuda contextual: 3 — VistaSemaforo enseña el mecanismo progresivamente, celebración explica el paso siguiente ("Repite esto 6 días más...").

Detalle craft (/4 c/u):
Jerarquía: 3 — 4 niveles legibles (28px display / 14-16px body / 12-13px label), consistente en las 4 capturas.
Profundidad: 3 — 3 superficies + mesh + anillo tintado da profundidad real; se debilita en la franja superior vacía de la celebración.
Identidad ownable: 3 — anillo de respiración + semáforo verde/naranja + Nunito redondeada es reconocible y no clona Capítulo/Umbral; el trazo del anillo decorativo por sí solo es un recurso común de blob-gradient (nota subjetiva, no bug).
Movimiento (código + reduced-motion): 3 — 6/7 baseline verificadas (stagger de chips, barra que se llena, tap <150ms en todos los botones, transición de paso, modal suave, celebración de hito); conteo de número héroe no aplica (no hay cifra en esta pantalla); reduced-motion cubierto en los 7 puntos revisados (HoldButton con pasos discretos, springs a duración reducida, etc.).
Encaje óptico: 3 — radios/paddings idénticos en toda la pantalla; el desbalance vertical de la celebración es el único desencaje visible a simple vista.

## Verificación puntual de los 3 defectos de ronda 12 + lo reportado en el pedido

1. **Contraste --text-secondary — RESUELTO en código, ronda 12 citó un valor ya viejo.**
   `components/landing/tokens.css` L27 tiene `--text-secondary: #6b6152` (el propio comentario documenta ~5.6-6:1), NO `#8c8172`. El usuario tiene razón: la cita de ronda 12 (#8c8172 → 3.55:1) es un falso positivo respecto al código actual — probablemente comparó contra el valor que sigue en `FICHA-ARTE.md` L24, no contra el token real. Pendiente solo de higiene documental (defecto #3 abajo).

2. **Celebración con flex-1/justify-center — CONFIRMADO en código, MEJORA PARCIAL en pantalla.**
   `app/onboarding/page.tsx` L211: `className="flex flex-1 flex-col items-center justify-center gap-4 text-center"` (antes era un div plano). Confirmado. En el screenshot el bloque (check + título + semana + caption) ya no cuelga pegado abajo, pero sigue leyéndose desplazado hacia la mitad-inferior con una franja plana notable entre el header y el ícono de check — el mesh radial superior (`FunnelFondo`, 14% de opacidad) es casi imperceptible sobre el crema. Es mejora real vs. el 38% medido en ronda 12, pero no un centrado que se perciba simétrico a simple vista.

3. **`onBack` retirado durante `comprometido` — LA CONDICIÓN DE CARRERA NO QUEDÓ CERRADA, SE MOVIÓ.**
   `app/onboarding/page.tsx` L205: `onBack={comprometido ? undefined : retroceder}` — confirmado, el botón "Atrás" ya no se pasa. PERO `FunnelHeader` (`components/funnel/ui.tsx` L31-45) cae al `else` del ternario cuando `onBack` es `undefined` y renderiza `<a href="/">` con el logo — un enlace real y funcional (visible en `onboarding-celebracion-375.png`: el círculo azul arriba-izquierda). Un tap ahí durante los 700ms de `comprometerse()` navega de inmediato a "/" por fuera del router de React, SIN pasar por `ConfirmSalir` (a diferencia de la X, que si abre el modal) — mismo tipo de bug que ronda 12, en un elemento distinto y con una consecuencia peor (pierde todo sin confirmar, no solo cambia de paso). NO puede darse por resuelto.

4. **Bounce 0.15 → 0.1 — RESUELTO, confirmado por grep en los 3 usos.**
   `components/funnel/ui.tsx` L174 (`OptionChip`) y L246 (`SemanaPreview`), `app/onboarding/page.tsx` L217 (celebración): los 3 usan `bounce: 0.1` ahora, dentro del rango 0-0.1 que `FICHA-ARTE.md` declara dos veces. Sin residuos de 0.15 en el flujo de onboarding (sí queda un `bounce: 0.4` en `components/funnel/LoadingPlan.tsx` L92, pero ese archivo vive en `/paywall`, fuera del alcance de esta pantalla).

## TOP DEFECTOS (máx 5)

1. [components/funnel/ui.tsx L31-45 + app/onboarding/page.tsx L205, pantalla de celebración] El fix de ronda 12 quitó el botón "Atrás" pero `FunnelHeader` cae a un `<a href="/">` con el logo cuando `onBack` es `undefined` — un enlace de navegación real, visible arriba-izquierda en `onboarding-celebracion-375.png`, que reabre la ventana de carrera de 700ms y además se salta `ConfirmSalir` por completo. Fix: durante `comprometido===true` renderizar un `<span>` no interactivo (sin `href`) en vez de caer al branch de logo-enlace.
2. [app/onboarding/page.tsx L206-229, celebración] El flex-1/justify-center mejoró el reparto vertical (confirmado en código) pero en pantalla el bloque de contenido sigue leyéndose desplazado hacia abajo, con una franja plana notable arriba del check (el mesh superior es casi invisible sobre crema). Fix: subir el "Repite esto 6 días más…" arriba del ícono o agrandar el bloque para que pese visualmente más en el centro real de la pantalla.
3. [FICHA-ARTE.md L24 vs components/landing/tokens.css L27] La ficha sigue citando `--text-secondary` como `#8C8172` (el valor que dio 3.55:1 en ronda 12); el código real ya usa `#6b6152` (~5.6-6:1, AA). El contraste EN PANTALLA está resuelto — es solo higiene: actualizar la ficha para que dejen de contradecirse (es "cosa juzgada", no debería documentar un valor que el código ya no usa).
4. [lib/onboarding.ts L87-93, H9] `guardarRespuestas` traga cualquier fallo de localStorage en silencio — sigue sin evidencia de aviso al usuario si sus respuestas no se guardaron, tal como se reportó en ronda 12. Fix: al menos loggear/mostrar un aviso no bloqueante si el `catch` se dispara.
5. [Eje 3, identidad — refinamiento subjetivo, no bug] El anillo decorativo de `FunnelFondo` es un trazo de blob-gradient genérico frecuente en apps fintech/wellness; funciona sostenido por el resto del sistema (semáforo, chips, Nunito) pero por sí solo no es tan distintivo. No bloquea el veredicto — queda como nota de pulido, no como defecto verificable.
