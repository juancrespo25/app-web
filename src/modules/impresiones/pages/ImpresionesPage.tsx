import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Layers3,
  Printer,
  Tag,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCargosImpresion, getEtiquetasImpresion } from "../services/impresion.service";

const formatos = [
  {
    id: "cargos",
    nombre: "Cargos",
    descripcion: "Comprobantes de entrega para tus envíos.",
    icono: FileText,
  },
  {
    id: "etiquetas",
    nombre: "Etiquetas",
    descripcion: "Identificación para los paquetes de la orden.",
    icono: Tags,
  },
  {
    id: "rotulada",
    nombre: "Etiqueta rotulada",
    descripcion: "Etiqueta con la información del destinatario.",
    icono: Tag,
  },
] as const;

type Formato = (typeof formatos)[number]["id"];
type Alcance = "orden" | "correlativos";

export default function ImpresionesPage() {
  const [formato, setFormato] = useState<Formato>("cargos");
  const [alcance, setAlcance] = useState<Alcance>("orden");
  const [orden, setOrden] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [imprimiendo, setImprimiendo] = useState(false);
  const formatoSeleccionado = formatos.find((item) => item.id === formato);

  const imprimir = async () => {
    if (formato === "rotulada") {
      toast.error("Este formato aún no está disponible.");
      return;
    }

    if (!orden || !/[1-9]/.test(orden)) {
      toast.error("Ingrese un número de orden válido.");
      return;
    }

    const itemDesde = desde ? Number(desde) : undefined;
    const itemHasta = hasta ? Number(hasta) : undefined;
    if (alcance === "correlativos") {
      if (itemDesde === undefined && itemHasta === undefined) {
        toast.error("Ingrese al menos un límite del rango de correlativos.");
        return;
      }
      if (
        (itemDesde !== undefined && (!Number.isSafeInteger(itemDesde) || itemDesde < 1)) ||
        (itemHasta !== undefined && (!Number.isSafeInteger(itemHasta) || itemHasta < 1)) ||
        (itemDesde !== undefined && itemHasta !== undefined && itemDesde > itemHasta)
      ) {
        toast.error("Ingrese un rango de correlativos válido.");
        return;
      }
    }

    const ventana = window.open("", "_blank");
    if (!ventana) {
      toast.error("Permita las ventanas emergentes para abrir el PDF.");
      return;
    }

    setImprimiendo(true);
    try {
      const getImpresion = formato === "cargos" ? getCargosImpresion : getEtiquetasImpresion;
      const pdf = await getImpresion(
        orden,
        alcance === "correlativos" ? { itemDesde, itemHasta } : undefined,
      );
      if (!(await pdf.slice(0, 5).text()).startsWith("%PDF-")) {
        throw new Error("La respuesta no contiene un PDF válido.");
      }
      const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
      ventana.location.href = url;
    } catch (error) {
      ventana.close();
      console.error(`Error al generar ${formato}:`, error);
      toast.error(`No se pudo generar el PDF de ${formato}.`);
    } finally {
      setImprimiendo(false);
    }
  };

  return (
    <div className="min-h-full bg-[#fcfcfc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <Printer className="h-4 w-4 text-red-600" />
            Centro de impresión
          </div>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">
            Gestión de <span className="text-red-600">Impresiones</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Selecciona el formato y la orden de servicio que deseas imprimir.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-black text-red-600">01</span>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Tipo de impresión</h2>
                  <p className="mt-1 text-xs text-slate-500">Elige el documento que necesitas preparar.</p>
                </div>
              </div>
              <fieldset className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
                <legend className="sr-only">Tipo de impresión</legend>
                {formatos.map((item) => {
                  const Icono = item.icono;
                  const activo = formato === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`relative flex min-h-36 cursor-pointer flex-col rounded-xl border p-4 transition-colors focus-within:ring-4 focus-within:ring-red-600/10 ${
                        activo ? "border-red-500 bg-red-50/50" : "border-slate-200 bg-white hover:border-red-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="formato"
                        value={item.id}
                        checked={activo}
                        onChange={() => setFormato(item.id)}
                        className="absolute right-4 top-4 h-4 w-4 accent-red-600"
                      />
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${activo ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        <Icono className="h-5 w-5" />
                      </span>
                      <span className="mt-4 text-sm font-bold text-slate-900">{item.nombre}</span>
                      <span className="mt-1 text-xs leading-5 text-slate-500">{item.descripcion}</span>
                    </label>
                  );
                })}
              </fieldset>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-black text-red-600">02</span>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Datos de la orden</h2>
                  <p className="mt-1 text-xs text-slate-500">Indica la orden y el alcance de la impresión.</p>
                </div>
              </div>
              <div className="space-y-6 p-5 sm:p-6">
                <div className="max-w-sm space-y-2">
                  <Label htmlFor="orden-impresion" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    N° de orden de servicio
                  </Label>
                  <div className="relative">
                    <ClipboardList className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="orden-impresion"
                      inputMode="numeric"
                      value={orden}
                      onChange={(event) => setOrden(event.target.value.replace(/\D/g, ""))}
                      placeholder="Ingresa el número de orden"
                      className="h-10 rounded-xl border-zinc-200 bg-white pl-10 text-sm focus-visible:border-red-600 focus-visible:ring-red-600/10"
                    />
                  </div>
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-xs font-bold uppercase tracking-wider text-slate-700">Alcance de impresión</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${alcance === "orden" ? "border-red-400 bg-red-50/50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="radio" name="alcance" checked={alcance === "orden"} onChange={() => setAlcance("orden")} className="mt-0.5 h-4 w-4 accent-red-600" />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">Orden completa</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Todos los correlativos de la orden.</span>
                      </span>
                    </label>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${alcance === "correlativos" ? "border-red-400 bg-red-50/50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="radio" name="alcance" checked={alcance === "correlativos"} onChange={() => setAlcance("correlativos")} className="mt-0.5 h-4 w-4 accent-red-600" />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">Rango de correlativos</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Selecciona desde y hasta qué correlativo.</span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                {alcance === "correlativos" && (
                  <div className="grid max-w-md grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="correlativo-desde" className="text-xs font-bold uppercase tracking-wider text-slate-700">Desde</Label>
                      <Input id="correlativo-desde" inputMode="numeric" value={desde} onChange={(event) => setDesde(event.target.value.replace(/\D/g, ""))} placeholder="Ej. 1" className="h-10 rounded-xl border-zinc-200" />
                    </div>
                    <ArrowRight aria-hidden="true" className="mb-3 h-4 w-4 text-slate-400" />
                    <div className="space-y-2">
                      <Label htmlFor="correlativo-hasta" className="text-xs font-bold uppercase tracking-wider text-slate-700">Hasta</Label>
                      <Input id="correlativo-hasta" inputMode="numeric" value={hasta} onChange={(event) => setHasta(event.target.value.replace(/\D/g, ""))} placeholder="Ej. 10" className="h-10 rounded-xl border-zinc-200" />
                    </div>
                  </div>
                )}
                {alcance === "correlativos" && (
                  <p className="text-xs text-slate-500">Puedes indicar uno o ambos límites del rango.</p>
                )}
              </div>
            </section>
          </div>

          <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Resumen</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">Configuración seleccionada</p>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Formato</p>
                <p className="mt-1 font-semibold text-slate-800">{formatoSeleccionado?.nombre}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Orden de servicio</p>
                <p className="mt-1 break-all font-semibold text-slate-800">{orden || "Sin especificar"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alcance</p>
                <p className="mt-1 break-words font-semibold text-slate-800">
                  {alcance === "orden" ? "Orden completa" : `Correlativos ${desde || "—"} al ${hasta || "—"}`}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-5">
              <Button type="button" onClick={imprimir} disabled={formato === "rotulada" || imprimiendo} className="h-10 w-full rounded-xl bg-red-600! text-white disabled:cursor-not-allowed disabled:opacity-50">
                <Printer className="h-4 w-4" />
                {imprimiendo ? "Generando PDF..." : "Imprimir"}
              </Button>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                {formato !== "rotulada"
                  ? "El PDF se abrirá en una nueva pestaña para imprimirlo."
                  : "Este formato estará disponible en una próxima implementación."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}