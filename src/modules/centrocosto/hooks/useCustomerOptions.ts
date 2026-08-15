import { useEffect, useState, useCallback } from "react";
import type { CustomerOption } from "../../customer/types/customer.type";
import { getAllCustomer } from "../services/centercosto.service";

export const useCustomerOptions = () => {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (isCached && customers.length > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllCustomer();
      
      if (!Array.isArray(data)) {
        throw new Error("Formato de respuesta inválido");
      }

      setCustomers(data);
      setIsCached(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar clientes";
      setError(errorMessage);
      console.error("Error cargando clientes:", err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [isCached, customers.length]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const refreshCustomers = useCallback(async () => {
    setIsCached(false);
    await loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    isLoading,
    error,
    refreshCustomers,
  };
};
