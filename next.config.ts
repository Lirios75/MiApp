import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* AGENTS.md de este proyecto es el archivo de reglas del SO (idéntico a CLAUDE.md) —
     Next.js no debe tocarlo ni anexarle su propio bloque de reglas. */
  agentRules: false,
};

export default nextConfig;
