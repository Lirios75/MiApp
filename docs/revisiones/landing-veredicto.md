# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 15:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Eje 4 Movimiento — toda la página] faltan 2 de las 7 animaciones baseline: ningún número (precios $4.16/$0.14/$6.99 en Oferta) cuenta al entrar, y el RespiraMark (el anillo ownable, ya dibujado como progreso con strokeDashoffset) queda completamente estático en Hero y Footer → fix: animar el trazo del anillo al montar/hacer scroll (Motion, animate strokeDashoffset) y usar count-up en los precios héroe de Oferta.
2. [Encabezados de sección: "¿Te suena?", "Nota el patrón...", "Tu semana, sin culpa", "Empieza gratis...", "Lo que quizá te estás preguntando"] los 5 usan el mismo patrón Kicker+H2 30-40px/bold sin ninguna variación de composición → al hacer scroll rápido todas las secciones "pesan" igual y se pierde la sensación de progreso narrativo (Problema→Agitación→Solución→Oferta) → fix: dar a la sección Solución (el giro de la venta) un tratamiento distinto (p.ej. el chip del mecanismo más grande, o el H2 partido en dos líneas con jerarquía de color) para que se lea como el punto de inflexión.
3. [Identidad ownable — todo el scroll de 7000px] el anillo de respiración (RespiraMark) solo aparece a 24px en el header y en el footer; en el resto de la página (Hero, CtaFinal, Oferta) no hay ningún eco visual del dispositivo, pese a haber espacio de sobra (fondos radiales genéricos en vez del anillo) → fix: reutilizar el anillo, más grande y sutil, como elemento decorativo de fondo en el Hero o en el bloque invertido de CtaFinal.
4. [Nombre del mecanismo: CTA "Quiero mi primer check-in" vs. sección Solución "el Semáforo del Gasto"] la página bautiza el mecanismo pero el CTA repetido en 5 lugares no lo nombra — dos etiquetas conviven ("check-in" como acción diaria, "Semáforo del Gasto" como marca) sin que el CTA conecte ambas → fix: acercar el CTA a la marca del mecanismo (p. ej. "Quiero ver mi Semáforo del Gasto" o mencionar el semáforo en el subtítulo del hero, no solo en la sección 4).
5. [Copy general: "check-in" se repite ~10 veces (CTA, Hero, Oferta, FAQ, StickyCtaMobile) sin traducir] es un anglicismo naturalizado en apps de hábitos pero no está en el léxico literal de FICHA-AVATAR.md (que usa "revisar mi cuenta", "marcar cómo me siento", nunca "check-in") → un ojo entrenado lo nota como la única palabra en inglés crudo de una página por lo demás 100% en el lenguaje de la usuaria → fix: evaluar reemplazar por un término propio ligado al Semáforo (p. ej. "marca del día") al menos en el CTA principal.
