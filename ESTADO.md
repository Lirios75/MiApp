# ESTADO — Respira
Última actualización: 2026-09-18 | Sesión actual: 5

⏸️ CHECKPOINT — Sesión 5 EN CURSO (app interna). Las 4 pantallas construidas y verificadas
(tsc ✓ · build ✓ · capturas reales a 375px con datos de ejemplo en docs/revisiones/vivo/):
Hoy (`/app`), Semana (`/app/semana`), Tu meta (`/app/meta`), Cuenta (`/app/cuenta`).
Persistencia local (localStorage vía `lib/app.ts`) — Supabase real es Sesión 6.
Paso actual: construida, PENDIENTE de que la usuaria vea las capturas y decida si pide la
revisión automática del revisor-visual en "Hoy" (pantalla principal, una de las 4 del dinero)
o avanza así, siguiendo el mismo criterio que aplicó en onboarding (Sesión 4).
Pantallas creadas: Hoy · Semana · Tu meta · Cuenta.
Protagonista de cada pantalla: Hoy = marcar el Semáforo del día · Semana = tendencia de los
últimos días/semanas · Tu meta = avance de la meta elegida en el onboarding · Cuenta = plan y
prueba gratis.
Acción primaria: Hoy = elegir "día tranquilo/alerta" · Semana = navegar entre semanas ·
Tu meta = registrar avance (o crear la meta la primera vez) · Cuenta = cerrar sesión.
Qué NO se construyó aún: servicios externos (Supabase/auth real), notificaciones push reales
(el toggle de Cuenta es solo preferencia visual), historial de avances de la meta (solo el
número acumulado, sin log de cada registro).
Riesgos/pendientes: la continuidad entre el "compromiso" del onboarding y el primer check-in
real de Hoy es deliberadamente independiente (el onboarding no fuerza un estado de ánimo) —
ver nota en Problemas conocidos si se quiere revisar. Faltan estados de error/offline explícitos
en los formularios de Meta (validación mínima con `required`/`min`, sin mensaje de error propio).
Siguiente paso exacto: mostrarle las capturas a la usuaria y esperar su decisión (revisor-visual
en Hoy, o avanzar a Sesión 6 — servicios externos).

