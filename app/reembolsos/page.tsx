export const metadata = { title: "Política de Reembolsos — Respira" };

export default function Reembolsos() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-3xl font-bold [font-family:var(--font-display)]">
        Política de Reembolsos
      </h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        Última actualización: [pendiente — se completa al configurar Hotmart, Sesión 6]
      </p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            La Garantía de los Primeros 14 Días Sin Culpa
          </h2>
          <p className="mt-2">
            Tienes 7 días de prueba gratis para probar Respira sin que se te cobre nada. Si ya
            pagaste y en tus primeros 14 días con el Semáforo del Gasto no logras notar un
            patrón real, escríbenos a{" "}
            <a href="mailto:lina.rios@ikigaihumano.com" className="underline underline-offset-4">lina.rios@ikigaihumano.com</a>{" "}
            y te devolvemos todo. Sin preguntas, sin formularios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Reembolsos procesados por Hotmart</h2>
          <p className="mt-2">
            Tu compra se procesa a través de Hotmart, que además ofrece su propia política de
            reembolso vigente según tu país y el momento de la compra. Esta página se actualizará
            con el plazo exacto en cuanto quede configurado en la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cómo pedir un reembolso</h2>
          <ol className="mt-2 list-decimal pl-5">
            <li>Escribe a <a href="mailto:lina.rios@ikigaihumano.com" className="underline underline-offset-4">lina.rios@ikigaihumano.com</a> desde el correo con el que compraste.</li>
            <li>Cuéntanos brevemente qué pasó (no es obligatorio, pero nos ayuda a mejorar).</li>
            <li>Procesamos la devolución a través de Hotmart en los plazos que su plataforma indique.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cancelar tu suscripción</h2>
          <p className="mt-2">
            Puedes cancelar cuando quieras desde tu cuenta, sin llamadas ni formularios. Al cancelar,
            conservas el acceso hasta el final del período ya pagado.
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
