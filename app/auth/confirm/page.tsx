'use client';

// Recibe el clic del enlace del correo (enlace mágico o confirmación de registro).
// Con las plantillas de correo POR DEFECTO de Supabase (sin SMTP propio todavía —
// Resend es un paso posterior), el enlace redirige aquí con la sesión ya armada
// en el fragmento de la URL (#access_token=...), no como parámetros normales.
// El cliente de Supabase la detecta solo al cargar — por eso esta pantalla es
// 'use client' y no una ruta de servidor.

import { useEffect, useState } from 'react';
import { crearClienteSupabase } from '@/lib/supabase/client';

export default function ConfirmarAcceso() {
  const [estado, setEstado] = useState<'verificando' | 'error'>('verificando');

  useEffect(() => {
    const supabase = crearClienteSupabase();
    const siguiente = new URLSearchParams(window.location.search).get('next') ?? '/app';

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setEstado('error');
        return;
      }
      window.location.replace(siguiente);
    });
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      {estado === 'verificando' ? (
        <p className="text-[15px] text-[var(--text-secondary)]">Entrando a tu cuenta…</p>
      ) : (
        <>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Este enlace ya no es válido. Pide uno nuevo para entrar.
          </p>
          <a href="/entrar" className="text-[14px] font-semibold text-[var(--accent)]">
            Volver a intentar
          </a>
        </>
      )}
    </main>
  );
}
