# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 0, zona bajo el 4º chip hasta el pie de pantalla] El mesh radial + eco del anillo (agregados en FunnelScreen para resolver el vacío inferior) NO son perceptibles en el screenshot — el 40-50% inferior sigue leyéndose plano y vacío, igual que en la pasada anterior. → Subir la opacidad/tamaño del mesh y del eco (o revisar si un overflow-hidden/stacking del padre recorta el SVG con -z-10), y RE-CAPTURAR para confirmar visualmente antes de declarar el defecto resuelto — verificar por DOM no sustituye el screenshot.
2. [Toda la pantalla del quiz] Cero atajos/aceleradores para el usuario avanzado (heurística 7): solo tap, sin foco de teclado visible ni Enter documentado para confirmar selección. → Agregar anillo focus-visible + confirmar con Enter cuando el chip tiene foco de teclado.
3. [Paso 3 "¿Ya intentaste controlar tus gastos antes?" y Paso 5 "¿Cuál es tu meta principal?"] Rompen el patrón de línea de contexto que sí tienen los pasos 0 y 2 (mismo tipo de pantalla: título + lista de chips) — inconsistencia menor pero visible al recorrer el funnel completo. → Agregar la misma línea de contexto de 1 renglón a los pasos 3 y 5.
4. [Toda la pantalla] Con el mesh no perceptible, la profundidad se queda en 2 niveles (fondo plano + card con sombra sutil) en vez de los 3 documentados en FICHA-ARTE ("sombras suaves tintadas" + fondo con mesh). → Mismo fix que el defecto 1; si tras subir la opacidad sigue sin notarse, usar un tratamiento más contundente en la franja baja.
