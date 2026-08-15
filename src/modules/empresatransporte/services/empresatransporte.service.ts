import api from "../../../services/api.service";
import type { EmpresaTransporteResponse, EmpresaTransporteResponseDetail } from "../types/empresatransporte.type";

export const getAllByType = async(status?: boolean, tipo_envio?: number): Promise<EmpresaTransporteResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<EmpresaTransporteResponse>("/empresas-transporte", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status, tipo_envio },
    });
    return response.data.data;
}