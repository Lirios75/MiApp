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
- Combinación tipográfica usada: fila "Hábitos/gamificada" de `29-REFERENCIA-VISUAL.md` (Nunito, redondeada, una sola familia) — validada contra la tabla de líderes (Habitica/Finch ya usan redondeada cálida).
- Arquetipo: Cuidador (con un toque de Inocente — permiso, sin culpa).
- Mundo del sujeto (0.45): respirar (inhalar/exhalar → anillo que se expande) · el bolsillo/monedero (formas redondeadas, no tarjetas duras) · la libreta emocional (textura cálida) · el semáforo de calma (verde=tranquila, naranja=alerta leve, NUNCA rojo punitivo) · la técnica de respiración 4-7-8 (motion lento, sin rebote).
- Dispositivo ownable: el anillo de respiración (propio, compatible con los líderes — Fintonic/Revolut ya usan anillos de progreso) · Líder de origen de la paleta: matriz "Fintech — femenina, control de gastos" de `29-REFERENCIA-VISUAL.md`, traducida a modo claro conservando el hue.

## Personalidad compilada
- 3 adjetivos de personalidad: calmada, permisiva, clara.
- Compilación: spring casi sin rebote (0–0.1) · duración base 300–380ms · exclamaciones máx 1/pantalla · celebración nivel medio (cambio de color + micro-mensaje, sin confeti) · radio tendencial 20–22px.

## Brand kit final (los valores que viven en globals.css/@theme)
- Fondo: `#FAF6EF` · Superficie: `#FFFDF8` · Hundido: `#F1EADC` (inputs, campos) · Texto 1º/2º: `#2A2620` / `#8C8172`
- Acento primario: `#5468D4` (azul-lila — SOLO en marca, anillo, CTA y selección)
- 2ª nota: `#2E9E6B` (verde — progreso positivo: ahorro, check-ins, celebración) · 3ª nota: `#E08A3C` (naranja — racha, hitos, alerta leve — nunca rojo)
- Semánticos: éxito `#2E9E6B` (comparte la 2ª nota) · error `#C15B4A` (terracota apagado, siempre con ícono — nunca solo color) · aviso `#E08A3C` (comparte la 3ª nota)
- Display: **Nunito** (pesos 700/800) · Body: **Nunito** (pesos 400/600) · Escala: display 34px / title 19px / body 15px / label 12px
- Radio: 22px cards / 16px botones · Profundidad: sombras suaves tintadas (RGB 42·38·32) + hairline sutil en elementos clave (nunca borde duro gris) · Espaciado base: escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: el anillo de respiración — se expande/llena como avance de meta o racha, mismo gesto que el nombre de la app
- Motion signature: ease-out suave, sin bounce (spring 0–0.1) · stagger 70–90ms · duración base 300–380ms · firma: "respirar" — fades amplios, nada abrupto

## Trazabilidad y vetos
- Ruta de diseño (PREGUNTA DE REFERENCIA del 54): propuesta propia (el usuario eligió opción 1).
- Protocolo A/B/C: página comparativa en `direcciones-abc.html` · screenshot en `docs/revisiones/direcciones-abc-full.png` · opción elegida: **B "Respira en calma"** · descartadas: A "Claridad templada" (dato-héroe estilo Fintonic, más frío/numérico) y C "Diario del dinero" (formato bitácora, más narrativo/lento para el check-in diario).
- Tour de la app: `vista-previa-app.html` · screenshot final en `docs/revisiones/vista-previa-app-full.png` · 5 vistas (principal/M0, onboarding, paywall, check-in, celebración) · **APROBADO por el usuario el 2026-09-17**, tras 2 rondas de ajuste: (1) más color funcional (verde=progreso, naranja=racha/hito) y pantallas más llenas, (2) cambio de tipografía de DM Sans → Nunito (comparada en `tipografia-opciones.html` contra Sora y Fraunces+Instrument Sans).
- Paleta derivada de: matriz "Fintech — femenina, control de gastos" de `29-REFERENCIA-VISUAL.md`, traducida a modo claro sin desafinar el hue; 2ª y 3ª nota (verde/naranja) responden al "semáforo de calma" ya documentado en Mundo del sujeto.
- Registro anti-repetición: paleta (azul-lila `#5468D4` + verde `#2E9E6B` + naranja `#E08A3C` sobre crema cálida) y tipografía (Nunito, una sola familia) — quedan VETADOS para el próximo proyecto del SO.
- Modo: CLARO — derivado porque el nicho (hábitos/bienestar + finanzas personales) gana en claro (confianza cotidiana, "victoria visible", ritual diurno) y rompe con el fintech oscuro institucional que el avatar asocia a "el banco de mis papás".

## Idioma UI: Español LATAM neutro · Fecha de cierre de la ficha: 2026-09-17 · Aprobada por el usuario: SÍ
