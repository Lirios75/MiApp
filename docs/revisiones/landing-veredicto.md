# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Hero.tsx — encabezados de sección "¿Te suena?"/"Nota el patrón..."/"Tu semana, sin culpa"/"Empieza gratis..."/FAQ] las 5 secciones siguen el mismo patrón Kicker+H2 sin variación de composición, se pierde el progreso narrativo Problema→Agitación→Solución→Oferta → fix: tratamiento distinto en la sección Solución (chip del mecanismo más grande o H2 partido con jerarquía de color). No bloqueante.
2. [CtaButton "Quiero mi primer check-in" vs. sección Solución "el Semáforo del Gasto"] el mecanismo bautizado y el CTA siguen sin conectarse en el mismo enunciado → fix: "Quiero ver mi Semáforo del Gasto". No bloqueante.
3. [Anglicismo "check-in" repetido ~10 veces] único término en inglés crudo de una página en español, no está en el léxico de FICHA-AVATAR.md → fix: término propio ligado al Semáforo, al menos en el CTA principal. No bloqueante.
4. [Oferta.tsx — eje Encaje, card anual] verificar a resolución completa que el badge de trial + el badge "más ahorro" sobre la card anual no compitan visualmente entre sí (dos pills apiladas cerca del borde superior) → fix: confirmar espaciado ≥8px entre ambos badges o fusionarlos en una sola línea.
5. [Hero.tsx EcoAnillo, opacity-[0.12]] mejora confirmada (antes 6% y estático) pero sigue siendo un elemento de "ojo entrenado": en un vistazo casual un usuario promedio probablemente no lo registra como el mismo dispositivo del logo → no bloqueante; si se busca identidad más contundente, subir a ~16-18% o sumar un segundo trazo concéntrico más fino.
