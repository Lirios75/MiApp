// Email directo con Resend — SOLO para avisos internos (a la dueña), no a compradoras. El acceso
// de las compradoras sigue viajando por Supabase Auth + el SMTP de Resend ya conectado (18-VENTA-
// HOTMART.md); esto es un canal aparte porque ese SMTP solo manda emails de autenticación.

import { Resend } from 'resend';

const SOPORTE_EMAIL = 'lina.rios@ikigaihumano.com';

/** El chequeo de la llave vive DENTRO de la función (no al importar el módulo) para que un
 * build sin el secreto a mano no tumbe el deploy. */
function resendCliente(): Resend {
  const llave = process.env.RESEND_API_KEY;
  if (!llave) throw new Error('FALTA RESEND_API_KEY');
  return new Resend(llave);
}

/** Avisa a la dueña por correo cuando entra un cobro real (no una prueba gratis). */
export async function avisarVentaRealADuena(datos: {
  email: string;
  nombre: string;
  plan: string | null;
  valor: number;
  moneda: string | null;
}): Promise<void> {
  const monto = datos.moneda ? `${datos.valor.toLocaleString('es')} ${datos.moneda}` : String(datos.valor);
  await resendCliente().emails.send({
    from: 'Respira <notificaciones@mail.ikigaihumano.com>',
    to: SOPORTE_EMAIL,
    subject: `💰 Nueva venta en Respira — ${datos.plan ?? 'plan'}`,
    html: `
      <p>Entró un cobro real en Respira.</p>
      <ul>
        <li><strong>Plan:</strong> ${datos.plan ?? 'sin especificar'}</li>
        <li><strong>Monto:</strong> ${monto}</li>
        <li><strong>Comprador:</strong> ${datos.nombre || 'sin nombre'} (${datos.email})</li>
      </ul>
    `,
  });
}
