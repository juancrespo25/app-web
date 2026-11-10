import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { getMotivoResponse, gesMotivoResponseDetail } from "../types/motivo.type";


export const getAllMotivo = async (status?: boolean, tipo?: number): Promise<gesMotivoResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getMotivoResponse>("/motivos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status, tipo },
    });
    return response.data.data;
}