import { useState } from "react";
import type { IGuiaDescargaDetail } from "../types/descarga.types";

export type TipoDescarga = "EF" | "MT" | "";

export interface DescargaDetalleForm {
  tipo: TipoDescarga;
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

const emptyDetalle: DescargaDetalleForm = {
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

export const useDescargaDetalleForm = () => {
  const [detalle, setDetalle] = useState<DescargaDetalleForm>(emptyDetalle);

  const setTipo = (tipo: TipoDescarga) =>
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

  const set = <K extends keyof DescargaDetalleForm>(key: K, value: string) =>
    setDetalle((prev) => ({ ...prev, [key]: value }));

  const loadDetalle = (data: IGuiaDescargaDetail) => {
    const tipo: TipoDescarga =
      data.estado === "EF" || data.estado === "MT" ? data.estado : "";
    const fecha =
      data.fecha_descarga instanceof Date
        ? data.fecha_descarga.toISOString().split("T")[0]
        : String(data.fecha_descarga ?? "").slice(0, 10);

    setDetalle({
      tipo,
      fecha,
      hora: (data.hora_descarga ?? "").slice(0, 5),
      parentesco: tipo === "EF" ? String(data.parentesco ?? "").trim() : "",
      recibido: tipo === "EF" ? (data.recibido ?? "") : "",
      documento: tipo === "EF" ? (data.documento ?? "") : "",
      motivo: tipo === "MT" ? String(data.motivo ?? "") : "",
      puerta: tipo === "MT" ? String(data.puerta ?? "") : "",
      color: tipo === "MT" ? (data.colorpuerta ?? "") : "",
      nroSuministro: tipo === "MT" ? (data.suministro ?? "") : "",
    });
  };

  const isDetalleValid =
    detalle.tipo !== "" &&
    detalle.fecha !== "" &&
    detalle.hora !== "" &&
    (detalle.tipo === "EF"
      ? detalle.parentesco !== "" && detalle.recibido !== ""
      : detalle.motivo !== "" && detalle.puerta !== "");

  const resetDetalle = () =>
    setDetalle({ ...emptyDetalle, hora: nowTime() });

  return { detalle, setTipo, set, isDetalleValid, resetDetalle, loadDetalle };
};
