-- Agrega la frecuencia de ahorro a las metas de tipo "monto" (Sesión 6, feature pedida
-- por la usuaria): ahora puede elegir cada cuánto quiere ahorrar (diario/semanal/mensual/
-- semestral/anual). Las metas de tipo "habito" no la usan (se miden en racha de días).

alter table public.metas add column if not exists frecuencia text
  check (frecuencia is null or frecuencia in ('diario', 'semanal', 'mensual', 'semestral', 'anual'));
