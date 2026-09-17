import Link from "next/link";
import { RespiraMark } from "@/components/RespiraMark";

export const metadata = { title: "Entrar a Respira" };

export default function Entrar() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-16 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <RespiraMark />
      <h1 className="max-w-xs text-2xl font-bold [font-family:var(--font-display)]">
        Estamos preparando el ingreso
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
        Todavía estamos construyendo el inicio de sesión de Respira. Si ya tienes cuenta, pronto
        vas a poder entrar desde aquí.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
