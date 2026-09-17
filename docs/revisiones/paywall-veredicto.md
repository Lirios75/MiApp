# VEREDICTO revisor-visual — Paywall (Respira) — Ronda 7
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png (+ docs/revisiones/paywall-cargando-375.png)
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Desglose Usabilidad /40
- h1 Visibilidad del estado del sistema: 3/4 — plan seleccionado da feedback inmediato (tinte+sombra), CTA cambia a "Un momento…" y el timeout muestra mensaje visible (h9-fix confirmado, línea `errorAvance` en app/paywall/page.tsx:252-256). Resta 1 punto: durante los 7s de espera el único cambio es la opacidad del botón (disabled:opacity-40) — sin spinner ni animación, el usuario no tiene señal de que algo sigue en curso hasta que aparece el mensaje a los 7s.
- h2 Lenguaje del usuario: 4/4 — cero jerga, cero inglés crudo, copy natural en todo el flujo.
- h3 Control y libertad: 3/4 — X y "Ahora no" abren `ConfirmSalir` (con "Seguir aquí"/"Salir sin guardar") cuando hay respuestas — bien. Resta 1 punto: la fase `cargando` (LoadingPlan, ~4.8s) no renderiza ningún header/X — cero forma de salir durante ese tramo (`app/paywall/page.tsx:110-116` retorna solo `<LoadingPlan>`, sin `FunnelHeader` ni botón de cierre).
- h4 Consistencia y estándares: 3/4 — el botón X ahora tiene `whileTap` igual que `FunnelHeader` (fix confirmado), `Hairline` usa los mismos tokens del kit. Resta 1 punto: la garantía se nombra distinto que en la landing — paywall dice "Garantía de 14 días sin culpa" (`app/paywall/page.tsx:278`) vs. landing "la Garantía de los **Primeros** 14 Días Sin Culpa" (`app/page.tsx:139`, Title Case + "Primeros"). Es el mismo concepto con dos nombres — mejor que la ronda 6 pero todavía no es el mismo string.
- h5 Prevención de errores: 4/4 — plan Anual preseleccionado por defecto, `if (avanzando) return;` evita doble-tap (`app/paywall/page.tsx:67`), sin inputs libres que puedan fallar.
- h6 Reconocer mejor que recordar: 4/4 — precios, timeline de cobro y garantía todos visibles a la vez; nada que el usuario deba recordar de otra pantalla.
- h7 Flexibilidad y eficiencia (verificado en código): 2/4 — no hay atajos de teclado ni forma de saltar la animación de carga para quien vuelve a ver el paywall; `FunnelButton` y los botones de plan no definen `focus-visible` propio (a diferencia de `OptionChip`, que sí lo tiene en `components/funnel/ui.tsx:138`) — navegación por teclado inconsistente entre componentes del mismo kit.
- h8 Estético y minimalista: 2/4 — 1 sola acción primaria, bien. Pero el screenshot completo mide ~1112px CSS de alto contra un viewport típico de ~812px: el CTA queda fuera de la vista inicial (~88% del scroll) y no hay CTA sticky (a diferencia del kit de landing, que sí tiene `<StickyCtaMobile>` en `components/landing/ui.tsx:186`). Además el mensaje "sin cobro sorpresa / cancela cuando quieras" se repite 3 veces con distinta redacción (timeline nodo 2 y 3 en líneas 228-229, y la línea suelta en 260-262) — no cada elemento se gana claramente su lugar.
- h9 Errores claros y con solución: 4/4 — fix confirmado línea por línea: `errorAvance` muestra "Esto está tardando más de lo normal. Vuelve a intentarlo — si sigue sin avanzar, revisa tu conexión." (qué pasó + qué hacer, sin jerga). Retry funcional (`setErrorAvance(false)` al reintentar).
- h10 Ayuda contextual: 3/4 — headline y value stack personalizados con las respuestas reales del onboarding (`leerRespuestas()`), el loading educa sobre qué está pasando. No es un empty state pero cumple la función de orientar.

