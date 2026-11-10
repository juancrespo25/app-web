import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { getLineaResponse, getLineaResponseDetail } from "../types/linea.type";

export const getAll = async(status?: boolean): Promise<getLineaResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getLineaResponse>("/lineas", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status },
    });
    return response.data.data;
}