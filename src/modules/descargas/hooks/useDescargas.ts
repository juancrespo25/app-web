import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getDescargas } from "../services/descarga.service";
import type { IDescargaListItem } from "../types/descarga.types";

export const useDescargas = () => {
  const [descargas, setDescargas] = useState<IDescargaListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDescargas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDescargas();
      setDescargas(response.data ?? []);
    } catch {
      toast.error("No se pudieron cargar las descargas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDescargas();
  }, [fetchDescargas]);

  return { descargas, isLoading, refetch: fetchDescargas };
};
