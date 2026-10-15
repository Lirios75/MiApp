-- Agrega "quincenal" a las frecuencias válidas de una meta de ahorro (Sesión 6, la usuaria
-- notó que faltaba junto a diario/semanal/mensual/semestral/anual).

alter table public.metas drop constraint if exists metas_frecuencia_check;

alter table public.metas add constraint metas_frecuencia_check
  check (frecuencia is null or frecuencia in ('diario', 'semanal', 'quincenal', 'mensual', 'semestral', 'anual'));
