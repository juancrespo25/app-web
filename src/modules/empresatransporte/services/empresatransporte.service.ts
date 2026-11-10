import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { EmpresaTransporteResponse, EmpresaTransporteResponseDetail } from "../types/empresatransporte.type";

export const getAllByType = async(status?: boolean, tipo_envio?: number): Promise<EmpresaTransporteResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<EmpresaTransporteResponse>("/empresas-transporte", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status, tipo_envio },
    });
    return response.data.data;
}