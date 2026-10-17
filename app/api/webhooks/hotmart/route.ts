// Webhook de Hotmart — docs/sistema/18-VENTA-HOTMART.md, "SEGURIDAD DEL WEBHOOK DE HOTMART".
// Orden obligatorio: autenticidad -> frescura -> catálogo permitido -> estado -> cuenta real ->
// idempotencia + cambio de estado (atómico, en la función apply_hotmart_event) -> email.
// NUNCA tocar la base de datos antes de verificar el hottok.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { verifyHotmart, esReciente } from '@/lib/hotmart-verify';
import { estadoParaEvento, type EstadoMembresia } from '@/lib/membership-fsm';
import { supabaseAdmin, crearOEncontrarUsuarioAuth, supabaseAnonServidor } from '@/lib/supabase/admin';
import { avisarVentaRealADuena } from '@/lib/email';
import { TRIAL_DIAS } from '@/lib/pricing';
import { HOTMART_PRODUCT_ID } from '@/lib/hotmart';

export const runtime = 'nodejs'; // necesitamos node:crypto y el cuerpo crudo (no Edge)

const DIAS_DE_GRACIA_PAGO_ATRASADO = 5;

async function registrarIntento(eventId: string | null, tipo: string | null, resultado: string) {
  await supabaseAdmin()
    .from('webhook_log')
    .insert({ event_id: eventId, type: tipo, result: resultado });
}

/** Extrae los campos que necesitamos del payload de Hotmart. El formato exacto se confirma
 * con el primer webhook real (Paso F de 18-VENTA-HOTMART.md) — por eso cada campo prueba
 * varias rutas posibles del JSON en vez de asumir una sola. */
function extraerDatosDelEvento(payload: Record<string, unknown>) {
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const producto = (data.product ?? {}) as Record<string, unknown>;
  const comprador = (data.buyer ?? {}) as Record<string, unknown>;
  const compra = (data.purchase ?? {}) as Record<string, unknown>;
  const suscripcion = (compra.subscription ?? data.subscription ?? {}) as Record<string, unknown>;
  const suscriptor = (suscripcion.subscriber ?? {}) as Record<string, unknown>;
  const plan = (suscripcion.plan ?? {}) as Record<string, unknown>;
  const precio = (compra.price ?? {}) as Record<string, unknown>;

  return {
    evento: String(payload.event ?? ''),
    productId: producto.id != null ? String(producto.id) : null,
    email: typeof comprador.email === 'string' ? comprador.email : null,
    nombre: typeof comprador.name === 'string' ? comprador.name : '',
    subscriberCode: typeof suscriptor.code === 'string' ? suscriptor.code : null,
    planName: typeof plan.name === 'string' ? plan.name : null,
    valor: typeof precio.value === 'number' ? precio.value : 0,
    moneda: typeof precio.currency_value === 'string' ? precio.currency_value : null,
    transaccion: typeof compra.transaction === 'string' ? compra.transaction : null,
    fechaMs:
      typeof payload.creation_date === 'number'
        ? payload.creation_date
        : typeof compra.approved_date === 'number'
          ? (compra.approved_date as number)
          : undefined,
  };
}

/**
 * Valida el importe de forma laxa a propósito: Hotmart cobra a cada comprador en SU moneda
 * local (confirmado con la primera compra real — el panel muestra USD, pero el correo de un
 * comprador en Colombia llegó en COP), así que no hay un monto/moneda fijo contra el que
 * comparar sin rechazar por error ventas reales de todo LATAM. La defensa real contra eventos
 * ajenos es el `productId` (paso 5 de abajo); aquí solo se descarta un valor imposible
 * (negativo), nunca un monto legítimo en otra moneda.
 */
function montoEsperadoValido(valor: number): boolean {
  return valor >= 0;
}

function calcularVentanasDeAcceso(estado: EstadoMembresia, planName: string | null) {
  const ahora = Date.now();
  let trialEndsAt: string | null = null;
  let accessUntil: string | null = null;
  let graceEndsAt: string | null = null;

  if (estado === 'trialing') {
    trialEndsAt = new Date(ahora + TRIAL_DIAS * 86_400_000).toISOString();
  }
  if (estado === 'past_due') {
    graceEndsAt = new Date(ahora + DIAS_DE_GRACIA_PAGO_ATRASADO * 86_400_000).toISOString();
  }
  if (estado === 'cancelled') {
    // No siempre viene la fecha exacta del próximo cobro en este evento — se usa el ciclo del
    // plan (mensual ~30 días, anual ~365) como piso razonable del acceso ya pagado. Se decide
    // por el NOMBRE del plan, no por el monto (el monto puede venir en cualquier moneda local).
    const diasDelCiclo = planName?.toLowerCase().includes('anual') ? 365 : 30;
    accessUntil = new Date(ahora + diasDelCiclo * 86_400_000).toISOString();
  }
  if (estado === 'expired') {
    accessUntil = new Date(ahora).toISOString(); // corta ya — expiró tras agotar reintentos
  }
  return { trialEndsAt, accessUntil, graceEndsAt };
}

