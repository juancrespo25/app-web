import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { getTipoEnvioResponse, getTipoEnvioResponseDetail } from "../types/tipoenvio.type";

export const getAll = async(status?: boolean): Promise<getTipoEnvioResponseDetail[]> => {

    const token = localStorage.getItem("token");
    const response = await api.get<getTipoEnvioResponse>("/tipoenvios", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status, linea: 1 },
    });
    return response.data.data;
}