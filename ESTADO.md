# ESTADO — Respira
Última actualización: 2026-10-15 | Sesión actual: 6

⏸️ CHECKPOINT (2026-10-15): tras migrar Hoy/Semana/Meta/Cuenta a Supabase real, las 3 pantallas
quedaron con el skeleton de carga pegado — causa real: faltaban los GRANT base de Postgres para
el rol `authenticated` sobre `perfiles`/`checkins`/`metas` (RLS solo filtra filas, no da acceso a
la tabla; confirmado con 403 en la consola del navegador). Fix ya escrito, commiteado y pusheado:
`supabase/migrations/20261015000000_grants.sql`. De paso se agregó `ErrorCarga` (componente
compartido en `components/app/ui.tsx`) + estado de error en las 3 pantallas, para que un fallo de
red/permiso muestre "Reintentar" en vez de quedarse cargando para siempre — queda como mejora
permanente, no solo parche del bug. El SQL del fix ya se ejecutó con éxito en la base real ("Success. No rows returned", confirmado
por captura). **Bug de permisos CERRADO y VERIFICADO EN VIVO** (2026-10-15, capturas reales desde
el celular de la usuaria en `mi-app-olive.vercel.app`): Hoy marcó "día tranquilo" y quedó
guardado con racha de 1 día, Semana mostró el mismo día con su punto verde + fechas reales
(12-18 oct), Meta mostró su meta real "Ahorrar para algo" ($5000 de $20.000, 25%) con el anillo
de progreso, Cuenta mostró el plan real ("Mensual $6.99/mes, prueba gratis 7 de 7 días"). **La
migración completa de localStorage a Supabase queda 100% cerrada y probada end-to-end con datos
reales de la usuaria.**

⏸️ CHECKPOINT (2026-10-15, tarde): la usuaria pidió un cambio en "Tu meta": que al crear la meta
pueda ESCRIBIR para qué está ahorrando (antes era un nombre fijo tipo "Ahorrar para algo") y
elegir CADA CUÁNTO ahorra (diario/semanal/mensual/semestral/anual) — aplica solo a metas de
ahorro/deuda (modo "monto"); las de hábito (dejar impulso/entender) siguen midiéndose en racha,
sin este campo. Implementado:
- `lib/app.ts`: nuevo tipo `Frecuencia` + `OPCIONES_FRECUENCIA`, `Meta.frecuencia` (nullable).
- `supabase/migrations/20261015020000_meta_frecuencia.sql`: agrega la columna `frecuencia` a
  `metas` (con check de los 5 valores válidos). **Falta que la usuaria la ejecute en el SQL
  Editor de Supabase** (mismo procedimiento de siempre — cuidado con la traducción de Chrome).
- `lib/supabase/datos.ts`: `crearMetaMontoSupabase` ahora pide la frecuencia;
  `actualizarDetalleMetaSupabase` (nueva) permite cambiar nombre/frecuencia de una meta ya creada
  sin tocar su monto.
- `app/app/meta/page.tsx`: al crear la meta, ahora pide primero "¿Para qué es tu meta?" (texto
  libre) y luego "¿Cada cuánto quieres ahorrar?" (chips Diario/Semanal/Mensual/Semestral/Anual).
  La meta ya creada muestra el nombre + un chip con la frecuencia, y un botón "Editar" (mismo
  patrón que "Cambiar" en Hoy) para cambiarlos después sin perder el progreso.
