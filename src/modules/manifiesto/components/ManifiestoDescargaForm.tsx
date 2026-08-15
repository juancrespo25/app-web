import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Search } from "lucide-react";
import { toast } from "sonner";
import { getByIdManifiesto, validateGuiaManifiesto, updateManifiestoLocal } from "@/modules/manifiesto/services/manifiesto.service";
import { getAllParentesco } from "@/modules/parentesco/services/parentesco.service";
import type { gesParentescoResponseDetail } from "@/modules/parentesco/types/parentesco.type";
import { getAllMotivo } from "@/modules/motivos/services/motivo.service";
import type { gesMotivoResponseDetail } from "@/modules/motivos/types/motivo.type";

interface DescargaRow {
    id_guia: number;
    estado: string;
    parentesco?: string;
    recibio?: string;
    dni?: string;
    motivo?: string;
    puerta?: string;
    color?: string;
    suministro?: string;
    devolucion?: string;
    fecha: string;
    hora: string;
}

interface ManifiestoDescargaFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManifiestoDescargaForm({ isOpen, onClose }: ManifiestoDescargaFormProps) {
    const [manifiesto, setManifiesto] = useState("");
    const [courier, setCourier] = useState("");
    const [zona, setZona] = useState("");
    const [fecha, setFecha] = useState("");
    const [total, setTotal] = useState("");
    const [pendientes, setPendientes] = useState("");
    const [estado, setEstado] = useState("");
    // MT fields
    const [motivo, setMotivo] = useState("");
    const [motivos, setMotivos] = useState<gesMotivoResponseDetail[]>([]);
    const [puerta, setPuerta] = useState("");
    const [color, setColor] = useState("");
    const [nroSuministro, setNroSuministro] = useState("");
    // EF fields
    const [parentesco, setParentesco] = useState("");
    const [parentescos, setParentescos] = useState<gesParentescoResponseDetail[]>([]);
    const [recibio, setRecibio] = useState("");
    const [dni, setDni] = useState("");
    // RT fields
    const [devolucion, setDevolucion] = useState("");
    const [devoluciones, setDevoluciones] = useState<gesMotivoResponseDetail[]>([]);
    const [fechaDescarga, setFechaDescarga] = useState(() => new Date().toISOString().split("T")[0]);
    const [horaDescarga, setHoraDescarga] = useState(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    });
    const [isSearching, setIsSearching] = useState(false);
    const [guiaInput, setGuiaInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [rows, setRows] = useState<DescargaRow[]>([]);
    const manifiestoInputRef = useRef<HTMLInputElement>(null);
    const guiaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAllParentesco(true)
            .then(setParentescos)
            .catch((err) => console.error("Error cargando parentescos:", err));
        getAllMotivo(true, 1)
            .then(setMotivos)
            .catch((err) => console.error("Error cargando motivos:", err));
        getAllMotivo(true, 2)
            .then(setDevoluciones)
            .catch((err) => console.error("Error cargando devoluciones:", err));
    }, []);

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setHoraDescarga(
                `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
            );
        };
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setManifiesto("");
        setCourier("");
        setZona("");
        setFecha("");
        setTotal("");
        setPendientes("");
        setEstado("");
        setMotivo("");
        setPuerta("");
        setColor("");
        setNroSuministro("");
        setParentesco("");
        setRecibio("");
        setDni("");
        setDevolucion("");
        setGuiaInput("");
        setRows([]);
        setTimeout(() => manifiestoInputRef.current?.focus(), 100);
    }, [isOpen]);

    const handleGuiaKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const guiaNum = Number(guiaInput.trim());
        if (!guiaNum) return;
        if (!estado) {
            toast.warning("Seleccione un estado antes de validar la guía.");
            return;
        }
        setIsValidating(true);
        try {
            const result = await validateGuiaManifiesto(guiaNum);
            if (!result.success) {
                toast.error(result.message || "La guía no está disponible para descarga.");
                return;
            }
            const estadoGuia = result.data.estado;
            if (["EF", "MT", "RT"].includes(estadoGuia)) {
                toast.error(`El envío ya fue descargado y el estado es ${estadoGuia}.`);
                return;
            }
            if (estadoGuia !== "ER") {
                toast.error(result.message || "La guía no está disponible para descarga.");
                return;
            }
            if (result.data.manifiesto !== manifiesto) {
                toast.error(`La guía pertenece al manifiesto ${result.data.manifiesto}, no al manifiesto ${manifiesto}.`);
                return;
            }
            const row: DescargaRow = {
                id_guia: result.data.id_guia,
                estado,
                fecha: fechaDescarga,
                hora: horaDescarga,
                ...(estado === "EF" && { parentesco, recibio, dni }),
                ...(estado === "MT" && { motivo, puerta, color, suministro: nroSuministro }),
                ...(estado === "RT" && { devolucion }),
            };
            setRows((prev) => [...prev, row]);
            toast.success(`Guía ${result.data.id_guia} agregada correctamente.`);
        } catch {
            toast.error("Error al validar la guía.");
        } finally {
            setIsValidating(false);
            setGuiaInput("");
            setTimeout(() => guiaInputRef.current?.focus(), 50);
        }
    };

    const resetForm = () => {
        setManifiesto("");
        setCourier("");
        setZona("");
        setFecha("");
        setTotal("");
        setPendientes("");
        setEstado("");
        setMotivo("");
        setPuerta("");
        setColor("");
        setNroSuministro("");
        setParentesco("");
        setRecibio("");
        setDni("");
        setDevolucion("");
        setGuiaInput("");
        setRows([]);
        setTimeout(() => manifiestoInputRef.current?.focus(), 50);
    };

    const handleGrabar = async () => {
        if (rows.length === 0) {
            toast.warning("No hay guías en la tabla para grabar.");
            return;
        }
        setIsSaving(true);
        try {
            const guias = rows.map((row) => ({
                id_guia: row.id_guia,
                estado: row.estado,
                recibido: row.recibio ?? "",
                parentesco: row.parentesco ? row.parentesco.split("-")[0] : "",
                documento: row.dni ?? "",
                motivo: row.estado === "RT"
                    ? (row.devolucion ? row.devolucion.split("-")[0] : "")
                    : (row.motivo ? row.motivo.split("-")[0] : ""),
                colorpuerta: row.puerta ? Number(row.puerta.split("-")[0]) : 0,
                suministro: row.suministro ?? "",
                fecha_descarga: new Date(`${row.fecha}T${row.hora}`),
                hora_descarga: row.hora,
            }));
            await updateManifiestoLocal({
                codigo: manifiesto,
                estado: "MI",
                userUpdated: localStorage.getItem("user_code") ?? "",
                guias,
            });
            toast.success("Manifiesto grabado correctamente.");
            resetForm();
        } catch {
            toast.error("Error al grabar el manifiesto.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBuscar = async () => {
        if (!manifiesto.trim()) return;
        setIsSearching(true);
        try {
            const result = await getByIdManifiesto(Number(manifiesto));
            if (!result) {
                toast.error("Manifiesto no encontrado.");
                return;
            }
            setCourier(result.nombre_courier);
            setManifiesto(result.codigo);
            setZona(result.zona_name);
            setFecha(new Date(result.createdAt).toLocaleDateString("es-PE"));
            setTotal(String(result.total));
            setPendientes(String(result.total_pendientes));
        } catch {
            toast.error("Error al buscar el manifiesto.");
        } finally {
            setIsSearching(false);
            setTimeout(() => manifiestoInputRef.current?.focus(), 50);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogTitle></DialogTitle>
            <DialogDescription className="sr-only">Formulario de descarga de manifiesto</DialogDescription>
            <DialogContent className="w-[60vw] max-w-[60vw]! h-[90vh] max-h-[90vh] rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]">

                {/* Barra superior */}
                <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
                        <Truck className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                        Descarga de <span className="text-red-600">Manifiesto</span>
                    </h2>
                </div>

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="flex flex-col gap-6">

                        {/* Card: Datos del Manifiesto */}
                        <Card className="border-slate-200 bg-white shadow-sm" id="datos_manifiesto">
                            <CardContent className="px-6 py-5">
                                <div className="grid grid-cols-3 gap-x-6 gap-y-4">

                                    {/* Manifiesto */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Manifiesto
                                        </Label>
                                        <div className="flex flex-1 gap-2">
                                            <Input
                                                ref={manifiestoInputRef}
                                                value={manifiesto}
                                                inputMode="numeric"
                                                onChange={(e) => setManifiesto(e.target.value.replace(/\D/g, ""))}
                                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleBuscar(); } }}
                                                placeholder="N° manifiesto"
                                                disabled={isSearching}
                                                className="flex-1 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60"
                                            />
                                            <button
                                                type="button"
                                                title="Búsqueda por guía"
                                                onClick={handleBuscar}
                                                disabled={!manifiesto.trim() || isSearching}
                                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                <Search className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Courier */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Courier
                                        </Label>
                                        <Input
                                            value={courier}
                                            onChange={(e) => setCourier(e.target.value)}
                                            readOnly
                                            className="flex-1 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Total
                                        </Label>
                                        <Input
                                            value={total}
                                            onChange={(e) => setTotal(e.target.value)}
                                            readOnly
                                            className="w-24 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                        />
                                    </div>

                                    {/* Zona */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Zona
                                        </Label>
                                        <Input
                                            value={zona}
                                            onChange={(e) => setZona(e.target.value)}
                                            readOnly
                                            className="flex-1 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                        />
                                    </div>

                                    {/* Fecha */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Fecha
                                        </Label>
                                        <Input
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            readOnly
                                            className="flex-1 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                        />
                                    </div>

                                    {/* Pendientes */}
                                    <div className="flex items-center gap-3">
                                        <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Pendientes
                                        </Label>
                                        <Input
                                            value={pendientes}
                                            onChange={(e) => setPendientes(e.target.value)}
                                            readOnly
                                            className="w-24 rounded-xl border-zinc-200 bg-white text-sm text-slate-700 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                        />
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Datos de Descarga */}
                        <Card className="border-slate-200 bg-white shadow-sm" id="filtros_descarga">
                            <CardContent className="px-6 py-5">
                                <div className="flex flex-col gap-4">

                                    {/* Fila: Estado + Fecha + Hora */}
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">

                                        {/* Estado */}
                                        <div className="flex items-center gap-3">
                                            <Label className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Estado
                                            </Label>
                                            <div className="flex items-center gap-1.5">
                                                {(["EF", "MT", "RT"] as const).map((op) => (
                                                    <button
                                                        key={op}
                                                        type="button"
                                                        onClick={() => setEstado(op)}
                                                        className={`h-8 min-w-10 rounded-lg px-3 text-xs font-bold uppercase tracking-wider transition-colors ${estado === op
                                                            ? "bg-red-600 text-white shadow-sm"
                                                            : "border border-zinc-200 bg-white text-slate-500 hover:border-red-300 hover:text-red-600"
                                                            }`}
                                                    >
                                                        {op}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fecha */}
                                        <div className="flex items-center gap-3">
                                            <Label className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Fecha
                                            </Label>
                                            <input
                                                type="date"
                                                value={fechaDescarga}
                                                onChange={(e) => setFechaDescarga(e.target.value)}
                                                className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                            />
                                        </div>

                                        {/* Hora */}
                                        <div className="flex items-center gap-3">
                                            <Label className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Hora
                                            </Label>
                                            <input
                                                type="time"
                                                value={horaDescarga}
                                                onChange={(e) => setHoraDescarga(e.target.value)}
                                                className="h-9 w-28 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                            />
                                        </div>

                                    </div>

                                    {/* Campos MT */}
                                    {estado === "MT" && (
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-zinc-100 bg-slate-50 px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Motivo</Label>
                                                <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
                                                    <option value="" disabled>Seleccionar</option>
                                                    {motivos.map((m) => (
                                                        <option key={m.id} value={m.id}>{m.descripcion}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Puerta</Label>
                                                <select value={puerta} onChange={(e) => setPuerta(e.target.value)} className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
                                                    <option value="" disabled>Seleccionar</option>
                                                    <option value="1">Madera</option>
                                                    <option value="2">Fierro</option>
                                                    <option value="3">Otro</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Color</Label>
                                                <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">N° Suministro</Label>
                                                <Input value={nroSuministro} onChange={(e) => setNroSuministro(e.target.value)} placeholder="N° suministro" className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Campos EF */}
                                    {estado === "EF" && (
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-4 rounded-xl border border-zinc-100 bg-slate-50 px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Parentesco</Label>
                                                <select value={parentesco} onChange={(e) => setParentesco(e.target.value)} className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
                                                    <option value="" disabled>Seleccionar</option>
                                                    {parentescos.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.descripcion}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Recibió</Label>
                                                <Input value={recibio} onChange={(e) => setRecibio(e.target.value)} placeholder="Nombre" className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">DNI</Label>
                                                <Input value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={8} placeholder="DNI" className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Campos RT */}
                                    {estado === "RT" && (
                                        <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-slate-50 px-4 py-4">
                                            <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">Motivo</Label>
                                            <select value={devolucion} onChange={(e) => setDevolucion(e.target.value)} className="h-9 flex-1 max-w-xs rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10">
                                                <option value="" disabled>Seleccionar motivo</option>
                                                {devoluciones.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.descripcion}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Datos de Descarga */}
                        <Card className="border-slate-200 bg-white shadow-sm" id="datos_descarga">
                            <CardContent className="px-6 py-5">
                                <div className="flex flex-col gap-4">
                                    {/* Input agregar guia */}
                                    <div className="flex items-center gap-3">
                                        <Label htmlFor="mf-validate-guia" className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            N° Guía
                                        </Label>
                                        <Input
                                            ref={guiaInputRef}
                                            id="mf-validate-guia"
                                            type="text"
                                            inputMode="numeric"
                                            value={guiaInput}
                                            onChange={(e) => setGuiaInput(e.target.value.replace(/\D/g, ""))}
                                            onKeyDown={handleGuiaKeyDown}
                                            disabled={isValidating || !estado || !manifiesto}
                                            placeholder={!manifiesto ? "Busque un manifiesto primero" : !estado ? "Seleccione un estado primero" : "Ingrese N° de guía y presione Enter"}
                                            className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* Tabla de guías */}
                                    {rows.length > 0 && (
                                        <div className="overflow-x-auto rounded-xl border border-zinc-200">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-zinc-200 bg-slate-50">
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">N° Guía</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Estado</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Parentesco</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Recibió</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">DNI</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Motivo</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Puerta</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Color</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">N° Suministro</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Fecha</th>
                                                        <th className="whitespace-nowrap px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-600">Hora</th>
                                                        <th className="px-3 py-2"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.map((row, idx) => (
                                                        <tr key={idx} className="border-b border-zinc-100 last:border-0 hover:bg-slate-50">
                                                            <td className="px-3 py-2 font-semibold text-slate-800">{row.id_guia}</td>
                                                            <td className="px-3 py-2">
                                                                <span className="rounded-md bg-red-100 px-2 py-0.5 font-bold text-red-700">{row.estado}</span>
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-600">
                                                                {row.estado === "EF" && row.parentesco
                                                                    ? `${row.parentesco}-${parentescos.find((p) => String(p.id) === row.parentesco)?.descripcion ?? row.parentesco}`
                                                                    : ""}
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-600">{row.estado === "EF" ? (row.recibio ?? "") : ""}</td>
                                                            <td className="px-3 py-2 text-slate-600">{row.estado === "EF" ? (row.dni ?? "") : ""}</td>
                                                            <td className="px-3 py-2 text-slate-600">
                                                                {row.estado === "MT"
                                                                    ? row.motivo
                                                                        ? `${row.motivo}-${motivos.find((m) => String(m.id) === row.motivo)?.descripcion ?? row.motivo}`
                                                                        : ""
                                                                    : row.estado === "RT"
                                                                        ? row.devolucion
                                                                            ? `${row.devolucion}-${devoluciones.find((d) => String(d.id) === row.devolucion)?.descripcion ?? row.devolucion}`
                                                                            : ""
                                                                        : ""}
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-600">
                                                                {row.estado === "MT" && row.puerta
                                                                    ? `${row.puerta}-${row.puerta === "1" ? "Madera" : row.puerta === "2" ? "Fierro" : "Otro"}`
                                                                    : ""}
                                                            </td>
                                                            <td className="px-3 py-2 text-slate-600">{row.estado === "MT" ? (row.color ?? "") : ""}</td>
                                                            <td className="px-3 py-2 text-slate-600">{row.estado === "MT" ? (row.suministro ?? "") : ""}</td>
                                                            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{row.fecha}</td>
                                                            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{row.hora}</td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 border-t border-zinc-200 bg-white px-8 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                        className="min-w-28 rounded-xl border-zinc-300 bg-white! px-6 text-slate-700 hover:bg-zinc-50! disabled:opacity-60"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGrabar}
                        disabled={isSaving || rows.length === 0}
                        className="min-w-28 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {isSaving ? "Grabando…" : "Descargar"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
