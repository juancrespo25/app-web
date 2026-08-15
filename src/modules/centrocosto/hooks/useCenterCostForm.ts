import { useState } from "react";
import type { CentroCostoData, CentroCostoSave } from "../types/centercost.type";

export const useCenterCostForm = (
  initialData: CentroCostoSave | CentroCostoData | null | undefined,
) => {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion ?? "");
  const [contacto, setContacto] = useState(initialData?.contacto ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [telefono, setTelefono] = useState(initialData?.telefono ?? "");
  const [user, setUser] = useState(initialData?.user ?? "");
  const [password, setPassword] = useState(initialData?.password ?? "");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email === "" || emailRegex.test(email);

  const isFormValid =
    descripcion.trim() !== "" &&
    contacto.trim() !== "" &&
    email.trim() !== "" &&
    isEmailValid &&
    telefono.trim() !== "" &&
    user.trim() !== "" &&
    password.trim() !== "";

  return {
    descripcion,
    setDescripcion,
    contacto,
    setContacto,
    email,
    setEmail,
    telefono,
    setTelefono,
    user,
    setUser,
    password,
    setPassword,
    isEmailValid,
    isFormValid,
  };
};;
