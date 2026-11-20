import { FileSpreadsheet, LockKeyhole, PackagePlus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import GuiaDevolucionForm from "../components/GuiaDevolucionForm";
import { useDevolucionOptions } from "../hooks/useDevolucionOptions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inputClassName =
  "h-9 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-slate-400";
const labelClassName =
  "w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600";
const buttonClassName =
  "flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700";

export default function DevolucionCargos() {
  const [isGuiaFormOpen, setIsGuiaFormOpen] = useState(false);
  const {
    customers, loadingCustomers, customersError, retryCustomers,
    customer, selectCustomer, centerCost, setCenterCost,
    centerCosts, loadingCenterCosts, centerCostsError,
  } = useDevolucionOptions();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="min-h-full bg-[#fcfcfc] p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          Devolución de <span className="text-red-600">Cargos</span>
        </h1>
      </div>

      <section aria-label="Filtros de devolución" className="mb-6 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex items-center gap-3">
            <label htmlFor="devolucion-fecha-inicial" className={labelClassName}>Fecha inicial</label>
            <input id="devolucion-fecha-inicial" type="date" defaultValue={today} className={inputClassName} />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="devolucion-fecha-final" className={labelClassName}>Fecha final</label>
            <input id="devolucion-fecha-final" type="date" defaultValue={today} className={inputClassName} />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="devolucion-guia" className={labelClassName}>N° de guía</label>
            <input id="devolucion-guia" type="text" inputMode="numeric" placeholder="N° de guía" className={inputClassName} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <label htmlFor="devolucion-cliente" className={labelClassName}>Cliente</label>
              <select id="devolucion-cliente" value={customer} onChange={(event) => selectCustomer(event.target.value)} disabled={loadingCustomers || customersError} className={inputClassName}>
                <option value="">{loadingCustomers ? "Cargando clientes..." : customersError ? "Error al cargar clientes" : "Todos"}</option>
                {customers.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
              </select>
            </div>
            {customersError && <button type="button" onClick={retryCustomers} className="self-end text-xs text-red-600 underline">Reintentar clientes</button>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <label htmlFor="devolucion-centro-costo" className={labelClassName}>Centro costo</label>
              <select id="devolucion-centro-costo" value={centerCost} onChange={(event) => setCenterCost(event.target.value)} disabled={!customer || loadingCenterCosts || centerCostsError} className={inputClassName}>
                <option value="">{loadingCenterCosts ? "Cargando centros..." : centerCostsError ? "Error al cargar centros" : "Todos"}</option>
                {centerCosts.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
              </select>
            </div>
            {centerCostsError && <button type="button" onClick={() => selectCustomer(customer)} className="self-end text-xs text-red-600 underline">Reintentar centros de costo</button>}
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <button type="button" onClick={() => toast.info("La consulta estará disponible en una próxima implementación.")} className={buttonClassName}>
          <Search size={16} aria-hidden="true" />
          Consultar
        </button>
        <button type="button" onClick={() => setIsGuiaFormOpen(true)} className={buttonClassName}>
          <PackagePlus size={16} aria-hidden="true" />
          Agregar
        </button>
      </div>

      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="px-6 py-4 text-left text-sm text-slate-500">
            Vista previa del diseño. La consulta y las operaciones estarán disponibles en una próxima implementación.
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70 bg-slate-950 text-white hover:bg-slate-950">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">N° guía</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Cliente</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Centro costo</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Fecha</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Estado</TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Operaciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-white text-slate-400 hover:bg-white">
              <TableCell className="px-6 py-5">—</TableCell>
              <TableCell className="px-6 py-5">—</TableCell>
              <TableCell className="px-6 py-5">—</TableCell>
              <TableCell className="px-6 py-5">—</TableCell>
              <TableCell className="px-6 py-5">—</TableCell>
              <TableCell className="px-6 py-5">
                <div className="flex justify-center gap-2">
                  <button type="button" disabled aria-label="Agregar a guía" title="Agregar a guía" className="rounded-lg p-2 text-slate-400 disabled:cursor-not-allowed">
                    <PackagePlus size={18} aria-hidden="true" />
                  </button>
                  <button type="button" disabled aria-label="Cerrar guía" title="Cerrar guía" className="rounded-lg p-2 text-slate-400 disabled:cursor-not-allowed">
                    <LockKeyhole size={18} aria-hidden="true" />
                  </button>
                  <button type="button" disabled aria-label="Exportar a Excel" title="Exportar a Excel" className="rounded-lg p-2 text-slate-400 disabled:cursor-not-allowed">
                    <FileSpreadsheet size={18} aria-hidden="true" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {isGuiaFormOpen && <GuiaDevolucionForm onClose={() => setIsGuiaFormOpen(false)} />}
    </div>
  );
}