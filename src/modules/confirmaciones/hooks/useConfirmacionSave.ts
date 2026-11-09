import { useState } from "react";
import { toast } from "sonner";
import { saveConfirmacion } from "../services/confirmacciones.service";
import type { ConfirmacionDetalleForm } from "./useConfirmacionDetalleForm";
import type { ConfirmacionSavePayload } from "../types/confirmacion.type";

const buildPayload = (
  nroCargo: string,
  detalle: ConfirmacionDetalleForm,
): ConfirmacionSavePayload => ({
  id_guia: Number(nroCargo),
  estado: detalle.tipo,
  tipo: "C",
  recibido: detalle.tipo === "EF" ? detalle.recibido : "",
  parentesco: detalle.tipo === "EF" ? detalle.parentesco : "",
  documento: detalle.tipo === "EF" ? detalle.documento : "",
  motivo: detalle.tipo === "MT" ? detalle.motivo : "",
  puerta: detalle.tipo === "MT" ? Number(detalle.puerta) || 0 : 0,
  colorpuerta: detalle.tipo === "MT" ? detalle.color : "",
  suministro: detalle.tipo === "MT" ? detalle.nroSuministro : "",
  fecha_descarga: detalle.fecha,
  hora_descarga: detalle.hora,
});

export const useConfirmacionSave = () => {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (nroCargo: string, detalle: ConfirmacionDetalleForm) => {
    setIsSaving(true);
    try {
      await saveConfirmacion(buildPayload(nroCargo, detalle));
      toast.success("Registro grabado");
      return true;
    } catch (error) {
      console.error("Error al guardar confirmación:", error);
      toast.error("No se pudo grabar el registro");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
};
