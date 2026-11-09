import { useState } from "react";
import { toast } from "sonner";
import { saveDescarga } from "../services/descarga.service";
import type { DescargaDetalleForm } from "./useDescargaDetalleForm";
import type { DescargaSavePayload } from "../types/descarga.types";

const buildPayload = (
  nroCargo: string,
  detalle: DescargaDetalleForm,
): DescargaSavePayload => ({
  id_guia: Number(nroCargo),
  estado: detalle.tipo,
  tipo: "D",
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

export const useDescargaSave = () => {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (nroCargo: string, detalle: DescargaDetalleForm) => {
    setIsSaving(true);
    try {
      await saveDescarga(buildPayload(nroCargo, detalle));
      toast.success("Registro grabado");
      return true;
    } catch (error) {
      console.error("Error al guardar descarga:", error);
      toast.error("No se pudo grabar el registro");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
};
