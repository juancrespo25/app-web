import { useEffect } from "react";
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
import { MapPin, ClipboardList, Package } from "lucide-react";
import type { UbigeoItem } from "@/modules/ubigeo/types/ubigeo.type";

interface OrdenFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export default function OrdenForm({ isOpen, onClose, onSaved }: OrdenFormProps) {

    const {
        isLoadingCustomers,
        selectedCustomer,
        filteredCustomers,
        handleSelectCustomer,
        selectedCenterCost,
        isLoadingCenterCosts,
        filteredCenterCosts,
        handleSelectCenterCost,
        selectedOrigenLabel,
        setSelectedOrigen,
        setSelectedOrigenLabel,
        isUbigeoOpen,
        setIsUbigeoOpen,
        selectedDestinoLabel,
        setSelectedDestino,
        setSelectedDestinoLabel,
        isUbigeoDestinoOpen,
        setIsUbigeoDestinoOpen,
        correlativo,
        contenidos,
        selectedContenido,
        setSelectedContenido,
        isLoadingContenidos,
        tipoEnvios,
        selectedTipoEnvio,
        setSelectedTipoEnvio,
        isLoadingTipoEnvios,
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
        handleConfirmOrden,
        customerButtonRef,
        destinoButtonRef,
        numeroOrdenRef,
        centerCostRef,
        origenButtonRef,
        destinatarioInputRef,
        direccionRef,
        empresaRef,
        contenidoRef,
        tipoEnvioRef,
        pesoRef,
        bultosRef,
        unidadesRef,
        observacionesRef,
        grabarButtonRef,
        destinatario,
        handleDestinatarioChange,
        direccion,
        setDireccion,
        destinatarioOptions,
        isSearchingDestinatario,
        showDestinatarioOptions,
        setShowDestinatarioOptions,
        handleSelectDestinatario,
        empresa,
        setEmpresa,
        peso,
        setPeso,
        bultos,
        setBultos,
        unidades,
        setUnidades,
        observaciones,
        setObservaciones,
        isSaving,
        saveError,
        setSaveError,
        saveSuccess,
        isOrdenFormValid,
        handleSaveOrden,
    } = useOrdenForm(onSaved);

    const handleUbigeoSelect = (item: UbigeoItem) => {
        setSelectedOrigen(item.codigo.trim());
        setSelectedOrigenLabel(`${item.departamento} - ${item.provincia} - ${item.distrito}`);
        setIsUbigeoOpen(false);
        setShowDestinatarioOptions(false);
        setTimeout(() => destinatarioInputRef.current?.focus(), 50);
    };

