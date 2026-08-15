import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { validateGuia } from "@/modules/guia/services/guia.service";
import { saveManifiestoLocal } from "@/modules/manifiesto/services/manifiesto.service";
import { getAllZonas } from "@/modules/zonas/services/zona.service";
import type { ZonaResponseDetail } from "@/modules/zonas/types/zona.type";
import { getUserType } from "@/modules/user/services/user.service";
import type { UserTypeResponseDetail } from "@/modules/user/types/UserForm.types";

export interface GuiaItem {
    guia: string;
    orden: string;
    cliente: string;
    cCosto: string;
    destino: string;
    destinatario: string;
}

const generateNumeroManifiesto = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        String(now.getFullYear()) +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        pad(now.getHours()) +
        pad(now.getMinutes()) +
        pad(now.getSeconds())
    );
};

export const useManifiestoForm = (
    isOpen: boolean,
    onClose: () => void,
    onSaved?: () => void
) => {
    const [numeroManifiesto, setNumeroManifiesto] = useState("");
    const [zona, setZona] = useState("");
    const [courier, setCourier] = useState("");
    const [zonas, setZonas] = useState<ZonaResponseDetail[]>([]);
    const [couriers, setCouriers] = useState<UserTypeResponseDetail[]>([]);
    const [isLoadingZonas, setIsLoadingZonas] = useState(false);
    const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [guiaInput, setGuiaInput] = useState("");
    const [guias, setGuias] = useState<GuiaItem[]>([]);
    const [correlativo, setCorrelativo] = useState(1);
    const [isValidating, setIsValidating] = useState(false);
    const guiaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsLoadingZonas(true);
        getAllZonas()
            .then(setZonas)
            .catch((err) => console.error("Error cargando zonas:", err))
            .finally(() => setIsLoadingZonas(false));

        setIsLoadingCouriers(true);
        getUserType()
            .then(setCouriers)
            .catch((err) => console.error("Error cargando couriers:", err))
            .finally(() => setIsLoadingCouriers(false));
    }, []);

    useEffect(() => {
        if (isOpen) {
            setNumeroManifiesto(generateNumeroManifiesto());
            setZona("");
            setCourier("");
            setSaveError(null);
            setGuiaInput("");
            setGuias([]);
            setCorrelativo(1);
        }
    }, [isOpen]);

    const focusGuiaInput = () => setTimeout(() => guiaInputRef.current?.focus(), 50);

    const handleAddGuia = useCallback(async () => {
        const g = guiaInput.trim();
        if (!g) return;
        if (guias.some((item) => item.guia === g)) {
            toast.error("La guía ya fue agregada.");
            setGuiaInput("");
            focusGuiaInput();
            return;
        }
        setIsValidating(true);
        try {
            const result = await validateGuia(Number(g));
            const det = result.data;
            if (!det) {
                toast.error("Guía no encontrada.");
                setGuiaInput("");
                focusGuiaInput();
                return;
            }
            if (det.provincia !== "001") {
                toast.error("El envio corresponde a provincia.");
                setGuiaInput("");
                focusGuiaInput();
                return;
            }
            if (det.estado !== "PD" && det.estado !== "RT") {
                toast.error("El envio no figura como pendiente.");
                setGuiaInput("");
                focusGuiaInput();
                return;
            }
            setGuias((prev) => [
                ...prev,
                {
                    guia: String(det.id_guia),
                    orden: String(correlativo),
                    cliente: det.customer,
                    cCosto: det.ccosto,
                    destino: det.destino,
                    destinatario: det.destinatario_name,
                },
            ]);
            setCorrelativo((c) => c + 1);
            setGuiaInput("");
            focusGuiaInput();
        } catch {
            toast.error("Error al validar la guía.");
            setGuiaInput("");
            focusGuiaInput();
        } finally {
            setIsValidating(false);
        }
    }, [guiaInput, guias, correlativo]);

    const handleRemoveGuia = useCallback((guia: string) => {
        setGuias((prev) => prev.filter((item) => item.guia !== guia));
    }, []);

    const isFormValid = !!numeroManifiesto && !!zona && !!courier && guias.length > 0;

    const handleSave = useCallback(async () => {
        if (!isFormValid) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            await saveManifiestoLocal({
                codigo: numeroManifiesto,
                zona,
                courier,
                estado: 'MP',
                userCreated: localStorage.getItem('user_code') ?? '',
                guias: guias.map((item) => ({
                    id_guia: Number(item.guia),
                    ordenamiento: Number(item.orden),
                    estado: 'ER',
                })),
            });
            toast.success('Manifiesto registrado');
            onSaved?.();
            onClose();
        } catch (err) {
            console.error("Error guardando manifiesto:", err);
            setSaveError("No se pudo guardar. Intente nuevamente.");
        } finally {
            setIsSaving(false);
        }
    }, [isFormValid, numeroManifiesto, zona, courier, guias, onSaved, onClose]);

    return {
        numeroManifiesto,
        zona, setZona,
        courier, setCourier,
        zonas, isLoadingZonas,
        couriers, isLoadingCouriers,
        isSaving,
        saveError, setSaveError,
        guiaInput, setGuiaInput,
        guias,
        isValidating,
        guiaInputRef,
        isFormValid,
        handleAddGuia,
        handleRemoveGuia,
        handleSave,
    };
};
