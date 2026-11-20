import { useEffect, useState } from "react";
import { verguia } from "../services/consultaorden.service";
import type { DetalleGuia } from "../types/consultaorden.type";

type EstadoConsulta =
  | { estado: "cargando" }
  | { estado: "error" }
  | { estado: "completo"; guia: DetalleGuia };

export function useDetalleGuia(numeroGuia: number) {
  const [consulta, setConsulta] = useState<EstadoConsulta>({ estado: "cargando" });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let active = true;
    verguia(numeroGuia)
      .then((guia) => {
        if (active) setConsulta({ estado: "completo", guia });
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Error al consultar la guía:", error);
          setConsulta({ estado: "error" });
        }
      });
    return () => { active = false; };
  }, [numeroGuia, intento]);

  const reintentar = () => {
    setConsulta({ estado: "cargando" });
    setIntento((actual) => actual + 1);
  };

  return { consulta, reintentar };
}
