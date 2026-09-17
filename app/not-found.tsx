import Link from "next/link";
import { RespiraMark } from "@/components/RespiraMark";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[var(--bg)] px-4 py-16 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <RespiraMark />
      <h1 className="max-w-xs text-2xl font-bold [font-family:var(--font-display)]">
        No encontramos esta página
      </h1>
      <p className="max-w-sm text-base leading-relaxed text-[var(--text-secondary)]">
        Puede que el enlace esté roto o que esta parte de Respira todavía no exista.
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
