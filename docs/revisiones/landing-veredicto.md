# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 14:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 27/40
Craft: 13/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA repetido: Hero, AppPorDentro, Oferta, CtaFinal, sticky + "Entrar" del header] apuntan a /onboarding y /entrar, rutas que no existen en app/ (no hay app/onboarding ni app/entrar ni not-found.tsx custom) → el botón más repetido de toda la página termina en el 404 genérico de Next → fix: publicar al menos un placeholder honesto en /onboarding y /entrar (o feature-flag el href) antes de dar la landing por "vendible".
2. [Texto secundario en toda la página: subtítulo del hero, párrafos de Agitación, pasos de Solución, respuestas del FAQ] usan --text-secondary #8C8172 sobre #FAF6EF/#FFFDF8 ≈ 3.55:1, por debajo del 4.5:1 AA que exige la Regla UX #10 → fix: oscurecer --text-secondary (p.ej. ~#7A6F60) sin salir de la familia cálida, y reverificar contraste tras el cambio.
3. [Sección "Así se ve por dentro" vs. secciones vecinas "El mecanismo" y "La oferta"] --surface (#FFFDF8) y --bg (#FAF6EF) difieren ~5-9 unidades RGB: la alternancia base/elevado es imperceptible a 375px, las secciones se funden en un mismo plano → fix: aumentar el salto de luminancia entre --bg y --surface o agregar un separador/hairline visible.
4. [Hero — placeholder del visual, único lugar donde se sugiere el dispositivo] el "anillo de respiración" (dispositivo ownable de FICHA-ARTE) no se ve dibujado en ningún punto real de la landing, solo se lo describe en el texto del placeholder ("...con el anillo de tu meta...") → fix: plantar un SVG simple del anillo en el hero, chips o CTA para que la identidad se vea, no solo se lea, aun sin el screenshot final de la app.
5. [Copy de los CTA: Hero/AppPorDentro/CtaFinal dicen "Quiero mi primer check-in"; Oferta-anual dice "Empezar mis 7 días gratis"; Oferta-mensual dice "Elegir mensual"] misma acción, tres redacciones distintas → diluye la "acción única repetida" que pide la rúbrica de copy → fix: unificar el verbo/beneficio (mantener "check-in"/"gratis" o el mismo verbo en 1ª persona) en las tres variantes.
