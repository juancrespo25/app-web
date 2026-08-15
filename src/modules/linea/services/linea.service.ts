import api from "../../../services/api.service";
import type { getLineaResponse, getLineaResponseDetail } from "../types/linea.type";

export const getAll = async(status?: boolean): Promise<getLineaResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getLineaResponse>("/lineas", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status },
    });
    return response.data.data;
}