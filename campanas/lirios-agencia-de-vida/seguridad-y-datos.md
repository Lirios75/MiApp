# Cómo hacer la campaña más segura — Lirios Agencia de Vida

En seguros se maneja información delicada (salud, ingresos, créditos, familia). Estas son
las medidas, de la más importante a la menos.

## 1. Pide lo mínimo
- En el formulario de tu página y en WhatsApp pide SOLO: nombre, celular y qué te interesa.
- NUNCA por formulario, correo o WhatsApp: cédula escaneada, historia clínica, extractos
  bancarios, contraseñas ni datos de tarjeta. Eso se revisa en la reunión o por el canal
  oficial de la aseguradora.

## 2. Autorización de datos (Ley 1581 de 2012, Colombia)
- Debajo del botón del formulario agrega una casilla SIN marcar:
  "☐ Autorizo a Lirios Agencia de Vida a tratar mis datos para contactarme por WhatsApp,
  llamada y correo, según su política de privacidad."
- Enlaza una página de **política de privacidad** (quién guarda los datos, para qué, y cómo
  pedir que se borren).
- Todo correo lleva enlace de baja, y todo WhatsApp respeta la palabra SALIR.

## 3. Que nadie pueda suplantarte (correo)
- Envía desde un correo con **tu propio dominio** (ej. lina@liriosagenciadevida.com), no
  desde Gmail, y a través de una herramienta de correo (Brevo, Mailchimp o Resend).
- Al conectar el dominio, la herramienta te pide activar 3 registros (SPF, DKIM y DMARC):
  son como la firma notarial del correo. Sin ellos tus correos caen en spam y cualquiera
  podría enviar correos falsos a tu nombre.
- No adjuntes archivos: usa botones que lleven a tu página.

## 4. Que nadie pueda suplantarte (WhatsApp)
- Perfil de WhatsApp Business completo y, si llegas a volumen, la versión oficial verificada.
- El aviso "nunca te pediré claves ni datos bancarios" ya va en el correo y en las
  respuestas rápidas.

## 5. Tu página de Lovable (para pedírselo a Lovable)
Pega este texto en el chat de Lovable:

> "Revisa la seguridad del formulario: (1) si los datos se guardan en Supabase, activa
> RLS en la tabla para que nadie pueda leer los registros desde el navegador, solo
> insertar; (2) valida en el servidor que el celular y el nombre tengan formato correcto
> y limita el largo de cada campo; (3) agrega protección anti-robots (Cloudflare
> Turnstile o hCaptcha) y un límite de envíos por minuto; (4) agrega la casilla de
> autorización de datos sin marcar y obligatoria, y una página de política de
> privacidad; (5) que ninguna clave secreta esté en el código del navegador."

Lo más importante es el punto (1): si la tabla no tiene esa protección, cualquiera con
algo de conocimiento podría descargar la lista de todas las personas que te dejaron sus datos.
