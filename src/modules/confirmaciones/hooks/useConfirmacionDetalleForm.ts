import { useState } from "react";

export type TipoConfirmacion = "EF" | "MT" | "";

export interface ConfirmacionDetalleForm {
  tipo: TipoConfirmacion;
  fecha: string;
  hora: string;
  // entregado
  parentesco: string;
  recibido: string;
  documento: string;
  // motivado
  motivo: string;
  puerta: string;
  color: string;
  nroSuministro: string;
}

const today = new Date().toISOString().split("T")[0];
const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const emptyDetalle: ConfirmacionDetalleForm = {
  tipo: "",
  fecha: today,
  hora: nowTime(),
  parentesco: "",
  recibido: "",
  documento: "",
  motivo: "",
  puerta: "",
  color: "",
  nroSuministro: "",
};

export const useConfirmacionDetalleForm = () => {
  const [detalle, setDetalle] = useState<ConfirmacionDetalleForm>(emptyDetalle);

  const setTipo = (tipo: TipoConfirmacion) =>
    setDetalle((prev) => ({
      ...prev,
      tipo,
      parentesco: "",
      recibido: "",
      documento: "",
      motivo: "",
      puerta: "",
      color: "",
      nroSuministro: "",
    }));

  const set = <K extends keyof ConfirmacionDetalleForm>(key: K, value: string) =>
    setDetalle((prev) => ({ ...prev, [key]: value }));

  const isDetalleValid =
    detalle.tipo !== "" &&
    detalle.fecha !== "" &&
    detalle.hora !== "" &&
    (detalle.tipo === "EF"
      ? detalle.parentesco !== "" && detalle.recibido !== ""
      : detalle.motivo !== "" && detalle.puerta !== "");

  const resetDetalle = () =>
    setDetalle({ ...emptyDetalle, hora: nowTime() });

  return { detalle, setTipo, set, isDetalleValid, resetDetalle };
};
