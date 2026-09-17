import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* AGENTS.md de este proyecto es el archivo de reglas del SO (idéntico a CLAUDE.md) —
     Next.js no debe tocarlo ni anexarle su propio bloque de reglas. */
  agentRules: false,
  /* El indicador flotante de dev ("N") se superponía en las capturas de revisión
     y no es parte del diseño de la app — se apaga para que no vuelva a contaminarlas. */
  devIndicators: false,
};

export default nextConfig;
