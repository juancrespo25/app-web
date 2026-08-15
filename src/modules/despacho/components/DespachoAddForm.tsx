import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDespachoAddForm } from "../hooks/useDespachoAddForm";

interface DespachoFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  despachoId?: string | number | null;
  onSuccess?: () => void;
  readOnly?: boolean;
}

const DespachoAddForm = ({ isOpen, onOpenChange, despachoId, onSuccess, readOnly }: DespachoFormProps) => {
  const {
    detail,
    guiaInput,
    guias,
    loading,
    validating,
    isSaving,
    guiaInputRef,
    handleInputChange,
    handleEnterKey,
    removeGuia,
    handleSave,
  } = useDespachoAddForm(despachoId, onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogDescription className="sr-only">
        Formulario de despacho
      </DialogDescription>
      <DialogContent className="w-[55vw] max-w-[55vw]! h-auto rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]">
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
            <Truck className="h-5 w-5 text-white" />
          </div>
<h2 className="text-base font-black uppercase tracking-tight text-slate-900">
{readOnly ? (
              <>
                Detalle del <span className="text-red-600">Despacho de</span>{" "}
                <span className="text-slate-900 capitalize">
                  {detail?.provincia ?? "..."}
                </span>
              </>
            ) : (
              <>
                Agregar Guias al <span className="text-red-600">Despacho de</span>{" "}
                <span className="text-slate-900 capitalize">
                  {detail?.provincia ?? "..."}
                </span>
              </>
            )}
          </h2>
        </div>

        <div className="flex flex-col gap-5 px-8 py-6">
          {/* Card: Datos del Despacho */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="px-6 py-5">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando datos del despacho...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Despacho
                  </Label>
                  <input
                    type="text"
                    readOnly
                    value={detail?.id ?? ""}
                    className="h-9 flex-1 rounded-xl border border-zinc-200 bg-gray-50 px-3 text-sm text-slate-700 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Agente
                  </Label>
                  <input
                    type="text"
                    readOnly
                    value={detail?.agente_name ?? ""}
                    className="h-9 flex-1 rounded-xl border border-zinc-200 bg-gray-50 px-3 text-sm text-slate-700 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tipo de Envio
                  </Label>
                  <input
                    type="text"
                    readOnly
                    value={detail?.tenvio_name ?? ""}
                    className="h-9 flex-1 rounded-xl border border-zinc-200 bg-gray-50 px-3 text-sm text-slate-700 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Transporte
                  </Label>
                  <input
                    type="text"
                    readOnly
                    value={detail?.empresatransporte ?? ""}
                    className="h-9 flex-1 rounded-xl border border-zinc-200 bg-gray-50 px-3 text-sm text-slate-700 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Agregar Guías */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="px-6 py-5">
{/* Fila de ingreso de guía (solo en modo edición) */}
              {!readOnly && (
                <div className="flex items-end gap-4 mb-5">
                  <div className="flex items-center gap-3 flex-1">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      N° Guía
                    </Label>
                    <input
                      ref={guiaInputRef}
                      type="text"
                      id="searchGuia"
                      placeholder="Ingrese número de guía y presione Enter"
                      value={guiaInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleEnterKey}
                      disabled={loading || validating}
                      className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:opacity-60"
                    />
                  </div>
                  {validating && (
                    <span className="h-9 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Validando...
                    </span>
                  )}
                </div>
              )}

              {/* Tabla de guías agregadas */}
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <Table className="min-w-full text-sm">
                  <TableCaption className="sr-only">
                    Guías asignadas al despacho
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
                      <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                        Guía
                      </TableHead>
                      <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                        Destinatario
                      </TableHead>
                      <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                        Destino
                      </TableHead>
                      <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                        Eliminar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guias.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-slate-400"
                        >
                          No se han agregado guías
                        </TableCell>
                      </TableRow>
                    ) : (
                      guias.map((guia) => (
                        <TableRow
                          key={guia.id_guia}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="px-4 py-3 font-medium text-slate-800">
                            {guia.id_guia}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-slate-600">
                            {guia.dnombres}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center text-slate-600">
                            {guia.destino}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeGuia(guia.id_guia)}
                              disabled={guia.locked}
                              title={guia.locked ? "Guía registrada en el despacho" : "Eliminar"}
                              className="rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

{!readOnly && (
          <div className="flex justify-end items-center gap-3 border-t border-zinc-200 bg-white px-8 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-28 rounded-xl border-zinc-300 bg-white! px-6 text-slate-700 hover:bg-zinc-50!"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || loading || validating}
              className="min-w-28 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Grabando...
                </>
              ) : (
                "Grabar"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DespachoAddForm;
