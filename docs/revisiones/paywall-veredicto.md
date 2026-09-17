# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Cards "Anual"/"Mensual" — selector de plan, app/paywall/page.tsx L138-177] Son <button> planos sin motion.whileTap (a diferencia de OptionChip/FunnelButton del mismo kit) → envolver en motion.button con whileTap={{ scale: 0.98 }} para feedback táctil consistente en toda la pantalla.
2. [Value-stack, plan cards, timeline — toda la pantalla] --shadow-1 (opacidad 0.06) es casi imperceptible a 375px; las 3 superficies elevadas se sienten casi al mismo plano que el fondo → usar --shadow-2 al menos en la card de plan seleccionada (Anual) para un 2º nivel de elevación real, no solo el borde de color.
3. [Gobernanza de copy, no visible en la captura pero bloqueante] FICHA-AVATAR.md sigue "Estado: BORRADOR" / "Aprobada por el usuario: NO", y la nueva línea de dolor ("Para que no vuelvas a decir «...»") ya se muestra en esta pantalla derivada de esa ficha sin aprobar → aprobar FICHA-AVATAR.md (o al menos las frases de dolor/deseo usadas) antes de declarar esta pantalla vendible.
4. [CTA "Empezar mis 7 días gratis" → onClick] No hay ningún patrón de error/reintento definido en el código para cuando falle la navegación o, a futuro, el checkout real (el comentario del archivo dice que se conecta en Sesión 6) → dejar al menos el patrón de error documentado en ESTADO.md antes de conectar Hotmart, para no llegar a ese momento sin diseño de error.
5. [X arriba-izquierda y "Ahora no" abajo] Ambos ejecutan exactamente router.push('/') — no hay forma de volver a editar las respuestas del quiz (dolor/meta) si el usuario duda antes de decidir → diferenciar los dos caminos o eliminar la redundancia.
