export const metadata = { title: "Términos y Condiciones — Respira" };

export default function Terminos() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-3xl font-bold [font-family:var(--font-display)]">
        Términos y Condiciones
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: [pendiente — se completa al confirmar el responsable y el dominio]
      </p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Qué es Respira</h2>
          <p className="mt-2">
            Respira es una app de acompañamiento diario que te ayuda a registrar cómo te sientes con
            tu dinero y a seguir metas simples de ahorro o deuda. Respira{" "}
            <strong className="font-semibold text-[var(--text-primary)]">no</strong> se conecta a tu
            cuenta bancaria, no da asesoría financiera profesional y no garantiza resultados
            económicos específicos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">El acceso y el pago</h2>
          <p className="mt-2">
            El acceso a Respira se vende como suscripción a través de Hotmart y se usa dentro de la
            aplicación web. Al suscribirte, aceptas también las condiciones de pago de Hotmart.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Uso aceptable</h2>
          <ul className="mt-2 list-disc pl-5">
            <li>Usar la app para tu propio registro personal, no para terceros sin su consentimiento.</li>
            <li>No intentar vulnerar la seguridad de la plataforma ni acceder a cuentas ajenas.</li>
            <li>Respira puede suspender o cerrar cuentas que violen estas condiciones.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Limitación de responsabilidad</h2>
          <p className="mt-2">
            Respira es una herramienta de acompañamiento y seguimiento personal — no es asesoría
            financiera, psicológica ni profesional de ningún tipo. Las decisiones sobre tu dinero
            son tuyas; te recomendamos consultar a un profesional para decisiones financieras
            importantes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Edad mínima</h2>
          <p className="mt-2">Respira está pensada para personas mayores de 18 años.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Ley aplicable</h2>
          <p className="mt-2">
            Estos términos se rigen por las leyes de [país del responsable]. Cualquier disputa se
            resuelve ante los tribunales competentes de esa jurisdicción.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contacto</h2>
          <p className="mt-2">
            <a href="mailto:hola@respira.app" className="underline underline-offset-4">hola@respira.app</a>
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
