import api from "../../../services/api.service";
import type { getDestinatarioResponse, GetDestinatarioResponseDetail } from "../types/destinatario.type";

const isDestinatario = (value: unknown): value is Partial<GetDestinatarioResponseDetail> => {
    return Boolean(value && typeof value === "object" && ("nombre" in value || "nombres" in value));
};

const normalizeDestinatarioData = (data: unknown): GetDestinatarioResponseDetail[] => {
    if (Array.isArray(data)) return data.flatMap(normalizeDestinatarioData);
    if (data && typeof data === "object") {
        if (isDestinatario(data)) {
            const nombre = data.nombre ?? data.nombres ?? "";
            return [{
                id: String(data.id ?? nombre ?? crypto.randomUUID()),
                nombre: String(nombre),
                nombres: data.nombres ? String(data.nombres) : undefined,
                ubigeo: String(data.ubigeo ?? ""),
                direccion: String(data.direccion ?? ""),
            }];
        }

        return Object.values(data).flatMap(normalizeDestinatarioData);
    }
    return [];
};

export const getDestinatario = async (nombre: string, customer: string, ccosto: string, ubigeo: string): Promise<GetDestinatarioResponseDetail[]> => {
    const token = localStorage.getItem("token");
    try {
        const response = await api.post<getDestinatarioResponse>('/destinatarios',
            {
                nombre,
                customer,
                ccosto,
                ubigeo
            }, {
                headers: { Authorization: `Bearer ${token}` },
                baseURL: "http://localhost:4006",
            }
        );
        return normalizeDestinatarioData(response.data);
    } catch (error) {
        console.error("Error fetching destinatario:", error);
        return [];
    }
}
