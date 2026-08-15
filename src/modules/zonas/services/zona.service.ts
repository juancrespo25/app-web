import api from "../../../services/api.service";
import type { ZonaResponse, ZonaResponseDetail } from "../types/zona.type";

export const getAllZonas = async (): Promise<ZonaResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<ZonaResponse>("/zonas", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status: true },
    });
    return response.data.data;
};