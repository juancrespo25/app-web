import { FileSpreadsheet, Search } from "lucide-react";
import { toast } from "sonner";
import { useDevolucionOptions } from "@/modules/devolucioncargos/hooks/useDevolucionOptions";
import { useEnviosPorCliente } from "../hooks/useEnviosPorCliente";
import { useProvincias } from "../hooks/useProvincias";
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
const headClassName =
  "px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200";

const columns = [
  "Guía",
  "Cliente",
  "Centro costo",
  "Destinatario",
  "Dirección",
  "Destino",
  "Fecha",
  "Estado",
  "Cant. cargos",
];

export default function EnviosPorCliente() {
  const { envios, loading, consultado, consultar } = useEnviosPorCliente();
  const { provincias, loading: loadingProvincias, error: provinciasError, retry: retryProvincias } = useProvincias();
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
          Envíos por <span className="text-red-600">Cliente</span>
        </h1>
      </div>

      <form onSubmit={consultar} noValidate>
      <section aria-label="Filtros de envíos" className="mb-6 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex items-center gap-3">
            <label htmlFor="envios-fecha-inicial" className={labelClassName}>Fecha inicial</label>
            <input id="envios-fecha-inicial" name="fecha_inicial" type="date" required defaultValue={today} className={inputClassName} />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-fecha-final" className={labelClassName}>Fecha final</label>
            <input id="envios-fecha-final" name="fecha_final" type="date" required defaultValue={today} className={inputClassName} />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-estado" className={labelClassName}>Estado</label>
            <select id="envios-estado" name="estado" defaultValue="" className={inputClassName}>
              <option value="">Todos</option>
              <option value="PD">Pendiente</option>
              <option value="EF">Entregado</option>
              <option value="MT">Motivado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <label htmlFor="envios-origen" className={labelClassName}>Origen</label>
              <select id="envios-origen" name="origen" defaultValue="" disabled={loadingProvincias || provinciasError} className={inputClassName}>
                <option value="">{loadingProvincias ? "Cargando provincias..." : provinciasError ? "Error al cargar provincias" : "Todos"}</option>
                {provincias.map((provincia) => <option key={provincia.codigo} value={provincia.codigo}>{provincia.descripcion}</option>)}
              </select>
            </div>
            {provinciasError && <button type="button" onClick={retryProvincias} className="self-end text-xs text-red-600 underline">Reintentar provincias</button>}
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-destino" className={labelClassName}>Destino</label>
            <select id="envios-destino" name="destino" defaultValue="" disabled={loadingProvincias || provinciasError} className={inputClassName}>
              <option value="">{loadingProvincias ? "Cargando provincias..." : provinciasError ? "Error al cargar provincias" : "Todos"}</option>
              {provincias.map((provincia) => <option key={provincia.codigo} value={provincia.codigo}>{provincia.descripcion}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-orden" className={labelClassName}>Orden servicio</label>
            <input id="envios-orden" name="numero" type="text" inputMode="numeric" onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, ""); }} placeholder="Orden de servicio" className={inputClassName} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <label htmlFor="envios-cliente" className={labelClassName}>Cliente</label>
              <select id="envios-cliente" name="customer" value={customer} onChange={(event) => selectCustomer(event.target.value)} disabled={loadingCustomers || customersError} className={inputClassName}>
                <option value="">{loadingCustomers ? "Cargando clientes..." : customersError ? "Error al cargar clientes" : "Todos"}</option>
                {customers.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
              </select>
            </div>
            {customersError && <button type="button" onClick={retryCustomers} className="self-end text-xs text-red-600 underline">Reintentar clientes</button>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <label htmlFor="envios-centro-costo" className={labelClassName}>Centro costo</label>
              <select id="envios-centro-costo" name="ccosto" value={centerCost} onChange={(event) => setCenterCost(event.target.value)} disabled={!customer || loadingCenterCosts || centerCostsError} className={inputClassName}>
                <option value="">{loadingCenterCosts ? "Cargando centros..." : centerCostsError ? "Error al cargar centros" : "Todos"}</option>
                {centerCosts.map((item) => <option key={item.codigo} value={item.codigo}>{item.descripcion}</option>)}
              </select>
            </div>
            {centerCostsError && <button type="button" onClick={() => selectCustomer(customer)} className="self-end text-xs text-red-600 underline">Reintentar centros de costo</button>}
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-destinatario" className={labelClassName}>Destinatario</label>
            <input id="envios-destinatario" name="nombre" type="text" placeholder="Destinatario" className={inputClassName} />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="envios-doc-adjunto" className={labelClassName}>Doc. adjunto</label>
            <input id="envios-doc-adjunto" name="numero_documento" type="text" placeholder="Documento adjunto" className={inputClassName} />
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => toast.info("La exportación a Excel estará disponible en una próxima implementación.")}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <FileSpreadsheet size={16} aria-hidden="true" />
          Exportar Excel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={16} aria-hidden="true" />
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </div>
      </form>

      <div className="overflow-x-auto border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="px-6 py-4 text-left text-sm text-slate-500">
            {loading ? "Consultando envíos..." : consultado ? `${envios.length} ${envios.length === 1 ? "envío encontrado" : "envíos encontrados"}.` : "Ingrese los filtros y consulte para ver los envíos."}
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70 bg-slate-950 text-white hover:bg-slate-950">
              {columns.map((column) => (
                <TableHead key={column} className={headClassName}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {envios.map((envio) => (
              <TableRow key={envio.id_guia} className="bg-white">
                <TableCell className="px-6 py-5">{envio.id_guia}</TableCell>
                <TableCell className="px-6 py-5">{envio.cliente}</TableCell>
                <TableCell className="px-6 py-5">{envio.ccosto}</TableCell>
                <TableCell className="px-6 py-5">{envio.nombres}</TableCell>
                <TableCell className="px-6 py-5">{envio.direccion}</TableCell>
                <TableCell className="px-6 py-5">{envio.destino}</TableCell>
                <TableCell className="px-6 py-5">{new Date(envio.fecha_registro).toLocaleDateString("es-PE")}</TableCell>
                <TableCell className="px-6 py-5">{envio.estado}</TableCell>
                <TableCell className="px-6 py-5">{envio.total_documentos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
