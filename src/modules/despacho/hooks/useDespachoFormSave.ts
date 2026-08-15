import { useState } from "react";
import { toast } from "sonner";
import { SaveDespacho } from "../services/despacho.service";

const today = new Date().toISOString().split("T")[0];

export const emptyForm = {
  agente: "",
  fecha: today,
  tipoEnvio: "",
  transporte: "",
};

export const useDespachoFormSave = (onSuccess?: () => void) => {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    fecha: new Date().toISOString().split("T")[0],
  }));
  const [isSaving, setIsSaving] = useState(false);

  const isFormValid =
    form.agente !== "" &&
    form.tipoEnvio !== "" &&
    form.transporte !== "";

  const set = <K extends keyof typeof emptyForm>(key: K, value: string) =>
    setForm((prev) => {
      if (key === "tipoEnvio") {
        return { ...prev, tipoEnvio: value, transporte: "" };
      }
      return { ...prev, [key]: value };
    });

  const handleSubmit = async (tipo: number = 0, onClose?: () => void) => {
    if (!isFormValid) return;

    setIsSaving(true);
    try {
      const [year, month, day] = form.fecha.split("-").map(Number);
      const now = new Date();
      const fechaCreacion = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      const payload = {
        agente: Number(form.agente),
        tipoenvio: Number(form.tipoEnvio),
        empresatransporte: form.transporte,
        estado: "DP",
        status: true,
        fecha_creacion: fechaCreacion,
        tipo,
      };

      await SaveDespacho(payload);
      toast.success("Registro grabado");
      setForm({ ...emptyForm, fecha: new Date().toISOString().split("T")[0] });
      onClose?.();
      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar despacho:", error);
      toast.error("Error al grabar el despacho");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    set,
    isFormValid,
    isSaving,
    handleSubmit,
  };
};

