import api from "../../../services/api.service";
import type { UbigeoApiResponse, UbigeoItem } from "../types/ubigeo.type";
export type { UbigeoItem } from "../types/ubigeo.type";


export const findByName = async (name: string): Promise<UbigeoItem[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get<UbigeoApiResponse>(`recursos/ubigeo/name/${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const findByCode = async (code: string): Promise<UbigeoItem | null> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get<UbigeoApiResponse>(`recursos/ubigeo/code/${code}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data?.data;
    if (Array.isArray(data) && data.length > 0) return data[0];
    // Si el API devuelve un objeto único en lugar de array
    if (data && !Array.isArray(data)) return data as unknown as UbigeoItem;
    return null;
  } catch {
    return null;
  }
};