import { useEffect, useState } from "react";
import { getAllParentesco } from "@/modules/parentesco/services/parentesco.service";
import type { gesParentescoResponseDetail } from "@/modules/parentesco/types/parentesco.type";
import { getAllMotivo } from "@/modules/motivos/services/motivo.service";
import type { gesMotivoResponseDetail } from "@/modules/motivos/types/motivo.type";

export const useConfirmacionFormOptions = () => {
  const [parentescos, setParentescos] = useState<gesParentescoResponseDetail[]>([]);
  const [motivos, setMotivos] = useState<gesMotivoResponseDetail[]>([]);

  useEffect(() => {
    getAllParentesco(true)
      .then(setParentescos)
      .catch((err) => console.error("Error cargando parentescos:", err));

    getAllMotivo(true, 1)
      .then(setMotivos)
      .catch((err) => console.error("Error cargando motivos:", err));
  }, []);

  return { parentescos, motivos };
};
