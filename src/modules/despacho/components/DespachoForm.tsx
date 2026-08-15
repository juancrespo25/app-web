import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, AlertTriangle } from "lucide-react";

import { useDespachoFormOptions } from "../hooks/useDespachoFormOptions";
import { useDespachoFormSave } from "../hooks/useDespachoFormSave";

interface DespachoFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const DespachoForm = ({ isOpen, onOpenChange, onSuccess }: DespachoFormProps) => {
  const { form, set, isFormValid, isSaving, handleSubmit } =
    useDespachoFormSave(onSuccess);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { agentes, tiposEnvio, transportes } = useDespachoFormOptions(
    form.tipoEnvio || undefined,
  );

  const confirmSave = async (tipo: number) => {
    await handleSubmit(tipo, () => {
      setIsConfirmOpen(false);
      onOpenChange(false);
    });
  };

  const handleGrabarClick = () => {
    setIsConfirmOpen(true);
  };

  return (
    <>
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
              Registro de <span className="text-red-600">Despacho</span>
            </h2>
          </div>

          <div className="px-8 py-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="px-6 py-5">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Agente
                    </Label>
                    <select
                      value={form.agente}
                      onChange={(e) => set("agente", e.target.value)}
                      className="w-60 h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                    >
                      <option value="" disabled>
                        [SELECCIONAR]
                      </option>
                      {agentes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.provincia_agente}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Fecha
                    </Label>
                    <input
                      type="date"
                      value={form.fecha}
                      onChange={(e) => set("fecha", e.target.value)}
                      className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Tipo Envio
                    </Label>
                    <select
                      value={form.tipoEnvio}
                      onChange={(e) => set("tipoEnvio", e.target.value)}
                      className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                    >
                      <option value="" disabled>
                        [SELECCIONAR]
                      </option>
                      {tiposEnvio.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-700">
                      Transporte
                    </Label>
                    <select
                      value={form.transporte}
                      onChange={(e) => set("transporte", e.target.value)}
                      className="w-60 h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                    >
                      <option value="" disabled>
                        [SELECCIONAR]
                      </option>
                      {transportes.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
              onClick={handleGrabarClick}
              disabled={!isFormValid || isSaving}
              className="min-w-28 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Grabando…" : "Grabar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="bg-white">
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Confirmación
              </DialogTitle>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-slate-600">
                ¿Desea grabar automáticamente los envíos?
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsConfirmOpen(false);
                  confirmSave(0);
                }}
                className="rounded-xl border-zinc-300 px-4"
              >
                No
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsConfirmOpen(false);
                  confirmSave(1);
                }}
                className="rounded-xl bg-red-600 px-4 text-white hover:bg-red-700"
              >
                Sí
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DespachoForm;
