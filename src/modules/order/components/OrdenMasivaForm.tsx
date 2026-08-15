import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { saveOrden } from "../services/order.service";
import type { GuiaOrden } from "@/modules/guia/types/guia.type";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UbigeoFrom } from "@/modules/ubigeo/UbigeoFrom";
import { useOrdenForm } from "../hooks/useOrdenForm";
import { MapPin, ClipboardList, Layers, Package, Upload } from "lucide-react";
import type { UbigeoItem } from "@/modules/ubigeo/types/ubigeo.type";

interface OrdenMasivaFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

const CSV_COLUMNS = [
    { label: "Item",          index: 12 },
    { label: "Empresa",       index: 0  },
    { label: "Destinatario",  index: 1  },
    { label: "Dirección",     index: 2  },
    { label: "Glosa",         index: 3  },
    { label: "Tarifa",        index: 4  },
    { label: "Destino",       index: 5  },
    { label: "T. Envío",      index: 6  },
    { label: "Peso",          index: 7  },
    { label: "Bulto",         index: 8  },
    { label: "Unidad",        index: 9  },
    { label: "Observaciones", index: 11 },
    { label: "T. Documento",  index: 13 },
    { label: "Número",        index: 14 },
];

export default function OrdenMasivaForm({ isOpen, onClose, onSaved }: OrdenMasivaFormProps) {

    const {
        isLoadingCustomers,
        selectedCustomer,
        filteredCustomers,
        handleSelectCustomer,
        selectedCenterCost,
        isLoadingCenterCosts,
        filteredCenterCosts,
        handleSelectCenterCost,
        selectedOrigen,
        selectedOrigenLabel,
        setSelectedOrigen,
        setSelectedOrigenLabel,
        isUbigeoOpen,
        setIsUbigeoOpen,
        fecha,
        setFecha,
        numeroOrden,
        setNumeroOrden,
        isSearchingOrden,
        isOrdenFound,
        resetForm,
        handleOrdenSearch,
        showOrdenConfirm,
        setShowOrdenConfirm,
        pendingOrden,
        customerButtonRef,
        destinoButtonRef,
        numeroOrdenRef,
        centerCostRef,
        origenButtonRef,
    } = useOrdenForm();

    const [csvRows, setCsvRows] = useState<string[][]>([]);
    const [csvFileName, setCsvFileName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const PAGE_SIZE = 15;

    const parseCSV = (text: string): string[][] => {
        const rows: string[][] = [];
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        for (let i = 0; i < lines.length; i++) {
            const cols: string[] = [];
            let current = "";
            let inQuotes = false;
            for (const char of lines[i]) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ";" && !inQuotes) {
                    cols.push(current);
                    current = "";
                } else {
                    current += char;
                }
            }
            cols.push(current);
            if (cols.some((c) => c.trim() !== "")) rows.push(cols);
        }
        return rows;
    };

    const handleFileChange = (e: { target: { files: FileList | null } }) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvFileName(file.name);
        setCurrentPage(1);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            setCsvRows(parseCSV(text));
        };
        reader.readAsText(file);
    };

    const handleUbigeoSelect = (item: UbigeoItem) => {
        setSelectedOrigen(item.codigo.trim());
        setSelectedOrigenLabel(`${item.departamento} - ${item.provincia} - ${item.distrito}`);
        setIsUbigeoOpen(false);
        setTimeout(() => destinoButtonRef.current?.focus(), 50);
    };

    const isMasivaFormValid =
        !!numeroOrden && !!selectedCustomer && !!selectedCenterCost &&
        !!selectedOrigen && !!fecha && csvRows.length > 0 && !isOrdenFound;

    const handleSaveMasiva = async () => {
        if (!isMasivaFormValid) return;
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            const guias: GuiaOrden[] = csvRows.map((row) => ({
                id_guia: Number(`${numeroOrden}${row[12] ?? ''}`),
                item: Number(row[12] ?? 0),
                empresa: row[0] ?? '',
                destinatario: 0,
                destinatario_name: row[1] ?? '',
                direccion: row[2] ?? '',
                tarifa: Number(row[4] ?? 0),
                peso: Number(row[7] ?? 0),
                bultos: Number(row[8] ?? 0),
                unidades: Number(row[9] ?? 0),
                origen: selectedOrigen,
                destino: row[5] ?? '',
                tenvio: Number(row[6] ?? 0),
                contenido: row[3] ?? '',
                observaciones: row[11] ?? '',
                estado: 'PD',
                digitalizado: false,
            }));
            await saveOrden({
                numero: Number(numeroOrden),
                customer: selectedCustomer,
                ccosto: selectedCenterCost,
                origen: selectedOrigen,
                provincia: '001',
                userCreated: localStorage.getItem('user_code') ?? '',
                fecha_registro: new Date(`${fecha}T00:00:00`),
                guias,
            });
            setSaveSuccess(true);
            toast.success('Orden masiva registrada');
            onSaved?.();
            resetForm();
            setCsvRows([]);
            setCsvFileName('');
            setCurrentPage(1);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setTimeout(() => setSaveSuccess(false), 3000);
            setTimeout(() => numeroOrdenRef.current?.focus(), 50);
        } catch (error) {
            console.error('Error al grabar:', error);
            setSaveError('No se pudo grabar. Intente nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    return (
        <>
        {/* Diálogo orden ya existe */}
        <Dialog open={showOrdenConfirm} onOpenChange={(open) => !open && setShowOrdenConfirm(false)}>
            <DialogContent className="max-w-sm rounded-2xl p-6 bg-white">
                <DialogTitle className="text-base font-bold text-slate-800">
                    Orden ya existe
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-600 mt-1">
                    La orden <span className="font-semibold text-slate-800">N° {pendingOrden?.numero}</span> ya existe en el sistema.
                </DialogDescription>
                <DialogFooter className="mt-4 flex justify-end">
                    <Button
                        variant="ghost"
                        className="rounded-xl bg-red-600! text-white hover:bg-red-700! min-w-25 px-6"
                        onClick={() => {
                            setShowOrdenConfirm(false);
                            setNumeroOrden("");
                            setTimeout(() => numeroOrdenRef.current?.focus(), 50);
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogTitle></DialogTitle>
            <DialogContent className="w-[70vw] max-w-[70vw]! h-[95vh] max-h-[95vh] rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]">

                {/* Barra superior fija */}
                <div className="flex shrink-0 flex-col gap-2 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                            Orden <span className="text-red-600">Masiva</span>
                        </h2>
                    </div>

                    <div className="flex justify-end items-center gap-2">
                        {/* N° Orden */}
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                            <Label htmlFor="masiva-orden" className="text-[11px] font-bold uppercase tracking-widest text-slate-700 whitespace-nowrap">
                                N° Orden
                            </Label>
                            <Input
                                id="masiva-orden"
                                type="text"
                                inputMode="numeric"
                                ref={numeroOrdenRef}
                                placeholder="—"
                                maxLength={6}
                                value={numeroOrden}
                                disabled={isSearchingOrden}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    if (val.length <= 6) setNumeroOrden(val);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleOrdenSearch();
                                    }
                                }}
                                className="h-7 w-20 border-0 bg-transparent p-0 text-sm font-semibold text-slate-700 shadow-none focus-visible:ring-0 placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                    </div>
                </div>

                {/* Area de contenido scrolleable */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="mx-auto w-full max-w-[96%] flex flex-col gap-6">

                        {/* Card: Datos de la Orden */}
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 px-6 py-4">
                                <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                    <ClipboardList className="h-4 w-4 text-red-500" />
                                    Datos de la Orden
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 py-5">
                                <div className="flex flex-col gap-4">

                                    {/* Fila 1: Cliente + Centro de Costo */}
                                    <div className="grid grid-cols-2 gap-6">

                                        {/* Cliente */}
                                        <div className="flex items-center gap-3">
                                            <Label htmlFor="masiva-cliente" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Cliente
                                            </Label>
                                            <div className="flex-1">
                                                <select
                                                    ref={customerButtonRef}
                                                    id="masiva-cliente"
                                                    value={selectedCustomer}
                                                    disabled={isOrdenFound || isLoadingCustomers}
                                                    onChange={(e) => {
                                                        const customer = filteredCustomers.find((c) => c.codigo === e.target.value);
                                                        if (customer) handleSelectCustomer(customer.codigo, customer.descripcion);
                                                    }}
                                                    className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    <option value="" disabled>
                                                        {isLoadingCustomers ? "Cargando clientes..." : "Seleccionar cliente"}
                                                    </option>
                                                    {filteredCustomers.map((customer) => (
                                                        <option key={customer.codigo} value={customer.codigo}>
                                                            {customer.descripcion.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Centro de Costo */}
                                        <div className="flex items-center gap-3">
                                            <Label htmlFor="masiva-centro-costo" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Centro de Costo
                                            </Label>
                                            <div className="flex-1">
                                                <select
                                                    ref={centerCostRef}
                                                    id="masiva-centro-costo"
                                                    value={selectedCenterCost}
                                                    disabled={!selectedCustomer || isOrdenFound || isLoadingCenterCosts}
                                                    onChange={(e) => {
                                                        const centerCost = filteredCenterCosts.find((cc) => cc.codigo === e.target.value);
                                                        if (centerCost) handleSelectCenterCost(centerCost.codigo, centerCost.descripcion);
                                                    }}
                                                    className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    <option value="" disabled>
                                                        {isLoadingCenterCosts ? "Cargando centros..." : "Seleccionar centro"}
                                                    </option>
                                                    {filteredCenterCosts.map((centerCost) => (
                                                        <option key={centerCost.codigo} value={centerCost.codigo}>
                                                            {centerCost.descripcion.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                    </div>{/* fin fila 1 */}

                                    {/* Fila 2: Origen + Fecha */}
                                    <div className="grid grid-cols-2 gap-6">

                                        {/* Origen */}
                                        <div className="flex items-center gap-3">
                                            <Label className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Origen
                                            </Label>
                                            <div className="flex-1">
                                                <Button
                                                    ref={origenButtonRef}
                                                    type="button"
                                                    variant="outline"
                                                    disabled={isOrdenFound}
                                                    onClick={() => !isOrdenFound && setIsUbigeoOpen(true)}
                                                    className="w-full justify-between rounded-xl border-zinc-200 bg-white text-sm font-normal text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    <span className="truncate">
                                                        {selectedOrigenLabel || "Seleccionar origen"}
                                                    </span>
                                                    <MapPin className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Fecha */}
                                        <div className="flex items-center gap-3">
                                            <Label htmlFor="masiva-fecha" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Fecha
                                            </Label>
                                            <div className="flex-1">
                                                <input
                                                    id="masiva-fecha"
                                                    type="date"
                                                    value={fecha}
                                                    disabled={isOrdenFound}
                                                    onChange={(e) => setFecha(e.target.value)}
                                                    className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                    </div>{/* fin fila 2 */}

                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Datos de la Guia */}
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader className="border-b border-slate-100 px-6 py-4">
                                    <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                        <Package className="h-4 w-4 text-red-500" />
                                        Datos de Envios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-5 flex flex-col gap-4">
                                    {/* Upload */}
                                    <div className="flex items-center gap-3">
                                        <Label htmlFor="masiva-archivo" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Cargue su archivo
                                        </Label>
                                        <div className="flex-1">
                                            <label
                                                htmlFor="masiva-archivo"
                                                className="flex items-center gap-3 h-9 w-full cursor-pointer rounded-xl border border-dashed border-zinc-300 bg-white px-4 text-sm text-slate-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Upload className="h-4 w-4 shrink-0" />
                                                <span className="truncate">
                                                    {csvFileName || "Seleccionar archivo CSV..."}
                                                </span>
                                            </label>
                                            <input
                                                ref={fileInputRef}
                                                id="masiva-archivo"
                                                type="file"
                                                accept=".csv"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Tabla de datos */}
                                    {csvRows.length > 0 && (() => {
                                        const totalPages = Math.ceil(csvRows.length / PAGE_SIZE);
                                        const pageRows = csvRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
                                        return (
                                        <div className="flex flex-col gap-2">
                                            <div className="overflow-x-auto border border-slate-200">
                                                <table className="min-w-full text-xs">
                                                    <thead>
                                                        <tr className="bg-slate-950">
                                                            {CSV_COLUMNS.map((col) => (
                                                                <th
                                                                    key={col.label}
                                                                    className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-200"
                                                                >
                                                                    {col.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pageRows.map((row, i) => (
                                                            <tr
                                                                key={i}
                                                                className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                                            >
                                                                {CSV_COLUMNS.map((col) => (
                                                                    <td
                                                                        key={col.label}
                                                                        className="whitespace-nowrap px-3 py-2 text-slate-600 font-medium"
                                                                    >
                                                                        {row[col.index] ?? ""}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Paginado */}
                                            <div className="flex items-center justify-between px-1 py-2 border-t border-slate-100">
                                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                                    <span className="font-bold text-slate-600">{csvRows.length}</span> registros &nbsp;&bull;&nbsp; página <span className="font-bold text-slate-600">{currentPage}</span> de <span className="font-bold text-slate-600">{totalPages}</span>
                                                </span>
                                                <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-1.5 py-1">
                                                    <button
                                                        type="button"
                                                        disabled={currentPage === 1}
                                                        onClick={() => setCurrentPage(1)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm disabled:opacity-25 disabled:cursor-not-allowed"
                                                    >
                                                        «
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={currentPage === 1}
                                                        onClick={() => setCurrentPage((p) => p - 1)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm disabled:opacity-25 disabled:cursor-not-allowed"
                                                    >
                                                        ‹
                                                    </button>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                                                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                                            if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                                                            acc.push(p);
                                                            return acc;
                                                        }, [])
                                                        .map((p, idx) =>
                                                            p === "..." ? (
                                                                <span key={`ellipsis-${idx}`} className="flex h-7 w-5 items-center justify-center text-xs font-bold text-slate-400 select-none">…</span>
                                                            ) : (
                                                                <button
                                                                    key={p}
                                                                    type="button"
                                                                    onClick={() => setCurrentPage(p as number)}
                                                                    className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-xs font-black transition ${
                                                                        currentPage === p
                                                                            ? "bg-red-600 text-white shadow-sm shadow-red-300"
                                                                            : "text-slate-600 hover:bg-white hover:text-red-600 hover:shadow-sm"
                                                                    }`}
                                                                >
                                                                    {p}
                                                                </button>
                                                            )
                                                        )}
                                                    <button
                                                        type="button"
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage((p) => p + 1)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm disabled:opacity-25 disabled:cursor-not-allowed"
                                                    >
                                                        ›
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage(totalPages)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm disabled:opacity-25 disabled:cursor-not-allowed"
                                                    >
                                                        »
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-zinc-200 bg-white px-8 py-4">
                    {saveSuccess && (
                        <span className="mr-auto text-xs font-semibold text-green-600 uppercase tracking-wide">
                            Orden masiva grabada correctamente
                        </span>
                    )}
                    {saveError && (
                        <span
                            className="mr-auto text-xs font-semibold text-red-500 uppercase tracking-wide cursor-pointer"
                            onClick={() => setSaveError(null)}
                        >
                            {saveError}
                        </span>
                    )}
                    <Button
                        type="button"
                        disabled={!isMasivaFormValid || isSaving}
                        onClick={handleSaveMasiva}
                        className="min-w-28 rounded-xl bg-red-600! px-6 text-white hover:bg-red-700! disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Grabando...' : 'Grabar'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="min-w-28 rounded-xl border-zinc-300 bg-white! px-6 text-slate-700 hover:bg-zinc-50!"
                    >
                        Cancelar
                    </Button>
                </div>

            </DialogContent>

            <UbigeoFrom
                open={isUbigeoOpen}
                onOpenChange={setIsUbigeoOpen}
                onSelect={handleUbigeoSelect}
            />
        </Dialog>
        </>
    );
}
