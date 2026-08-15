import { Navigate } from 'react-router-dom';
import { useTokenValidation } from '@/modules/login/hooks/useTokenValidation';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

/**
 * Componente que protege rutas validando que el token sea válido
 * Si el token está expirado o no existe, redirige a login
 */
export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isValid } = useTokenValidation();

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return element;
};
