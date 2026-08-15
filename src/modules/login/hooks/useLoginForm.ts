import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/login.service";
import { setToken } from "@/utils/token";

export const useLoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(userName, password);
      if (data.token) {
        setToken(data.token);
        navigate("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("Usuario o contraseña incorrectos");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    userName,
    setUserName,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
};