Verificado: tsc ✓ build ✓. La migración SQL ya se ejecutó con éxito en la base real ("Success. No
rows returned", confirmado por captura). Siguiente paso exacto: la usuaria prueba crear/editar
una meta con nombre propio y frecuencia en `mi-app-olive.vercel.app/app/meta` — pendiente su
confirmación. Después: dominio propio, luego Hotmart.

⏸️ CHECKPOINT (2026-10-15, noche): dos pedidos más de la usuaria sobre "Hoy":
1. Nota opcional "¿En qué se te fue?" después de marcar el Semáforo — **decisión de diseño
   consultada y acordada con la usuaria**: opcional y fuera del paso de 1 toque (no obligatoria),
   para no repetir el error de las apps de la competencia que piden anotar cada gasto y la gente
   abandona (ver "Reporte de validación" arriba). Aparece como link "+ ¿En qué se te fue?" debajo
   de la confirmación del día; se puede editar después. Implementado: `lib/app.ts` (`CheckIn.nota`),
   `supabase/migrations/20261015030000_checkin_nota.sql` (columna `nota` en `checkins`, **falta
   que la usuaria la ejecute**), `lib/supabase/datos.ts` (`registrarNotaCheckInSupabase`),
   `app/app/page.tsx` (`ConfirmacionDia` con el formulario opcional).
2. Color distinto para la tarjeta de reflexión diaria — hecho con el MISMO acento de marca (fondo
   con un tinte sutil en vez de blanco plano), sin agregar un color nuevo a la paleta. La usuaria
   también preguntó por emojis en esa tarjeta — se le explicó por qué NO (rompe la consistencia
   con los íconos de línea que usa el resto de la app) y aceptó mantener los íconos SVG.
Verificado: tsc ✓ build ✓. La migración SQL de `nota` ya se ejecutó con éxito en la base real
("Success. No rows returned"). La usuaria PROBÓ Y CONFIRMÓ en vivo: el nombre/frecuencia editable
de la meta y la nota opcional de Hoy quedan 100% cerrados y funcionando.

⏸️ CHECKPOINT (2026-10-15, noche) — app instalable en el celular (PWA): la usuaria preguntó cómo
hacer que la app, al comprarla, quede como un ícono en el celular (no solo abierta en el
navegador). Se le explicó la diferencia entre esto (gratis, funciona ya, "Agregar a pantalla de
inicio") y publicar en App Store/Google Play (trámite aparte, con costo y revisión, no es lo que
pidió). Implementado — app instalable:
- Generados los íconos de la app con el anillo de respiración de la marca (mismo mark de
  `components/RespiraMark.tsx`, azul-lila `#5468D4` sobre crema `#FAF6EF`) con Playwright en
  este sandbox: `app/icon.png` (512), `app/apple-icon.png` (180, iPhone), `public/icons/
  icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (con más margen, para Android). Se quitó
  el favicon por defecto de Next.
- `app/manifest.ts`: manifest de la app (nombre, colores de marca, `start_url: '/app'`,
  `display: 'standalone'`) — Next lo sirve automático en `/manifest.webmanifest`.
- `app/layout.tsx`: metadata de `appleWebApp` (capable, título) + `viewport.themeColor` (color de
  la barra del navegador en el celular) — SOLO metadata del `<head>`, cero cambios visuales en
  ninguna pantalla (confirmado por diff).
Verificado: tsc ✓ build ✓ (rutas `/icon.png`, `/apple-icon.png`, `/manifest.webmanifest` generadas
correctamente). **La usuaria PROBÓ Y CONFIRMÓ en vivo**: instaló el ícono en su Android (con
"Navegador Mi", el navegador de Xiaomi) y se ve con su marca — funciona.
⚠️ Nota operativa descubierta probando (igual que la de Chrome-traduce — documentar para no
re-diagnosticar si vuelve a pasar): el enlace mágico del correo puede abrirse en un navegador
DISTINTO al que instaló el ícono (ej. Gmail abre en "el navegador" por defecto del teléfono, que
puede no ser el mismo donde está instalada la PWA) — como son apps distintas, cada una guarda su
propia sesión y el ícono no queda logueado aunque el correo sí haya funcionado. Nada roto del
lado del código (confirmado: es aislamiento de almacenamiento entre apps del sistema operativo,
no un bug de Respira). Solución que funcionó: desde el correo, "Copiar URL" en vez de tocar el
enlace directo, abrir el ícono de Respira ya instalado, pegar la URL en su barra de direcciones y
entrar ahí. La usuaria pidió agregar el tip — hecho en `app/entrar/page.tsx` (pantalla propia, no se tocó la
plantilla de correo de Supabase): en la vista "Revisa tu correo" (justo después de pedir el
enlace) se agregó una nota corta "Si ya tienes el ícono de Respira en tu pantalla de inicio,
ábrelo desde ahí en cuanto toques el enlace del correo." Verificado: tsc ✓ build ✓.
⏸️ CHECKPOINT (2026-10-15, noche) — dos ajustes más en Tu meta, pedidos por la usuaria:
1. Faltaba "Quincenal" entre las frecuencias (solo estaban diario/semanal/mensual/semestral/
   anual) — agregado en `lib/app.ts` (`OPCIONES_FRECUENCIA`) + nueva migración
   `supabase/migrations/20261015040000_meta_frecuencia_quincenal.sql` (reemplaza el check de la
   columna `frecuencia` para incluir `quincenal`) — **falta que la usuaria la ejecute**.
2. "Editar" en la meta solo dejaba cambiar nombre y frecuencia, no el monto total — ahora también
   permite cambiar "¿Cuánto quieres ahorrar en total?" sin perder lo ya ahorrado (`actual` no se
   toca). `actualizarDetalleMetaSupabase` ahora recibe también el objetivo.
Verificado: tsc ✓ build ✓. NO se pudo probar en vivo en este sandbox. ⏸️ CHECKPOINT (2026-10-15, noche) — Semana ahora muestra la nota de cada día: la usuaria preguntó
si la nota opcional de Hoy se guardaba y si se podía ver en el calendario — confirmado que sí se
guarda, pero no se veía en ningún lado más que el mismo día. Pidió agregarlo, implementado en
`app/app/semana/page.tsx`: los días YA marcados (no futuros) ahora son tocables — al tocar uno se
abre un panel debajo del calendario con la fecha completa, si fue día tranquilo/alerta, y la nota
de ese día (o "No escribiste en qué se te fue ese día." si no escribió nada). Solo lectura — para
editar una nota pasada se sigue haciendo desde Hoy (día de hoy únicamente, ya existía). Verificado:
tsc ✓ build ✓. La migración de `quincenal` ya se ejecutó con éxito en la base real ("Success. No
rows returned"). ⏸️ CHECKPOINT (2026-10-15, noche) — montos con puntos de miles mientras se escriben: la usuaria
preguntó si debía escribir "10.000.000" o "10000000" en los campos de monto de Meta — se le
explicó que el campo no entendía puntos, y pidió que se formatearan solos. Implementado en los 3
campos de monto de `app/app/meta/page.tsx` (crear meta, editar meta, registrar avance): ahora son
`type="text" inputMode="numeric"` en vez de `type="number"`, y mientras la usuaria escribe se ven
los puntos de miles (ej. escribe "10000000", ve "10.000.000"). Nuevas funciones compartidas en
`components/app/ui.tsx`: `formatearMiles` (dígitos → texto con puntos) y `soloDigitos` (texto →
solo números, para guardar el valor real). Verificado: tsc ✓ build ✓. NO se pudo probar en vivo
en este sandbox. La usuaria PROBÓ Y CONFIRMÓ: los puntos de miles funcionan.

⏸️ CHECKPOINT (2026-10-16) — foto de perfil: la usuaria preguntó si la app se podía personalizar
(subir una foto u otra idea que yo propusiera). Se le preguntó para acotar el alcance y confirmó
"foto de perfil en Cuenta". Implementado:
- `supabase/migrations/20261016000000_avatar_perfil.sql`: columna `avatar_url` en `perfiles` +
  bucket de Supabase Storage "avatars" (público para lectura, cada usuaria solo puede subir/
  cambiar/borrar el suyo vía RLS sobre `storage.objects`, carpeta por `user_id`) — **falta que la
  usuaria la ejecute** (es SQL, mismo procedimiento de siempre, en el mismo editor).
- `lib/app.ts`: `EstadoApp.avatarUrl`.
- `lib/supabase/datos.ts`: `subirFotoPerfilSupabase` (valida tipo JPG/PNG/WEBP y máximo 5 MB,
  sube a `avatars/<uid>/avatar.<ext>` con `upsert`, guarda la URL pública con cache-bust en
  `perfiles.avatar_url`).
- `app/app/cuenta/page.tsx`: círculo de foto arriba de "Tu plan" (ícono de persona si no tiene
  foto) con un botón de cámara para cambiarla — abre el selector de archivos del celular
  directamente (sin librería de recorte, para no sobre-construir: la imagen se recorta visualmente
  con `object-cover` en el círculo, no se guarda recortada).
Verificado: tsc ✓ build ✓. La migración ya se ejecutó con éxito en la base real ("Success. No
rows returned"). La usuaria probó: dio error "No pudimos subir tu foto" — diagnosticado por consola del navegador
(mismo método de siempre): `403` al subir. Causa raíz encontrada: el GRANT original de la Sesión
6 solo daba `select, insert` en `perfiles` (nunca se necesitó `update` hasta ahora) — igual bug
que el de checkins/metas, esta vez en perfiles. Fix en
`supabase/migrations/20261016010000_grant_update_perfiles.sql` (agrega `update` en perfiles +
confirma los grants base de `storage.objects`/`storage.buckets` para el rol autenticado, por si
también faltaban) — ya ejecutada con éxito en la base real ("Success. No rows returned").
Pero el GRANT no resolvió el problema real: la foto seguía sin verse. Diagnóstico extendido con
la consola/Network del navegador (varias rondas, filtrando por "avatar" y por `method:PATCH`):
la subida a Storage daba 200, el PATCH a perfiles daba 204 ("éxito")... pero al mirar la tabla
`perfiles` directo en el Editor de Supabase, `avatar_url` seguía en NULL. Causa raíz real:
`perfiles` NUNCA tuvo una POLÍTICA de RLS para "update" (la migración inicial solo creó las de
select e insert) — sin esa política, RLS bloquea la fila en silencio y el PATCH "tiene éxito"
pero no actualiza ninguna fila. Fix en
`supabase/migrations/20261016020000_rls_update_perfiles.sql` (crea la política de update en
`perfiles`, mismo patrón que checkins/metas) — ya ejecutada con éxito en la base real ("Success.
No rows returned"). **La usuaria PROBÓ Y CONFIRMÓ: su foto ya se ve correctamente en Cuenta.** Feature de foto de
perfil 100% cerrada y funcionando.

⏸️ CHECKPOINT (2026-10-16) — dominio propio, EN CURSO. La usuaria eligió usar un subdominio de
su dominio existente `ikigaihumano.com` (gratis, ya lo tiene) en vez de comprar uno nuevo:
**`respira.ikigaihumano.com`**. Hecho hasta ahora:
- En Vercel (proyecto `mi-app`): agregado el dominio `respira.ikigaihumano.com` (Settings →
  Domains → Add Existing), ambiente Production.
- En Hostinger (DNS de `ikigaihumano.com`): agregado el registro que pidió Vercel —
  `CNAME respira → d6eed6c8a1e1cf6c.vercel-dns-017.com` — confirmado guardado correctamente en
  la lista de registros.
- Pendiente: que el DNS propague (minutos a ~1h) y Vercel marque "Valid Configuration" al darle
  Refresh.
Hecho: (1) Vercel generando el certificado SSL del dominio nuevo (DNS ya propagado), (2) en
Supabase Auth → Configuración de URL: "Site URL" ya es `https://respira.ikigaihumano.com`, y
"URLs de redireccionamiento" tiene AMBAS: `https://mi-app-olive.vercel.app/**` (la vieja, se deja
por si acaso) y `https://respira.ikigaihumano.com/**` (la nueva). **La usuaria PROBÓ Y CONFIRMÓ: `respira.ikigaihumano.com` funciona de punta a punta** (sesión real,
datos reales, mismo backend). El código no necesitó cambios: el redirect del login usa
`window.location.origin` (dinámico), no una URL fija. **Dominio propio 100% cerrado.**

⏸️ CHECKPOINT (2026-10-16) — Hotmart, EN CURSO (ver `docs/sistema/18-VENTA-HOTMART.md`, la fuente
canónica de todo este bloque). Plan de 4 fases explicado a la usuaria en simple:
1. Ella en Hotmart: crear el producto tipo SUSCRIPCIÓN + área de miembros (1 clase con el
   instructivo de acceso) + planes mensual/anual con prueba gratis de 7 días + enviar a aprobar.
2. Yo en código: endpoint seguro del webhook (hottok en tiempo constante, dedupe por event_id,
   FSM de membresía, tabla `processed_events`/`webhook_log`) + conectar el paywall real al
   checkout de Hotmart + flujo de cuenta tras la compra.
3. Juntas: conectar el webhook en Hotmart (pegar la URL del endpoint + copiar el HOTTOK a una
   variable de entorno).
4. Juntas: compra de prueba de punta a punta antes de anunciar.
**Modelo de creación de usuario:** 2A (onboarding-first / preview anónimo) — coherente con la
decisión de Sesión 1 ("Freemium con suscripción, onboarding-first") y con que hoy el paywall YA
manda a `/entrar` sin cuenta previa (simulación honesta, `app/paywall/page.tsx` líneas ~66-76).
Decisión técnica, no se le pregunta a la usuaria.
Progreso de la Fase 1 (en Hotmart, app.hotmart.com): producto "RESPIRA" tipo Suscripción creado,
con descripción, idioma (Español), país (Colombia), categoría ("Finanzas e Inversiones") e imagen
(el ícono de marca que ya existía en `public/icons/icon-512.png`) — pasó a "Fijación de precios".
⚠️ HALLAZGO IMPORTANTE: el panel real de Hotmart para "Plazo para solicitar el reembolso" NO
ofrece 14 días — solo 7/15/21/30. Se subió la garantía de 14 a **15 días** (sigue cumpliendo
garantía > prueba de 7) y se corrigió en TODO el proyecto para quedar consistente:
`lib/pricing.ts` (`GARANTIA_DIAS`, usado por el paywall), `app/page.tsx` (landing),
`app/reembolsos/page.tsx`, `docs/copy/landing.md`, `docs/copy/onboarding-paywall.md`,
`FICHA-MERCADO.md` §4. Verificado: tsc ✓ build ✓. Re-verificación del paywall hecha (SÍ le cambia
el número que muestra, pero no la estructura/diseño — certificación 37/40·20/20·19/20 sigue
vigente). Decisión confirmada con la usuaria: precios en **dólares (USD)**, no reales brasileños (default de
Hotmart) ni pesos colombianos. Plan **Mensual** casi listo en Hotmart: nombre "Mensual",
descripción, moneda USD, $6.99, periodicidad mensual, "Pago al contado", "Hasta que el cliente
cancele", claves de seguimiento apagadas (no necesarias aún) — a punto de guardar. **Ambos planes ya creados y guardados en Hotmart**: Mensual ($6.99 USD, pago al contado, hasta
cancelar) y Anual ($49.99 USD, mismo esquema). Plazo de reembolso: 15 días. **Prueba gratis de 7
días activada en AMBOS planes** (modalidad "Gratuito" — no modalidad "Período de prueba", que es
otra cosa — confirmado en la tabla, columna "prueba" = 7 en Mensual y Anual). También se completó
el "Contenido" del Área de Miembros con el texto del instructivo de acceso (adaptado del modelo de
18-VENTA-HOTMART.md, con el link real `respira.ikigaihumano.com/entrar` y el correo de soporte
`lina.rios@ikigaihumano.com` — ya aclarado con la usuaria que este correo SÍ es el correcto, no se
confunde con `notificaciones@mail.ikigaihumano.com` que es solo de envío automático). Falta:
completar lo que falte de "Fijación de precios" y "Página de producto"/"Página de Venta" si no
están ya marcadas, y hacer clic en "Finalizar registro" (Paso D) para enviar a aprobación.

