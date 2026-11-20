import api from "@/services/api.service";
import type { Provincia, ProvinciaResponse } from "../types/provincia.type";

export const getAllProvincia = async (): Promise<Provincia[]> => {
  const response = await api.get<ProvinciaResponse>("/recursos/provincia", {
    params: { status: "A" },
  });
  return response.data.data;
};