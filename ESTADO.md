# ESTADO — Respira
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Sesión 4 EN CONSTRUCCIÓN (certificación PENDIENTE), 8ª pasada del revisor en curso para onboarding y paywall (commit 679525d pusheado). Progreso medido ronda a ronda: onboarding 29→31→30/40 usabilidad (oscilando, no mejora limpia) y 13→14→12/20 craft; paywall 32→33→32/40 usabilidad pero craft YA PASA (16/20) y copy YA PASA (19/20) desde la ronda 7 — el paywall está a un solo eje (usabilidad) del gate.
Hallazgo estructural de la ronda 6 (corregido y verificado, no solo descrito): el anillo/mesh de fondo NO era un límite del sandbox headless sino un bug real de CSS de stacking-context (`position:relative` con `z-index:auto` no crea contexto propio → el `bg-[var(--bg)]` del propio contenedor tapaba a sus hijos `-z-10`). Fix: `isolate` + `position:fixed`, extraído a `<FunnelFondo>` compartido (antes duplicado en 2 archivos). Mismo fix pendiente de aplicar a la landing (Hero `EcoAnillo`) si se vuelve a tocar esa pantalla.
Fixes de la ronda 7 (verificados, no solo descritos): `HoldButton` sin soporte de teclado (bloqueaba el funnel a usuarios de solo-teclado) → agregado onKeyDown/onKeyUp Enter/Espacio; reduced-motion sin feedback visual en el hold → setInterval en pasos discretos; el `justify-center` de la ronda 6 resultó matemáticamente equivalente a centrar (no resolvía el vacío, solo lo movía) → revertido a top-anchored, confiando en el fondo ya agrandado/animado; paywall: CTA fuera del viewport inicial (~88% del scroll, el defecto de mayor impacto medido) → ahora es una barra fija al fondo siempre visible; garantía alineada 100% con el texto de la landing; CTA con spinner real en vez de solo atenuarse; X de salida durante la carga; redundancia de "cancela cuando quieras" recortada de 3 menciones a 2.
NOTA METODOLÓGICA (aprendida en la ronda 6, sigue vigente): commitear SIEMPRE antes de lanzar el revisor-visual — si se lanza sobre cambios sin commitear, el veredicto puede analizar código desactualizado.
Siguiente acción exacta: leer los veredictos de la 8ª pasada. El paywall está cerca (falta solo usabilidad); el onboarding ha oscilado sin mejora clara en 3 rondas — si la 8ª tampoco muestra avance limpio, considerar presentarle al usuario la disyuntiva en vez de seguir iterando indefinidamente.

## Qué es esta app (3 líneas máximo)
App de hábito diario que acompaña a mujeres 25-35 LATAM a dejar de gastar por ansiedad: check-in emocional diario + seguimiento simple de 1-2 metas de ahorro/deuda, sin conectar cuenta bancaria. Freemium con suscripción mensual/anual.

## Promesa central
"Esta app ayuda a mujeres que gastan por ansiedad a sentir que controlan su dinero, sin conectar su banco ni llevar un presupuesto complicado, mediante un check-in emocional diario que las acompaña a entender por qué gastan antes de que vuelva a pasar."

## Reporte de validación (Sesión 1)
- Veredicto: Viable — trae su propio RESUMEN FINAL validado por el usuario (curso externo), se acepta como reporte de validación sin re-investigar desde cero.
- Apps de referencia: YNAB/Fintonic (queja: complejidad + conexión bancaria obligatoria) · Journals PDF de money mindset (queja: sin seguimiento, se abandona) · Habitica/apps de hábitos genéricas (queja: sin enfoque financiero real).
- Lo que los usuarios odian de la competencia (nuestra oportunidad): conexión bancaria obligatoria, complejidad de categorías, cero acompañamiento diario/emocional.
- Brecha LATAM confirmada: sí — money mindset en español activo solo en formato estático (cursos/journals), sin competidor app dedicado a este cruce dinero+emoción.
- Precio de referencia del mercado: journals digitales $8.99 (pago único) · apps de finanzas $5.99-13/mes (sin fuente propia con fecha — ver FICHA-MERCADO.md, pendiente de verificación propia).

## Dirección de Arte (Sesión 2 — CERRADA, cosa juzgada)
- FICHA-ARTE.md: APROBADA el 2026-09-17. Dirección elegida: **B "Respira en calma"**.
- ¿Hubo referencia visual del usuario?: NO — eligió que el agente proponga (opción 1 de LA PREGUNTA DE REFERENCIA).
- Brand kit: fondo `#FAF6EF` · acento primario `#5468D4` (azul-lila) + verde `#2E9E6B` (progreso) + naranja `#E08A3C` (racha/hito) · **Nunito** (una sola familia, redondeada y cálida — elegida por el usuario tras comparar con Sora y Fraunces+Instrument Sans) · radio 22/16 · dispositivo ownable: anillo de respiración.
- Modo: claro (derivado — rompe con el fintech oscuro institucional).
- Detalle completo, tabla de líderes y trazabilidad de las 2 rondas de ajuste: ver `FICHA-ARTE.md`.

