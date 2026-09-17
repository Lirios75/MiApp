# ESTADO — Respira
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Sesión 3 (página de ventas) construida — scaffold Next.js 16 + kit canónico de landing tematizado + 10 secciones con copy derivado de FICHA-AVATAR.md + páginas legales borrador (privacidad/terminos/reembolsos) + tsc/build limpios + screenshot 375px verificado. Se lanzó el subagente revisor-visual (obligatorio, landing = pantalla del dinero) — veredicto pendiente. / Siguiente acción exacta: leer docs/revisiones/landing-veredicto.md cuando el revisor termine; si aprueba (≥36/40 y ≥16/20), cerrar Sesión 3 y proponer Sesión 4 (onboarding+paywall+login); si no, corregir lo que señale y re-renderizar.

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
- Landing: CONSTRUIDA (Sesión 3) — las 10 secciones canónicas, copy trazado a esta ficha. Ver docs/copy/landing.md.
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
- Estado de la secuencia: Landing construida, verificando (Sesión 3). Resto pendiente.
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida — verificada (tsc+build+dev limpios, screenshot 375px) — protagonista: el Semáforo del Gasto — CTA primario: "Quiero mi primer check-in" → `/onboarding` (ruta aún no existe, se construye en Sesión 4)
- Onboarding: pendiente
- Paywall: pendiente
- Login/Auth: pendiente
- App interna: pendiente
- Servicios externos: pendiente

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: construida, NO aprobada todavía — evidencia: tsc ✓ build ✓ dev ✓ · screenshot docs/revisiones/landing-375.png · veredicto:landing 1ª pasada = NO LISTA (27/40, 13/20), los 5 defectos ya se corrigieron (detalle en "Problemas conocidos") y se relanzó el revisor-visual para la 2ª pasada — resultado aún no aterriza en docs/revisiones/landing-veredicto.md.
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
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

## Sesión en progreso 🔧
- Sesión 3 — Página de ventas: construida, verificando con el revisor-visual (obligatorio, es pantalla del dinero).

## Próximas sesiones 📋
- Sesión 4: onboarding, paywall y login.
- Sesión 5: app interna simplificada (ahí se toman los screenshots reales para el carrusel de la landing).

## Problemas conocidos ⚠️
- veredicto:landing — 1ª pasada NO LISTA (usabilidad 27/40, craft 13/20). 2ª pasada: usabilidad 36/40 ✅, craft 14/20 ❌. 3ª pasada (tras animar RespiraMark + count-up de precios): usabilidad 36/40 ✅, craft 15/20 ❌ — faltaba 1 punto: el eco grande del anillo en el Hero seguía estático e imperceptible (6% opacidad). Se animó con el mismo patrón de RespiraMark y se subió a 12%. Se relanzó el revisor-visual para la 4ª pasada — veredicto pendiente.
- carrusel "La app por dentro": usa 4 placeholders honestos rotulados (Check-in diario / Metas / Pantalla principal / Reporte semanal) porque la app interna todavía no existe — se reemplazan por screenshots reales al cerrar la Sesión 5 (regla dura de 19 §5). No declarar la landing "100% terminada" hasta ese reemplazo.
- FICHA-MERCADO.md tiene varios campos "NO ENCONTRADO" — los precios/plazos que dio el usuario en el RESUMEN no traen fuente+fecha propia; se usan como punto de partida pero se marcan para verificación antes de fijar precio final en Hotmart.
- Garantía (footer/reembolsos): el piso legal dice "política de reembolso de Hotmart" SIN número de días porque Hotmart aún no está configurado (Sesión 6) — no prometer un plazo exacto hasta configurarlo.
- Páginas legales (privacidad/términos/reembolsos): son borrador funcional, les falta el nombre/razón social del responsable, el país de operación y confirmar el email de soporte real (hoy usan el provisional `hola@respira.app`) — ver "Pendientes del usuario".

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] (no bloqueante) Verificar "Respira" en el registro oficial de marcas (SIC/IMPI) antes de comprar dominio.

## Datos del responsable (para las páginas legales — confirmados por el usuario 2026-09-17)
- Responsable: Lina Rios · País: Colombia · Correo de soporte/legal: lina.rios@ikigaihumano.com (provisional hasta que exista un dominio propio — cuando se compre el dominio, cambiar a un correo con ese dominio en las 3 páginas legales + FooterLegal).

## Notas para la próxima sesión
- El usuario ya trae el RESUMEN FINAL validado — no se debe re-investigar mercado desde cero, solo completar los huecos de fuente+fecha en FICHA-MERCADO.md cuando se fije el precio definitivo.
