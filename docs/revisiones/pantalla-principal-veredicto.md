# VEREDICTO revisor-visual — Hoy (pantalla principal / M0)
Fecha: 2026-09-18 00:00
Screenshot: docs/revisiones/pantalla-principal-375.png
Usabilidad: 32/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [lib/app.ts:51-58, guardarEstadoApp] Si localStorage falla (modo privado/bloqueado), el check-in se pierde en silencio — el catch solo comenta "la sesión sigue en memoria" y la UI igual muestra la confirmación como si se hubiera guardado → mostrar un aviso visible ("No pudimos guardar tu registro") con reintento cuando falle la escritura.
2. [Evidencia/proceso] El screenshot entregado no corresponde al estado declarado (racha de 5 días con check-in de hoy ya hecho): muestra el selector sin marcar, racha "4 días" y el círculo de "V" (hoy) vacío en el resumen semanal → regenerar el screenshot con datos semilla que incluyan el check-in de hoy antes de la próxima revisión; el estado de confirmación (ConfirmacionDia) queda sin verificar visualmente.
3. [FICHA-ARTE vs código] El dispositivo ownable declarado ("el anillo de respiración... mismo gesto que el nombre de la app") no aparece en la pantalla que más se abre: app/app/page.tsx usa una barra lineal para la meta (líneas 176-183) y `AnilloProgreso` solo se usa en app/app/meta/page.tsx, no en Hoy → usar el anillo (aunque sea pequeño, en el chip de racha o en la vista previa de meta) en esta pantalla.
4. [app/app/page.tsx:229-247, botones del selector] El fondo de "Día tranquilo"/"Día de alerta" usa color-mix al 12% de accent-2/accent-3 sobre --surface (#FFFDF8) — la diferencia de luminancia contra la tarjeta es mínima (la única señal es el matiz, verde vs naranja pálidos), lo que falla el contraste ≥3:1 exigido al CTA héroe y perjudica a usuarios con daltonismo → subir el tinte a ≥20-25% o agregar un borde visible en reposo, no solo al seleccionar.
5. [Escala tipográfica] FICHA-ARTE.md declara 4 tamaños (34/19/15/12) pero la pantalla usa al menos 6 no declarados: 22px en el h1 "Hoy" (page.tsx:73), 17px en "Marcaste: ..." (page.tsx:269), 11px en las iniciales de día (components/app/ui.tsx:118) contra el label de 12px de la ficha → consolidar a los 4 tamaños de la ficha o ampliar formalmente la escala documentada.
