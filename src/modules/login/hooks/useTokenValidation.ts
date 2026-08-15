import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, removeToken, getTokenExpiresIn } from '@/utils/token';

/**
 * Hook personalizado para validar y monitorear el estado del token
 * Redirige a login si el token expira
 */
export const useTokenValidation = () => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  // Función para verificar el token (sin incluir en dependencias)
  const checkTokenRef = useRef(() => {
    const token = getToken();
    
    if (isTokenExpired(token)) {
      setIsValid(false);
      removeToken();
      navigate('/login', { replace: true });
      return false;
    }

    setIsValid(true);
    const remaining = getTokenExpiresIn(token);
    setExpiresIn(remaining);
    return true;
  });

  // Verificar token al montar el componente y cada minuto
  useEffect(() => {
    // Verificar inmediatamente
    checkTokenRef.current();

    // Configurar verificación periódica cada minuto
    const interval = setInterval(() => {
      checkTokenRef.current();
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  return {
    isValid,
    expiresIn,
  };
};

/**
 * Hook para validar manualmente si el token es válido
 */
export const useIsTokenValid = () => {
  const token = getToken();
  return !isTokenExpired(token);
};
