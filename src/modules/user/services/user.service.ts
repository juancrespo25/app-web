import api from "../../../services/api.service";
import type { UserFormData, UserTypeResponse, UserTypeResponseDetail } from "../types/UserForm.types";

export const save = async (userData: UserFormData) => {
  const token = localStorage.getItem("token");
  const userCode = localStorage.getItem("user_code");
  const status = true;
  const {
    nombres,
    apellidos,
    email,
    telefono,
    area,
    user,
    password: contrasena,
  } = userData;

  const response = await api.post(
    "/user",
    {
      nombres,
      apellidos,
      email,
      telefono,
      status,
      area,
      user_name: user,
      password: contrasena,
      userCreated: userCode,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const getAll = async (status?: boolean) => {
  const token = localStorage.getItem("token");
  const response = await api.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
    params: { status },
  });
  return response.data;
};

export const getByCode = async (code: string) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/user/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteByCode = async (code: string, userDeleted: string) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(
    "/user",
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { code, userDeleted },
    },
  );
  return response.data;
};

export const update = async (code: string, userData: UserFormData) => {
    const token = localStorage.getItem("token");
    const { nombres, apellidos, email, telefono, area, user, password: contrasena } = userData;
    const status = true;
    const response = await api.patch(
      `/user`,
      {
        codigo: code,
        nombres,
        apellidos,
        email,
        telefono,
        status,
        area,
        user_name: user,
        password: contrasena,
        userUpdated: localStorage.getItem("user_code"),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
}

export const getUserType = async (): Promise<UserTypeResponseDetail[]> => {
    const token = localStorage.getItem("token");
    const response = await api.get<UserTypeResponse>(`/user/type/JESS-00002`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data.data.data;
    return Array.isArray(data) ? data : [];
}
