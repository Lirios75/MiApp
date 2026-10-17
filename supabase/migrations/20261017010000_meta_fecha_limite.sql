-- Fecha límite opcional para las metas de monto (ahorro/deuda) — pedida por la usuaria.
alter table public.metas
  add column if not exists fecha_limite date;
