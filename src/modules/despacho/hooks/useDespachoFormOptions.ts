import { useEffect, useMemo, useState } from "react";

import { getAll as getAllAgentes } from "@/modules/agente/services/agente.service";
import type { AgenteResponseDetail } from "@/modules/agente/types/agente.type";

import { getAll as getAllTipoEnvio } from "@/modules/tipoenvio/services/tipoenvio.service";
import type { getTipoEnvioResponseDetail } from "@/modules/tipoenvio/types/tipoenvio.type";

import { getAllByType } from "@/modules/empresatransporte/services/empresatransporte.service";
import type { EmpresaTransporteResponseDetail } from "@/modules/empresatransporte/types/empresatransporte.type";

export const useDespachoFormOptions = (tipoEnvioId?: string) => {
  const [agentes, setAgentes] = useState<AgenteResponseDetail[]>([]);
  const [tiposEnvio, setTiposEnvio] = useState<getTipoEnvioResponseDetail[]>([]);
  const [transportes, setTransportes] = useState<EmpresaTransporteResponseDetail[]>([]);

  const parsedTipoEnvioId = useMemo(() => {
    if (!tipoEnvioId) return undefined;
    const n = Number(tipoEnvioId);
    return Number.isFinite(n) ? n : undefined;
  }, [tipoEnvioId]);

  useEffect(() => {
    getAllAgentes(true)
      .then(setAgentes)
      .catch((err) => console.error("Error cargando agentes:", err));

    getAllTipoEnvio(true)
      .then(setTiposEnvio)
      .catch((err) => console.error("Error cargando tipos de envio:", err));
  }, []);

  useEffect(() => {
    if (!parsedTipoEnvioId) return;

    getAllByType(true, parsedTipoEnvioId)
      .then(setTransportes)
      .catch((err) => console.error("Error cargando transportes:", err));
  }, [parsedTipoEnvioId]);

  return {
    agentes,
    tiposEnvio,
    transportes,
  };
};


