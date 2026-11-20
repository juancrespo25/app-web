import api from "@/services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";

type RangoImpresion = { itemDesde?: number; itemHasta?: number };

const getImpresion = async (
  orden: string,
  tipo: "impresion" | "etiquetas-barra",
  rango?: RangoImpresion,
): Promise<Blob> => {
  const response = await api.get<Blob>(
    `/ordenes/${encodeURIComponent(orden)}/guias/${tipo}`,
    {
      baseURL: OPERACIONES_API_URL,
      params: rango,
      responseType: "blob",
    },
  );
  return response.data;
};

export const getCargosImpresion = (orden: string, rango?: RangoImpresion) =>
  getImpresion(orden, "impresion", rango);

export const getEtiquetasImpresion = (orden: string, rango?: RangoImpresion) =>
  getImpresion(orden, "etiquetas-barra", rango);