## Sesiones anteriores (resumen)
Sesión 4 CERRADA (2026-09-18). Paywall CERTIFICADO ✅ (37/40 · 20/20 · 19/20). Onboarding
APROBADO POR LA USUARIA EN SUSTANCIA (16ª pasada del revisor: 29/40 usabilidad · 17/20 craft —
la usuaria vio capturas reales en vivo a 375px, entendió los 5 pendientes en simple y decidió
avanzar sin seguir iterando; detalle en docs/revisiones/onboarding-veredicto.md, sección
"Decisión de la usuaria"). La familia de bugs de timer/rutas de escape (rondas 13-16) quedó
CERRADA y VERIFICADA — no volver a tocar salvo que reaparezca. Quedan 5 pendientes conocidos NO
bloqueantes en onboarding (ver Problemas conocidos). Login construido (pantalla secundaria).
NOTA METODOLÓGICA (sigue vigente): commitear SIEMPRE antes de lanzar el revisor-visual;
verificar fixes de "control y libertad" con prueba automatizada end-to-end antes de relanzar.

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
- Estado de la secuencia: Landing, Onboarding, Paywall y Login construidos y aprobados (ver Puertas de etapa). Siguiente: App interna (Sesión 5).
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida y aprobada por el usuario en sustancia, PENDIENTE de certificación formal del revisor-visual hasta la Sesión 5 — protagonista: el Semáforo del Gasto — CTA primario: "Quiero mi primer registro" → `/onboarding` (hoy es un placeholder honesto "en construcción"; la Sesión 4 la reemplaza por el flujo real)
- Onboarding: construida y APROBADA POR LA USUARIA EN SUSTANCIA (Sesión 4, cerrada 2026-09-18)
- Paywall: CERTIFICADA ✅ por el revisor-visual (Sesión 4, cerrada 2026-09-18)
- Login/Auth: construida (UI completa, magic link SIMULADO — Supabase Auth real se conecta en Sesión 6), no requiere revisor obligatorio
- App interna: 4 pantallas construidas (Hoy, Semana, Tu meta, Cuenta) — PENDIENTE de que la usuaria vea las capturas y decida sobre la revisión del revisor-visual en Hoy (la pantalla principal). Persistencia local (Supabase real en Sesión 6).
- Servicios externos: pendiente

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: APROBADA POR EL USUARIO EN SUSTANCIA, PENDIENTE de certificación formal del revisor-visual — evidencia: tsc ✓ build ✓ dev ✓ · screenshot docs/revisiones/landing-375.png · veredicto actual en docs/revisiones/landing-veredicto.md = NO LISTA (usabilidad 31/40 · craft 15/20 · copy 19/20, 7ª pasada). El techo restante es estructural (2 excepciones de identidad que el usuario decidió mantener + placeholders de app real que no existe hasta la Sesión 5) — el usuario, informado del detalle exacto, decidió avanzar así. No re-abrir esta decisión sin que el usuario lo pida.
- Onboarding: APROBADO POR LA USUARIA EN SUSTANCIA (2026-09-18) — evidencia: tsc ✓ build ✓ · flujo completo probado en navegador · 16 pasadas del revisor-visual (última: usabilidad 29/40, craft 17/20 — craft sí pasa, usabilidad no alcanza el gate ≥36/40) · veredicto en docs/revisiones/onboarding-veredicto.md · capturas en vivo a 375px en docs/revisiones/vivo/. La usuaria vio las capturas reales, entendió los 5 pendientes conocidos (ver Problemas conocidos) y decidió avanzar sin seguir iterando — no re-abrir sin que ella lo pida.
- Paywall: CERTIFICADA ✅ (12ª pasada del revisor-visual, 2026-09-18) — usabilidad 37/40 · craft 20/20 · copy 19/20 (gate ≥36/40, ≥16/20, ≥16/20 sin ejes ≤2, todos superados). Evidencia: tsc ✓ build ✓ · screenshot docs/revisiones/paywall-375.png (+ paywall-cargando-375.png) · veredicto en docs/revisiones/paywall-veredicto.md = LISTA. Historial: 12 rondas, empezando en 29/40 (ronda 4-ish) hasta cerrar con fixes de accesibilidad (ARIA en selector de plan, aria-label unificado, hairline consistente entre planes, escala tipográfica de 4 niveles). Quedan 4 notas de refinamiento fino no bloqueantes (ver veredicto): tamaño de ícono X levemente distinto entre fases, aria-label "Cerrar" del paywall no se propagó al "Salir" de FunnelHeader (onboarding) — no bloqueante, no re-abrir sin pedido del usuario.
- Login/Auth: construida — evidencia: tsc ✓ build ✓ · estados idle/enviando/enviado probados en navegador · screenshot docs/revisiones/entrar-375.png · sin revisor (pantalla secundaria, no es de las 4 del dinero) · magic link SIMULADO, sin backend real todavía (Sesión 6)
- App interna: construida (Hoy, Semana, Tu meta, Cuenta), PENDIENTE de decisión de la usuaria — evidencia: tsc ✓ build ✓ · capturas reales a 375px con datos de ejemplo en docs/revisiones/vivo/ (+ copias canónicas: pantalla-principal-375.png, semana-375.png, meta-375.png, cuenta-375.png) · flujo probado (marcar Semáforo, navegar semanas, crear/registrar meta en ambos modos, cerrar sesión) · revisor-visual AÚN NO lanzado en Hoy (pantalla principal) — pendiente de que la usuaria decida si lo pide, mismo criterio que se usó en onboarding.
- Servicios externos: bloqueados

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js 16 App Router (React 19, Turbopack) — landing con SEO/contenido orgánico + API routes para webhook de Hotmart, y duda entre Vite/Next resuelta por la regla del stack a favor de Next. Scaffold hecho el 2026-09-17 según 51-STACK-PINEADO.md.
- `next.config.ts`: `agentRules: false` — Next 16 auto-genera un bloque de reglas dentro de AGENTS.md al correr `next dev`/`build`; como AGENTS.md de este proyecto es el archivo de reglas del SO, se desactivó esa función para que no lo modifique.
- Auth: Supabase Auth, passwordless (magic link) — sin fricción para audiencia no técnica y escéptica. (Aún no instalado — se conecta en Sesión 6.)
- Modelo de datos (borrador, a migrar a Supabase en Sesión 6): `usuarios`, `checkins_diarios` (estado tranquilo/alerta + fecha, sin nota libre — se simplificó: el "tip" es contenido del sistema, no un campo del usuario), `metas` (tipo, modo monto/hábito, objetivo, actual) — todas con RLS por `(select auth.uid())`. La racha NO es una tabla propia: se DERIVA de `checkins_diarios` contando días consecutivos hacia atrás (ver `calcularRacha` en `lib/app.ts`) — más simple y sin riesgo de desincronizarse; mantener esta decisión al diseñar el esquema real.
- Sesión 5 implementó esto en local (localStorage, `lib/app.ts`) como prototipo de UX — la migración 1:1 a Supabase queda para Sesión 6.
- Features del MVP (del usuario): (1) check-in diario emoción/dinero, (2) 1 meta activa de ahorro/deuda/hábito con registro manual, (3) racha/progreso visual, (4) tip/reflexión corta diaria. Fuera del MVP: conexión bancaria, metas múltiples simultáneas, comunidad/social, gamificación compleja.
- Idioma UI: español LATAM neutro, mono-idioma.
- Kit de landing: `plantillas-codigo/landing/` copiado a `components/landing/` sin modificar los `.tsx` — solo se tematizó `tokens.css` (Nunito, azul-lila `#5468D4`, verde `#2E9E6B`, crema `#FAF6EF`, radios 22/16). Copy marcado en `docs/copy/landing.md`.

