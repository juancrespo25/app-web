import { useState, useMemo } from "react";
import type { UserItem } from "./useUsers";

export const useUserSearch = (users: UserItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    return users.filter(
      (user) =>
        user.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  // Handler para el cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    filteredUsers,
    handleSearchChange,
  };
};
