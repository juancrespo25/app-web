import { useMemo, useState, type ChangeEvent } from "react";
import type { CentroCostoData } from "../types/centercost.type";

export const useCenterCostSearch = (centerCosts: CentroCostoData[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCenterCosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return centerCosts;
    }

    return centerCosts.filter((centerCost) =>
      centerCost.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, centerCosts]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return {
    searchTerm,
    filteredCenterCosts,
    handleSearchChange,
  };
};
