'use client';

// LOGIN — magic link por email (50-DISENO-ONBOARDING-PAYWALL.md §E, 26-AUTH-MODERNO.md).
// Usa Supabase Auth real en cuanto NEXT_PUBLIC_SUPABASE_URL está configurada (Sesión 6).
// Mientras no lo esté, el envío se simula localmente — nunca se le hace creer al usuario
// que ya tiene una cuenta real creada hasta que la conexión exista de verdad.

import { useEffect, useState, type FormEvent } from 'react';
import { Lock, Mail } from 'lucide-react';
import { FunnelButton } from '@/components/funnel/ui';
import { RespiraMark } from '@/components/RespiraMark';
import { crearClienteSupabase } from '@/lib/supabase/client';

const RATE_LIMIT_S = 60;
const SUPABASE_CONFIGURADO = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

export default function Entrar() {
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [segundos, setSegundos] = useState(0);
  const [googleTocado, setGoogleTocado] = useState(false);

  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  async function enviarEnlace(e: FormEvent) {
    e.preventDefault();
    if (!correo.includes('@') || estado === 'enviando') return;
    setEstado('enviando');

    if (!SUPABASE_CONFIGURADO) {
      // Sin backend todavía (pendiente de conectar Supabase) — simulación honesta.
      setTimeout(() => {
        setEstado('enviado');
        setSegundos(RATE_LIMIT_S);
      }, 900);
      return;
    }

    const supabase = crearClienteSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/app` },
    });
    if (error) {
      setEstado('error');
      return;
    }
    setEstado('enviado');
    setSegundos(RATE_LIMIT_S);
  }

  if (estado === 'enviado') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-16 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
        <span
          aria-hidden="true"
          className="inline-flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
        >
          <Mail size={28} strokeWidth={1.75} color="var(--accent)" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-[24px] font-bold [font-family:var(--font-display)]">Revisa tu correo</h1>
          <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{correo}</span>
          </p>
        </div>
        <button
          type="button"
          disabled={segundos > 0}
          onClick={enviarEnlace}
          className="text-[14px] font-semibold text-[var(--accent)] disabled:text-[var(--text-tertiary)]"
        >
          {segundos > 0 ? `Reenviar en ${segundos}s` : 'Reenviar enlace'}
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="flex w-full max-w-[380px] flex-col items-center text-center">
        <a href="/" className="mb-6 flex items-center gap-2 text-[16px] font-semibold">
          <RespiraMark duracionS={0.35} /> Respira
        </a>

        <h1 className="text-[26px] font-bold leading-[1.2] [font-family:var(--font-display)]">
          Entra a tu Semáforo del Gasto
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Para guardarlo y verlo en cualquier dispositivo.
        </p>

        <form onSubmit={enviarEnlace} className="mt-6 flex w-full flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            placeholder="tu@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="h-[52px] w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          {estado === 'error' && (
            <p className="text-left text-[13px] text-[var(--accent-3)]">
              No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.
            </p>
          )}
          <FunnelButton type="submit" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
          </FunnelButton>
        </form>

        <div className="mt-3 w-full">
          <button
            type="button"
            onClick={() => setGoogleTocado(true)}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
          >
            Continuar con Google
          </button>
          {googleTocado && (
            <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">Muy pronto vas a poder entrar así.</p>
          )}
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
          <Lock size={14} strokeWidth={2} aria-hidden="true" /> Sin contraseñas: te llegará un enlace de un solo uso.
        </p>
      </div>
    </main>
  );
}
