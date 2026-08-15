import api from "../../../services/api.service";
import type { getContenidoResponse, getContenidoResponseDetail } from "../types/contenido.type";

export const getAll = async(status?: boolean): Promise<getContenidoResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getContenidoResponse>("/contenidos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status },
    });
    return response.data.data;
}