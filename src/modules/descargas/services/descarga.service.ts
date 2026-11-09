import api from "../../../services/api.service";
import type { DescargaSavePayload, IDescargaListResponse, IGuiaDescargaResponse, IGuiaDescargaResponseDetail } from "../types/descarga.types";

export const getDescargas = async (): Promise<IDescargaListResponse> => {
    const token = localStorage.getItem("token");
    const response = await api.get<IDescargaListResponse>(`/guiadescarga/D`, {
        headers: { Authorization: "Bearer " + token },
        baseURL: "http://localhost:4006",
    });
    return response.data;
}

export const getByIdGuiaDescarga = async (guiaid: number): Promise<IGuiaDescargaResponse> => {
    const token = localStorage.getItem("token");
    const response = await api.get<IGuiaDescargaResponse>(`/guias/validateGuiaProvincia/${guiaid}`, {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: "http://localhost:4006",
    });
    return response.data;
}

export const getByIdGuiaDescargaDetail = async (id_guia: number): Promise<IGuiaDescargaResponseDetail> => {
    const token = localStorage.getItem("token");
    const response = await api.get<IGuiaDescargaResponseDetail>(`/guiadescarga/id/${id_guia}`, {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: "http://localhost:4006",
    });
    return response.data;
}

export const saveDescarga = async (descargaData: DescargaSavePayload) => {
    const token = localStorage.getItem("token");
    const userCode = localStorage.getItem("user_code");
    const response = await api.put(`/guiadescarga`, {
        ...descargaData,
        userCreated: userCode,
    }, {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: "http://localhost:4006",
    });
    return response.data;
}