## Avatar y venta (Sesión 1 — ficha creada, pendiente de completar con VoC real)
- FICHA-AVATAR.md: creada a partir del RESUMEN FINAL del usuario — estado BORRADOR (faltan ≥10 frases VoC con fuente verificable; las 5 dadas por el usuario cuentan como base pero sin fuente citable todavía).
- Resumen: Camila, 29 años, Bogotá/CDMX, ingreso $800-1800 USD/mes · dolor #1: "otra vez gasté sin darme cuenta y no sé en qué se me fue" · deseo #1: "ver mi cuenta sin que me dé ansiedad" · nivel de consciencia: consciente-del-problema, no de la solución.
- Landing: construida, PENDIENTE de certificación formal del revisor-visual (aprobada en sustancia por el usuario — ver Problemas conocidos) — las 10 secciones canónicas, copy trazado a esta ficha. Ver docs/copy/landing.md.
- Mecanismo bautizado: "el Semáforo del Gasto" (check-in de 1 toque que marca el día tranquilo/alerta antes de que el gasto se repita). Big Idea en docs/copy/landing.md.

## Estrategia de monetización (Sesión 1 — decidido, informado al usuario)
- Modelo: Freemium con suscripción (onboarding-first) — coherente con la matriz A-F del 02C para bienestar/hábitos B2C: la frecuencia diaria pide construir inversión emocional antes del paywall duro.
- Justificación: nicho de hábito diario + audiencia escéptica por intentos previos → conviene que sienta la primera victoria (primer check-in + racha) antes de pedir pago.
- Trial: 7 días (dato del usuario, coherente con benchmark del nicho — pendiente confirmar plazo real de Hotmart en FICHA-MERCADO §4).
- Pricing: $6.99/mes mensual | $49.99/año (~$4.16/mes) — dato del usuario, sin fuente propia con fecha todavía (FICHA-MERCADO §1 pendiente de verificación).

## Gamificación y retención (se documenta en Sesión 4, se construye en Sesión 5)
- Loop del hábito (Hooked) — propuesto, a confirmar en Sesión 1 técnica:
  Gatillo: notificación/hora del día → Acción: check-in emocional de 30s + registro de gasto/ahorro →
  Recompensa: reflejo del progreso (racha + barra de meta) + micro-insight del día →
  Inversión: la meta y el historial emocional crecen día a día (se pierden si abandona).
