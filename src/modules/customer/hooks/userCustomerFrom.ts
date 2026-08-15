import { useState, useEffect } from 'react';
import type { CustomerData, CustomerSave } from "../types/customer.type";
import { findByRuc } from "../services/customer.service";

export const useCustomerForm = (initialData: CustomerSave | CustomerData | null | undefined, isOpen: boolean) => {

    const [descripcion, setDescripcion] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ubigeo, setUbigeo] = useState('');
    const [ubigeoLabel, setUbigeoLabel] = useState('');
    const [contacto, setContacto] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [rucExists, setRucExists] = useState(false);
    const [isValidatingRuc, setIsValidatingRuc] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = email === '' || emailRegex.test(email);
    const isRucValid = ruc.trim().length === 11 && !ruc.trim().startsWith('0');

    const isFormValid =
        descripcion.trim() !== '' &&
        isRucValid &&
        !rucExists &&
        direccion.trim() !== '' &&
        ubigeo.trim() !== '' &&
        contacto.trim() !== '' &&
        email.trim() !== '' &&
        isEmailValid &&
        telefono.trim() !== '' &&
        user.trim() !== '' &&
        password.trim() !== '';


    useEffect(() => {
        if (isOpen && !initialData) {
            setDescripcion('');
            setRuc('');
            setDireccion('');
            setUbigeo('');
            setContacto('');
            setEmail('');
            setTelefono('');
            setUser('');
            setPassword('');
            setRucExists(false);
        } else if (initialData) {
            setDescripcion(initialData.descripcion || '');
            setRuc(initialData.ruc || '');
            setDireccion(initialData.direccion || '');
            setUbigeo(initialData.ubigeo || '');
            setUbigeoLabel(initialData.ubigeo || '');
            setContacto(initialData.contacto || '');
            setEmail(initialData.email || '');
            setTelefono(initialData.telefono || '');
            setUser(initialData.user || '');
            setPassword(initialData.password || '');
            setRucExists(false);
        }
    }, [initialData, isOpen]);

    // Validar RUC duplicado con debounce
    useEffect(() => {
        const validateRuc = async () => {
            // Solo validar si el RUC tiene 11 dígitos y no comienza con 0
            if (!isRucValid) {
                setRucExists(false);
                return;
            }

            // Si estamos en modo edición y el RUC es el mismo, no validar como duplicado
            if (initialData && initialData.ruc === ruc) {
                setRucExists(false);
                return;
            }

            try {
                setIsValidatingRuc(true);
                const result = await findByRuc(ruc);
                // Si la respuesta trae datos, significa que el RUC ya existe
                setRucExists(!!result);
            } catch {
                // Si hay error 404 o similar, significa que no existe
                setRucExists(false);
            } finally {
                setIsValidatingRuc(false);
            }
        };

        // Debounce de 500ms
        const timer = setTimeout(() => {
            validateRuc();
        }, 500);

        return () => clearTimeout(timer);
    }, [ruc, isRucValid, initialData]);

    return {
        descripcion, setDescripcion,
        ruc, setRuc,
        direccion, setDireccion,
        ubigeo, setUbigeo,
        ubigeoLabel, setUbigeoLabel,
        contacto, setContacto,
        email, setEmail,
        telefono, setTelefono,
        user, setUser,
        password, setPassword,
        isEmailValid,
        isFormValid,
        rucExists,
        isValidatingRuc,
    };
};
