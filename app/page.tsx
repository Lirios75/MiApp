'use client';

import { Hero } from "@/components/landing/Hero";
import { Problema } from "@/components/landing/Problema";
import { Agitacion } from "@/components/landing/Agitacion";
import { Solucion } from "@/components/landing/Solucion";
import { AppPorDentro } from "@/components/landing/AppPorDentro";
import { Oferta } from "@/components/landing/Oferta";
import { Garantia } from "@/components/landing/Garantia";
import { Faq } from "@/components/landing/Faq";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { FooterLegal } from "@/components/landing/FooterLegal";
import { StickyCtaMobile } from "@/components/landing/ui";
import { RespiraMark } from "@/components/RespiraMark";

// Modelo onboarding-first (02C/ESTADO.md): el CTA lleva al onboarding gratis,
// nunca directo al checkout — el pago se cierra en el paywall in-app (Sesión 4).
const CTA_HREF = "/onboarding";
const CTA_LABEL = "Quiero mi primer registro";

export default function LandingRespira() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="Respira"
        logo={<RespiraMark />}
        loginHref="/entrar"
        h1Marked="Deja de [acento]gastar por ansiedad[/acento] sin darte cuenta"
        subtitleMarked="Un registro de 30 segundos para notar el patrón antes de repetirlo."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Sin conectar tu banco · cancela cuando quieras</span>}
        visualPlaceholderSugerencia="captura de tu pantalla principal con el anillo de tu meta y tu racha"
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { emoji: "💸", textoMarked: "¿Gastas y después no sabes en qué se te fue la plata?" },
          { emoji: "😰", textoMarked: "¿Revisar tu cuenta te da ansiedad, así que mejor no miras?" },
          { emoji: "🔁", textoMarked: "¿Ya empezaste un presupuesto y lo dejaste antes de la semana?" },
          { emoji: "😔", textoMarked: "¿Sientes que no tienes control sobre ti misma con el dinero?" },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          "Cada gasto sin darte cuenta no es solo plata: es otra vez [b]la culpa en ti misma[/b].",
          "Si sigue igual, en seis meses vas a seguir evitando mirar tu cuenta — con seis meses menos.",
          "El presupuesto que abandonaste no falló porque seas indisciplinada: falló porque [b]nadie te acompañó cada día[/b].",
        ]}
        contraste={{
          labelHoy: "Hoy",
          hoy: "Gastas sin darte cuenta y evitas mirar tu cuenta por la ansiedad.",
          labelFuturo: "En 6 meses, si nada cambia",
          futuro: "El mismo patrón — con 6 meses menos y la misma culpa.",
        }}
      />

      {/* 4. SOLUCIÓN — el Semáforo del Gasto */}
      <Solucion
        tituloMarked="Nota el patrón [acento]antes de repetirlo[/acento]"
        mecanismo="el Semáforo del Gasto"
        bigIdeaMarked="No te falta disciplina — te falta notar la ansiedad [b]antes de gastar[/b]. [acento]El Semáforo del Gasto[/acento] te hace parar 30 segundos cada día para nombrarla."
        pasos={[
          { titulo: "Marca cómo te sientes", detalle: "En un toque, marcas tu ánimo con la plata hoy." },
          { titulo: "El Semáforo lo guarda", detalle: "Arma tu patrón de la semana sin que hagas nada más." },
          { titulo: "Ves la alerta a tiempo", detalle: "Sabes cuándo se repite el gasto antes de que pase." },
        ]}
        antesDespues={{
          labelAntes: "Antes",
          antes: "Gastas y descubres la culpa recién al final del mes.",
          labelDespues: "Después",
          despues: "Notas la ansiedad el mismo día y decides distinto.",
        }}
      />

      {/* 5. LA APP POR DENTRO — placeholders honestos (app interna: Sesión 5) */}
      <AppPorDentro
        tituloMarked="Tu semana, [acento]sin culpa[/acento]"
        frames={[
          { label: "Tu registro de 30 segundos", nombrePantalla: "Registro diario" },
          { label: "Tu meta de ahorro creciendo", nombrePantalla: "Metas" },
          { label: "Tu racha de la semana", nombrePantalla: "Pantalla principal" },
          { label: "Tu semana, explicada", nombrePantalla: "Reporte semanal" },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — anual primero, trial 7 días en ambos, total siempre visible */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]$0.14 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: "Respira Pro con el Semáforo del Gasto (12 meses)", valor: "$84" },
            { resultado: "Guía «Primeros 7 días sin culpa»", valor: "$19" },
            { resultado: "Plantilla «Mi primera meta de ahorro»", valor: "$15" },
          ],
          totalTachado: "$118",
          nota: "Hoy: $4.16/mes (se cobra $49.99/año)",
        }}
        anual={{
          nombre: "Anual",
          badge: "5 MESES GRATIS",
          precioMes: "$4.16",
          totalAnual: "Se cobra $49.99/año",
          ahorro: "Ahorras ~40% vs. mensual",
          descomposicionDia: "menos de $0.14 al día",
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            "Check-in diario sin conectar tu banco",
            "Metas de ahorro y deuda ilimitadas",
            "Tu racha y tu progreso siempre visibles",
            "Un tip corto cada día, sin sermones",
          ],
        }}
        mensual={{
          nombre: "Mensual",
          precioMes: "$6.99",
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            "Check-in diario sin conectar tu banco",
            "Metas de ahorro y deuda ilimitadas",
            "Tu racha y tu progreso siempre visibles",
            "Cancelas cuando quieras",
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía de los Primeros 14 Días Sin Culpa"
        condicionMarked="Si en tus primeros 14 días pagados el [b]Semáforo del Gasto[/b] no te ayuda a notar un patrón real, escribes un correo y te devolvemos todo. Sin preguntas."
        pisoLegal="7 días de prueba gratis + 14 días de garantía pagada"
      />

      {/* 8. FAQ — objeciones de FICHA-AVATAR.md, en orden de fuerza */}
      <Faq
        items={[
          {
            pregunta: "¿Necesito conectar mi cuenta bancaria?",
            respuestaMarked:
              "No. Todo el registro es manual — [b]tú decides qué anotar[/b], sin dar acceso a tu banco.",
          },
          {
            pregunta: "Ya probé un curso, un journal y otra app, ¿por qué esta sí?",
            respuestaMarked:
              "Porque no es otro presupuesto: es un registro de 30 segundos que conecta tu emoción con tu gasto, [b]antes de que se repita[/b].",
          },
          {
            pregunta: "¿Cuánto tiempo me toma cada día?",
            respuestaMarked:
              "Menos de 30 segundos. No es journaling largo — es una marca y listo.",
          },
          {
            pregunta: "¿Es seguro pagar con mi tarjeta?",
            respuestaMarked:
              "Sí. El pago lo procesa Hotmart, la misma pasarela de miles de cursos y apps en español.",
          },
          {
            pregunta: "¿Puedo cancelar cuando quiera?",
            respuestaMarked:
              "Sí, sin llamadas ni formularios: cancelas desde tu cuenta [b]cuando quieras[/b].",
          },
          {
            pregunta: "¿Vale la pena pagar por esto?",
            respuestaMarked:
              "Cuesta menos que un café a la semana — y te ayuda a dejar de perder plata [b]que ni recuerdas en qué se fue[/b].",
          },
        ]}
      />

      {/* 9. CTA FINAL + PS */}
      <CtaFinal
        h2Marked="Empieza a [acento]respirar[/acento] con tu plata"
        futurePacingMarked="Imagina revisar tu cuenta sin que se te acelere el pecho, ya sabiendo tu patrón."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · cancela cuando quieras"
        psMarked="PS: Respira conecta tu emoción con tu gasto con el Semáforo del Gasto. Hoy entras con 7 días gratis y la Garantía de los Primeros 14 Días Sin Culpa."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="Respira"
        logo={<RespiraMark />}
        soporteEmail="lina.rios@ikigaihumano.com"
        enlaces={[
          { label: "Privacidad", href: "/privacidad" },
          { label: "Términos y Condiciones", href: "/terminos" },
          { label: "Reembolsos", href: "/reembolsos" },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
