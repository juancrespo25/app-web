import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { getParentescoResponse, gesParentescoResponseDetail } from "../types/parentesco.type";

export const getAllParentesco = async (status?: boolean): Promise<gesParentescoResponseDetail[]> => {

    const token = localStorage.getItem("token");
    const response = await api.get<getParentescoResponse>("/parentescos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: OPERACIONES_API_URL,
        params: { status },
    });
    return response.data.data;

}