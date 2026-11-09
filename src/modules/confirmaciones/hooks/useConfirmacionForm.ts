import { useRef, useState } from "react";
import { toast } from "sonner";
import { getByIdGuiaConfirmaciones } from "../services/confirmacciones.service";
import type { ConfirmacionFormData } from "../types/confirmacion.type";

const emptyForm: ConfirmacionFormData = {
  nroCargo: "",
  destinatario: "",
  direccion: "",
  fecha: "",
  cliente: "",
  cCosto: "",
  origen: "",
  estado: "",
  destino: "",
  contenido: "",
  tEnvio: "",
  peso: "",
  bultos: "",
  unidades: "",
  cantidadDocadjuntos: 0,
};

const ESTADO_LABELS: Record<string, string> = {
  ET: "EN TRANSITO",
  PD: "PENDIENTE",
  EF: "ENTREGADO",
  MT: "MOTIVADO",
};

export const useConfirmacionForm = () => {
  const [form, setForm] = useState<ConfirmacionFormData>(emptyForm);
  const [isValidating, setIsValidating] = useState(false);
  const [guiaValidada, setGuiaValidada] = useState(false);
  const lastFetched = useRef("");
  const validatingRef = useRef(false);

  const isFormValid = guiaValidada;

  // El campo Nro Cargo solo acepta números
  const setNroCargo = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    lastFetched.current = "";
    setGuiaValidada(false);
    setForm({ ...emptyForm, nroCargo: value });
  };

  // Valida la guía contra el servicio y llena el formulario cuando corresponde
  const buscarGuia = async () => {
    const nroCargo = form.nroCargo.trim();

    if (!nroCargo) {
      toast.error("Ingrese un número de cargo");
      return;
    }

    if (validatingRef.current || lastFetched.current === nroCargo) return;

    validatingRef.current = true;
    setIsValidating(true);
    try {
      const response = await getByIdGuiaConfirmaciones(Number(nroCargo));
      const guia = response.data;

      if (!response.success || !guia) {
        toast.error(response.message || "No se encontró la guía");
        setGuiaValidada(false);
        return;
      }

      lastFetched.current = nroCargo;

      // EF / MT: el envío ya fue confirmado
      if (guia.estado === "EF" || guia.estado === "MT") {
        toast.error("El envio ya fue confirmado");
        setGuiaValidada(false);
        return;
      }

      const esProvincia = guia.provincia !== "001";

      // PD en provincia: aún no ha sido despachado
      if (guia.estado === "PD" && esProvincia) {
        toast.error("El envio esta pendiente de despachar");
        setGuiaValidada(false);
        return;
      }

      // Válido: (ET y provincia != 001) o (PD y provincia == 001)
      const esValido =
        (guia.estado === "ET" && esProvincia) ||
        (guia.estado === "PD" && !esProvincia);

      if (!esValido) {
        toast.error("La guía no está disponible para confirmar");
        setGuiaValidada(false);
        return;
      }

      setForm({
        nroCargo,
        destinatario: guia.destinatario_name,
        direccion: guia.direccion,
        fecha: new Date(guia.fecha).toLocaleDateString("es-PE"),
        cliente: guia.customer,
        cCosto: guia.ccosto,
        origen: guia.origen,
        estado: ESTADO_LABELS[guia.estado] ?? guia.estado,
        destino: guia.destino,
        contenido: guia.contenido,
        tEnvio: String(guia.tenvio),
        peso: String(guia.peso),
        bultos: String(guia.bultos),
        unidades: String(guia.unidades),
        cantidadDocadjuntos: guia.cantidad_docadjuntos,
      });
      setGuiaValidada(true);
    } catch (error) {
      console.error("Error al validar la guía:", error);
      toast.error("No se encontró la guía");
      setGuiaValidada(false);
    } finally {
      validatingRef.current = false;
      setIsValidating(false);
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setGuiaValidada(false);
    lastFetched.current = "";
  };

  return {
    form,
    setNroCargo,
    buscarGuia,
    isFormValid,
    isValidating,
    reset,
  };
};
