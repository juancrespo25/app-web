import api from "../../../services/api.service";
import type {
  getAllManifiestoResponse,
  getAllManifiestoResponseDetail,
  getDetailManifiesto,
  saveManifiesto,
  getByidManifiestoResponse,
  GuiaManifiestoValidateResponse,
  UpdateManifiesto,
} from "../types/manifiesto.type";

export const getAllManifiesto = async (
  fecha_inicial: Date,
  fecha_final: Date,
  codigo?: string,
  estado?: string,
  courier?: string,
  zona?: string
): Promise<getAllManifiestoResponseDetail[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get<getAllManifiestoResponse>("/manifiestos", {
    headers: { Authorization: `Bearer ${token}` },
    baseURL: "http://localhost:4006",
    params: { fecha_inicial, fecha_final, codigo, estado, courier, zona },
  });
  return response.data.data;
};

export const saveManifiestoLocal = async (manifiesto: saveManifiesto) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.post(
    "/manifiestos",
    {
      ...manifiesto,
      userCreated: userCode,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    }
  );
  return response.data;
};

export const updateManifiestoLocal = async (manifiesto: UpdateManifiesto) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.put(
    `/manifiestos`,
    {
      ...manifiesto,
      userUpdated: userCode,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    }
  );
  return response.data;
};

export const getByIdManifiesto = async (manifiesto: number): Promise<getDetailManifiesto | null> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get<getByidManifiestoResponse>(`/manifiestos/${manifiesto}`, {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    });
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

export const validateGuiaManifiesto = async(guia: number): Promise<GuiaManifiestoValidateResponse> => {
    const token = localStorage.getItem("token");
    const response = await api.get<GuiaManifiestoValidateResponse>(`/validate/${guia}`,
    {
        headers: { Authorization: `Bearer ${token}`},
        baseURL: "http://localhost:4006/guiamanifiestos",
    });
    return response.data;
}