- Mecánica elegida: racha diaria + barra de progreso de 1-2 metas (sin XP/insignias elaboradas — el propio usuario descartó gamificación compleja en el MVP).
- Primera victoria (<5 min): primer check-in + primera meta con progreso visible.

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Landing construida, PENDIENTE de certificación formal (Sesión 3 — ver Problemas conocidos). Resto pendiente.
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida y aprobada por el usuario en sustancia, PENDIENTE de certificación formal del revisor-visual hasta la Sesión 5 — protagonista: el Semáforo del Gasto — CTA primario: "Quiero mi primer registro" → `/onboarding` (hoy es un placeholder honesto "en construcción"; la Sesión 4 la reemplaza por el flujo real)
- Onboarding: construida, PENDIENTE de verificación del revisor-visual (Sesión 4, en curso)
- Paywall: construida, PENDIENTE de verificación del revisor-visual (Sesión 4, en curso)
- Login/Auth: construida (UI completa, magic link SIMULADO — Supabase Auth real se conecta en Sesión 6), no requiere revisor obligatorio
- App interna: pendiente
- Servicios externos: pendiente

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: APROBADA POR EL USUARIO EN SUSTANCIA, PENDIENTE de certificación formal del revisor-visual — evidencia: tsc ✓ build ✓ dev ✓ · screenshot docs/revisiones/landing-375.png · veredicto actual en docs/revisiones/landing-veredicto.md = NO LISTA (usabilidad 31/40 · craft 15/20 · copy 19/20, 7ª pasada). El techo restante es estructural (2 excepciones de identidad que el usuario decidió mantener + placeholders de app real que no existe hasta la Sesión 5) — el usuario, informado del detalle exacto, decidió avanzar así. No re-abrir esta decisión sin que el usuario lo pida.
- Onboarding: construida, PENDIENTE — evidencia: tsc ✓ build ✓ · flujo completo probado en navegador (4 preguntas + 2 reconocimientos + compromiso, con lógica condicional verificada) · screenshot docs/revisiones/onboarding-375.png · veredicto en curso (1ª pasada del revisor-visual, obligatoria por ser plantilla nueva)
- Paywall: construida, PENDIENTE — evidencia: tsc ✓ build ✓ · loading personalizado con respuestas reales + planes + timeline de trial probados en navegador · screenshot docs/revisiones/paywall-375.png · veredicto en curso (1ª pasada del revisor-visual, obligatoria)
- Login/Auth: construida — evidencia: tsc ✓ build ✓ · estados idle/enviando/enviado probados en navegador · screenshot docs/revisiones/entrar-375.png · sin revisor (pantalla secundaria, no es de las 4 del dinero) · magic link SIMULADO, sin backend real todavía (Sesión 6)
- App interna: no iniciada
- Servicios externos: bloqueados

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js 16 App Router (React 19, Turbopack) — landing con SEO/contenido orgánico + API routes para webhook de Hotmart, y duda entre Vite/Next resuelta por la regla del stack a favor de Next. Scaffold hecho el 2026-09-17 según 51-STACK-PINEADO.md.
- `next.config.ts`: `agentRules: false` — Next 16 auto-genera un bloque de reglas dentro de AGENTS.md al correr `next dev`/`build`; como AGENTS.md de este proyecto es el archivo de reglas del SO, se desactivó esa función para que no lo modifique.
- Auth: Supabase Auth, passwordless (magic link) — sin fricción para audiencia no técnica y escéptica. (Aún no instalado — se conecta en Sesión 6.)
- Modelo de datos (borrador): `usuarios`, `checkins_diarios` (emoción + nota corta + fecha), `metas` (tipo ahorro/deuda, monto objetivo, monto actual), `rachas` (contador + última fecha activa) — todas con RLS por `(select auth.uid())`.
- Features del MVP (del usuario): (1) check-in diario emoción/dinero, (2) 1-2 metas de ahorro/deuda con registro manual, (3) racha/progreso visual, (4) tip/reflexión corta diaria. Fuera del MVP: conexión bancaria, metas múltiples simultáneas, comunidad/social, gamificación compleja.
- Idioma UI: español LATAM neutro, mono-idioma.
- Kit de landing: `plantillas-codigo/landing/` copiado a `components/landing/` sin modificar los `.tsx` — solo se tematizó `tokens.css` (Nunito, azul-lila `#5468D4`, verde `#2E9E6B`, crema `#FAF6EF`, radios 22/16). Copy marcado en `docs/copy/landing.md`.

## Nombre — CONFIRMADO
- Nombre definitivo: **Respira**. Confirmado por el usuario el 2026-09-17.
- Pendiente (acción del usuario, no bloqueante): verificar disponibilidad oficial en SIC (Colombia) / IMPI (México) antes de comprar dominio o lanzar públicamente.

## Sesiones completadas ✅
- Sesión 1 — Validación, avatar, monetización, arquitectura y nombre — cerrada 2026-09-17.
- Sesión 2 — Identidad visual (FICHA-ARTE.md aprobada, dirección B "Respira en calma") — cerrada 2026-09-17.
- Sesión 3 — Página de ventas (10 secciones) — cerrada 2026-09-17. Nota: tras el cierre, el usuario pidió 5 ajustes (registro/emojis/colores/garantía) que reabrieron 7 pasadas de revisión; el veredicto final quedó NO LISTA por un techo estructural (ver Problemas conocidos) que el usuario decidió aceptar en vez de seguir corrigiendo.

## Sesión en progreso 🔧
- Sesión 4 (código listo, certificación PENDIENTE) — onboarding, paywall y login. Código construido y verificado; esperando veredicto del revisor-visual antes de cerrar.

## Próximas sesiones 📋
- Sesión 4: onboarding, paywall y login.
- Sesión 5: app interna simplificada (ahí se toman los screenshots reales para el carrusel de la landing).

