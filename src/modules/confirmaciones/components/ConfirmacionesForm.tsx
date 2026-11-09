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
import { FileText, PackageCheck } from "lucide-react";
import { useConfirmacionForm } from "../hooks/useConfirmacionForm";
import { useConfirmacionDetalleForm } from "../hooks/useConfirmacionDetalleForm";
import { useConfirmacionFormOptions } from "../hooks/useConfirmacionFormOptions";
import { useConfirmacionSave } from "../hooks/useConfirmacionSave";

interface ConfirmacionesFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const readonlyClass =
  "h-9 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-slate-500 outline-none cursor-not-allowed";

const editableClass =
  "h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10";

const ConfirmacionesForm = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: ConfirmacionesFormProps) => {
  const {
    form,
    setNroCargo,
    buscarGuia,
    isFormValid,
    isValidating,
    reset,
  } = useConfirmacionForm();
  const { detalle, setTipo, set, isDetalleValid, resetDetalle } =
    useConfirmacionDetalleForm();
  const { parentescos, motivos } = useConfirmacionFormOptions();
  const { save, isSaving } = useConfirmacionSave();

  const handleGrabar = async () => {
    const success = await save(form.nroCargo, detalle);
    if (success) {
      reset();
      resetDetalle();
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[55vw] max-w-[55vw]! h-auto rounded-xl p-0 flex flex-col gap-0 overflow-hidden bg-[#f5f6f8]"
      >
        <DialogTitle className="sr-only">Registro de Confirmación</DialogTitle>
        <DialogDescription className="sr-only">
          Formulario de confirmación
        </DialogDescription>
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-8 py-4 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600">
            <PackageCheck className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
            Registro de <span className="text-red-600">Confirmación</span>
          </h2>
          {form.cantidadDocadjuntos > 0 && (
            <div className="ml-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              <FileText className="h-4 w-4 text-red-600" />
              {form.cantidadDocadjuntos} Documentos Adjuntos
            </div>
          )}
        </div>

        <div className="px-8 py-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Fila 1 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Nro Cargo
                  </Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.nroCargo}
                    onChange={(e) => setNroCargo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        buscarGuia();
                      }
                    }}
                    onBlur={() => {
                      if (form.nroCargo.trim()) buscarGuia();
                    }}
                    disabled={isValidating}
                    className={editableClass}
                    placeholder="Ingrese Nro Cargo"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Fecha
                  </Label>
                  <input
                    type="text"
                    value={form.fecha}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Destinatario y Dirección */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Destinatario
                  </Label>
                  <input
                    type="text"
                    value={form.destinatario}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Dirección
                  </Label>
                  <input
                    type="text"
                    value={form.direccion}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Fila 2 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Cliente
                  </Label>
                  <input
                    type="text"
                    value={form.cliente}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    C.Costo
                  </Label>
                  <input
                    type="text"
                    value={form.cCosto}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Fila 3 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Origen
                  </Label>
                  <input
                    type="text"
                    value={form.origen}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Estado
                  </Label>
                  <input
                    type="text"
                    value={form.estado}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Fila 4 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Destino
                  </Label>
                  <input
                    type="text"
                    value={form.destino}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contenido
                  </Label>
                  <input
                    type="text"
                    value={form.contenido}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Fila 5 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    T. Envio
                  </Label>
                  <input
                    type="text"
                    value={form.tEnvio}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Peso
                  </Label>
                  <input
                    type="text"
                    value={form.peso}
                    readOnly
                    className={readonlyClass}
                  />
                </div>

                {/* Fila 6 */}
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Bultos
                  </Label>
                  <input
                    type="text"
                    value={form.bultos}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                    Unidades
                  </Label>
                  <input
                    type="text"
                    value={form.unidades}
                    readOnly
                    className={readonlyClass}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segunda tarjeta: Entregado / Motivado */}
          <Card className="mt-4 border-slate-200 bg-white shadow-sm">
            <CardContent className="px-6 py-5">
              {/* Toggle Entregado / Motivado */}
              <div className="mb-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTipo("EF")}
                  className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                    detalle.tipo === "EF"
                      ? "bg-red-600 text-white"
                      : "border border-zinc-200 bg-white text-slate-600 hover:bg-zinc-50"
                  }`}
                >
                  Entregado
                </button>
                <button
                  type="button"
                  onClick={() => setTipo("MT")}
                  className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                    detalle.tipo === "MT"
                      ? "bg-red-600 text-white"
                      : "border border-zinc-200 bg-white text-slate-600 hover:bg-zinc-50"
                  }`}
                >
                  Motivado
                </button>
              </div>

              {detalle.tipo !== "" && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Fecha y Hora — comunes a ambas opciones */}
                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Fecha
                    </Label>
                    <input
                      type="date"
                      value={detalle.fecha}
                      onChange={(e) => set("fecha", e.target.value)}
                      className={editableClass}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Hora
                    </Label>
                    <input
                      type="time"
                      value={detalle.hora}
                      onChange={(e) => set("hora", e.target.value)}
                      className={editableClass}
                    />
                  </div>

                  {/* Campos Entregado */}
                  {detalle.tipo === "EF" && (
                    <>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Parentesco
                        </Label>
                        <select
                          value={detalle.parentesco}
                          onChange={(e) => set("parentesco", e.target.value)}
                          className={editableClass}
                        >
                          <option value="" disabled>[SELECCIONAR]</option>
                          {parentescos.map((p) => (
                            <option key={p.id} value={p.id}>{p.descripcion}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Recibido
                        </Label>
                        <input
                          type="text"
                          value={detalle.recibido}
                          onChange={(e) => set("recibido", e.target.value)}
                          className={editableClass}
                          placeholder="Nombre de quien recibe"
                        />
                      </div>
                      <div className="flex items-center gap-3 col-span-2">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Documento
                        </Label>
                        <input
                          type="text"
                          value={detalle.documento}
                          onChange={(e) => set("documento", e.target.value)}
                          className={editableClass}
                          placeholder="N° de documento"
                        />
                      </div>
                    </>
                  )}

                  {/* Campos Motivado */}
                  {detalle.tipo === "MT" && (
                    <>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Motivo
                        </Label>
                        <select
                          value={detalle.motivo}
                          onChange={(e) => set("motivo", e.target.value)}
                          className={editableClass}
                        >
                          <option value="" disabled>[SELECCIONAR]</option>
                          {motivos.map((m) => (
                            <option key={m.id} value={m.id}>{m.descripcion}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Puerta
                        </Label>
                        <select
                          value={detalle.puerta}
                          onChange={(e) => set("puerta", e.target.value)}
                          className={editableClass}
                        >
                          <option value="" disabled>[SELECCIONAR]</option>
                          <option value="1">Madera</option>
                          <option value="2">Fierro</option>
                          <option value="3">Otro</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Color
                        </Label>
                        <input
                          type="text"
                          value={detalle.color}
                          onChange={(e) => set("color", e.target.value)}
                          className={editableClass}
                          placeholder="Color de puerta"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                          Nro Suministro
                        </Label>
                        <input
                          type="text"
                          value={detalle.nroSuministro}
                          onChange={(e) => set("nroSuministro", e.target.value)}
                          className={editableClass}
                          placeholder="N° suministro"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
            onClick={handleGrabar}
            disabled={!isFormValid || !isDetalleValid || isSaving}
            className="min-w-28 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Grabando…" : "Grabar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmacionesForm;
