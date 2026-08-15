/**
 * Decodifica un JWT sin validar la firma (solo lectura de claims)
 */
export const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      atob(parts[1])
    );
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Verifica si el token ha expirado
 * Compara la fecha actual con el claim 'exp' del JWT
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp está en segundos, convertir a milisegundos
  const expirationTime = decoded.exp * 1000;
  const currentTime = new Date().getTime();

  return currentTime > expirationTime;
};

/**
 * Obtiene el token del localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Guarda el token en localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Elimina el token del localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Obtiene el tiempo restante en segundos antes de que expire el token
 */
export const getTokenExpiresIn = (token: string | null): number | null => {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;

  const expirationTime = decoded.exp * 1000;
  const currentTime = new Date().getTime();
  const remainingTime = Math.floor((expirationTime - currentTime) / 1000);

  return remainingTime > 0 ? remainingTime : 0;
};

/**
 * Valida si el token es válido (existe y no ha expirado)
 */
export const isTokenValid = (token: string | null): boolean => {
  return token !== null && !isTokenExpired(token);
};
