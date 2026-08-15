import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { toast } from "sonner";
import {
  getByIdDespacho,
  validateGuiaDespacho,
  UpdateDespacho,
} from "../services/despacho.service";
import type {
  DespachoDetail,
  IGuiaDespachoValidateResponseDetail,
  IUpdateDespacho,
} from "../types/despacho.type";

export interface DespachoGuiaRow extends IGuiaDespachoValidateResponseDetail {
  locked: boolean;
}

export const useDespachoAddForm = (
  despachoId?: string | number | null,
  onSuccess?: () => void,
) => {
  const [detail, setDetail] = useState<DespachoDetail | null>(null);
  const [provinciaCode, setProvinciaCode] = useState("");
  const [guias, setGuias] = useState<DespachoGuiaRow[]>([]);
  const [guiaInput, setGuiaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const guiaInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  // Consulta el detalle del despacho al abrir el formulario
  // El guard `hasFetched` evita la doble ejecución del efecto en modo desarrollo (StrictMode).
  // NOTA: no se usa flag `active` en el cleanup porque en StrictMode la primera ejecución
  // del efecto es descartada por React; con `hasFetched` solo se dispara UNA llamada,
  // y esa única llamada debe completar su respuesta para llenar el estado.
  useEffect(() => {
    if (!despachoId || hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);

    getByIdDespacho(Number(despachoId))
      .then((response) => {
        if (response.success && response.data) {
          setDetail(response.data);
          setProvinciaCode(response.data.provincia_code);
          // Precarga las guías ya asociadas al despacho (bloqueadas)
          setGuias(
            (response.data.guias ?? []).map((g) => ({
              ...g,
              locked: true,
            })),
          );
          requestAnimationFrame(() => guiaInputRef.current?.focus());
        } else {
          toast.error(response.message || "No se encontró el despacho");
        }
      })
      .catch((error) => {
        console.error("Error al cargar el despacho:", error);
        toast.error("Error al cargar los datos del despacho");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [despachoId]);

const handleInputChange = (value: string) => {
    setGuiaInput(value);
  };

  // Limpia el input de guía y devuelve el foco al mismo
  const resetGuiaInput = () => {
    setGuiaInput("");
    requestAnimationFrame(() => guiaInputRef.current?.focus());
  };

  const addGuia = async () => {
    const numeroGuia = guiaInput.trim();

    if (!numeroGuia) {
      toast.error("Ingrese un número de guía");
      return;
    }

    if (!/^\d+$/.test(numeroGuia)) {
      toast.error("El número de guía solo debe contener dígitos");
      resetGuiaInput();
      return;
    }

    const idGuia = Number(numeroGuia);

    // Evita duplicados en la tabla
    if (guias.some((guia) => guia.id_guia === idGuia)) {
      toast.warning("La guía ya fue agregada al despacho");
      resetGuiaInput();
      return;
    }

    setValidating(true);
    try {
      const response = await validateGuiaDespacho(idGuia);

      if (response.success && response.data) {
        // Valida que la guía pertenezca a la misma provincia del despacho
        if (provinciaCode && response.data.provincia !== provinciaCode) {
          toast.error(
            `La guía pertenece a la provincia ${response.data.provincia}, no a la provincia del despacho (${provinciaCode})`,
          );
          resetGuiaInput();
          return;
        }
        setGuias((prev) => [...prev, { ...response.data, locked: false }]);
        setGuiaInput("");
        toast.success(response.message || "Guía validada exitosamente");
      } else {
        toast.error(response.message || "No se encontró la guía");
        resetGuiaInput();
      }
    } catch (error) {
      console.error("Error al validar la guía:", error);
      toast.error("No se encontró la guía");
      resetGuiaInput();
    } finally {
      setValidating(false);
      requestAnimationFrame(() => guiaInputRef.current?.focus());
    }
  };

  const handleEnterKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addGuia();
    }
  };

const removeGuia = (idGuia: number) => {
    // Solo permite eliminar guías agregadas en esta sesión (no bloqueadas)
    setGuias((prev) =>
      prev.filter((guia) => !(guia.id_guia === idGuia && !guia.locked)),
    );
  };

  const handleSave = async () => {
    if (!despachoId) return;

    const guiasNuevas = guias.filter((guia) => !guia.locked);

    if (guiasNuevas.length === 0) {
      toast.error("No hay guías nuevas para grabar");
      return;
    }

const userCode = localStorage.getItem("user_code") ?? "";

    const payload: IUpdateDespacho = {
      id: Number(despachoId),
      userUpdated: "",
      estado: "DA",
      guias: guiasNuevas.map((guia) => ({
        despacho_id: Number(despachoId),
        id_guia: guia.id_guia,
        estado: "DP",
        userCreated: userCode,
      })),
    };

    setIsSaving(true);
    try {
      await UpdateDespacho(payload);
      toast.success("Guías grabadas correctamente");
      onSuccess?.();
    } catch (error) {
      console.error("Error al grabar el despacho:", error);
      toast.error("Error al grabar el despacho");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    detail,
    provinciaCode,
    guiaInput,
    guias,
    loading,
    validating,
    isSaving,
    guiaInputRef,
    handleInputChange,
    handleEnterKey,
    addGuia,
    removeGuia,
    handleSave,
  };
};