⏸️ CHECKPOINT (2026-10-16, noche) — producto RESPIRA (ID 8740950) enviado a aprobación en
Hotmart: la usuaria hizo clic en "Finalizar registro" con el checklist completo en verde
(Información básica, Fijación de precios, Página de Venta, Datos personales, Área de Miembros,
Contenido) y Hotmart respondió "Enviado a aprobación — este proceso puede tardar hasta 15
minutos". Estado actual: "En análisis". Fase 1 del plan de 4 (ella en Hotmart) queda
sustancialmente cerrada en cuanto Hotmart apruebe. Resumen de lo configurado: planes Mensual
$6.99/mes y Anual $49.99/año (USD), ambos con 7 días de prueba gratis (modalidad "Gratuito"),
garantía de reembolso 15 días. **Aprobado por Hotmart** (2026-10-16, noche — captura real del
panel: "¡Todo listo para vender!", checklist completo en verde). Fase 1 CERRADA.

⏸️ CHECKPOINT (2026-10-16, noche) — Fase 2 de Hotmart: CÓDIGO del webhook construido y verificado
(tsc ✓ build ✓), siguiendo `docs/sistema/18-VENTA-HOTMART.md` (las 4 defensas: autenticidad,
frescura, idempotencia, máquina de estados). Archivos nuevos:
- `supabase/migrations/20261017000000_hotmart_webhook.sql`: agrega a `perfiles` las columnas
  reales de membresía (`email`, `status`, `plan`, `hotmart_subscriber_code`,
  `hotmart_plan_name`, `trial_ends_at`, `first_paid_at`, `access_until`, `grace_ends_at`) + las
  tablas `processed_events` (dedupe) y `webhook_log` (auditoría) + la función
  `apply_hotmart_event` (atómica: dedupe + cambio de estado juntos). **Falta que la usuaria la
  ejecute** (mismo procedimiento SQL de siempre).
  ⚠️ CIERRE DE SEGURIDAD DE PASO: mientras construía esto encontré que las políticas de RLS de
  `perfiles` (hechas para la foto de perfil) dejaban a CUALQUIER usuaria autenticada
  actualizar/crear su propia fila CON CUALQUIER COLUMNA — incluidas `status`/`plan` — es decir,
  con la clave pública cualquiera podía auto-otorgarse Pro gratis sin pagar. Cerrado con permisos
  a nivel de COLUMNA (Postgres los soporta junto a RLS): `authenticated` solo puede tocar
  `avatar_url` (update) y `id`/`fecha_inicio_trial` (insert) — igual que antes para la foto —,
  el resto de columnas de membresía solo las escribe la función de arriba (corre como
  `service_role`). Esto va en la MISMA migración.
