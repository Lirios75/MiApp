export const metadata = { title: "Privacidad — Respira" };

export default function Privacidad() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-3xl font-bold [font-family:var(--font-display)]">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: [pendiente — se completa al confirmar el responsable y el dominio]
      </p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          Respira (&quot;la app&quot;) es operada por [Nombre o razón social del responsable], con
          domicilio en [país]. Esta política explica qué datos recopilamos, cómo los usamos y cómo
          puedes controlarlos.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Qué datos recopilamos</h2>
          <ul className="mt-2 list-disc pl-5">
            <li>Datos de cuenta: correo electrónico.</li>
            <li>Datos de uso del producto: tus check-ins diarios (estado de ánimo y notas cortas), tus metas de ahorro/deuda y tu racha.</li>
            <li>Datos de pago: procesados directamente por Hotmart — Respira no almacena tu tarjeta.</li>
          </ul>
          <p className="mt-2">
            Respira <strong className="font-semibold text-[var(--text-primary)]">nunca</strong> pide ni
            almacena credenciales o datos de tu cuenta bancaria: todo el registro es manual.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Con quién compartimos datos</h2>
          <ul className="mt-2 list-disc pl-5">
            <li><strong className="font-semibold text-[var(--text-primary)]">Supabase</strong> — base de datos y autenticación.</li>
            <li><strong className="font-semibold text-[var(--text-primary)]">Hotmart</strong> — procesamiento de pagos y suscripción.</li>
            <li><strong className="font-semibold text-[var(--text-primary)]">Resend</strong> — envío de correos transaccionales.</li>
            <li><strong className="font-semibold text-[var(--text-primary)]">Vercel</strong> — hosting de la aplicación.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cómo eliminar tus datos</h2>
          <p className="mt-2">
            Puedes pedir la eliminación completa de tu cuenta y tus datos escribiendo a{" "}
            <a href="mailto:hola@respira.app" className="underline underline-offset-4">hola@respira.app</a>.
            Procesamos la solicitud en un plazo razonable y te confirmamos por correo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contacto</h2>
          <p className="mt-2">
            Para cualquier duda sobre esta política, escribe a{" "}
            <a href="mailto:hola@respira.app" className="underline underline-offset-4">hola@respira.app</a>.
          </p>
        </section>

        <p className="text-sm text-[var(--text-tertiary)]">
          Este documento es un borrador inicial redactado conforme a la especificación del sistema
          interno del proyecto. Antes de publicar la app, se recomienda la revisión de un abogado
          local.
        </p>
      </div>
    </main>
  );
}
