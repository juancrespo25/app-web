import api from "../../../services/api.service";
import type { getParentescoResponse, gesParentescoResponseDetail } from "../types/parentesco.type";

export const getAllParentesco = async (status?: boolean): Promise<gesParentescoResponseDetail[]> => {

    const token = localStorage.getItem("token");
    const response = await api.get<getParentescoResponse>("/parentescos", {
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "http://localhost:4006",
        params: { status },
    });
    return response.data.data;

}