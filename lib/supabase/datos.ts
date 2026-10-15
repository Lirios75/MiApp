'use client';

// Persistencia real de la app interna (Sesión 6) — reemplaza el localStorage
// de Sesión 5. Las funciones puras (racha, semanas, reflexión...) siguen en
// lib/app.ts sin cambios; esto solo lee/escribe las 3 tablas de Supabase
// (perfiles/checkins/metas — ver supabase/migrations/).

import { calcularRacha, hoyISO, OBJETIVO_HABITO_DIAS, type EstadoApp, type EstadoSemaforo, type Frecuencia, type ModoMeta } from '@/lib/app';
import { crearClienteSupabase } from './client';

async function usuarioId(): Promise<string> {
  const supabase = crearClienteSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Sin sesión activa');
  return data.user.id;
}

export async function obtenerEstadoApp(): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();

  const [{ data: perfil }, { data: checkins, error: errorCheckins }, { data: meta, error: errorMeta }] = await Promise.all([
    supabase.from('perfiles').select('fecha_inicio_trial').eq('id', uid).maybeSingle(),
    supabase.from('checkins').select('fecha, estado, nota').eq('user_id', uid).order('fecha'),
    supabase.from('metas').select('tipo, nombre, modo, objetivo, actual, frecuencia').eq('user_id', uid).maybeSingle(),
  ]);
  if (errorCheckins) throw errorCheckins;
  if (errorMeta) throw errorMeta;

  let fechaInicioTrial = perfil?.fecha_inicio_trial ?? null;
  if (!perfil) {
    fechaInicioTrial = hoyISO();
    const { error } = await supabase.from('perfiles').insert({ id: uid, fecha_inicio_trial: fechaInicioTrial });
    if (error) throw error;
  }

  return {
    checkins: (checkins ?? []).map((c) => ({ fecha: c.fecha, estado: c.estado as EstadoSemaforo, nota: c.nota ?? null })),
    meta: meta
      ? {
          tipo: meta.tipo,
          nombre: meta.nombre,
          modo: meta.modo as ModoMeta,
          objetivo: Number(meta.objetivo),
          actual: Number(meta.actual),
          frecuencia: (meta.frecuencia as Frecuencia | null) ?? null,
        }
      : null,
    fechaInicioTrial,
  };
}

export async function registrarCheckInSupabase(estadoSemaforo: EstadoSemaforo): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { error } = await supabase
    .from('checkins')
    .upsert({ user_id: uid, fecha: hoyISO(), estado: estadoSemaforo }, { onConflict: 'user_id,fecha' });
  if (error) throw error;
  return obtenerEstadoApp();
}

/** Guarda (o borra, si llega vacío) la nota opcional "¿en qué se te fue?" del check-in de hoy —
 * no toca el estado tranquilo/alerta ya marcado. */
export async function registrarNotaCheckInSupabase(nota: string): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { error } = await supabase
    .from('checkins')
    .update({ nota: nota.trim() || null })
    .eq('user_id', uid)
    .eq('fecha', hoyISO());
  if (error) throw error;
  return obtenerEstadoApp();
}

export async function crearMetaMontoSupabase(
  tipo: string,
  nombre: string,
  objetivo: number,
  actual: number,
  frecuencia: Frecuencia
): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { error } = await supabase
    .from('metas')
    .upsert({ user_id: uid, tipo, nombre, modo: 'monto', objetivo: Math.max(1, objetivo), actual: Math.max(0, actual), frecuencia });
  if (error) throw error;
  return obtenerEstadoApp();
}

/** Cambiar el nombre y/o la frecuencia de una meta "monto" ya creada (Editar en /app/meta),
 * sin tocar su objetivo/actual. */
export async function actualizarDetalleMetaSupabase(nombre: string, frecuencia: Frecuencia): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { error } = await supabase.from('metas').update({ nombre, frecuencia }).eq('user_id', uid);
  if (error) throw error;
  return obtenerEstadoApp();
}

export async function crearMetaHabitoSupabase(tipo: string, nombre: string, checkins: EstadoApp['checkins']): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { error } = await supabase
    .from('metas')
    .upsert({ user_id: uid, tipo, nombre, modo: 'habito', objetivo: OBJETIVO_HABITO_DIAS, actual: calcularRacha(checkins) });
  if (error) throw error;
  return obtenerEstadoApp();
}

export async function registrarAvanceMetaSupabase(delta: number): Promise<EstadoApp> {
  const supabase = crearClienteSupabase();
  const uid = await usuarioId();
  const { data: metaActual, error: errorLectura } = await supabase
    .from('metas')
    .select('actual')
    .eq('user_id', uid)
    .maybeSingle();
  if (errorLectura) throw errorLectura;
  if (!metaActual) return obtenerEstadoApp();
  const nuevoActual = Math.max(0, Number(metaActual.actual) + delta);
  const { error } = await supabase.from('metas').update({ actual: nuevoActual }).eq('user_id', uid);
  if (error) throw error;
  return obtenerEstadoApp();
}

export async function cerrarSesionSupabase(): Promise<void> {
  const supabase = crearClienteSupabase();
  await supabase.auth.signOut();
  try {
    window.localStorage.removeItem('respira_plan');
    window.localStorage.removeItem('respira_onboarding');
    window.localStorage.removeItem('respira_notificaciones');
  } catch {
    // localStorage no disponible — no hay nada que limpiar.
  }
}
