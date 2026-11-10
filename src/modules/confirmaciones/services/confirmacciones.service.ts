import api from "../../../services/api.service";
import { OPERACIONES_API_URL } from "@/services/api-config";
import type { ConfirmacionSavePayload, IConfirmacionListResponse, IGuiaConfirmacionesResponse } from "../types/confirmacion.type";

export const getConfirmaciones = async (): Promise<IConfirmacionListResponse> => {
    const token = localStorage.getItem("token");
    const response = await api.get<IConfirmacionListResponse>(`/guiadescarga/C`, {
        headers: { Authorization: "Bearer " + token },
        baseURL: OPERACIONES_API_URL,
    });
    return response.data;
}

export const getByIdGuiaConfirmaciones = async (guiaid: number): Promise<IGuiaConfirmacionesResponse> => {
    const token = localStorage.getItem("token");
    const response = await api.get<IGuiaConfirmacionesResponse>(`/guias/validateGuiaProvincia/${guiaid}`, {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: OPERACIONES_API_URL,
    });
    return response.data;
}

export const saveConfirmacion = async (confirmacionData: ConfirmacionSavePayload) => {
    const token = localStorage.getItem("token");
    const userCode = localStorage.getItem("user_code");
    const response = await api.post(`/guiadescarga`, {
        ...confirmacionData,
        userCreated: userCode,
    }, {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: OPERACIONES_API_URL,
    });
    return response.data;
}