- `lib/hotmart-verify.ts`: verifica el hottok en tiempo constante (`crypto.timingSafeEqual`,
  anti timing-attack) + ventana anti-replay de 5 min.
- `lib/membership-fsm.ts`: traduce evento de Hotmart + monto cobrado → estado
  (trialing/active/past_due/cancelled/expired/refunded/chargeback) y bloquea reactivar un
  reembolso/contracargo con un evento viejo reentregado.
- `lib/supabase/admin.ts`: cliente con la llave SERVICE ROLE (SOLO servidor) + función que crea
  la cuenta de quien compró (o la reutiliza si ya existía) ANTES de tocar `perfiles` — para
  nunca dejar un pago "procesado" sin cuenta real detrás.
- `lib/hotmart.ts`: el product id real (8740950) + los dos links de checkout — **vacíos por
  ahora, pendientes de que la usuaria los comparta** (Hotmart → menú del producto → "Ver mis
  Hotlinks"). Mientras estén vacíos, el paywall sigue mandando a `/entrar` como hasta ahora (sin
  romper nada en producción).
- `app/api/webhooks/hotmart/route.ts`: el endpoint en sí — valida → verifica catálogo
  (producto+moneda+importe esperados) → resuelve/crea la cuenta → aplica el estado de forma
  atómica (RPC) → envía el enlace de acceso reusando Supabase Auth + Resend YA conectados (sin
  montar un envío de correo aparte).
- `app/paywall/page.tsx`: el botón de "Empezar mis 7 días gratis" ahora manda al checkout REAL
  de Hotmart si el link ya está cargado (si no, sigue igual que hasta hoy).
- `lib/app.ts` / `lib/supabase/datos.ts` / `app/app/cuenta/page.tsx`: Cuenta ahora muestra el
  plan y el estado REALES en cuanto exista una compra confirmada por Hotmart (antes era una
  adivinanza hecha en el navegador con `localStorage`); si todavía no hay compra, se ve
  exactamente igual que antes (sin regresión para su cuenta de pruebas actual).
⚠️ Alcance decidido (DECIDE-INFORMA-AVANZA, documentado aquí): por ahora NO se construyó el
libro mayor de ingresos (`payment_transactions`) ni el job semanal de reconciliación que pide el
SO — son para no duplicar INGRESOS en reportes financieros, no afectan si el acceso se otorga
bien o mal (eso sí está cubierto). Se agregan antes de necesitar reportes de plata reales.
Tampoco se mapeó `SWITCH_PLAN` (cambio nativo mensual↔anual) — se ignora sin romper nada; se
agrega si se habilita esa opción en el panel de Hotmart.
Siguiente paso exacto (3 cosas, en este orden):
1. La usuaria ejecuta la migración SQL nueva en Supabase (igual que siempre).
2. La usuaria agrega en Vercel una variable de entorno nueva: `SUPABASE_SERVICE_ROLE_KEY` (la
   copia del panel de Supabase, Configuración → API, directo a Vercel — nunca pegada en el chat)
   y otra `HOTMART_HOTTOK` (se consigue en el Paso E de abajo).
3. Paso E de `18-VENTA-HOTMART.md`: conectar el webhook en el panel de Hotmart (pegar la URL del
   endpoint ya desplegado + elegir los eventos + copiar el HOTTOK a Vercel) y mandar un test.
Después: pedirle los 2 links de "Hotlinks" para completar `lib/hotmart.ts`, y hacer la compra de
prueba de punta a punta (Paso F) antes de anunciar la venta.