## Problemas conocidos ⚠️
- veredicto onboarding PENDIENTE de certificación formal (Sesión 4, en construcción) — última pasada leída (7ª): usabilidad 30/40, craft 12/20 — gate exige ≥36/40 y ≥16/20, sigue NO LISTA (ha oscilado 29→31→30/40 en 3 rondas, sin mejora limpia). Desde esa pasada se corrigió soporte de teclado en HoldButton, feedback visual en reduced-motion, y se revirtió el justify-center (era matemáticamente equivalente a centrar, no resolvía el vacío) — se relanzó una 8ª pasada, resultado aún no leído al momento de este checkpoint. No declarar esta pantalla "lista" hasta que el veredicto diga LISTA o el usuario acepte una disyuntiva explícita.
- veredicto paywall PENDIENTE de certificación formal (Sesión 4, en construcción) — última pasada leída (7ª): usabilidad 32/40 (gate ≥36/40) — craft 16/20 y copy 19/20 YA PASAN desde esta pasada, solo falta usabilidad. Desde esa pasada se corrigió el defecto de mayor impacto medido (CTA fuera del viewport inicial, ahora barra fija siempre visible), garantía alineada 100% con la landing, spinner real en el CTA, salida durante la carga, y redundancia de copy recortada — se relanzó una 8ª pasada, resultado aún no leído al momento de este checkpoint. No declarar esta pantalla "lista" hasta que el veredicto diga LISTA o el usuario acepte una disyuntiva explícita.
- veredicto landing PENDIENTE de certificación formal (7ª pasada del revisor-visual: usabilidad 31/40, craft 15/20 — gate exige ≥36/40 y ≥16/20; copy 19/20 sí pasa) — DECISIÓN FINAL DEL USUARIO (2026-09-17): se le presentó la disyuntiva completa (mantener "check-in diario" en Oferta + emojis a color en "¿Te suena?" vs. revertirlos para subir la nota) y respondió "dejar todo como está". Landing queda APROBADA POR EL USUARIO EN SUSTANCIA, la certificación formal queda PENDIENTE hasta la Sesión 5. Detalle de por qué el techo es estructural (para no repetir el análisis si se vuelve a tocar esta pantalla):
  - "Check-in diario" (excepción del usuario en Oferta) le cuesta a USABILIDAD ~2 puntos (heurística de lenguaje consistente).
  - Los emojis a color de "¿Te suena?" (excepción del usuario) le cuestan a CRAFT el punto exacto que separa 15/20 de 16/20 (el umbral) — es la única razón por la que craft no pasa.
  - Los placeholders de "la app por dentro" (Hero + carrusel, sin app real — Sesión 5 no empezada) le cuestan a USABILIDAD ~2-3 puntos más — esto no depende de esta pantalla, es scope de Sesión 5.
  - Aun revirtiendo las 2 excepciones, usabilidad solo llegaría a ~33/40 (sigue sin pasar) hasta que exista la app real — por eso no tiene sentido seguir iterando esta pantalla ahora.
  - NO re-abrir esta decisión ni volver a proponer revertir "check-in"/emojis sin que el usuario lo pida — ya se le explicó el costo exacto y eligió mantenerlos.
  - Anillo del Hero (18% de opacidad en código, confirmado): no se logró verificar visualmente en el PNG headless de este sandbox (posible limitación del renderer con z-index negativo bajo software rendering, no del valor en sí) — pendiente de re-verificar con navegador real si se vuelve a tocar esta pantalla. No bloqueante por sí solo.
- carrusel "La app por dentro": usa 4 placeholders honestos rotulados (Registro diario / Metas / Pantalla principal / Reporte semanal) porque la app interna todavía no existe — se reemplazan por screenshots reales al cerrar la Sesión 5 (regla dura de 19 §5). No declarar la landing "100% terminada" hasta ese reemplazo. El revisor sigue marcando esto como defecto en cada pasada aunque es una limitación conocida y aceptada mientras la Sesión 5 no exista.
- FICHA-MERCADO.md tiene varios campos "NO ENCONTRADO" — los precios/plazos que dio el usuario en el RESUMEN no traen fuente+fecha propia; se usan como punto de partida pero se marcan para verificación antes de fijar precio final en Hotmart.
- Garantía (footer/reembolsos): el piso legal dice "política de reembolso de Hotmart" SIN número de días porque Hotmart aún no está configurado (Sesión 6) — no prometer un plazo exacto hasta configurarlo.
- Garantía en 14 días (prueba en 7, 14>7 cumple la regla dura de 18-VENTA-HOTMART.md) — historial completo de la ida y vuelta 14→7→14 en FICHA-MERCADO.md §4.
- Páginas legales (privacidad/términos/reembolsos): son borrador funcional, les falta el nombre/razón social del responsable, el país de operación y confirmar el email de soporte real (hoy usan el provisional `hola@respira.app`) — ver "Pendientes del usuario".

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] (no bloqueante) Verificar "Respira" en el registro oficial de marcas (SIC/IMPI) antes de comprar dominio.

## Datos del responsable (para las páginas legales — confirmados por el usuario 2026-09-17)
- Responsable: Lina Rios · País: Colombia · Correo de soporte/legal: lina.rios@ikigaihumano.com (provisional hasta que exista un dominio propio — cuando se compre el dominio, cambiar a un correo con ese dominio en las 3 páginas legales + FooterLegal).

## Notas para la próxima sesión
- El usuario ya trae el RESUMEN FINAL validado — no se debe re-investigar mercado desde cero, solo completar los huecos de fuente+fecha en FICHA-MERCADO.md cuando se fije el precio definitivo.
