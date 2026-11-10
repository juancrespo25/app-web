import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { getContenidoResponse, getContenidoResponseDetail } from "../types/contenido.type";

export const getAll = async(status?: boolean): Promise<getContenidoResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getContenidoResponse>("/contenidos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status },
    });
    return response.data.data;
}