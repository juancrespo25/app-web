import { useState } from "react";
import { PackageCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCaption,
  TableCell,
} from "@/components/ui/table";
import DescargaForm from "../components/DescargaForm";
import { useDescargas } from "../hooks/useDescargas";

const DescargaPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { descargas, isLoading, refetch } = useDescargas();

    return (
        <div className="p-8 bg-[#fcfcfc] min-h-full">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-2xl font-black tracking-tight text-black uppercase">
                    Registro de <span className="text-red-600">Descargas</span>
                </h1>
            </div>



            {/* Acciones */}
            <div className="flex justify-end gap-3 mb-6">
                <button
                    id="crear"
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                    <PackageCheck size={16} />
                    Descargar
                </button>
            </div>

            {/* Contenedor de Tabla */}
            <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <Table className="min-w-full text-sm">
                    <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
                        Descargas realizadas durante el dia
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Orden
                            </TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Corre.
                            </TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Cliente
                            </TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Centro Costo
                            </TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Destino
                            </TableHead>
                            <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Fecha
                            </TableHead>
                            <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Hora
                            </TableHead>
                            <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Estado
                            </TableHead>
                            <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Usuario
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {descargas.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="px-6 py-6 text-center text-slate-500">
                                    {isLoading ? "Cargando..." : "Sin descargas"}
                                </TableCell>
                            </TableRow>
                        )}
                        {descargas.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell className="px-6 py-3">{d.orden}</TableCell>
                                <TableCell className="px-6 py-3">{d.item}</TableCell>
                                <TableCell className="px-6 py-3">{d.cliente}</TableCell>
                                <TableCell className="px-6 py-3">{d.centrocosto}</TableCell>
                                <TableCell className="px-6 py-3">{d.destino}</TableCell>
                                <TableCell className="px-6 py-3 text-center">
                                    {new Date(d.fecha_descarga).toLocaleDateString("es-PE", { timeZone: "UTC" })}
                                </TableCell>
                                <TableCell className="px-6 py-3 text-center">{d.hora_descarga}</TableCell>
                                <TableCell className="px-6 py-3 text-center">{d.guia_estado}</TableCell>
                                <TableCell className="px-6 py-3 text-center">{d.usuario}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-xs border-l-4 border-l-red-600 shadow-sm">
                <span className="text-slate-700 font-bold">
                    <span className="mr-1 rounded bg-red-600 px-2 py-0.5 font-bold text-white">EF</span> Entregado
                </span>
                <span className="text-slate-700 font-bold">
                    <span className="mr-1 rounded bg-red-600 px-2 py-0.5 font-bold text-white">MT</span> Motivado
                </span>
            </div>

      <DescargaForm
        key={isFormOpen ? "open" : "closed"}
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) void refetch();
        }}
      />
        </div>
    )
}


export default DescargaPage;