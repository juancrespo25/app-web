import api from "@/services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { EnvioPorCliente, EnviosPorClienteResponse, FiltrosEnvios } from "../types/envios.por.cliente.type";

export async function queryOrden(filtros: FiltrosEnvios): Promise<EnvioPorCliente[]> {
  const response = await api.get<EnviosPorClienteResponse>("/ordenes/query", {
    baseURL: OPERACIONES_API_URL,
    params: filtros,
  });
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error(response.data.message || "Respuesta inválida al consultar envíos.");
  }
  return response.data.data;
}