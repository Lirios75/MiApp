# FICHA DE DIRECCIÓN DE ARTE — Respira

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: NO — el usuario eligió que el agente proponga el diseño (opción 1 de LA PREGUNTA DE REFERENCIA).

## Identidad derivada (FUSIÓN de líderes — 16 PASO 0.2bis — + banco del 54 para el dispositivo)
- TABLA DE LÍDERES:
  | App | Tipografía | Lógica de color | Radius/cards | Nav | Cómo celebra | Patrón robable |
  |---|---|---|---|---|---|---|
  | Fintonic / YNAB | sans geométrica/grotesk segura | claro, verde solo en saldos/progreso, sobrio | cards con borde sutil | bottom-tabs | barras de progreso | dato-héroe grande y legible del saldo/meta |
  | Habitica | redondeada multicolor | claro/oscuro, colores de RPG | cards redondeadas | bottom-tabs | racha + celebración visual de hitos | la racha como elemento central, sin culpa al romperla |
  | Finch (gigante admirado, self-care) | redondeada cálida | pastel cálido, check-in de humor en 1 toque | cards suaves | bottom-tabs | mascota que crece con la racha | check-in emocional de un solo toque ANTES de cualquier dato |
  | Cleo (gigante admirado, fintech conversacional) | sans con personalidad | tono cercano, tarjetas de insight en lenguaje humano | chat-cards | conversacional | mensajes con humor | insight en lenguaje coloquial, cero jerga financiera |
- Combinación tipográfica probada usada: fila "Finanzas" (Archivo/Instrument Sans) en A · mood "Cálido/bienestar" (Sentient/Switzer) en B · fila "Hábitos/gamificada" (Nunito) en C — las 3 validadas contra la tabla de líderes.
- Arquetipo: Cuidador (con un toque de Inocente — permiso, sin culpa).
- Mundo del sujeto (0.45): respirar (inhalar/exhalar → anillo que se expande) · el bolsillo/monedero (formas redondeadas, no tarjetas duras) · la libreta emocional (textura cálida de papel) · el semáforo de calma (verde=tranquila, ámbar=alerta leve, NUNCA rojo punitivo) · la técnica de respiración 4-7-8 (motion lento, sin rebote).
- Dirección del banco 54 usada para el DISPOSITIVO OWNABLE: ninguna de las 12 se ajustaba al mundo "respirar" — se derivó un dispositivo propio compatible con los líderes (anillo de progreso, ya usado por Fintonic/Revolut) · Líder de origen de la paleta: fila "Finanzas personales" y matriz "Fintech — femenina, control de gastos" de `29-REFERENCIA-VISUAL.md`, tomada tal cual (traducida a modo claro conservando el hue, según regla del propio 29).

## Personalidad compilada
- 3 adjetivos de personalidad: calmada, permisiva, clara.
- Compilación: spring casi sin rebote (0-0.1) · duración base 300-380ms · exclamaciones máx 1/pantalla · celebración nivel medio (sin confeti, sí un cambio de color + micro-mensaje) · radio tendencial 18-22px.

## Brand kit — TRES OPCIONES presentadas, esperando elección del usuario

### Opción A — "Claridad templada"
- Fondo `#F8F6F0` · Superficie `#FEFDF9` · Texto 1º/2º `#1D222B` / `#79808F`
- Acento `#178A54` (verde dinero, SOLO en progreso/CTA) · Radio 16/12 · Sombra tintada 29·34·43
- Display **Archivo** · Body **Instrument Sans**
- Composición: héroe-dato (meta de ahorro grande) + cards apiladas (check-in, racha)

### Opción B — "Respira en calma" (elegida por el usuario, ajustada tras el tour — ver Trazabilidad)
- Fondo `#FAF6EF` · Superficie `#FFFDF8` · Texto 1º/2º `#2A2620` / `#8C8172`
- Acento primario `#5468D4` (azul-lila calmo — SOLO en el anillo/CTA/marca)
- 2ª nota `#2E9E6B` (verde — progreso positivo: ahorro, check-ins buenos, éxito) · 3ª nota `#E08A3C` (naranja — racha/hito/estado de alerta leve, NUNCA rojo)
  → las 3 notas responden al "semáforo de calma" ya documentado en Mundo del sujeto: verde=tranquila, naranja=alerta leve, azul=marca/acción — se agregaron a pedido del usuario tras ver el tour ("le veo muchos espacios" + quería más color); siguen la regla 60-30-10 (el azul-lila sigue siendo el dominante de marca, verde y naranja son notas funcionales, no decorativas)
- Radio 22/16 · Sombra tintada 42·38·32
- Display **DM Sans** (700) · Body **DM Sans** (400/500) — combinación probada "Bienestar/meditación" de `29-REFERENCIA-VISUAL.md` (Sentient/Switzer se descartó: requiere Fontshare, bloqueado en el entorno de construcción; DM Sans es la misma familia de mood cálido/geométrico, embebible por Google Fonts sin riesgo)
- Composición: anillo de respiración centrado + grid 2×2 de señales (racha en naranja, check-ins en azul, ahorro en verde, ánimo en azul) + tarjeta de insight + aviso de racha — pantallas más densas de contenido tras el ajuste del usuario
- Dispositivo ownable: el anillo que "respira" — mismo gesto que el nombre de la app

### Opción C — "Diario del dinero"
- Fondo `#FAF6EF` · Superficie `#FFFDF8` · Texto 1º/2º `#28221B` / `#8C8172`
- Acento `#2E9E6B` (verde victoria) + hito `#F0A05A` (SOLO en el día destacado de la racha) · Radio 18/14 · Sombra tintada 40·34·27
- Display + Body **Nunito** (una sola familia, redondeada, cálida)
- Composición: timeline editorial — un registro por día de la semana

## Trazabilidad y vetos
- Ruta de diseño (PREGUNTA DE REFERENCIA del 54): propuesta propia (el usuario eligió opción 1).
- Protocolo A/B/C: página comparativa en `direcciones-abc.html` (raíz del proyecto) · screenshot en `docs/revisiones/direcciones-abc-full.png` · opción elegida: **B "Respira en calma"** · descartadas: A "Claridad templada" (dato-héroe estilo Fintonic, más frío/numérico) y C "Diario del dinero" (formato bitácora, más narrativo/lento para el check-in diario).
- Tour de la app: `vista-previa-app.html` (raíz del proyecto) · screenshot en `docs/revisiones/vista-previa-app-full.png` · 5 vistas: principal (M0/anillo), onboarding, paywall, check-in (mecanismo), celebración de racha (resultado) · aprobado por el usuario: PENDIENTE (mostrado en este mismo turno).
- Paleta derivada de: matriz "Fintech — femenina, control de gastos" de `29-REFERENCIA-VISUAL.md`, traducida a modo claro sin desafinar el hue.
- Registro anti-repetición: paleta (azul-lila #5468D4 sobre crema cálida) y par tipográfico (DM Sans, una sola familia) — vetados para el próximo proyecto del SO.
- Modo: CLARO — derivado porque el nicho (hábitos/bienestar + finanzas personales) gana en claro (confianza cotidiana, "victoria visible", ritual diurno) y rompe con el fintech oscuro institucional que el avatar asocia a "el banco de mis papás".

## Idioma UI: Español LATAM neutro · Fecha de cierre de la ficha: PENDIENTE (falta aprobación del tour) · Aprobada por el usuario: NO
