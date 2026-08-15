import { useState, useMemo } from "react";
import type { OrdenItem } from "./useOrden";

export const useOrdenSearch = (ordenes: OrdenItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrdenes = useMemo(() => {
    if (!searchTerm.trim()) {
      return ordenes;
    }

    return ordenes.filter(
      (orden) =>
        orden.customerDescripcion
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(orden.numero).includes(searchTerm),
    );
  }, [searchTerm, ordenes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return { filteredOrdenes, setSearchTerm, handleSearchChange };
};
