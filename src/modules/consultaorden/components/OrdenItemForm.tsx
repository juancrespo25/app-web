import { BadgeCheck, ClipboardList, FileImage, FileText, PackageCheck, RotateCcw, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDetalleGuia } from "../hooks/useDetalleGuia";

interface OrdenItemFormProps {
  numeroGuia: number;
  onClose: () => void;
}

function Campo({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-800">{value ?? "—"}</dd>
    </div>
  );
}

function Seccion({ title, icon, fields }: { title: string; icon: ReactNode; fields: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">{icon}</span>
        {title}
      </h3>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        {fields.map((field) => <Campo key={field} label={field} />)}
      </dl>
    </section>
  );
}

export default function OrdenItemForm({ numeroGuia, onClose }: OrdenItemFormProps) {
  const { consulta, reintentar } = useDetalleGuia(numeroGuia);
  const guia = consulta.estado === "completo" ? consulta.guia : null;
  const estado = guia?.estado.trim().toLowerCase();
  const estadoClassName = estado === "motivado" || estado === "mt"
    ? "border-red-200 bg-red-50 text-red-800"
    : estado === "entregado" || estado === "ef"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-[min(68rem,calc(100vw-2rem))]">
        <DialogHeader className="border-b border-slate-200 px-5 py-5 pr-12 sm:px-7 sm:pr-14">
          <div className="flex flex-wrap items-start justify-between gap-4 text-left">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-black uppercase tracking-tight text-slate-900">Detalle de guía {numeroGuia}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-500">
                  Información del envío y su ciclo operativo.
                </DialogDescription>
              </div>
            </div>
            {guia && <div className={`rounded-xl border px-4 py-2 ${estadoClassName}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider">Estado del envío</p>
              <p className="mt-1 text-sm font-black">{guia.estado.toLocaleUpperCase("es") || "—"}</p>
            </div>}
          </div>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto bg-slate-50/70 px-5 py-5 sm:px-7">
          {consulta.estado === "cargando" && <p role="status" className="py-8 text-center text-sm text-slate-500">Consultando detalle de la guía...</p>}
          {consulta.estado === "error" && (
            <div role="alert" className="py-8 text-center">
              <p className="text-sm text-red-700">No se pudo consultar el detalle de la guía.</p>
              <button type="button" onClick={reintentar} className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Reintentar</button>
            </div>
          )}
          {guia && <>
          <section aria-label="Información del envío" className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Información del envío</h3>
              {(guia.imagen1 != null || guia.imagen2 != null || guia.imagen3 != null) && (
                <button type="button" disabled title="Disponible próximamente" className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed">
                  <FileImage className="h-4 w-4" aria-hidden="true" /> Ver imagen
                </button>
              )}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
              <Campo label="Orden + correlativo" value={`${guia.numero}-${guia.item}`} />
              <Campo label="Cliente" value={guia.cliente} />
              <Campo label="Centro de costo" value={guia.ccosto} />
              <Campo label="Fecha" value={new Date(guia.fecha_registro).toLocaleDateString("es-PE")} />
              <Campo label="Origen" value={guia.origen} />
              <Campo label="Destino" value={guia.destino} />
              <Campo label="Contenido" value={guia.contenido} />
              <Campo label="Tipo de envío" value={guia.descripcion} />
              <Campo label="Destinatario" value={guia.nombres} />
              <Campo label="Dirección" value={guia.direccion} />
              <Campo label="Empresa" value={guia.empresa} />
              <div className="min-w-0">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cant. cargos</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
                  <span>{guia.total_documentos}</span>
                  {guia.total_documentos > 0 && (
                    <span title="Ver documentos adjuntos: disponible próximamente">
                      <button type="button" disabled aria-label="Ver documentos adjuntos (disponible próximamente)" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 disabled:cursor-not-allowed">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </span>
                  )}
                </dd>
              </div>
              <Campo label="Observaciones" value={guia.observaciones} />
              <Campo label="Peso" value={guia.peso} />
              <Campo label="Bultos" value={guia.bultos} />
              <Campo label="Unidades" value={guia.unidades} />
            </dl>
          </section>

          <div className="mb-3 mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">Ciclo operativo</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Seccion title="Despacho" icon={<Truck className="h-4 w-4" aria-hidden="true" />} fields={["Guía despacho", "Agente", "Fecha", "Envío", "Empresa"]} />
            <Seccion title="Confirmaciones" icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />} fields={["Estado", "Recepción", "Nombre", "Documento", "Usuario"]} />
            <Seccion title="Descarga" icon={<PackageCheck className="h-4 w-4" aria-hidden="true" />} fields={["Estado", "Recepción", "Nombre", "Documento", "Usuario"]} />
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </span>
                Guía de devolución / Facturación
              </h3>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <Campo label="Guía de devolución" />
                <Campo label="Usuario " />
                <Campo label="Estado de cuenta" />
                <Campo label="Usuario " />
              </dl>
            </section>
          </div>
          </>}
        </div>
      </DialogContent>
    </Dialog>
  );
}