import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { Guia, ValidateGuia } from "../types/guia.type";

export const saveGuia = async(guia: Guia) => {
    const token = localStorage.getItem("token");
    const userCode = localStorage.getItem("user_code");

    const response = await api.post("/",
        {
            ...guia,
            userCreated: userCode,
        },
    {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: `${OPERACIONES_API_URL}/guias`,
    });
    return response.data;
}

export const validateGuia = async(guia: number): Promise<ValidateGuia> => {
    const token = localStorage.getItem("token");
    const response = await api.get<ValidateGuia>(`/validate/${guia}`,
    {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: `${OPERACIONES_API_URL}/guias`,
    });
    return response.data;
}