⏸️ CHECKPOINT (2026-10-15/16, noche) — Fase 2, Paso E CERRADO: la usuaria completó las 3 cosas
pedidas arriba (migración SQL ejecutada, `SUPABASE_SERVICE_ROLE_KEY` y `HOTMART_HOTTOK` agregadas
en Vercel + redeploy) y conectó el webhook en Hotmart (URL `https://respira.ikigaihumano.com/
api/webhooks/hotmart`, versión 2.0.0, 6 eventos: compra aprobada/completa/reembolsada, chargeback,
cancelación de suscripción, cambio de plan — "pago atrasado/recurrencia" no apareció como opción
en el panel de su cuenta, no bloqueante). Envió la prueba de Hotmart ("Enviar prueba de
configuración") y los 6 eventos de prueba dieron **"200 - Procesado"** — confirma que la URL y el
HOTTOK están bien conectados y el endpoint no se cae con ningún evento. ⚠️ Honesto: esta prueba
NO confirma todavía que el flujo completo (crear cuenta real + mandar el correo de acceso) esté
funcionando — los eventos de prueba de Hotmart traen datos ficticios (producto/monto/correo de
prueba) que el filtro de "catálogo permitido" del webhook (`app/api/webhooks/hotmart/route.ts`)
rechaza a propósito sin romperse (responde 200 igual, por diseño, para no hacer que Hotmart
reintente algo que nunca va a coincidir) — por eso no se creó ninguna cuenta nueva con esta
prueba, y es lo esperado. La única forma de confirmar el flujo real es la compra de prueba de
verdad (Paso F). Siguiente paso exacto: pedirle a la usuaria los 2 links de "Hotlinks" (Hotmart →
menú del producto → "Ver mis Hotlinks") para completar `lib/hotmart.ts` y conectar el botón del
paywall al checkout real; después, una compra de prueba real (puede ser reembolsable) para
verificar: se crea la cuenta, llega el correo de acceso, el plan queda activo en Cuenta.

⏸️ CHECKPOINT (2026-10-16, noche) — `lib/hotmart.ts` completado con los 2 links reales de
checkout que compartió la usuaria (Hotmart → Hotlinks → "Página de Pago" de cada plan, con su
código de oferta). El botón "Empezar mis 7 días gratis" del paywall AHORA SÍ sale de la app y
lleva al cobro real de Hotmart (antes simulaba yendo a `/entrar`). Verificado: tsc ✓ build ✓.
Re-verificación del paywall anotada (cero cambio visual, certificación sigue vigente — ver
`docs/revisiones/paywall-veredicto.md`). **Falta la prueba real de punta a punta (Paso F):**
hacer una compra de prueba (puede ser reembolsable) desde el paywall real y confirmar: llega al
checkout correcto → el webhook la procesa → se crea la cuenta → llega el correo de acceso → al
entrar, Cuenta muestra el plan activo. Siguiente paso exacto: guiar a la usuaria a abrir su app
en el celular, llegar hasta el paywall, y hacer la compra de prueba.

⏸️ CHECKPOINT (2026-10-17) — PRUEBA E2E REAL hecha + BUG REAL encontrado y corregido antes de
que afectara una venta real. La usuaria compró de verdad (plan Anual, prueba gratis, comprador
"Pedro Torres" / apoyogyr@gmail.com, transacción HP1983914456) — "¡Compra aprobada!" en Hotmart,
y le llegaron los 2 correos propios de Hotmart (instructivo de acceso + "definir contraseña").
Revisando el correo de Hotmart encontré que el precio aparecía en **COP (pesos colombianos)**,
no en USD — la usuaria confirmó: en el checkout de Hotmart el comprador puede elegir pagar en su
moneda local y Hotmart lo liquida a la TRM (tasa de cambio) del día. El webhook tenía un filtro
de seguridad (`montoEsperadoValido` en `app/api/webhooks/hotmart/route.ts`) que SOLO aceptaba
pagos en USD con los montos exactos $6.99/$49.99 — con pagos en otra moneda, ese filtro iba a
**rechazar por error compras reales** de LATAM (el mercado entero de esta app). Corregido:
- `montoEsperadoValido` ya no exige USD ni un monto exacto — solo descarta un valor negativo
  (imposible). La defensa real contra eventos ajenos sigue siendo el `productId` (HOTMART_PRODUCT_ID).
- `calcularVentanasDeAcceso` (decide si un plan cancelado es mensual o anual para calcular hasta
  cuándo le queda acceso pagado) ya NO compara el monto contra $49.99 — ahora usa el NOMBRE del
  plan (`hotmart_plan_name`, que sí es estable sin importar la moneda).
Verificado: tsc ✓ build ✓. Publicado.
Confirmado con el detalle del webhook (la usuaria copió el JSON real del evento desde Hotmart):
`"price":{"value":0,"currency_value":"COP"}` — exactamente el caso que el filtro viejo rechazaba.
La respuesta guardada de ESE intento fue `{"received":true,"ignored":"catalog"}` (200, pero sin
crear nada) — confirma el diagnóstico al 100%. El reenvío manual del mismo evento (desde el
Historial de Hotmart) chocó con la protección anti-replay (evento de +30 min, marcado "stale") —
correcto por diseño, no reprocesa eventos viejos; para probar el arreglo hacía falta un evento
NUEVO, no un reenvío.

✅ CHECKPOINT (2026-10-17) — PRUEBA E2E REAL CONFIRMADA DE PUNTA A PUNTA. Segunda compra de
prueba (plan Mensual, prueba gratis, comprador "Juan Torres" / apoyolaboral1231@gmail.com,
transacción HP1740399051) con el código ya corregido:
1. Hotmart: "¡Compra aprobada!" ✓
2. Llegó el correo de **Respira** (no solo el de Hotmart) con el enlace de acceso — confirma que
   el webhook creó la cuenta real y disparó el enlace mágico vía Supabase Auth + Resend ✓
3. (Nota operativa ya conocida: el primer enlace dio "otp_expired" — típico de que Gmail abre el
   link solo para revisarlo antes de que la usuaria lo toque, consumiéndolo. Se resolvió pidiendo
   un enlace nuevo y usando "Copiar URL" en vez de tocar el botón directo — mismo truco ya
   documentado en el checkpoint de Resend de la Sesión 6.)
4. La usuaria entró a `/app` con la cuenta real, recién creada ✓
5. **Cuenta mostró el plan REAL que mandó Hotmart**: "Mensual · $6.99/mes" + "Prueba gratis
   activa — termina el 23 oct" — ya no es la adivinanza de `localStorage`, es el dato real de
   `perfiles.status`/`hotmart_plan_name`/`trial_ends_at` escrito por el webhook ✓
**Fase 2 de Hotmart (18-VENTA-HOTMART.md) queda CERRADA en su flujo esencial**: compra → cuenta
real → correo de acceso → plan visible correctamente. Pendiente, no bloqueante para vender:
probar un reembolso/cancelación de prueba (para confirmar que el acceso se corta bien) y el
`payment_transactions`/reconciliación semanal que quedaron fuera de alcance a propósito (ver
checkpoint de más arriba). Siguiente paso sugerido: la usuaria puede anunciar la venta — o, si
quiere más tranquilidad antes, hacer una prueba de cancelación/reembolso con cualquiera de las
2 compras de prueba ya hechas.
La usuaria decidió dejar la prueba de reembolso/cancelación para la próxima sesión. Siguiente
paso exacto: probar una cancelación o reembolso de una de las 2 compras de prueba ya hechas
(apoyogyr@gmail.com o apoyolaboral1231@gmail.com) y confirmar que el acceso se corta
correctamente en la app.

⏸️ CHECKPOINT (2026-10-17) — fecha límite opcional en "Tu meta" (pedido por la usuaria): al crear
o editar una meta de monto (ahorro/deuda) ahora puede elegir una fecha objetivo, opcional. La
tarjeta de progreso muestra "Te quedan N días (23 dic)" o, si ya pasó, "Tu fecha límite ya pasó
(23 dic)" — no bloquea nada, es solo informativo. No aplica a metas de hábito (se miden en racha).
Implementado:
- `supabase/migrations/20261017010000_meta_fecha_limite.sql`: columna `fecha_limite` (date,
  opcional) en `metas`. **Falta que la usuaria la ejecute** (mismo procedimiento SQL de siempre).
- `lib/app.ts`: `Meta.fechaLimite`.
- `lib/supabase/datos.ts`: `crearMetaMontoSupabase` y `actualizarDetalleMetaSupabase` ahora
  reciben la fecha límite (o `null`); `obtenerEstadoApp` la lee.
- `app/app/meta/page.tsx`: input de fecha (`type="date"`, mínimo hoy) al crear y al editar la
  meta + el texto de cuenta regresiva en la tarjeta de progreso.
Verificado: tsc ✓ build ✓. NO se pudo probar en vivo en este sandbox. Pendiente: que la usuaria
ejecute la migración y pruebe poner/editar una fecha límite en `/app/meta`.

✅ CHECKPOINT (2026-10-14): Resend conectado y FUNCIONANDO de verdad en producción — probado
end-to-end. Dominio `mail.ikigaihumano.com` verificado en Resend (DNS en Hostinger: TXT
`resend._domainkey.mail`, CNAME `rsend.mail`→`rsend-sae1.forge.rmta.net`, CNAME `send.mail`→
`send.forge.rmta.net`). Supabase Auth → Configuración SMTP: Host `smtp.resend.com`, Puerto 465,
Usuario `resend`, Contraseña = clave API de Resend (nombre "Supabase" en Resend; la primera clave
que se probó, "Onboarding", dio `535 Authentication credentials invalid` — se resolvió generando
una clave nueva y pegándola de nuevo, con cuidado de no dejar que el autocompletar de contraseñas
de Chrome interfiriera), Sender email `notificaciones@mail.ikigaihumano.com`, Sender name
`Respira`. Probado real: `mi-app-olive.vercel.app/entrar` → correo real llegó desde
"Respira <notificaciones@mail.ikigaihumano.com>" (cayó en Spam la primera vez — normal en un
dominio nuevo, mejora solo con el tiempo, no bloqueante) → clic en el enlace → sesión real creada
→ aterrizó en `/app` con datos. **Supabase Auth + Resend quedan 100% cerrados.**
⚠️ Nota operativa (para no repetir el error, por si se reabren estos paneles en otra sesión): la
traducción automática de Chrome ROMPE texto que el usuario escribe en paneles como Hostinger y
Supabase — tradujo "resend" a "reenviar" una vez. Apagar la traducción automática del sitio ANTES
de escribir nombres de registros DNS o claves.
✅ CHECKPOINT (2026-10-14, tarde): las 4 pantallas de la app interna (Hoy/Semana/Meta/Cuenta) ya
quedaron migradas de `localStorage` a datos reales de Supabase.
- `lib/app.ts`: queda SOLO lógica pura (racha, semanas, reflexión del día, tipos) — se le quitó
  todo el I/O de localStorage (`leerEstadoApp`, `registrarCheckIn`, `crearMeta*`,
  `registrarAvanceMeta`, `borrarMeta` [no se usaba en ningún lado], `cerrarSesionLocal`,
  `localStorageDisponible`).
- `lib/supabase/datos.ts` (nuevo): las versiones reales async — `obtenerEstadoApp()` (lee
  perfiles+checkins+metas del usuario autenticado, y crea la fila de `perfiles` la primera vez),
  `registrarCheckInSupabase`, `crearMetaMontoSupabase`, `crearMetaHabitoSupabase`,
  `registrarAvanceMetaSupabase`, `cerrarSesionSupabase` (hace `signOut()` real + limpia las 3
  llaves de localStorage que siguen siendo preferencias de cliente, no datos de cuenta: plan
  elegido y notificaciones — esas DOS quedan fuera de esta migración a propósito, son
  configuración local del dispositivo, no datos que deban persistir en el servidor).
- `app/app/layout.tsx`: ahora es un Server Component async que exige sesión real de Supabase —
  sin sesión, redirige a `/entrar` (antes cualquiera podía entrar a `/app` sin loguearse).
- Las 4 pantallas: mismo diseño y copy exactos, solo cambia de dónde leen/escriben (ahora async,
  con manejo de error mostrando el aviso "No pudimos guardar tu registro" si falla la escritura,
  y botones deshabilitados mientras guardan para evitar doble clic).
- Verificado: tsc ✓ build ✓ (las 4 rutas de `/app` pasaron de estáticas a dinámicas `ƒ`, correcto
  porque ahora dependen de la cookie de sesión). NO se pudo probar en vivo en este sandbox (sin
  acceso de red a Supabase) — pendiente que la usuaria pruebe el flujo completo en
  `mi-app-olive.vercel.app/app` una vez publicado: marcar el Semáforo, ver la semana, crear/avanzar
  una meta, cerrar sesión, y confirmar que entrar de nuevo con el mismo correo trae los mismos datos.
Siguiente paso exacto: la usuaria prueba el flujo completo en vivo (ver arriba). Si todo pasa:
dominio propio para la app (hoy vive en `*.vercel.app`), después Hotmart.

⏸️ CHECKPOINT SESIÓN 6 (servicios externos, en curso) — GitHub ya conectado desde antes.
Paso actual: publicando en Vercel. La usuaria creó su cuenta de Vercel y conectó el repositorio
`Lirios75/MiApp` vía GitHub. Antes de que diera "Deploy" se detectó y corrigió un problema real:
todo el código de Respira vivía solo en la rama de trabajo `claude/awesome-brown-rq2dqc` — la
rama `main` (la que Vercel usa por defecto) seguía con únicamente el commit inicial vacío. Se
hizo fast-forward de `main` a la punta de esa rama (con permiso explícito de la usuaria,
2026-09-21) para que Vercel publique la app real. Verificado: `origin/main` ahora en el mismo
commit que nuestro trabajo (b4c9077).
⚠️ Nota aparte (no bloqueante): en el mismo repositorio existe una pull request sin fusionar
(#2, rama `codex/construir-aplicativo-crm-para-lirios`, y otra rama relacionada
`codex/construir-aplicacion-web-tipo-crm-para-lirios`) de un proyecto DISTINTO de la usuaria —
un CRM en HTML/CSS/JS plano para "LIRIOS Agencia de Vida", hecho con otra herramienta (ChatGPT
Codex). No tiene relación con Respira, no se tocó, y sigue sin fusionarse a `main`. Si la
usuaria confirma que también es su proyecto, recomendar moverlo a un repositorio propio para no
mezclar los dos productos — no tomar esa decisión sin que ella lo pida.
Siguiente paso exacto: esperar a que la usuaria termine el deploy en Vercel y comparta el link
público (`*.vercel.app`) para verificar que carga la app real.

✅ CHECKPOINT (2026-09-21, tarde): deploy en Vercel exitoso, la usuaria confirmó ver la landing
real. Los DOS placeholders honestos de la landing quedaron resueltos con capturas reales: el
carrusel "La app por dentro" (commit 8f2a50c) y el `visual` del Hero (mismo día), que ahora
muestra `/images/app-por-dentro/pantalla-principal.png` (racha + Semáforo + meta) dentro del
mismo marco de teléfono que ya usaba el carrusel — reutiliza el patrón `w-[250px] rounded-[30px]
border-[5px]` de `AppPorDentro.tsx` en vez de inventar medidas nuevas. Verificado: tsc ✓ build ✓ ·
captura a 375px en `docs/revisiones/vivo/landing-hero-visual.png`. Nota técnica: el linter
mecánico de diseño (`post-edit-diseno.sh`) marca esos valores como "fuera de la escala 4·8·12…"
— es un falso positivo conocido (mismo patrón que el CADUCADO del paywall): esa escala rige
espaciado, no las medidas fijas de un marco de teléfono ya establecido y reusado en el proyecto.
Faltaba pushear a ambas ramas (`claude/awesome-brown-rq2dqc` y `main`) — hecho a continuación.

⏸️ CHECKPOINT (2026-09-21, noche) — Sesión 6, conectando Supabase. Preparado TODO el código que
no depende de una cuenta (protocolo 62-PUBLICACION-SEGURA-Y-CONTINUA.md, P0-P1 + parte de P3-P4):
- `.env.example` creado (solo nombres, sin valores) + `.gitignore` ajustado para permitirlo.
- Instalado `@supabase/supabase-js` + `@supabase/ssr`.
- `lib/supabase/client.ts` (navegador), `lib/supabase/server.ts` (Server Components/Actions),
  `lib/supabase/middleware.ts` + `proxy.ts` en la raíz (Next 16 renombró "middleware.ts" a
  "proxy.ts" — usado el nombre nuevo directamente, sin deuda). `proxy.ts` no hace nada mientras
  `NEXT_PUBLIC_SUPABASE_URL` no exista, así que el sitio sigue funcionando igual hasta que se
  conecte de verdad — verificado: tsc ✓ build ✓ (sin warning de deprecación) · dev ✓ · probado en
  navegador headless que `/entrar` sigue con la simulación honesta intacta
  (`docs/revisiones/vivo/entrar-simulado-post-envio.png`).
- `app/entrar/page.tsx`: ahora intenta Supabase Auth real (enlace mágico por correo) SI está
  configurado; si no, cae a la simulación de siempre. Nunca miente sobre tener cuenta real.
- `app/auth/confirm/page.tsx`: recibe el clic del enlace del correo y crea la sesión real.
  **IMPORTANTE (corregido 2026-10-11):** NO es una ruta de servidor (`route.ts`) — las plantillas
  de correo POR DEFECTO de Supabase (sin SMTP propio) redirigen con la sesión en el fragmento de
  la URL (`#access_token=...`), que el servidor nunca ve. Por eso es una página de cliente
  (`'use client'`) que deja que el SDK de Supabase detecte la sesión al cargar (`getSession()`) y
  recién entonces redirige a `/app`. Si se customiza el SMTP (Resend) y se cambian las plantillas
  a formato `token_hash`, este archivo tendría que revisarse — por ahora funciona con las
  plantillas default.
- `supabase/migrations/20260921120000_init.sql`: esquema completo (tablas `perfiles`, `checkins`,
  `metas` — mismo modelo que `lib/app.ts`) con RLS por `(select auth.uid())` en las 3 tablas,
  igual que exige `25-BASE-DE-DATOS.md`. **YA APLICADA** en el proyecto real de la usuaria (pegada
  en el SQL Editor del dashboard, ella misma — este sandbox no tiene acceso de red a Supabase).
- **Decisiones técnicas (DECIDE-INFORMA-AVANZA, no se le preguntan a la usuaria):** método de auth
  = enlace mágico por correo (ya diseñado en la pantalla, coherente con 26-AUTH-MODERNO.md);
  modelo de datos = 3 tablas (perfiles/checkins/metas) 1:1 o 1:N con `auth.users`, sin tabla
  aparte para plan/trial más allá de `fecha_inicio_trial` en `perfiles`; arquitectura síncrona
  (no hay IA en esta app, no aplica 30-INTEGRACION-IA.md).
- Migrar las 4 pantallas de la app interna (Hoy/Semana/Meta/Cuenta) de `localStorage` a Supabase
  real sigue pendiente — es el próximo paso de código tras cerrar Resend.

✅ CHECKPOINT (2026-10-11): Supabase ya está conectado y FUNCIONANDO de verdad en producción.
Proyecto real: `Respira` (org "Lirios75's Org", project-ref `wtkxpmzkbglyjsernrwy`, región São
Paulo/sa-east-1, plan gratis). Datos públicos ya guardados en Vercel como variables de entorno
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, tipo "Config" porque no son
secretas) en los 3 ambientes, con un redeploy ya hecho. Las 3 tablas (perfiles/checkins/metas)
existen y tienen RLS activo. El login con enlace mágico se probó de principio a fin en el sitio
real (`mi-app-olive.vercel.app/entrar`) y funcionó — llegó el correo real de Supabase, el enlace
llevó a la sesión real. También se corrigió en Supabase Auth → Configuración de URL: "URL del
sitio" = `https://mi-app-olive.vercel.app` (antes decía `localhost:3000`, rompía los enlaces) +
redirect URL `https://mi-app-olive.vercel.app/**`.
⚠️ Límite esperado: el correo de prueba por defecto de Supabase tiene un límite muy bajo (~pocos
por hora) — ya se topó en pruebas (`429 over_email_send_rate_limit`, visible en Authentication →
Logs). Es exactamente la razón por la que la usuaria decidió conectar Resend AHORA (eligió la
opción 2 de "esperar 1h" vs "conectar Resend ya") en vez de esperar al orden original de la
secuencia — Resend se vuelve el paso INMEDIATO siguiente, antes de dominio/Hotmart.
Siguiente paso exacto: conectar Resend como servidor SMTP personalizado de Supabase Auth (para
quitar el límite de correos) — guiar a la usuaria a crear su cuenta de Resend, verificar/usar un
dominio, generar una API key, y pegarla en Supabase Auth → Configuración SMTP. Después: probar de
nuevo el login real sin el límite, migrar las 4 pantallas a Supabase, dominio propio, Hotmart.