## Desglose Craft /20
- Jerarquía: 3/4 — headline 28px + acento, precios 20px, cuerpo 13-16px, labels 12-13px: funciona pero son casi 4 tamaños compitiendo, no 3 nítidos.
- Profundidad: 3/4 — `FunnelFondo` compartido confirmado (fix real: mismo componente en `FunnelScreen` y en el paywall, `components/funnel/ui.tsx:170-220`), 3 superficies (base/surface/surface-2 hundido) presentes en código, pero en el screenshot el degradé superior se percibe casi plano — se nota más en el anillo tras el timeline que en el resto de la pantalla.
- Identidad ownable: 3/4 — Nunito, anillo de marca, checks custom, hairline degradé en la card Anual (fix confirmado: `<Hairline emphasis={plan === 'anual'}>` en `app/paywall/page.tsx:176`). Pero el "Semáforo del Gasto" — el mecanismo que da nombre a la app y aparece 2 veces en el propio copy de esta pantalla — no tiene NINGUNA representación visual (ni rojo/ámbar/verde, la 2ª y 3ª nota de FICHA-ARTE.md líneas 26-27): toda la pantalla es monocromática en azul-lila. Se pierde el dispositivo más ownable que tiene el producto justo en la pantalla que lo vende.
- Movimiento: 4/4 (verificado en código) — stagger de entrada (`Bloque`, indice*0.07), conteo de % en el anillo de carga (`LoadingPlan.tsx:33`), anillo que se dibuja (`strokeDashoffset` animado), tap <150ms en todos los botones (`whileTap`), modal `ConfirmSalir` con fade+scale, `useReducedMotion` respetado en los 5 archivos revisados.
- Encaje óptico: 3/4 — `tabular-nums` en precios y porcentaje, radios consistentes (`--radius-card`/`--radius-button` en todas las cards y botones), padding simétrico (`p-5`). El badge "5 MESES GRATIS" se recorta bien sobre el hairline. Nada roto, pero nada sobresaliente tampoco.

## Desglose Copy /20 (trazado a FICHA-AVATAR.md)
- Idea única dominante: 4/4 — todo el copy gira en "Semáforo del Gasto" bautizado, repetido en headline, subtítulo y value stack.
- Especificidad y prueba: 3/4 — "Ahorras ~40% vs. mensual" es verificable (49.99 vs 83.88 = 40.4%, matemática correcta); "5 MESES GRATIS" es una redondeo razonable (4.85 meses reales). Cero prueba social/testimonio en esta pantalla — aceptable en un paywall post-quiz, pero no suma puntos de prueba.
- Emoción/dolor real: 4/4 — el subtítulo «Para que no vuelvas a decir "gasto y no sé en qué se me fue"» es casi cita literal del dolor #1 (★, el marcado como principal) de FICHA-AVATAR.md línea 22.
- Claridad de oferta: 4/4 — timeline día a día (Hoy/Día 5/Día 7) con monto exacto de cobro, plan y precio siempre visibles sin tener que releer.
- Dirección a una acción: 4/4 — un solo CTA primario, "Ahora no" claramente secundario y sin competir visualmente.
- Sub-check garantía nombrada: PASA (nombre + plazo presentes) pero con la inconsistencia de naming ya anotada en h4.

## TOP DEFECTOS (máx 5)
1. [Pantalla completa de planes, `app/paywall/page.tsx:118-283`] El CTA principal queda fuera del viewport inicial (~1112px de alto vs ~812px de viewport, CTA a ~88% del scroll) y no existe un CTA sticky de respaldo → agregar una barra CTA fija inferior (reusar el patrón de `StickyCtaMobile` en `components/landing/ui.tsx:186`) o comprimir el contenido para que el CTA entre en el primer scroll.
2. [`app/paywall/page.tsx:278` vs `app/page.tsx:139`] La garantía se nombra distinto en paywall ("Garantía de 14 días sin culpa") y en landing ("la Garantía de los Primeros 14 Días Sin Culpa") → exportar el nombre completo como constante en `lib/pricing.ts` y usarlo literal en ambos archivos.
3. [Toda la pantalla de planes] El "Semáforo del Gasto" —el mecanismo bautizado que da nombre a la pantalla— no tiene ninguna representación visual de semáforo (rojo/ámbar/verde, ya definidos en FICHA-ARTE.md líneas 26-27) → agregar un chip/ícono de 3 puntos junto al headline o en el value stack.
4. [`app/paywall/page.tsx:248-256`, botón `FunnelButton`] Durante los 7s de "Un momento…" no hay ningún indicador de progreso, solo opacidad reducida — se siente colgado hasta que aparece el mensaje de error → sumar un spinner/dots animados junto al texto mientras `avanzando` es true.
5. [`app/paywall/page.tsx:110-116` + `LoadingPlan.tsx`] La fase de carga (~4.8s) no renderiza ningún header ni botón de salida — cero forma de cancelar/cerrar durante ese tramo → agregar al menos un X discreto arriba, igual que en el resto del funnel.