export async function POST(req: NextRequest) {
  // 1. Leemos el cuerpo crudo ANTES de parsear (lo exige cualquier verificación de firma real).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok por header (camino principal) o, si no viene, por el cuerpo.
  let payload: Record<string, unknown> | undefined;
  const hottokHeader = req.headers.get('x-hotmart-hottok') ?? undefined;
  let hottok = hottokHeader;
  if (!hottok) {
    try {
      payload = JSON.parse(rawBody);
      const posible = (payload as Record<string, unknown>).hottok;
      if (typeof posible === 'string') hottok = posible;
    } catch {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }
  }

  let autenticado: boolean;
  try {
    autenticado = verifyHotmart({ hottok });
  } catch (error) {
    console.error('webhook hotmart: falta configuración', error);
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });
  }
  if (!autenticado) {
    await registrarIntento(null, null, 'unauthorized').catch(() => {});
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 3. Parsear (si no lo hicimos ya buscando el hottok en el cuerpo).
  if (!payload) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }
  }

  const datos = extraerDatosDelEvento(payload!);

  // 4. Frescura (anti-replay).
  if (!esReciente(datos.fechaMs)) {
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  const eventId =
    (payload!.id as string | undefined) ??
    (payload!.event_id as string | undefined) ??
    datos.transaccion ??
    `${datos.evento}:${datos.email}:${datos.fechaMs ?? ''}`;

  // 5. Catálogo permitido: producto, moneda e importe esperados — nunca confiar en el payload.
  if (datos.productId !== HOTMART_PRODUCT_ID || !montoEsperadoValido(datos.valor)) {
    console.error('webhook hotmart: evento fuera del catálogo esperado', {
      evento: datos.evento,
      productId: datos.productId,
      valor: datos.valor,
      moneda: datos.moneda,
    });
    await registrarIntento(eventId, datos.evento, 'unauthorized').catch(() => {});
    return NextResponse.json({ received: true, ignored: 'catalog' });
  }

  // 6. ¿Qué estado implica este evento? Si no lo mapeamos (ej. SWITCH_PLAN), lo ignoramos sin
  //    tocar nada — no hace falta dedupe para un evento que no cambia nada.
  const nuevoEstado = estadoParaEvento(datos.evento, datos.valor);
  if (!nuevoEstado) {
    return NextResponse.json({ received: true, ignored: datos.evento });
  }
  if (!datos.email) {
    await registrarIntento(eventId, datos.evento, 'error').catch(() => {});
    return NextResponse.json({ error: 'missing buyer email' }, { status: 400 });
  }

  // 7. Cuenta real ANTES de marcar el evento como procesado — si esto falla, Hotmart reintenta
  //    (el evento todavía no quedó "procesado" en ningún lado).
  let userId: string;
  try {
    userId = await crearOEncontrarUsuarioAuth(datos.email, datos.nombre);
  } catch (error) {
    console.error('webhook hotmart: no se pudo crear/encontrar la cuenta', error);
    await registrarIntento(eventId, datos.evento, 'error').catch(() => {});
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }

  const { trialEndsAt, accessUntil, graceEndsAt } = calcularVentanasDeAcceso(nuevoEstado, datos.planName);
  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

  // 8. Idempotencia + cambio de estado, atómicos (ver la función en la migración).
  const { data, error } = await supabaseAdmin().rpc('apply_hotmart_event', {
    p_event_id: eventId,
    p_event_type: datos.evento,
    p_payload_hash: payloadHash,
    p_user_id: userId,
    p_email: datos.email,
    p_subscriber_code: datos.subscriberCode,
    p_plan_name: datos.planName,
    p_new_status: nuevoEstado,
    p_trial_ends_at: trialEndsAt,
    p_access_until: accessUntil,
    p_grace_ends_at: graceEndsAt,
  });

  if (error) {
    console.error('webhook hotmart: error aplicando el evento', { evento: datos.evento, codigo: error.code });
    await registrarIntento(eventId, datos.evento, 'error').catch(() => {});
    return NextResponse.json({ error: 'processing failed' }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const resultado: string =
    data?.status === 'applied' ? 'applied' : data?.status === 'duplicate' ? 'duplicate' : 'illegal';
  await registrarIntento(eventId, datos.evento, resultado).catch(() => {});

  // 9. Email de acceso — SOLO si de verdad aplicamos el evento (no en duplicados/ilegales) y
  //    el estado da acceso. Reusa el enlace mágico + Resend ya conectados (mismo camino de
  //    /entrar) en vez de montar un envío de correo aparte.
  if (resultado === 'applied' && (nuevoEstado === 'trialing' || nuevoEstado === 'active')) {
    try {
      await supabaseAnonServidor().auth.signInWithOtp({ email: datos.email, options: { shouldCreateUser: false } });
    } catch (error) {
      console.error('webhook hotmart: no se pudo enviar el enlace de acceso', error);
      // No fallamos la respuesta por esto — la cuenta y el acceso YA quedaron correctos; la
      // usuaria siempre puede pedir otro enlace desde /entrar con el mismo correo.
    }
  }

  // 10. Aviso a la dueña — SOLO en un cobro real (no en el inicio de la prueba gratis).
  if (resultado === 'applied' && nuevoEstado === 'active') {
    try {
      await avisarVentaRealADuena({
        email: datos.email,
        nombre: datos.nombre,
        plan: datos.planName,
        valor: datos.valor,
        moneda: datos.moneda,
      });
    } catch (error) {
      console.error('webhook hotmart: no se pudo avisar la venta a la dueña', error);
      // No fallamos la respuesta por esto — el cobro y el acceso ya quedaron correctos.
    }
  }

  // 10. Siempre 200 cuando la decisión ya se tomó (incluido duplicate/illegal) — Hotmart deja
  //     de reintentar. Los 5xx de arriba son los únicos casos donde SÍ queremos que reintente.
  return NextResponse.json({ received: true, result: resultado });
}
