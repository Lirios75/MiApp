-- Dos features opcionales pedidas por la usuaria (Sesión 7), ninguna cambia el toque
-- rápido tranquilo/alerta que ya existe — ambas son datos de más que la persona puede
-- agregar si quiere, nunca un paso obligatorio del check-in diario.
-- 1) emocion: una emoción más precisa (gratitud, ansiedad, etc.) encima del tranquilo/alerta.
-- 2) entradas/gastos: cuánto dinero entró y salió ese día — un número simple, no un presupuesto
--    detallado por categorías.

alter table public.checkins add column if not exists emocion text;
alter table public.checkins add column if not exists entradas numeric;
alter table public.checkins add column if not exists gastos numeric;
