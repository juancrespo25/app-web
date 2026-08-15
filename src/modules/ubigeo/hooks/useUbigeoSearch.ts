import { useCallback, useState } from "react";
import { findByName, type UbigeoItem } from "../services/ubigeo.service";

export function useUbigeoSearch() {
  const [results, setResults] = useState<UbigeoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUbigeo = useCallback(async (term: string) => {
    const trimmedTerm = term.trim();

    if (trimmedTerm.length < 3) {
      setResults([]);
      setError("Ingresa al menos 3 caracteres para buscar.");
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const items = await findByName(trimmedTerm);
      setResults(items);
      if (items.length === 0) {
        setError("No se encontraron ubigeos para esa búsqueda.");
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setError("No se pudo cargar los ubigeos. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    searchUbigeo,
  };
}
