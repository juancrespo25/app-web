import api from "../../../services/api.service";
import type { CentroCostoSave } from "../types/centercost.type";
import type { CustomerOption } from "../../customer/types/customer.type";

export const save = async (centroCosto: CentroCostoSave) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");
  centroCosto.status = true;

    const response = await api.post(
    "/centercost",
    {
      ...centroCosto,
      userCreated: userCode,
    },
    { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
};

export const getAll = async (customer: string, status?: boolean) => {
    const token = localStorage.getItem("token");
    const response = await api.get("/centercost", {
        headers: { Authorization: `Bearer ${token}` },
        params: { customer, status },
    });
    return response.data;
}

export const getByCode = async (code: string) => {
    const token = localStorage.getItem("token");
    const response = await api.get(`/centercost/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export const deleteByCode = async (code: string) => {
    const token = localStorage.getItem("token");
    const userUpdated = localStorage.getItem("user_code");
    const response = await api.delete(
        "/centercost",
        {
            headers: { Authorization: `Bearer ${token}` },
            data: { code, userUpdated },
        },
    );
    return response.data;
};

export const update = async (code: string, centroCosto: CentroCostoSave) => {
    const token = localStorage.getItem("token");
    const userCode = localStorage.getItem("user_code");
    centroCosto.status = true;
    const response = await api.patch(
        "/centercost",
        {
            ...centroCosto,
            codigo: code,
            userUpdated: userCode
        },
        { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
}

export const getAllCustomer = async(): Promise<CustomerOption[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get("/customer", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: true },
    });
    
    const customers = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return customers.map((customer: CustomerOption) => ({
        codigo: customer.codigo,
        descripcion: customer.descripcion,
    }));
}

