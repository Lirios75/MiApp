# VEREDICTO revisor-visual — planeador
Fecha: 2026-11-16 00:00
Screenshot: docs/revisiones/planeador-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: el aviso "No se pudo guardar" y los botones "Borrar" de confirmación usan texto casi-blanco (var(--bg)) sobre fondo naranja sólido (var(--accent-3) #E08A3C) con contraste medido ~2.5:1 (falla AA 4.5:1) — al pasar de "tinte sutil" a "fondo sólido" en esta ronda se ganó visibilidad de posición pero se perdió legibilidad · el nuevo AnilloSemana usa verde=hábitos / naranja=tareas, pero el check de tarea completada en "Tus tareas" (unas pantallas más abajo, mismo scroll) es VERDE — el mismo color que el anillo asigna a hábitos, no a tareas — y además el anillo dibuja arcos cerrados 0-360° en vez de la abertura de 270° que es la firma real de RespiraMark, por lo que se lee como un Activity Ring genérico con los 2 colores de marca encima, sin leyenda en pantalla que explique qué mide cada color · los títulos de tarjeta subieron a 16px, un tamaño que no existe en los 4 declarados por FICHA-ARTE (display 28-34/title 19-22/body 15/label 12-13) — funciona visualmente pero es un 5to tamaño no catalogado · la fila de chips de día en "Tus tareas" (L16...) se corta en el borde derecho sin ninguna pista de que hay más días (ni degradé ni flecha) — domingo queda escondido · heurística 7 (flexibilidad/atajos) sigue en el mismo nivel básico de rondas anteriores, no fue parte de esta tanda de fixes.
