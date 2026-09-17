# ESTADO — Respira
Última actualización: 2026-09-17 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: RESUMEN FINAL del usuario cargado, fichas creadas, nombre recomendado. / Siguiente acción exacta: esperar OK del usuario sobre el nombre y el Plan Maestro para arrancar Sesión 1 (arquitectura, modelo de datos, auth).

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

## Dirección de Arte (Sesión 2 — pendiente)
- FICHA-ARTE.md: NO existe todavía — se hace en Sesión 2.
- ¿Hubo referencia visual del usuario?: NO (hasta ahora) — se le hará LA PREGUNTA DE REFERENCIA al llegar a esa sesión.

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

## Nombre — decisión pendiente del usuario
- Candidatos del usuario: Respira (principal) · Junto/Junta (alt. 1) · Al Día (alt. 2).
- Investigación de conflicto (búsqueda web, no reemplaza verificación oficial en IMPI/SIC): "Respira" no tiene conflicto en la categoría finanzas (sí existe una app de respiración/meditación con ese nombre — categoría distinta); "Junta"/"Junto" choca con apps financieras reales (ej. una app bancaria cooperativa) y es una palabra genérica de uso común, lo que la debilita como marca; "Al Día" no tiene app homónima encontrada pero es una frase genérica (bajo poder distintivo) y existe "Em Dia", su equivalente en portugués, como app de finanzas en Brasil.
- Recomendación del agente: **Respira**. Pendiente: el usuario confirma o ajusta.

## Sesiones completadas ✅
(ninguna todavía)

## Sesión en progreso 🔧
- Sesión 1 — Validación, avatar, monetización y arquitectura: fichas creadas, falta cerrar arquitectura de datos/RLS detallada y confirmar nombre con el usuario.

## Próximas sesiones 📋
- Sesión 1 (cierre): modelo de datos definitivo + RLS + confirmar nombre.
- Sesión 2: identidad visual (dirección de arte).
- Sesión 3: página de ventas.

## Problemas conocidos ⚠️
- FICHA-MERCADO.md tiene varios campos "NO ENCONTRADO" — los precios/plazos que dio el usuario en el RESUMEN no traen fuente+fecha propia; se usan como punto de partida pero se marcan para verificación antes de fijar precio final en Hotmart.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Confirmar o ajustar el nombre de la app (Respira / otro).

## Notas para la próxima sesión
- El usuario ya trae el RESUMEN FINAL validado — no se debe re-investigar mercado desde cero, solo completar los huecos de fuente+fecha en FICHA-MERCADO.md cuando se fije el precio definitivo.
