// El dispositivo ownable de FICHA-ARTE.md: el anillo de respiración (75% lleno,
// el mismo gesto que la pantalla principal de la app) — la marca de Respira en
// vez de un cuadrado genérico.
export function RespiraMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="3" />
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="44.7"
        strokeDashoffset="11.2"
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
