import api from "../../../services/api.service";

export interface LoginResponse {
  token: string;
}

export const login = async (
  user_name: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await api.post("/login", { user_name, password });
  return response.data;
};
