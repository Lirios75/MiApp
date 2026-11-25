# VEREDICTO revisor-visual — landing
Fecha: 2026-11-25 14:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Proceso de captura — toda la pantalla] El PNG entregado es full-page de 14314px de alto a 375px de ancho; a esa escala el texto fino (features de Oferta, copy exacto del Hero) no es legible con certeza para una verificación pixel a pixel — no se puede confirmar VISUALMENTE (solo por código) que los 3 fixes declarados (mockup real del Hero, "Registro diario", íconos SVG) se vean como dice el código en producción → recapturar por secciones (Hero, Problema+Agitación, Solución, AppPorDentro, Oferta, Garantía+FAQ, CtaFinal+Footer) en PNGs de ≤1600px cada uno antes de la próxima certificación. 2) [Heurística 7 — toda la pantalla] No hay un mini-nav de anclas visible (Precios/Preguntas) para saltar de sección; el único atajo es el StickyCtaMobile, invisible hasta hacer scroll → agregar 1-2 anclas de navegación rápida en el header. 3) [Heurística 9 — CTAs de toda la pantalla] Los CTA son <a> simples sin estado de "cargando" tras el tap, y no hay evidencia de qué pasa si /onboarding no carga → agregar micro-estado de carga (200-300ms) en CtaButton y verificar el caso de ruta caída. 4) [Heurística 3 — Oferta/CtaFinal] La única salida para alguien con cuenta ya creada es el link "Entrar" del header; en la sección de Oferta y CtaFinal (donde el usuario decide) no se repite esa salida → añadir enlace terciario "¿Ya tienes cuenta? Entra aquí" cerca del CTA de compra. 5) [Identidad — EcoAnillo del Hero, components/landing/Hero.tsx L17-46] El anillo decorativo de marca quedó en una pasada anterior marcado como "sin verificar con claridad" a 18% de opacidad y nunca se reconfirmó con una captura aislada del primer fold → resolver junto con el defecto #1 (recorte del Hero) antes de cerrar identidad visual.

## Notas de esta recertificación (2026-11-25)
Se re-evaluó tras 3 fixes reportados por el equipo desde la 7ª pasada (2026-09-17, 31/40 · 15/20 · 19/20):
"Registro diario" (revertido el anglicismo), emojis → íconos SVG en "¿Te suena?", y placeholders del
Hero/carrusel → capturas reales. Verificado en código (`app/page.tsx`, `components/landing/*.tsx`,
`components/landing/tokens.css`) que los 3 cambios están efectivamente implementados y consistentes
con FICHA-ARTE.md (tokens de color/radio/tipografía sin desvíos). El CTA héroe vivo pasa sus 4 anclas
(contraste ~4.66:1, whileTap 0.97 + hover, nunca disabled, alto 52-56px full-width mobile). Los 3
binarios de conversión (titular con énfasis, hairline+chips SVG sin emojis, secciones distinguibles)
pasan. Sin embargo, el puntaje de usabilidad NO sube lo suficiente para cruzar el gate: los 3 fixes
resuelven defectos puntuales, pero varias heurísticas (control y libertad, flexibilidad, prevención/
manejo de errores) siguen en nivel "funciona pero modesto" (2-3/4) de forma estructural, no por un
bug nuevo. Craft cruza el umbral (16/20) gracias al fix de emojis — identidad ya no se penaliza por
violar la regla de chips SVG. Limitación metodológica: el screenshot full-page de 14314px no permite
verificar con certeza visual el texto fino; la verificación de copy se apoyó en el código fuente.

---
(Historial previo conservado para auditoría)

# VEREDICTO revisor-visual — landing
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) [Hero, primer fold, justo bajo el CTA] Placeholder punteado con ícono de cámara y el texto "Sugerencia: captura de tu pantalla principal..." ocupa el espacio más prominente de la página inmediatamente después del CTA — cualquier visitante lo nota como "obra en construcción" en el primer segundo → reemplazar por una ilustración/mockup estilizado del anillo+racha (no una foto real, mientras la app no exista) para que no delate placeholder de desarrollador. 2) [AppPorDentro, "Así se ve por dentro"] Los 4 frames del carrusel son recuadros grises con solo el nombre de la pantalla (Registro diario/Metas/Pantalla principal/Reporte semanal), cero contenido real, en la sección cuya única función es demostrar el producto → mismo fix que el punto 1: mockup ilustrado con datos semilla, no placeholder gris. 3) [Oferta, primera línea de features en AMBOS planes Anual y Mensual] "Check-in diario sin conectar tu banco" usa un anglicismo crudo ("check-in") repetido dos veces en la sección de precios, mientras el resto del copy usa consistentemente "registro" (Hero, Solución, FAQ) → traducir a "Registro diario sin conectar tu banco" para unificar vocabulario y cumplir "0 inglés crudo en la UI". 4) [Problema, "¿Te suena?", los 4 chips de pregunta] Emojis a color (💸😰🔁😔) como ícono dentro del chip, mientras el resto del kit (Garantía, Hero) usa SVG monocromo (Lucide) — rompe el sistema de íconos de la página y viola la regla "chips SVG sin emojis en toda lista" que baja el Eje 3 de identidad → sustituir por Lucide/Phosphor en el mismo chip neutro. 5) [Hero, esquina superior derecha, EcoAnillo de fondo] Con la opacidad ya subida a 18% en el código, en el PNG revisado sigue sin distinguirse con claridad el anillo (dispositivo ownable de la marca) — no se penaliza como fix fallido (posible limitación del renderer headless reportada por el equipo), pero tampoco se puede acreditar visualmente todavía → volver a capturar con Playwright renderizando en navegador real (no software rendering) antes de la próxima revisión, para confirmar si el problema es del render o si aun así necesita subir más la opacidad/grosor del stroke.

## Actualización (2026-11-04) — estado real de los 5 defectos

De los 5 defectos de arriba, 4 ya están resueltos y 1 sigue abierto:
1. Placeholder del Hero → RESUELTO 2026-09-21 (mockup real de la app, ver ESTADO.md).
2. Placeholders del carrusel "Así se ve por dentro" → RESUELTO 2026-09-21 (mismo cambio).
3. "Check-in diario" → RESUELTO 2026-10-17 (ahora dice "Registro diario" en ambos planes).
4. Emojis a color en "¿Te suena?" → RESUELTO HOY (2026-11-04): reemplazados por íconos SVG de
   línea (mismo `IconChip` del resto del kit, `tone="muted"`) a pedido explícito de la usuaria.
   Cambiado en `components/landing/Problema.tsx` (interfaz `PreguntaProblema` ahora recibe
   `icon: LucideIcon` en vez de `emoji: string`) y `app/page.tsx` (Wallet/EyeOff/RotateCcw/Frown
   Verificado: tsc ✓ build ✓ · captura real a 375px en `docs/revisiones/landing-te-suena-iconos-375.png`.
5. EcoAnillo del Hero sigue sin verificarse con claridad — NO se tocó en esta pasada (la usuaria
   no lo pidió; solo pidió los emojis). Sigue como pendiente conocido, ver ESTADO.md.

No se relanzó el revisor-visual completo para este cambio — es un swap puntual de íconos dentro de
un chip ya certificado en su forma/tamaño (Garantía/Hero ya usan el mismo `IconChip`), no amerita
otra pasada completa. Pendiente: que la usuaria revise la captura real y confirme.