## Sesiones anteriores — Sesión 5 (resumen, cerrada 2026-09-18)
Sesión 5 EN CURSO (app interna). Las 4 pantallas construidas y verificadas
(tsc ✓ · build ✓ · capturas reales a 375px con datos de ejemplo en docs/revisiones/vivo/):
Hoy (`/app`), Semana (`/app/semana`), Tu meta (`/app/meta`), Cuenta (`/app/cuenta`).
Persistencia local (localStorage vía `lib/app.ts`) — Supabase real es Sesión 6.
"Hoy" pasó 2 rondas del revisor-visual (límite puesto por la usuaria: máximo 2, sin
reintentar sola después). Ronda 1: 32/40 · 12/20. Ronda 2: 27/40 · 14/20, NO LISTA. Detalle
completo en docs/revisiones/pantalla-principal-veredicto.md. Tras ver las capturas y los 5
pendientes en simple, la usuaria eligió CORREGIRLOS (no una 3ª ronda automática) — se
corrigieron los 5: (1) aviso de guardado con texto preciso ("no se guarda de forma permanente"
en vez de prometer solo hasta cerrar pestaña), (2) tarjeta de reflexión con ícono chip como las
demás tarjetas, (3) hueco vacío reducido quitando el `flex-1` mal aplicado en la vista previa de
la meta + más contenido real (racha en la confirmación), (4) botón "Cancelar" (X) al tocar
"Cambiar" — verificado con prueba automatizada que vuelve a la confirmación sin alterar el
valor, (5) FICHA-ARTE.md actualizada para documentar la escala tipográfica realmente en uso
(19-22px título, 12-13px label) en vez de re-litigar tamaños ya consistentes en paywall/
onboarding. tsc ✓ build ✓ · capturas regeneradas. NO se relanzó el revisor una 3ª vez (respeta
el límite de la usuaria). La usuaria decidió AVANZAR A SESIÓN 6 con este resultado (sin pedir
una verificación más de "Hoy").
Antes de avanzar, pidió un ajuste visual: el menú inferior (Hoy/Semana/Meta/Cuenta) con efecto
de relieve/3D. Se mostraron 3 variantes reales (docs/revisiones/vivo/nav-variante-A/B/C.png):
A "Isla flotante" (barra despegada de los bordes, con margen y sombra propia), B "Puente
elevado" (ancho completo, esquinas superiores redondeadas, sombra hacia arriba), C "Cápsula
activa" (barra plana, solo el ítem activo se levanta). Eligió **A**. Implementada en
`components/app/ui.tsx` (`BottomNav`) como la única versión — el código de comparación
(`?nav=A|B|C`) se quitó, no queda como opción oculta. tsc ✓ build ✓ · capturas regeneradas con
el menú nuevo en las 4 pantallas.
Paso actual: Sesión 5 CERRADA. Arrancar Sesión 6 (servicios externos).
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
- App interna: 4 pantallas construidas y APROBADAS POR LA USUARIA (Hoy, Semana, Tu meta, Cuenta) — Sesión 5 cerrada 2026-09-18. Persistencia local (Supabase real en Sesión 6).
- Servicios externos: pendiente (Sesión 6, en curso)

