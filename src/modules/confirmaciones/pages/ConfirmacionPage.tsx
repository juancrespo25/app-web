import { PackageCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCaption,
} from "@/components/ui/table";

const ConfirmacionPage = () => {


    return (
        <div className="p-8 bg-[#fcfcfc] min-h-full">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-2xl font-black tracking-tight text-black uppercase">
                    Registro de <span className="text-red-600">Confirmaciones</span>
                </h1>
            </div>



            {/* Acciones */}
            <div className="flex justify-end gap-3 mb-6">
                <button
                    id="crear"
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                    <PackageCheck size={16} />
                    Confirmar
                </button>
            </div>

            {/* Contenedor de Tabla */}
            <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                <Table className="min-w-full text-sm">
                    <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
                        Confirmaciones realizadas durante el dia
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Orden
                            </TableHead>
                            <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                                Correlativo
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
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}




export default ConfirmacionPage;