import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileStack, Package, Trash2 } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useManifiestoForm } from "../hooks/useManifiestoForm";

interface ManifiestoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export default function ManifiestoForm({ isOpen, onClose, onSaved }: ManifiestoFormProps) {
    const {
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
    } = useManifiestoForm(isOpen, onClose, onSaved);

    useEffect(() => {}, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogTitle></DialogTitle>
            <DialogContent className="w-[65vw] max-w-[65vw]! h-[90vh] max-h-[90vh] rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]">

                {/* Barra superior */}
                <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
                        <FileStack className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                        Nuevo <span className="text-red-600">Manifiesto</span>
                    </h2>
                </div>

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="flex flex-col gap-6">

                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-slate-100 px-6 py-4">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                <FileStack className="h-4 w-4 text-red-500" />
                                Datos del Manifiesto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="flex flex-col gap-4">

                                {/* N° Manifiesto */}
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="num-manifiesto" className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        N° Manifiesto
                                    </Label>
                                    <Input
                                        id="num-manifiesto"
                                        type="text"
                                        value={numeroManifiesto}
                                        readOnly
                                        className="flex-1 border-0 bg-transparent text-sm text-slate-900 cursor-not-allowed shadow-none focus-visible:ring-0"
                                    />
                                </div>

                                {/* Zona */}
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="mf-zona" className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Zona
                                    </Label>
                                    <select
                                        id="mf-zona"
                                        value={zona}
                                        onChange={(e) => setZona(e.target.value)}
                                        disabled={isLoadingZonas}
                                        className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>
                                            {isLoadingZonas ? "Cargando zonas..." : "Seleccionar zona"}
                                        </option>
                                        {zonas.map((z) => (
                                            <option key={z.codigo} value={z.codigo}>
                                                {z.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Courier */}
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="mf-courier" className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Courier
                                    </Label>
                                    <select
                                        id="mf-courier"
                                        value={courier}
                                        onChange={(e) => setCourier(e.target.value)}
                                        disabled={isLoadingCouriers}
                                        className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>
                                            {isLoadingCouriers ? "Cargando couriers..." : "Seleccionar courier"}
                                        </option>
                                        {couriers.map((c) => (
                                            <option key={c.codigo} value={c.codigo}>
                                                {c.nombre_completo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Guías */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-slate-100 px-6 py-4">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                <Package className="h-4 w-4 text-red-500" />
                                Guías
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 py-5">
                            <div className="flex flex-col gap-4">

                                {/* Input agregar guia */}
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="mf-guia-input" className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        N° Guía
                                    </Label>
                                    <Input
                                        ref={guiaInputRef}
                                        id="mf-guia-input"
                                        type="text"
                                        inputMode="numeric"
                                        value={guiaInput}
                                        onChange={(e) => setGuiaInput(e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddGuia(); } }}
                                        placeholder="Ingrese N° de guía y presione Enter"
                                        className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddGuia}
                                        disabled={!guiaInput.trim() || isValidating}
                                        className="rounded-xl bg-red-600! text-white hover:bg-red-700! disabled:opacity-50"
                                    >
                                        {isValidating ? "Validando..." : "Agregar"}
                                    </Button>
                                </div>

                                {/* Tabla de guías */}
                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <Table className="min-w-full text-sm">
                                        <TableHeader>
                                            <TableRow className="bg-slate-950">
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Orden</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Guía</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Cliente</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">C.Costo</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Destino</TableHead>
                                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Destinatario</TableHead>
                                                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-200"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {guias.length === 0 ? (
                                                <TableRow>
                                                        <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-400">
                                                        Sin guías agregadas
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                guias.map((item) => (
                                                    <TableRow key={item.guia} className="bg-white hover:bg-slate-50 transition-colors">
                                                        <TableCell className="px-4 py-3 text-slate-700">{item.orden}</TableCell>
                                                        <TableCell className="px-4 py-3 font-medium text-slate-700">{item.guia}</TableCell>
                                                        <TableCell className="px-4 py-3 text-slate-700">{item.cliente}</TableCell>
                                                        <TableCell className="px-4 py-3 text-slate-700">{item.cCosto}</TableCell>
                                                        <TableCell className="px-4 py-3 text-slate-700">{item.destino}</TableCell>
                                                        <TableCell className="px-4 py-3 text-slate-700">{item.destinatario}</TableCell>
                                                        <TableCell className="px-4 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveGuia(item.guia)}
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 border-t border-zinc-200 bg-white px-8 py-4">
                    {saveError && (
                        <span
                            className="text-xs font-semibold text-red-500 uppercase tracking-wide mr-auto cursor-pointer"
                            onClick={() => setSaveError(null)}
                        >
                            {saveError}
                        </span>
                    )}
                    <Button
                        type="button"
                        disabled={!isFormValid || isSaving}
                        onClick={handleSave}
                        className="min-w-28 rounded-xl bg-red-600! px-6 text-white hover:bg-red-700! disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Guardando..." : "Grabar"}
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
        </Dialog>
    );
}
