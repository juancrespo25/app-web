/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Obtiene el valor de una variable de entorno en runtime o build time
 * @param envKey - La clave de la variable de entorno (ej: 'VITE_API_URL')
 * @returns El valor de la variable de entorno
 */
export const getEnvVar = (envKey: string): string => {
  // Intentar obtener desde window._env_ (runtime - Docker)
  if (typeof window !== 'undefined' && (window as any)._env_?.[envKey]) {
    return (window as any)._env_[envKey];
  }
  
  // Fallback a import.meta.env (build time - desarrollo)
  return (import.meta.env as any)[envKey] as string;
};
