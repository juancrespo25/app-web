import { useState } from "react";
import type { FormEvent } from "react";
import { ClipboardList, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDevolucionOptions } from "../hooks/useDevolucionOptions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GuiaDevolucionFormProps {
  onClose: () => void;
}

const inputClassName =
  "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-slate-400";
const labelClassName = "text-xs font-bold uppercase tracking-wider text-slate-600";

export default function GuiaDevolucionForm({ onClose }: GuiaDevolucionFormProps) {
  const [modo, setModo] = useState<"orden" | "manual">("orden");
  const [numero, setNumero] = useState("");
  const [guias, setGuias] = useState<string[]>([]);
  const {
    customers, loadingCustomers, customersError, retryCustomers,
    customer, selectCustomer, centerCost, setCenterCost,
    centerCosts, loadingCenterCosts, centerCostsError,
  } = useDevolucionOptions();

  const agregarGuia = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valor = numero.trim();
    if (!/^\d+$/.test(valor) || !/[1-9]/.test(valor)) {
      toast.error(modo === "orden" ? "Ingrese un número de orden válido." : "Ingrese un número de guía válido.");
      return;
    }
    if (modo === "orden") {
      toast.info("La carga de guías por orden estará disponible en una próxima implementación.");
      return;
    }
    if (guias.includes(valor)) {
      toast.error("La guía ya está en la tabla.");
      return;
    }
    setGuias((actuales) => [...actuales, valor]);
    setNumero("");
  };

  const cambiarModo = (nuevoModo: "orden" | "manual") => {
    setModo(nuevoModo);
    setNumero("");
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-5xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-900">
            <ClipboardList className="h-5 w-5 text-red-600" aria-hidden="true" />
            Guía de devolución
          </DialogTitle>
          <DialogDescription>
            Vista previa: la consulta de datos y el guardado se implementarán posteriormente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="guia-devolucion-cliente" className={labelClassName}>Cliente</label>
            <select id="guia-devolucion-cliente" value={customer} onChange={(event) => selectCustomer(event.target.value)} disabled={loadingCustomers || customersError} className={inputClassName}>
              <option value="">{loadingCustomers ? "Cargando clientes..." : customersError ? "Error al cargar clientes" : "Selecciona un cliente"}</option>
              {customers.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
            </select>
            {customersError && <button type="button" onClick={retryCustomers} className="text-xs text-red-600 underline">Reintentar clientes</button>}
          </div>
          <div className="space-y-2">
            <label htmlFor="guia-devolucion-centro" className={labelClassName}>Centro de costo</label>
            <select id="guia-devolucion-centro" value={centerCost} onChange={(event) => setCenterCost(event.target.value)} disabled={!customer || loadingCenterCosts || centerCostsError} className={inputClassName}>
              <option value="">{loadingCenterCosts ? "Cargando centros..." : centerCostsError ? "Error al cargar centros" : "Selecciona un centro de costo"}</option>
              {centerCosts.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
            </select>
            {centerCostsError && <button type="button" onClick={() => selectCustomer(customer)} className="text-xs text-red-600 underline">Reintentar centros de costo</button>}
          </div>
        </div>

        <form onSubmit={agregarGuia} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <fieldset>
            <legend className={labelClassName}>Descargar por</legend>
            <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-700">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="modo-devolucion" checked={modo === "orden"} onChange={() => cambiarModo("orden")} className="h-4 w-4 accent-red-600" />
                Por orden
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="modo-devolucion" checked={modo === "manual"} onChange={() => cambiarModo("manual")} className="h-4 w-4 accent-red-600" />
                Manual
              </label>
            </div>
          </fieldset>
          <div className="max-w-md space-y-2">
            <label htmlFor="guia-devolucion-numero" className={labelClassName}>
              {modo === "orden" ? "Número de orden" : "Número de guía"}
            </label>
            <input
              id="guia-devolucion-numero"
              type="text"
              inputMode="numeric"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              placeholder={modo === "orden" ? "Ingresa la orden y presiona Enter" : "Ingresa orden + correlativo y presiona Enter"}
              className={inputClassName}
            />
          </div>
        </form>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-950 hover:bg-slate-950">
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Guía</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Doc. adjunto</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Destinatario</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Destino</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Estado</TableHead>
                <TableHead className="px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-200">Eliminar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    No hay guías agregadas.
                  </TableCell>
                </TableRow>
              ) : guias.map((guia) => (
                <TableRow key={guia}>
                  <TableCell className="px-4 py-3 font-medium text-slate-700">{guia}</TableCell>
                  <TableCell className="px-4 py-3 text-slate-400">—</TableCell>
                  <TableCell className="px-4 py-3 text-slate-400">—</TableCell>
                  <TableCell className="px-4 py-3 text-slate-400">—</TableCell>
                  <TableCell className="px-4 py-3 text-slate-400">—</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <button
                      type="button"
                      aria-label={`Eliminar guía ${guia}`}
                      title="Eliminar guía"
                      onClick={() => setGuias((actuales) => actuales.filter((item) => item !== guia))}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-slate-500">Las guías agregadas son una vista previa local; los demás datos aún no están disponibles.</p>

        <div className="flex justify-end">
          <button type="button" onClick={() => toast.info("El guardado estará disponible en una próxima implementación.")} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
            <Save size={16} aria-hidden="true" />
            Grabar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}