    const handleUbigeoDestinoSelect = (item: UbigeoItem) => {
        setSelectedDestino(item.codigo.trim());
        setSelectedDestinoLabel(`${item.departamento} - ${item.provincia} - ${item.distrito}`);
        setIsUbigeoDestinoOpen(false);
        setShowDestinatarioOptions(false);
        setTimeout(() => direccionRef.current?.focus(), 50);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    return (
        <>
            {/* Diálogo de confirmación orden existente */}
            <Dialog open={showOrdenConfirm} onOpenChange={(open) => !open && setShowOrdenConfirm(false)}>
                <DialogContent className="max-w-sm rounded-2xl p-6 bg-white">
                    <DialogTitle className="text-base font-bold text-slate-800">
                        Orden encontrada
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-600 mt-1">
                        La orden <span className="font-semibold text-slate-800">N° {pendingOrden?.numero}</span> ya existe.
                        ¿Desea agregar correlativos a esta orden?
                    </DialogDescription>
                    <DialogFooter className="mt-4 flex gap-3 justify-end">
                        <Button
                            variant="ghost"
                            className="rounded-xl border border-slate-200 bg-white! text-slate-700 hover:bg-slate-50! min-w-25 px-6"
                            onClick={() => { setShowOrdenConfirm(false); onClose(); }}
                        >
                            No
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-xl bg-red-600! text-white hover:bg-red-700! min-w-32.5 px-6"
                            onClick={handleConfirmOrden}
                        >
                            Sí, agregar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogTitle></DialogTitle>
                <DialogContent className="w-[60vw] max-w-[60vw]! h-[95vh] max-h-[95vh] rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]">

                    {/* Barra superior fija */}
                    <div className="flex shrink-0 flex-col gap-2 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
                                <ClipboardList className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
                                Nueva <span className="text-red-600">Orden</span>
                            </h2>
                        </div>

                        <div className="flex justify-end items-center gap-2">
                            {/* N° Orden */}
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                                <Label htmlFor="orden" className="text-[11px] font-bold uppercase tracking-widest text-slate-700 whitespace-nowrap">
                                    N° Orden
                                </Label>
                                <Input
                                    id="orden"
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
                            {/* Separador */}
                            <span className="text-slate-300 text-lg font-light select-none">/</span>
                            {/* Correlativo */}
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                                    Corr.
                                </Label>
                                <span className="text-sm font-semibold text-slate-400 min-w-6 text-center">
                                    {correlativo || "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Area de contenido scrolleable */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <div className="mx-auto max-w-4xl flex flex-col gap-6">

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
                                                <Label htmlFor="cliente" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Cliente
                                                </Label>
                                                <div className="flex-1">
                                                    <select
                                                        ref={customerButtonRef}
                                                        id="cliente"
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
                                                <Label htmlFor="centro-costo" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Centro de Costo
                                                </Label>
                                                <div className="flex-1">
                                                    <select
                                                        ref={centerCostRef}
                                                        id="centro-costo"
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
                                                <Label htmlFor="fecha" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Fecha
                                                </Label>
                                                <div className="flex-1">
                                                    <input
                                                        id="fecha"
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
                                        Datos de Envio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-5">
                                    <div className="flex flex-col gap-4">

                                        {/* Fila 0: Destinatario + Destino */}
                                        <div className="grid grid-cols-2 gap-6">

                                            {/* Destinatario */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="destinatario" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Destinatario
                                                </Label>
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <Input
                                                            ref={destinatarioInputRef}
                                                            id="destinatario"
                                                            type="text"
                                                            placeholder="Nombre del destinatario"
                                                            value={destinatario}
                                                            autoComplete="off"
                                                            onChange={(e) => {
                                                                handleDestinatarioChange(e.target.value);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    setShowDestinatarioOptions(false);
                                                                    destinoButtonRef.current?.focus();
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                setShowDestinatarioOptions(destinatario.trim().length >= 3);
                                                            }}
                                                            className="w-full rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10 pr-24"
                                                        />
                                                        {isSearchingDestinatario && (
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                                                                Buscando...
                                                            </span>
                                                        )}
                                                    </div>
                                                    {showDestinatarioOptions && (
                                                        <div className="mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                                                            <div className="max-h-56 overflow-y-auto py-1">
                                                                {isSearchingDestinatario ? (
                                                                    <div className="px-4 py-3 text-sm text-slate-400">Buscando destinatarios...</div>
                                                                ) : destinatarioOptions.length > 0 ? (
                                                                    destinatarioOptions.map((opt, index) => (
                                                                        <button
                                                                            key={opt.id || `${opt.nombre}-${index}`}
                                                                            type="button"
                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                            onClick={() => {
                                                                                handleSelectDestinatario(opt);
                                                                            }}
                                                                            className="block w-full px-4 py-2.5 text-left text-sm text-slate-800 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none"
                                                                        >
                                                                            {opt.nombre}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-4 py-3 text-sm text-slate-400">Sin destinatarios encontrados</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Destino */}
                                            <div className="flex items-center gap-3">
                                                <Label className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Destino
                                                </Label>
                                                <div className="flex-1">
                                                    <Button
                                                        ref={destinoButtonRef}
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsUbigeoDestinoOpen(true)}
                                                        className="w-full justify-between rounded-xl border-zinc-200 bg-white text-sm font-normal text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <span className="truncate">
                                                            {selectedDestinoLabel || "Seleccionar destino"}
                                                        </span>
                                                        <MapPin className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>{/* fin fila 0 */}

                                        {/* Fila 1:  Direccion + Empresa */}
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Direccion */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="direccion" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Direccion
                                                </Label>
                                                <Input
                                                    ref={direccionRef}
                                                    id="direccion"
                                                    type="text"
                                                    placeholder="Direccion de entrega"
                                                    value={direccion}
                                                    onChange={(e) => setDireccion(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); empresaRef.current?.focus(); } }}
                                                    className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                                />
                                            </div>

                                            {/* Empresa */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="empresa" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Empresa
                                                </Label>
                                                <Input
                                                    ref={empresaRef}
                                                    id="empresa"
                                                    type="text"
                                                    value={empresa}
                                                    onChange={(e) => setEmpresa(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); contenidoRef.current?.focus(); } }}
                                                    placeholder="Nombre de la empresa"
                                                    className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                                />
                                            </div>

                                        </div>{/* fin fila 1 */}

                                        {/* Fila 2: Contenido + Tipo de Envio */}
                                        <div className="grid grid-cols-2 gap-6">

                                            {/* Contenido */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="contenido" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Glosa
                                                </Label>
                                                <div className="flex-1">
                                                    <select
                                                        ref={contenidoRef}
                                                        id="contenido"
                                                        value={selectedContenido}
                                                        onChange={(e) => { setSelectedContenido(e.target.value); setTimeout(() => tipoEnvioRef.current?.focus(), 50); }}
                                                        className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                                    >
                                                        <option value="" disabled>
                                                            {isLoadingContenidos ? "Cargando contenidos..." : "Seleccionar contenido"}
                                                        </option>
                                                        {contenidos.map((contenido) => (
                                                            <option key={contenido.id} value={contenido.id}>
                                                                {contenido.descripcion}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Tipo de Envio */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="tipo-envio" className="w-32 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Tipo de Envio
                                                </Label>
                                                <div className="flex-1">
                                                    <select
                                                        ref={tipoEnvioRef}
                                                        id="tipo-envio"
                                                        value={selectedTipoEnvio}
                                                        onChange={(e) => { setSelectedTipoEnvio(e.target.value); setTimeout(() => pesoRef.current?.focus(), 50); }}
                                                        disabled={isLoadingTipoEnvios}
                                                        className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="" disabled>
                                                            {isLoadingTipoEnvios ? "Cargando tipos..." : "Seleccionar tipo"}
                                                        </option>
                                                        {tipoEnvios.map((tipoEnvio) => (
                                                            <option key={tipoEnvio.id} value={tipoEnvio.id}>
                                                                {tipoEnvio.descripcion}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* fin fila 2 */}

                                        {/* Fila 3: Peso + Bultos + Unidades */}
                                        <div className="grid grid-cols-3 gap-6">

                                            {/* Peso */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="peso" className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Peso
                                                </Label>
                                                <Input
                                                    ref={pesoRef}
                                                    id="peso"
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={peso}
                                                    onChange={(e) => setPeso(e.target.value.replace(/[^0-9.]/g, ''))}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); bultosRef.current?.focus(); } }}
                                                    placeholder="Peso"
                                                    className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                                />
                                            </div>

                                            {/* Bultos */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="bultos" className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Bultos
                                                </Label>
                                                <Input
                                                    ref={bultosRef}
                                                    id="bultos"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={bultos}
                                                    onChange={(e) => setBultos(e.target.value.replace(/\D/g, ''))}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); unidadesRef.current?.focus(); } }}
                                                    placeholder="Cantidad"
                                                    className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                                />
                                            </div>

                                            {/* Unidades */}
                                            <div className="flex items-center gap-3">
                                                <Label htmlFor="unidades" className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                    Unidades
                                                </Label>
                                                <Input
                                                    ref={unidadesRef}
                                                    id="unidades"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={unidades}
                                                    onChange={(e) => setUnidades(e.target.value.replace(/\D/g, ''))}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); observacionesRef.current?.focus(); } }}
                                                    placeholder="Unidades"
                                                    className="flex-1 rounded-xl border-zinc-200 text-sm focus:border-red-600 focus:ring-red-600/10"
                                                />
                                            </div>

                                        </div>{/* fin fila 3 */}

                                        {/* Fila 5: observaciones */}
                                        <div className="flex items-start gap-3">
                                            <Label htmlFor="observaciones" className="w-32 shrink-0 pt-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Observaciones
                                            </Label>
                                            <textarea
                                                ref={observacionesRef}
                                                id="observaciones"
                                                rows={2}
                                                value={observaciones}
                                                onChange={(e) => setObservaciones(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); grabarButtonRef.current?.focus(); } }}
                                                placeholder="Ingrese las observaciones"
                                                className="flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                                            /></div>{/* fin fila 5 */}

                                        <div className="flex justify-end items-center gap-3 border-t border-zinc-200 pt-4">
                                            {saveSuccess && (
                                                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide mr-auto">
                                                    Orden grabada correctamente
                                                </span>
                                            )}
                                            {saveError && (
                                                <span
                                                    className="text-xs font-semibold text-red-500 uppercase tracking-wide mr-auto cursor-pointer"
                                                    onClick={() => setSaveError(null)}
                                                >
                                                    {saveError}
                                                </span>
                                            )}
                                            <Button
                                                ref={grabarButtonRef}
                                                type="button"
                                                disabled={!isOrdenFormValid || isSaving}
                                                onClick={handleSaveOrden}
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

                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                </DialogContent>

                <UbigeoFrom
                    open={isUbigeoOpen}
                    onOpenChange={setIsUbigeoOpen}
                    onSelect={handleUbigeoSelect}
                />
                <UbigeoFrom
                    open={isUbigeoDestinoOpen}
                    onOpenChange={setIsUbigeoDestinoOpen}
                    onSelect={handleUbigeoDestinoSelect}
                />
            </Dialog>
        </>
    );
}
