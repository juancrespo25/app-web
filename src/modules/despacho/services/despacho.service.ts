import api from "../../../services/api.service";
import type {
  DespachoResponse,
  DespachoResponseDetail,
  IGetByIdGuiaDespachoResponse,
  IGuiaDespachoValidateResponse,
  ISaveDespacho,
  IUpdateDespacho,
} from "../types/despacho.type";

export const getAllDespacho = async (
  fecha_inicial: Date,
  fecha_final: Date,
  agente: number,
  estado: string,
): Promise<DespachoResponseDetail[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get<DespachoResponse>("/despacho", {
    headers: { Authorization: `Bearer ${token}` },
    baseURL: "http://localhost:4006",
    params: { fecha_inicial, fecha_final, agente, estado },
  });
  return response.data.data;
};

export const getByIdDespacho = async (despachoid: number): Promise<IGetByIdGuiaDespachoResponse> => {
  const token = localStorage.getItem("token");
  const response = await api.get<IGetByIdGuiaDespachoResponse>("/despacho/search/"+despachoid, {
    headers: { Authorization: `Bearer ${token}` },
    baseURL: "http://localhost:4006",
  });
  return response.data;
}

export const validateGuiaDespacho = async (
  guia: number,
): Promise<IGuiaDespachoValidateResponse> => {
  const token = localStorage.getItem("token");
  const response = await api.get<IGuiaDespachoValidateResponse>(
    "guiadespacho/validate/"+guia,
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006"
    },
  );
  return response.data;
};

export const SaveDespacho = async (despacho: ISaveDespacho) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.post(
    "/despacho",
    {
      ...despacho,
      userCreated: userCode,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    },
  );
  return response.data;
};

export const UpdateDespacho = async (despacho: IUpdateDespacho) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.put(
    "/despacho",
    {
      ...despacho,
      userUpdated: userCode
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    },
  );
  return response.data;
};

export const UpdateStatusDespacho = async (despachoid: number, status: string) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.put(
    "/despacho/updatestatus",
    {
      id: despachoid,
      status: status,
      userUpdated: userCode
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    },
  );
  return response.data;
}

export const ConfirmDespacho = async (despachoid: number, status: string) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");

  const response = await api.put(
    "/despacho/confirm",
    {
      id: despachoid,
      status: status,
      userUpdated: userCode
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "http://localhost:4006",
    },
  );
  return response.data;
}