## Puertas de etapa (aprobacion antes de avanzar)
- Landing: APROBADA POR EL USUARIO EN SUSTANCIA, PENDIENTE de certificación formal del revisor-visual — evidencia: tsc ✓ build ✓ dev ✓ · screenshot docs/revisiones/landing-375.png · veredicto actual en docs/revisiones/landing-veredicto.md = NO LISTA (usabilidad 31/40 · craft 15/20 · copy 19/20, 7ª pasada, PRE Sesión 5). El techo citado ahí ya no aplica: los DOS placeholders estructurales (carrusel "La app por dentro" y el `visual` del Hero) quedaron resueltos con capturas reales el 2026-09-21 — ver nota en Problemas conocidos. Sigue pendiente una nueva pasada del revisor-visual para confirmar el puntaje actualizado; no se ha relanzado (no bloqueante, el usuario ya aprobó avanzar así). El otro motivo (2 excepciones de identidad que el usuario decidió mantener) sigue igual — no re-abrir sin que el usuario lo pida.
- Onboarding: APROBADO POR LA USUARIA EN SUSTANCIA (2026-09-18) — evidencia: tsc ✓ build ✓ · flujo completo probado en navegador · 16 pasadas del revisor-visual (última: usabilidad 29/40, craft 17/20 — craft sí pasa, usabilidad no alcanza el gate ≥36/40) · veredicto en docs/revisiones/onboarding-veredicto.md · capturas en vivo a 375px en docs/revisiones/vivo/. La usuaria vio las capturas reales, entendió los 5 pendientes conocidos (ver Problemas conocidos) y decidió avanzar sin seguir iterando — no re-abrir sin que ella lo pida.
- Paywall: CERTIFICADA ✅ (12ª pasada del revisor-visual, 2026-09-18) — usabilidad 37/40 · craft 20/20 · copy 19/20 (gate ≥36/40, ≥16/20, ≥16/20 sin ejes ≤2, todos superados). Evidencia: tsc ✓ build ✓ · screenshot docs/revisiones/paywall-375.png (+ paywall-cargando-375.png) · veredicto en docs/revisiones/paywall-veredicto.md = LISTA. Historial: 12 rondas, empezando en 29/40 (ronda 4-ish) hasta cerrar con fixes de accesibilidad (ARIA en selector de plan, aria-label unificado, hairline consistente entre planes, escala tipográfica de 4 niveles). Quedan 4 notas de refinamiento fino no bloqueantes (ver veredicto): tamaño de ícono X levemente distinto entre fases, aria-label "Cerrar" del paywall no se propagó al "Salir" de FunnelHeader (onboarding) — no bloqueante, no re-abrir sin pedido del usuario.
- Login/Auth: construida — evidencia: tsc ✓ build ✓ · estados idle/enviando/enviado probados en navegador · screenshot docs/revisiones/entrar-375.png · sin revisor (pantalla secundaria, no es de las 4 del dinero) · magic link SIMULADO, sin backend real todavía (Sesión 6)
- App interna: APROBADA POR LA USUARIA (2026-09-18) — evidencia: tsc ✓ build ✓ · capturas reales a 375px en docs/revisiones/vivo/ (+ canónicas: pantalla-principal-375.png, semana-375.png, meta-375.png, cuenta-375.png) · flujo probado (marcar Semáforo, cancelar edición, navegar semanas, crear/registrar meta en ambos modos, cerrar sesión) · "Hoy" pasó 2 rondas del revisor-visual (32/40·12/20 → 27/40·14/20, no llegó al gate ≥36/40) y la usuaria decidió avanzar tras corregir los 5 pendientes concretos que encontró, sin pedir una 3ª ronda. Menú inferior con relieve ("isla flotante") elegido por la usuaria entre 3 variantes.
- Servicios externos: en curso (Sesión 6)

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
- Sesión 5 — App interna (Hoy, Semana, Tu meta, Cuenta) — cerrada 2026-09-18. "Hoy" hizo 2 rondas del revisor-visual (límite puesto por la usuaria); tras verlas, la usuaria eligió corregir los 5 pendientes concretos en vez de una 3ª ronda automática, y luego decidió avanzar. Menú inferior con relieve ("isla flotante") elegido entre 3 variantes.

