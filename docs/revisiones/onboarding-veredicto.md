# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Logo (header, esquina sup. izq.) sigue leyéndose como spinner de carga: la forma en reposo (anillo al 75%, arco incompleto) es idéntica a un loader a medio camino; el fix solo aceleró la animación (0.9s→0.35s) sin cambiar la forma que causa la confusión, y queda pegado a una barra de progreso real que refuerza la lectura de "algo está cargando". 2) El vacío muerto no se eliminó, se trasladó: los 4 chips terminan en ~60% de la altura y el ~40% inferior queda cream sólido sin ningún elemento — mismo síntoma (aire muerto) en otra posición. 3) Fondo de un solo fill plano (#FAF6EF) sin el mesh/tinte de profundidad que pide FICHA-ARTE; solo existe un nivel (chip elevado con shadow-1), falta base con textura y no hay nivel hundido — eje profundidad no pasa el gate. 4) Inconsistencia de ayuda contextual entre pasos: el paso 2 explica por qué se pregunta ("Así ajustamos cuándo te recordamos...") pero el paso 0 (esta pantalla) no da ningún contexto de por qué se pregunta esto primero. 5) La ficha que sustenta la excepción de "presupuesto" (FICHA-AVATAR.md) sigue en estado BORRADOR / "Aprobada por el usuario: NO" — la traza de copy de esta pantalla descansa sobre una ficha no cerrada.
