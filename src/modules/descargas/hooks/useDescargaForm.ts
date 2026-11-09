import { useRef, useState } from "react";
import { toast } from "sonner";
import { getByIdGuiaDescarga, getByIdGuiaDescargaDetail } from "../services/descarga.service";
import type { DescargaFormData, IGuiaDescargaDetail } from "../types/descarga.types";

const emptyForm: DescargaFormData = {
  nroCargo: "",
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
  EF: "ENTREGADO",
  MT: "MOTIVADO",
};

export const useDescargaForm = (
  onDetalleLoaded?: (detalle: IGuiaDescargaDetail) => void,
  onDetalleClear?: () => void,
) => {
  const [form, setForm] = useState<DescargaFormData>(emptyForm);
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
    onDetalleClear?.();
    setForm({ ...emptyForm, nroCargo: value });
  };

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
      const response = await getByIdGuiaDescarga(Number(nroCargo));
      const guia = response.data;

      if (!response.success || !guia) {
        toast.error("El envio no existe");
        setGuiaValidada(false);
        return;
      }

      lastFetched.current = nroCargo;

      if (guia.estado !== "EF" && guia.estado !== "MT") {
        toast.error("El cargo no esta confirmado");
        setGuiaValidada(false);
        return;
      }

      const detalleResponse = await getByIdGuiaDescargaDetail(Number(nroCargo));
      const detalle = detalleResponse.data;

      if (!detalleResponse.success || !detalle || !detalle.tipo?.trim()) {
        toast.error("El envio no esta confirmado");
        setGuiaValidada(false);
        return;
      }

      if (detalle.tipo === "D") {
        toast.error("El envio ya fue descargado");
        setGuiaValidada(false);
        return;
      }

      setForm({
        nroCargo,
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
      onDetalleLoaded?.(detalle);
      setGuiaValidada(true);
    } catch (error) {
      console.error("Error al validar la guía:", error);
      toast.error("El envio no existe");
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
