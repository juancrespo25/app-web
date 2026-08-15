import { useState, useEffect } from 'react';
import type { UserFormData, UserUpdate } from '../types/UserForm.types';

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export const useUserForm = (initialData: UserFormData | UserUpdate | null | undefined, isOpen: boolean) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [area, setArea] = useState('');
  const [user, setUser] = useState('');
  const [contrasena, setContrasena] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const getPhoneDigits = (value: string) => value.replace(/\D/g, '');
  const isEmailValid = email === '' || emailRegex.test(email);
  const isPhoneValid = getPhoneDigits(telefono).length === 9;

  const isFormValid =
    nombres.trim() !== '' &&
    apellidos.trim() !== '' &&
    email.trim() !== '' &&
    emailRegex.test(email) &&
    area.trim() !== '' &&
    isPhoneValid;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen && !initialData) {
      // Resetear campos cuando se abre el modal para nuevo usuario
      setNombres('');
      setApellidos('');
      setEmail('');
      setTelefono('');
      setArea('');
      setUser('');
      setContrasena('');
    } else if (initialData) {
      // Cargar datos cuando se edita un usuario
      setNombres(initialData.nombres || '');
      setApellidos(initialData.apellidos || '');
      setEmail(initialData.email || '');
      setTelefono(formatPhoneNumber(initialData.telefono || ''));
      setArea(initialData.area || '');
      setUser(initialData.user || '');
      setContrasena(initialData.password || '');
    }
  }, [initialData, isOpen]);

  return {
    nombres, setNombres,
    apellidos, setApellidos,
    email, setEmail,
    telefono, setTelefono,
    area, setArea,
    user, setUser,
    contrasena, setContrasena,
    isEmailValid,
    isFormValid,
  };
};