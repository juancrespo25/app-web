import api from "../../../services/api.service";
import type { AgenteResponse, AgenteResponseDetail } from "../types/agente.type";

export const getAll = async(status?: boolean): Promise<AgenteResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<AgenteResponse>("/agentes", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status },
    });
    return response.data.data;
}