## Nombre — CONFIRMADO
- Nombre definitivo: **Respira**. Confirmado por el usuario el 2026-09-17.
- Pendiente (acción del usuario, no bloqueante): verificar disponibilidad oficial en SIC (Colombia) / IMPI (México) antes de comprar dominio o lanzar públicamente.

## Sesiones completadas ✅
- Sesión 1 — Validación, avatar, monetización, arquitectura y nombre — cerrada 2026-09-17.
- Sesión 2 — Identidad visual (FICHA-ARTE.md aprobada, dirección B "Respira en calma") — cerrada 2026-09-17.
- Sesión 3 — Página de ventas (10 secciones) — cerrada 2026-09-17. Nota: tras el cierre, el usuario pidió 5 ajustes (registro/emojis/colores/garantía) que reabrieron 7 pasadas de revisión; el veredicto final quedó NO LISTA por un techo estructural (ver Problemas conocidos) que el usuario decidió aceptar en vez de seguir corrigiendo.
- Sesión 4 — Onboarding, paywall y login — cerrada 2026-09-18. Paywall CERTIFICADO ✅ por el revisor-visual (37/40 · 20/20 · 19/20). Onboarding APROBADO POR LA USUARIA EN SUSTANCIA tras 16 pasadas (29/40 usabilidad, techo no bloqueante — ver Problemas conocidos) — la usuaria vio capturas reales del estado actual y decidió avanzar sin seguir iterando. Login construido como pantalla secundaria.

## Sesión en progreso 🔧
- Sesión 5 (código construido y verificado, PENDIENTE de la decisión de la usuaria) — app interna: Hoy, Semana, Tu meta, Cuenta.

## Próximas sesiones 📋
- Sesión 6: servicios externos (GitHub ya está, falta Supabase real, IA si aplica, Vercel, Resend, dominio, Hotmart) — ahí se reemplazan los placeholders del carrusel de la landing por screenshots reales de la app.

## Problemas conocidos ⚠️
- onboarding: APROBADO POR LA USUARIA EN SUSTANCIA (ver "Puertas de etapa") tras 16 pasadas del revisor-visual. Quedan 5 pendientes conocidos, NO bloqueantes, aceptados así por la usuaria el 2026-09-18 (detalle completo en docs/revisiones/onboarding-veredicto.md, sección "Decisión de la usuaria"):
  1. Botón "Salir sin guardar" del aviso de salida no cambia a "Salir" cuando ya te comprometiste — contradice el mensaje de arriba ("tu compromiso ya quedó guardado").
  2. Las 2 pantallas del compromiso (antes de sostener el botón, y la de "¡Listo, quedó registrado!") tienen casi la mitad de la pantalla vacía arriba del título — confirmado con capturas reales en docs/revisiones/vivo/.
  3. Sostener el botón para comprometerse es un punto sin retorno a las preguntas anteriores, y nada lo avisa antes de soltar el dedo.
  4. La barra de progreso llega a 100% antes de completar el gesto de sostener — comunica "ya terminaste" cuando falta el paso más importante.
  5. El botón "Seguir aquí" del aviso de salida, cuando ya te comprometiste, en realidad te lleva a la pantalla de planes — el texto no calza con la acción.
  No re-abrir esta pantalla ni relanzar el revisor sobre ella sin que la usuaria lo pida.
- veredicto paywall: CERTIFICADO ✅ — ver "Puertas de etapa". Ya no es un problema pendiente.
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
