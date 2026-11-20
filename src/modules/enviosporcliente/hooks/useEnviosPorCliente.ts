import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { queryOrden } from "../services/envios.por.cliente.service";
import type { EnvioPorCliente, FiltrosEnvios } from "../types/envios.por.cliente.type";

export function useEnviosPorCliente() {
  const [envios, setEnvios] = useState<EnvioPorCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [consultado, setConsultado] = useState(false);
  const requestId = useRef(0);

  useEffect(() => () => { requestId.current += 1; }, []);

  const consultar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const fecha_inicial = value("fecha_inicial");
    const fecha_final = value("fecha_final");
    if (!fecha_inicial || !fecha_final) {
      toast.error("Ingrese la fecha inicial y la fecha final.");
      return;
    }
    if (fecha_inicial > fecha_final) {
      toast.error("La fecha inicial no puede ser posterior a la fecha final.");
      return;
    }
    const numero = value("numero");
    if (numero && !/^\d+$/.test(numero)) {
      toast.error("La orden de servicio solo debe contener números.");
      return;
    }
    const filtros: FiltrosEnvios = { fecha_inicial, fecha_final };
    const opcionales = ["estado", "origen", "destino", "numero", "numero_documento", "customer", "ccosto", "nombre"] as const;
    for (const campo of opcionales) {
      const dato = value(campo);
      if (dato) filtros[campo] = dato;
    }

    const id = ++requestId.current;
    setLoading(true);
    setConsultado(false);
    setEnvios([]);
    try {
      const data = await queryOrden(filtros);
      if (id !== requestId.current) return;
      setEnvios(data);
      setConsultado(true);
    } catch (error) {
      if (id !== requestId.current) return;
      console.error("Error al consultar envíos:", error);
      toast.error("No se pudieron consultar los envíos. Inténtelo nuevamente.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  return { envios, loading, consultado, consultar };
}
