import { getEnvVar } from "@/utils/env";

const requireApiUrl = (name: string): string => {
  const value = getEnvVar(name)?.trim();
  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }
  return value.replace(/\/+$/, "");
};

export const API_URL = requireApiUrl("VITE_API_URL");
export const OPERACIONES_API_URL = requireApiUrl("VITE_OPERACIONES_API_URL");
