# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-paso2-375.png, onboarding-paso6-375.png, onboarding-celebracion-375.png)
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Todo el funnel, tokens de FICHA-ARTE.md] --text-secondary (#8C8172) sobre --bg (#FAF6EF) da ~3.55:1 de contraste, por debajo del mínimo 4.5:1 (Regla UX #10) para texto normal de 14px. Afecta todos los subtítulos bajo cada pregunta y probablemente --text-tertiary (aún más claro) en la frase de refuerzo y labels del SemanaPreview. Fix: oscurecer el token hasta ≥4.5:1 sobre el fondo crema.
2. [app/onboarding/page.tsx L206-230, celebración] La pantalla de celebración sigue siendo la más vacía del funnel pese al fix de ronda 11: contenido termina en ~y670px de 1136px totales, dejando ~430px (38%) de fondo plano antes del anillo decorativo. La frase de refuerzo agregada es un parche de copy que no reparte el espacio vertical disponible (el contenedor no usa flex-1/justify-center ni añade un bloque de valor real). Fix: centrar verticalmente el bloque o sumar contenido real (teaser del paywall) que ocupe ese tercio inferior.
3. [app/onboarding/page.tsx L41-45 + L202-247] Condición de carrera de ~700ms: al comprometerse(), el setTimeout hacia /paywall corre igual aunque el usuario toque "Atrás" (onBack sigue activo durante comprometido=true) — el back cambia el paso pero el router.push lo sobrescribe 700ms después, ignorando la intención de quedarse. Fix: ocultar/deshabilitar onBack cuando comprometido===true, o cancelar el timeout si el usuario navega.
4. [components/funnel/ui.tsx L174 y L246, app/onboarding/page.tsx L218] Confirmado: los 3 checkmarks usan bounce:0.15 (defecto de ronda 11 con bounce 0.4/0.5 SÍ resuelto, ya bajo el umbral "juguete" de 41-CRAFT-DE-ANIMACION >0.3). Nota menor: sigue 0.05 por encima del rango que FICHA-ARTE.md declara dos veces ("spring casi sin rebote 0–0.1"); visualmente imperceptible, no bloquea el veredicto por sí solo, pero desalinea el código del contrato de la ficha.
5. [H9, general] Sin evidencia en el código revisado de manejo de errores (fallo de localStorage en guardarRespuestas, fallo de navegación a /paywall). Riesgo bajo por ser flujo 100% local, pero no verificado.
