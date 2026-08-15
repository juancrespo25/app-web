import { useState } from "react";
import { toast } from "sonner";
import { UpdateStatusDespacho } from "../services/despacho.service";

export interface DespachoEstadoUpdate {
  id: string;
  estado: string;
}

export const useUpdateDespachoEstado = (
  onSuccess?: () => void,
) => {
  const [despachoToUpdate, setDespachoToUpdate] =
    useState<DespachoEstadoUpdate | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirmar = async () => {
    if (!despachoToUpdate) return;

    setIsUpdating(true);
    try {
      const { id, estado } = despachoToUpdate;
      const response = await UpdateStatusDespacho(Number(id), estado);
      if (response?.success) {
        toast.success(
          estado === "DC" ? "Despacho cerrado" : "Despacho abierto",
        );
        setDespachoToUpdate(null);
        onSuccess?.();
      } else {
        toast.error(response?.message || "No se pudo actualizar el estado del despacho");
      }
    } catch (error) {
      console.error("Error al actualizar el estado del despacho:", error);
      toast.error("Error al actualizar el estado del despacho");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    despachoToUpdate,
    setDespachoToUpdate,
    isUpdating,
    handleConfirmar,
  };
};
