import axios from 'axios';
import { getEnvVar } from '@/utils/env';
import { getToken, removeToken } from '@/utils/token';

const api = axios.create({
  // Esto permite centralizar la URL de tu backend
  baseURL: getEnvVar('VITE_API_URL') || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud: agrega el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: maneja tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde con 401 (Unauthorized)
    if (error.response?.status === 401) {
      removeToken();
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exportamos la instancia para consumirla en los módulos de Clientes, Órdenes, etc.
export default api;