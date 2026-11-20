import { ClipboardList, CornerDownLeft, Eye, List, Pencil, Search } from "lucide-react";
import { toast } from "sonner";
import { useConsultaOrden } from "../hooks/useConsultaOrden";
import OrdenItemForm from "../components/OrdenItemForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const labelClassName = "text-xs font-bold uppercase tracking-wider text-slate-600";
const fieldClassName =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-700 outline-none";

export default function ConsultaOrdenPage() {
  const { numeroOrden, orden, loading, cambiarNumeroOrden, consultarOrden, envioSeleccionado, setEnvioSeleccionado } = useConsultaOrden();

  return (
    <div className="min-h-full bg-[#fcfcfc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              <ClipboardList className="h-4 w-4 text-red-600" aria-hidden="true" />
              Atención al cliente
            </div>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">
              Consulta de <span className="text-red-600">Orden</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">Consulta los datos y las guías asociadas a una orden de servicio.</p>
          </div>

        <form
          aria-label="Buscar orden"
          onSubmit={consultarOrden}
          noValidate
          className="w-full max-w-md shrink-0 md:w-80"
        >
          <label htmlFor="consulta-orden-numero" className={labelClassName}>Número de orden</label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="consulta-orden-numero"
              name="orden"
              type="text"
              inputMode="numeric"
              value={numeroOrden}
              onChange={(event) => cambiarNumeroOrden(event.target.value)}
              pattern="[0-9]{6}"
              required
              aria-describedby="consulta-orden-ayuda"
              placeholder="Ingresa los 6 dígitos"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-20 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase text-slate-400">
              Enter <CornerDownLeft className="h-3 w-3" />
            </span>
          </div>
          <p id="consulta-orden-ayuda" className="mt-2 text-xs leading-5 text-slate-500">
            {loading ? "Consultando orden..." : "Ingresa los 6 dígitos y presiona Enter para consultar."}
          </p>
        </form>
        </div>

        <section aria-label="Datos de la orden" className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Datos de la orden</h2>
                <p className="mt-1 text-xs text-slate-500">Información general de la orden consultada.</p>
              </div>
            </div>
            <button type="button" onClick={() => toast.info("La modificación de órdenes estará disponible en una próxima implementación.")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600/10">
              <Pencil size={14} aria-hidden="true" />
              Modificar orden
            </button>
          </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="consulta-orden-cliente" className={labelClassName}>Cliente</label>
            <input id="consulta-orden-cliente" readOnly value={orden?.cliente ?? ""} placeholder="—" className={fieldClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="consulta-orden-centro" className={labelClassName}>Centro de costo</label>
            <input id="consulta-orden-centro" readOnly value={orden?.centrocosto ?? ""} placeholder="—" className={fieldClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="consulta-orden-origen" className={labelClassName}>Origen</label>
            <input id="consulta-orden-origen" readOnly value={orden?.origen ?? ""} placeholder="—" className={fieldClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="consulta-orden-provincia" className={labelClassName}>Provincia</label>
            <input id="consulta-orden-provincia" readOnly value={orden?.provincia_cubierta ?? ""} placeholder="—" className={fieldClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="consulta-orden-fecha" className={labelClassName}>Fecha de creación</label>
            <input id="consulta-orden-fecha" readOnly value={orden ? new Date(orden.fecha_registro).toLocaleDateString("es-PE") : ""} placeholder="—" className={fieldClassName} />
          </div>
          <div className="space-y-2">
            <label htmlFor="consulta-orden-usuario" className={labelClassName}>Usuario de creación</label>
            <input id="consulta-orden-usuario" readOnly value={orden?.usuario ?? ""} placeholder="—" className={fieldClassName} />
          </div>
        </div>

      </section>

      <section aria-label="Ítems de la orden" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <List className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Guías de la orden</h2>
            <p className="mt-1 text-xs text-slate-500">Detalle de los envíos asociados.</p>
          </div>
        </div>
        <Table>
          <TableCaption className="px-6 py-4 text-left text-sm text-slate-500">
            {loading ? "Consultando guías..." : !orden ? "Ingresa una orden para consultar sus guías." : orden.envios.length === 0 ? "Esta orden no tiene guías." : `${orden.envios.length} ${orden.envios.length === 1 ? "guía encontrada" : "guías encontradas"}.`}
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70 bg-slate-950 hover:bg-slate-950">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Guía</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Destinatario</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Dirección</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Destino</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Estado</TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">Ver guía</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orden?.envios.map((envio) => (
            <TableRow key={envio.id_guia} className="bg-white">
              <TableCell className="px-6 py-5">{envio.id_guia}</TableCell>
              <TableCell className="px-6 py-5">{envio.nombres}</TableCell>
              <TableCell className="px-6 py-5">{envio.direccion}</TableCell>
              <TableCell className="px-6 py-5">{envio.destino}</TableCell>
              <TableCell className="px-6 py-5">{envio.estado}</TableCell>
              <TableCell className="px-6 py-5 text-center">
                <button type="button" onClick={() => setEnvioSeleccionado(envio)} aria-label={`Ver guía ${envio.id_guia}`} title={`Ver guía ${envio.id_guia}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-700">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      </div>
      {orden && envioSeleccionado && (
        <OrdenItemForm key={envioSeleccionado.id_guia} numeroGuia={envioSeleccionado.id_guia} onClose={() => setEnvioSeleccionado(null)} />
      )}
    </div>
  );
}