# ESTADO — Respira
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: usuario eligió que el agente proponga el diseño; se generó la comparativa A/B/C (`direcciones-abc.html`, screenshot en `docs/revisiones/direcciones-abc-full.png`) y `FICHA-ARTE.md` con las 3 opciones. / Siguiente acción exacta: esperar que el usuario elija A, B, C, combine o pida ajustes.

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

## Dirección de Arte (Sesión 2 — en curso)
- FICHA-ARTE.md: creada, con 3 opciones (A/B/C) — esperando elección del usuario para cerrarla.
- ¿Hubo referencia visual del usuario?: NO — eligió que el agente proponga (opción 1 de LA PREGUNTA DE REFERENCIA).
- Resumen de las 3 opciones: A "Claridad templada" (verde #178A54, Archivo/Instrument Sans, dato-héroe) · B "Respira en calma" (azul-lila #5468D4, Sentient/Switzer, anillo de respiración — recomendada) · C "Diario del dinero" (verde #2E9E6B + hito #F0A05A, Nunito, timeline).
- Modo: claro en las 3 (derivado — rompe con el fintech oscuro institucional).

## Avatar y venta (Sesión 1 — ficha creada, pendiente de completar con VoC real)
- FICHA-AVATAR.md: creada a partir del RESUMEN FINAL del usuario — estado BORRADOR (faltan ≥10 frases VoC con fuente verificable; las 5 dadas por el usuario cuentan como base pero sin fuente citable todavía).
- Resumen: Camila, 29 años, Bogotá/CDMX, ingreso $800-1800 USD/mes · dolor #1: "otra vez gasté sin darme cuenta y no sé en qué se me fue" · deseo #1: "ver mi cuenta sin que me dé ansiedad" · nivel de consciencia: consciente-del-problema, no de la solución.
- Landing: pendiente (Sesión 3) — sigue estructura canónica de 10 secciones (19).

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
- Estado de la secuencia: aún no arrancó ninguna etapa de construcción.
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: pendiente
- Onboarding: pendiente
- Paywall: pendiente
- Login/Auth: pendiente
- App interna: pendiente
- Servicios externos: pendiente

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: no iniciada
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
- App interna: no iniciada
- Servicios externos: bloqueados

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js App Router — landing con SEO/contenido orgánico + API routes para webhook de Hotmart, y duda entre Vite/Next resuelta por la regla del stack a favor de Next.
- Auth: Supabase Auth, passwordless (magic link) — sin fricción para audiencia no técnica y escéptica.
- Modelo de datos (borrador): `usuarios`, `checkins_diarios` (emoción + nota corta + fecha), `metas` (tipo ahorro/deuda, monto objetivo, monto actual), `rachas` (contador + última fecha activa) — todas con RLS por `(select auth.uid())`.
- Features del MVP (del usuario): (1) check-in diario emoción/dinero, (2) 1-2 metas de ahorro/deuda con registro manual, (3) racha/progreso visual, (4) tip/reflexión corta diaria. Fuera del MVP: conexión bancaria, metas múltiples simultáneas, comunidad/social, gamificación compleja.
- Idioma UI: español LATAM neutro, mono-idioma.

## Nombre — CONFIRMADO
- Nombre definitivo: **Respira**. Confirmado por el usuario el 2026-09-17.
- Pendiente (acción del usuario, no bloqueante): verificar disponibilidad oficial en SIC (Colombia) / IMPI (México) antes de comprar dominio o lanzar públicamente.

## Sesiones completadas ✅
- Sesión 1 — Validación, avatar, monetización, arquitectura y nombre — cerrada 2026-09-17.

## Sesión en progreso 🔧
- Sesión 2 — Identidad visual: arrancando con LA PREGUNTA DE REFERENCIA (PASO 0 del 54).

## Próximas sesiones 📋
- Sesión 2: identidad visual (dirección de arte) — en curso.
- Sesión 3: página de ventas.

## Problemas conocidos ⚠️
- vista-previa-app.html: pospuesto a propósito — el TOUR DE LA APP (54) se construye DESPUÉS de que el usuario elija entre las opciones A/B/C de `direcciones-abc.html` (elección aún pendiente, ver checkpoint). Generarlo ahora sería tematizar un frame con una dirección que el usuario todavía no aprobó. En cuanto elija, se construye vista-previa-app.html con esa dirección y se presenta la pregunta del tour (me encanta / ajustar / repensar) antes de cerrar FICHA-ARTE.md.
- FICHA-MERCADO.md tiene varios campos "NO ENCONTRADO" — los precios/plazos que dio el usuario en el RESUMEN no traen fuente+fecha propia; se usan como punto de partida pero se marcan para verificación antes de fijar precio final en Hotmart.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] (no bloqueante) Verificar "Respira" en el registro oficial de marcas (SIC/IMPI) antes de comprar dominio.

## Notas para la próxima sesión
- El usuario ya trae el RESUMEN FINAL validado — no se debe re-investigar mercado desde cero, solo completar los huecos de fuente+fecha en FICHA-MERCADO.md cuando se fije el precio definitivo.
