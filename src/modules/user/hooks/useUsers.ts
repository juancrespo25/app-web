import { useCallback, useEffect, useState } from 'react';
import type { UserFormData, UserUpdate } from '../types/UserForm.types';
import { save, getAll, deleteByCode, update } from '../services/user.service';

export type UserItem = UserUpdate & { status?: boolean };

export const useUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserUpdate | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [newUserKey, setNewUserKey] = useState(0);

  const normalizeUsers = (result: unknown): UserItem[] => {
    const normalized = result as { data?: unknown; users?: unknown };

    if (Array.isArray(result)) {
      return result as UserItem[];
    }

    if (Array.isArray(normalized.data)) {
      return normalized.data as UserItem[];
    }

    if (Array.isArray(normalized.users)) {
      return normalized.users as UserItem[];
    }

    return [];
  };

  const loadUsers = useCallback(async (status = true) => {
    try {
      const result = await getAll(status);
      setUsers(normalizeUsers(result));
      setShowDeleted(status === false);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      await loadUsers();
    };
    fetchUsers();
  }, [loadUsers]);

  const handleNewUserClick = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: UserItem) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userItem: UserItem) => {
    const confirmed = window.confirm(`¿Eliminar usuario ${userItem.codigo}?`);
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const currentUserCode = localStorage.getItem('user_code') || '';
      console.log(userItem.codigo, currentUserCode);
      await deleteByCode(userItem.codigo, currentUserCode);
      await loadUsers(showDeleted ? false : true);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('No se pudo eliminar el usuario.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveUser = async (formData: UserFormData) => {
    setIsProcessing(true);
    try {
      if (currentUser) {
        await update(currentUser.codigo, formData);
        alert('registro actualizado');
      } else {
        await save(formData);
        alert('registro guardado');
      }
      await loadUsers(showDeleted ? false : true);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('error al guardar el registro');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggleView = async () => {
    await loadUsers(showDeleted);
  };

  return {
    isModalOpen,
    currentUser,
    users,
    isProcessing,
    showDeleted,
    newUserKey,
    setNewUserKey,
    handleNewUserClick,
    handleViewUser,
    handleDeleteUser,
    handleSaveUser,
    closeModal,
    handleToggleView,
  };
};
