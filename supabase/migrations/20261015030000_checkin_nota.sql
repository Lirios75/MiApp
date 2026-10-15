-- Nota opcional "¿en qué se te fue?" en el check-in diario (Sesión 6, feature pedida por la
-- usuaria). Aparece DESPUÉS de marcar el Semáforo, nunca antes — el check-in de 1 toque no
-- cambia, esto es un detalle que la persona puede agregar si quiere, no un paso obligatorio.

alter table public.checkins add column if not exists nota text;
