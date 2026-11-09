import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getConfirmaciones } from "../services/confirmacciones.service";
import type { IConfirmacionListItem } from "../types/confirmacion.type";

export const useConfirmaciones = () => {
  const [confirmaciones, setConfirmaciones] = useState<IConfirmacionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConfirmaciones = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getConfirmaciones();
      setConfirmaciones(response.data ?? []);
    } catch {
      toast.error("No se pudieron cargar las confirmaciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConfirmaciones();
  }, [fetchConfirmaciones]);

  return { confirmaciones, isLoading, refetch: fetchConfirmaciones };
};
