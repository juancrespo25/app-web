import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getDetalleOrden } from "../services/consultaorden.service";
import type { DetalleOrden, EnvioOrden } from "../types/consultaorden.type";

export function useConsultaOrden() {
  const [numeroOrden, setNumeroOrden] = useState("");
  const [orden, setOrden] = useState<DetalleOrden | null>(null);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<EnvioOrden | null>(null);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => () => {
    requestId.current += 1;
  }, []);

  const cambiarNumeroOrden = (valor: string) => {
    requestId.current += 1;
    setNumeroOrden(valor.replace(/\D/g, "").slice(0, 6));
    setOrden(null);
    setEnvioSeleccionado(null);
    setLoading(false);
  };

  const consultarOrden = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(numeroOrden)) {
      toast.error("Ingrese un número de orden de 6 dígitos.");
      return;
    }

    const currentRequest = ++requestId.current;
    setOrden(null);
    setEnvioSeleccionado(null);
    setLoading(true);
    try {
      const resultado = await getDetalleOrden(numeroOrden);
      if (currentRequest !== requestId.current) return;
      if (!resultado) {
        setNumeroOrden("");
        toast.error("No se encontró la orden.");
        return;
      }
      setOrden(resultado);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setNumeroOrden("");
        toast.error("No se encontró la orden.");
      } else {
        toast.error("No se pudo consultar la orden. Inténtelo nuevamente.");
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  };

  return { numeroOrden, orden, loading, cambiarNumeroOrden, consultarOrden, envioSeleccionado, setEnvioSeleccionado };
}
