import api from "../../../services/api.service";
import type {CustomerSave} from "../types/customer.type";

export const save = async (customer: CustomerSave) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");
  customer.status = true;
  const response = await api.post(
    "/customer",
    {
      ...customer,
      userCreated: userCode,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const getAll = async (status?: boolean) => {
  const token = localStorage.getItem("token");
  const response = await api.get("/customer", {
    headers: { Authorization: `Bearer ${token}` },
    params: { status },
  });
  return response.data;
}

export const getByCode = async (code: string) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/customer/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export const findByRuc = async (ruc: string ) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/customer/ruc/${ruc}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export const deleteByCode = async (code: string) => {
  const token = localStorage.getItem("token");
  const userUpdated = localStorage.getItem("user_code");
  const response = await api.delete(
    "/customer",
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { code, userUpdated },
    },
  );
  return response.data;
};

export const update = async (code: string, customer: CustomerSave) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");
  customer.status = true;
  const response = await api.patch(
    "/customer",
    {
      ...customer,
      codigo: code,
      userUpdated: userCode
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
