# COPY — Onboarding, Paywall y Login de Respira

> Fuente: `FICHA-AVATAR.md` (Camila, 29, Colombia/México). Cada pregunta/reconocimiento se traza a un
> dolor/deseo/objeción de la ficha (02B: "el onboarding se deriva de la ficha, no se improvisa").

## 1. PREGUNTA — dolor (eco de la landing, Problema)
- título: `¿Qué te pasa más seguido?`
- opciones: Gasto y no sé en qué se me fue (dolor #1) · Reviso mi cuenta y me da ansiedad (dolor #4) ·
  Empiezo un presupuesto y lo dejo (dolor #3) · Siento que no tengo control (dolor #2)

## 2. RECONOCIMIENTO A — nombra el mecanismo (regla b de la escalera, 02B)
- título: `No es falta de disciplina`
- cuerpo: `Lo que marcaste no es un problema de fuerza de voluntad — es que nadie te acompaña justo el
  día que decides gastar. El Semáforo del Gasto te acompaña antes de que pase, no después.`

## 3. PREGUNTA — momento del día (ancla contextual, obligatoria en 02B)
- título: `¿En qué momento te pasa más?`
- sub: `Así ajustamos cuándo te recordamos marcar tu Semáforo.`
- opciones: En la mañana · En la tarde · En la noche · El fin de semana

## 4. PREGUNTA — ¿ya lo intentaste? (objeción #1 de la ficha)
- título: `¿Ya intentaste controlar tus gastos antes?`
- opciones: Sí, con un curso o journal · Sí, con otra app · Sí, a mano o en Excel · No, es la primera vez

## 5. RECONOCIMIENTO B — quita la culpa con la causa real (fórmula 50 §A5)
- si ya intentó algo: `Eso no fue tu culpa` — `Los presupuestos y los journals solo llevan el registro
  — ninguno te avisa el momento exacto en que estás por gastar por ansiedad. El Semáforo del Gasto sí:
  te frena 30 segundos antes de que pase, cada día.`
- si es la primera vez: `Buena señal empezar así` — `Vas a construir el hábito desde cero, sin tener
  que desaprender nada — con el Semáforo del Gasto notando el patrón contigo desde el primer día.`

## 6. PREGUNTA — meta principal (personaliza el paywall)
- título: `¿Cuál es tu meta principal?`
- opciones: Ahorrar para algo · Salir de una deuda · Dejar de gastar por impulso · Solo entender en qué
  se va la plata

## 7. COMPROMISO (ritual pre-loading, 50 §C3bis)
- título: `¿Lista para tu primer Semáforo?`
- cuerpo: `Mantén presionado para comprometerte a marcarlo todos los días esta semana.`

## 8. LOADING — "armando tu plan" (50 §B, labor illusion)
- headline: `Armando tu Semáforo del Gasto…`
- líneas (con las respuestas reales del usuario):
  `Analizando tu patrón: [dolor]` · `Ajustando la hora: [momento]` · `Preparando tu meta: [meta]` ·
  `Guardando tu compromiso diario`

## 9. PAYWALL
- headline: `Tu Semáforo del Gasto para [meta] está listo` — usa la META literal del quiz (deseo tangible)
- subhead (costo hundido, regla a de la escalera 02B): `Hecho con tus N respuestas`
- value stack (3 beneficios): `Tu Semáforo diario, sin conectar tu banco` · `Notas el patrón antes de
  que se repita` · `Tu racha y tu meta siempre visibles`
- planes: Anual $4.16/mes (se cobra $49.99/año, 5 meses gratis) · Mensual $6.99/mes — MISMOS números
  que `app/page.tsx` (Oferta de la landing); ver `lib/pricing.ts`
- timeline del trial (50 §C4, default con trial): Hoy — acceso completo · Día 5 — te avisamos ·
  Día 7 — 1er cobro (monto y fecha exactos, cancela antes sin costo)
- CTA: `Empezar mis 7 días gratis`
- reversibilidad: `Cancela cuando quieres · te avisamos antes del cobro`
- salida limpia: `Ahora no`
- trust row: `Pago seguro` · `Garantía de 14 días` (íconos Lucide Lock/ShieldCheck, jamás emoji)
- ⚠️ El CTA hoy lleva a `/entrar` en vez de a Hotmart — el checkout real se conecta en la Sesión 6
  (ver ESTADO.md). No es un checkout falso: solo avanza al siguiente paso simulado del flujo.

## 10. LOGIN (`/entrar`) — después del paywall, nunca antes (50 §E)
- headline: `Entra a tu Semáforo del Gasto`
- sub: `Para guardarlo y verlo en cualquier dispositivo.`
- CTA primario: `Enviarme mi enlace de acceso` (magic link — simulado hasta que Supabase Auth se
  conecte en la Sesión 6; ver ESTADO.md)
- estado enviado: `Revisa tu correo` · `Te enviamos el enlace a [correo]` · reenviar con cooldown de 60s
- secundario: `Continuar con Google` (aún no implementado — muestra "Muy pronto" al tocarlo, nunca
  queda muerto sin respuesta — regla UX 11 de CLAUDE.md)
- caption: `Sin contraseñas: te llegará un enlace de un solo uso.`
