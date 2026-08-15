import api from "../../../services/api.service";
import type { getMotivoResponse, gesMotivoResponseDetail } from "../types/motivo.type";


export const getAllMotivo = async (status?: boolean, tipo?: number): Promise<gesMotivoResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<getMotivoResponse>("/motivos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status, tipo },
    });
    return response.data.data;
}