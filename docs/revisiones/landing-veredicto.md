# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 16:10
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Eje 4 Movimiento — Hero.tsx líneas 71-77, el eco grande del anillo] es un `<svg>` plano sin `motion.circle`, con `strokeDashoffset="135"` fijo — no anima, a diferencia del RespiraMark del header que sí dibuja su trazo → la única instancia GRANDE del dispositivo ownable en toda la página sigue siendo estática → fix: reutilizar el hook de `RespiraMark.tsx` (useInView + motion.circle) también en este eco, mismo gesto de llenado, para que el movimiento y la identidad se refuercen en el mismo elemento en vez de vivir solo en un logo de 24px.
2. [Eje 3 Identidad — Hero.tsx línea 74, `opacity-[0.06]`] al 6% de opacidad sobre fondo crema (`#FAF6EF`)/blanco, el eco del anillo es prácticamente invisible en el screenshot real — el fix de "el dispositivo ownable se ve, no solo en 24px" no se percibe en la práctica aunque exista en el código → fix: subir a 10-14% de opacidad (o usar el acento 2ª nota con más contraste) hasta que sea perceptible al pasar la vista, sin competir con el copy.
3. [Encabezados de sección: "¿Te suena?", "Nota el patrón...", "Tu semana, sin culpa", "Empieza gratis...", "Lo que quizá te estás preguntando" — sin cambios desde la 2ª pasada] las 5 secciones siguen el mismo patrón Kicker+H2 sin ninguna variación de composición → se pierde la sensación de progreso narrativo (Problema→Agitación→Solución→Oferta) → fix: dar a la sección Solución un tratamiento distinto (chip del mecanismo más grande, o H2 partido con jerarquía de color) para marcar el punto de inflexión.
4. [CTA repetido "Quiero mi primer check-in" vs. sección Solución "el Semáforo del Gasto" — sin cambios] el mecanismo bautizado (Semáforo del Gasto) y la acción del CTA (check-in) siguen sin conectarse en el mismo enunciado → fix: "Quiero ver mi Semáforo del Gasto" o mencionar el semáforo en el subtítulo del hero.
5. [Anglicismo "check-in" repetido ~10 veces (CTA, Hero, Oferta, FAQ, StickyCtaMobile) — sin cambios] único término en inglés crudo de una página 100% en español, y no aparece en el léxico literal de FICHA-AVATAR.md → fix: evaluar un término propio ligado al Semáforo (p. ej. "marca del día") al menos en el CTA principal.
