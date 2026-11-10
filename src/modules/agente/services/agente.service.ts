import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { AgenteResponse, AgenteResponseDetail } from "../types/agente.type";

export const getAll = async(status?: boolean): Promise<AgenteResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<AgenteResponse>("/agentes", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status },
    });
    return response.data.data;
}