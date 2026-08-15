import { useCallback, useEffect, useState } from "react";
import type { GetAllOrdenResponseDetail } from "../types/order.type";
import { getAllOrdenToday } from "../services/order.service";

export type OrdenItem = GetAllOrdenResponseDetail;

export const useOrden = () => {
  const [ordenes, setOrdenes] = useState<OrdenItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrdenes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllOrdenToday();
      setOrdenes(result);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
      setOrdenes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrdenes();
  }, [loadOrdenes]);

  return {
    ordenes,
    isLoading,
    loadOrdenes,
  };
};
