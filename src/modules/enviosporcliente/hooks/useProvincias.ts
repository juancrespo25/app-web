import { useEffect, useState } from "react";
import { getAllProvincia } from "@/modules/provincia/service/provincia.service";
import type { Provincia } from "@/modules/provincia/types/provincia.type";

export function useProvincias() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getAllProvincia()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Formato de provincias inválido.");
        if (active) setProvincias(data);
      })
      .catch((err: unknown) => {
        if (active) {
          console.error("Error al cargar provincias:", err);
          setError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [attempt]);

  const retry = () => {
    setError(false);
    setLoading(true);
    setAttempt((value) => value + 1);
  };

  return { provincias, loading, error, retry };
}
