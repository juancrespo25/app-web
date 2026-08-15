import api from "../../../services/api.service";
import type { getTipoEnvioResponse, getTipoEnvioResponseDetail } from "../types/tipoenvio.type";

export const getAll = async(status?: boolean): Promise<getTipoEnvioResponseDetail[]> => {

    const token = localStorage.getItem("token");
    const response = await api.get<getTipoEnvioResponse>("/tipoenvios", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status, linea: 1 },
    });
    return response.data.data;
}