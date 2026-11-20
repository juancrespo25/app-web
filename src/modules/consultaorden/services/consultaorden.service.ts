import api from "@/services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { DetalleGuia, DetalleGuiaResponse, DetalleOrden, DetalleOrdenResponse } from "../types/consultaorden.type";

export async function getDetalleOrden(numero: string): Promise<DetalleOrden | null> {
  const response = await api.get<DetalleOrdenResponse>(
    `/ordenes/${encodeURIComponent(numero)}/detalle`,
    { baseURL: OPERACIONES_API_URL },
  );
  if (response.data.status === 404) return null;
  if (!response.data.success) {
    throw new Error(response.data.message || "No se pudo consultar la orden.");
  }

  return response.data.data;
}

export async function verguia(numeroGuia: number): Promise<DetalleGuia> {
  const response = await api.get<DetalleGuiaResponse>(
    `/guias/${encodeURIComponent(String(numeroGuia))}/detalle`,
    { baseURL: OPERACIONES_API_URL },
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "No se pudo consultar la guía.");
  }
  return response.data.data;
}
