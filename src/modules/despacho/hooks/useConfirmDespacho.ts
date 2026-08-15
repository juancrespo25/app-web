import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDespacho } from "../services/despacho.service";

export interface DespachoConfirm {
  id: string;
  estado: string;
}

export const useConfirmDespacho = (
  onSuccess?: () => void,
) => {
  const [despachoToConfirm, setDespachoToConfirm] =
    useState<DespachoConfirm | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmar = async () => {
    if (!despachoToConfirm) return;

    setIsConfirming(true);
    try {
      const { id } = despachoToConfirm;
      const response = await ConfirmDespacho(Number(id), "DF");
      if (response?.success) {
        toast.success("Despacho confirmado correctamente");
        setDespachoToConfirm(null);
        onSuccess?.();
      } else {
        toast.error(
          response?.message || "No se pudo confirmar el despacho",
        );
      }
    } catch (error) {
      console.error("Error al confirmar el despacho:", error);
      toast.error("Error al confirmar el despacho");
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    despachoToConfirm,
    setDespachoToConfirm,
    isConfirming,
    handleConfirmar,
  };
};
