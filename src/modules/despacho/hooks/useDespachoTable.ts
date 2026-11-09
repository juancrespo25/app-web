import { useState, useEffect, useCallback, useRef } from "react";
import { getAllDespacho } from "../services/despacho.service";
import type { DespachoResponseDetail } from "../types/despacho.type";

export const useDespachoTable = () => {
  const [despachos, setDespachos] = useState<DespachoResponseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const fetchDespachos = useCallback(
    async (
      fechaInicial: string,
      fechaFinal: string,
      agente: string,
      estado: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDespacho(
          new Date(`${fechaInicial}T00:00:00`),
          new Date(`${fechaFinal}T23:59:59.999`),
          agente ? Number(agente) : 0,
          estado
        );
        setDespachos(data);
      } catch (err) {
        console.error("Error cargando despachos:", err);
        setError("No se pudieron cargar los despachos");
        setDespachos([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Carga inicial al montar el componente con el día actual
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const today = new Date().toISOString().split("T")[0];
    fetchDespachos(today, today, "", "");
  }, [fetchDespachos]);

  const loadDespachos = useCallback(
    (
      fechaInicial: string,
      fechaFinal: string,
      agente: string,
      estado: string
    ) => {
      fetchDespachos(fechaInicial, fechaFinal, agente, estado);
    },
    [fetchDespachos]
  );

  return {
    despachos,
    loading,
    error,
    loadDespachos,
  };
};