## Sesión en progreso 🔧
- Ninguna — lista para arrancar Sesión 6.

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
- veredicto pantalla-principal ("Hoy", app interna): APROBADO POR LA USUARIA (2026-09-18) tras 2 rondas del revisor-visual (32/40·12/20 → 27/40·14/20 — nunca alcanzó el gate ≥36/40, ≥16/20). Detalle completo en docs/revisiones/pantalla-principal-veredicto.md. Se corrigieron los 5 defectos concretos de la ronda 2 (aviso de guardado impreciso, tarjeta de reflexión sin tratamiento visual, hueco vacío bajo la meta, sin forma de cancelar al editar el día, tipografía fuera de la escala documentada) y la usuaria decidió avanzar a Sesión 6 sin pedir una 3ª ronda — no re-abrir esta pantalla ni relanzar el revisor sobre ella sin que la usuaria lo pida.
- veredicto landing PENDIENTE de certificación formal (7ª pasada del revisor-visual: usabilidad 31/40, craft 15/20 — gate exige ≥36/40 y ≥16/20; copy 19/20 sí pasa) — DECISIÓN FINAL DEL USUARIO (2026-09-17): se le presentó la disyuntiva completa (mantener "check-in diario" en Oferta + emojis a color en "¿Te suena?" vs. revertirlos para subir la nota) y respondió "dejar todo como está". Landing queda APROBADA POR EL USUARIO EN SUSTANCIA, la certificación formal queda PENDIENTE hasta la Sesión 5. Detalle de por qué el techo es estructural (para no repetir el análisis si se vuelve a tocar esta pantalla):
  - "Check-in diario" (excepción del usuario en Oferta) le cuesta a USABILIDAD ~2 puntos (heurística de lenguaje consistente).
  - Los emojis a color de "¿Te suena?" (excepción del usuario) le cuestan a CRAFT el punto exacto que separa 15/20 de 16/20 (el umbral) — es la única razón por la que craft no pasa.
  - Los placeholders de "la app por dentro" (Hero + carrusel, sin app real — Sesión 5 no empezada) le cuestan a USABILIDAD ~2-3 puntos más — esto no depende de esta pantalla, es scope de Sesión 5.
  - Aun revirtiendo las 2 excepciones, usabilidad solo llegaría a ~33/40 (sigue sin pasar) hasta que exista la app real — por eso no tiene sentido seguir iterando esta pantalla ahora.
  - NO re-abrir esta decisión ni volver a proponer revertir "check-in"/emojis sin que el usuario lo pida — ya se le explicó el costo exacto y eligió mantenerlos.
  - Anillo del Hero (18% de opacidad en código, confirmado): no se logró verificar visualmente en el PNG headless de este sandbox (posible limitación del renderer con z-index negativo bajo software rendering, no del valor en sí) — pendiente de re-verificar con navegador real si se vuelve a tocar esta pantalla. No bloqueante por sí solo.
- carrusel "La app por dentro" y visual del Hero: AMBOS RESUELTOS (2026-09-21) — los 4 placeholders del carrusel y el placeholder dashed del Hero se reemplazaron por capturas reales de la app en `public/images/app-por-dentro/` (registro-diario.png = Hoy sin marcar, metas.png = Tu meta con el anillo, pantalla-principal.png = Hoy confirmado con racha [reusada en el Hero], reporte-semanal.png = Semana). Verificado en el navegador (docs/revisiones/vivo/landing-carrusel-app.png y landing-hero-visual.png). El Hero reutiliza el mismo marco de teléfono (`w-[250px] rounded-[30px] border-[5px]`) ya establecido en `AppPorDentro.tsx` en vez de inventar medidas nuevas — el linter mecánico de diseño lo marca como "fuera de escala" pero es un falso positivo conocido (esa escala rige espaciado, no las medidas fijas de un dispositivo ya aprobado).
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
