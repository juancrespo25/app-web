import api from "../../../services/api.service";
import type {
  GetAllOrdenResponse,
  GetAllOrdenResponseDetail,
  GetOrdenResponse,
  GetOrdenResponseDetail,
  OrdenSave,
} from "../types/order.type";

export const getOrden = async (
  orden: string,
): Promise<GetOrdenResponseDetail | null> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get<GetOrdenResponse>(`/${orden}`, {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006/ordenes",
    });
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

export const getAllOrdenToday = async (): Promise<
  GetAllOrdenResponseDetail[]
> => {
  const token = localStorage.getItem("token");
  const response = await api.get<GetAllOrdenResponse>("/get/today", {
    headers: { Authorization: `Bearer ${token}` },
    baseURL: "http://localhost:4006/ordenes", // Asegúrate de que esta URL sea correcta
  });
  return response.data.data;
};

export const saveOrden = async (orden: OrdenSave) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.post(
    "/",
    {
      ...orden,
      provincia: '001',
      userCreated: userCode,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006/ordenes",
    },
  );
  return response.data;
};
