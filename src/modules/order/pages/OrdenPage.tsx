import { useState } from "react";
import { Eye, Printer, Search, PackageOpen, PackagePlus } from "lucide-react";
import { useOrden } from "../hooks/useOrden";
import { useOrdenSearch } from "../hooks/useOrdenSearch";
import OrdenForm from "../components/OrdenForm";
import OrdenMasivaForm from "../components/OrdenMasivaForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const OrdenPage = () => {
  const { ordenes, isLoading, loadOrdenes } = useOrden();
  const { filteredOrdenes, handleSearchChange } = useOrdenSearch(ordenes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMasivaModalOpen, setIsMasivaModalOpen] = useState(false);

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-full">
      {/* Encabezado de Página */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase">
            Registro de <span className="text-red-600">Órdenes</span>
          </h1>
        </div>
      </div>

      {/* Sección de Acciones: Búsqueda */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 relative w-1/2 max-w-md">
          <div className="flex relative w-full">
            <input
              type="text"
              id="search"
              onChange={handleSearchChange}
              placeholder="Buscar por cliente o número de orden"
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 rounded-xl px-4 py-2 transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-700"
          >
            <PackagePlus size={20} />
            +Simple
          </button>
          <span className="text-zinc-600 text-lg select-none">|</span>
          <button
            onClick={() => setIsMasivaModalOpen(true)}
            className="flex items-center gap-3 rounded-xl px-4 py-2 transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-700"
          >
            <PackagePlus size={20} />
            +Masivo
          </button>
        </div>
      </div>

      {/* Contenedor de Tabla */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
            Órdenes registradas el día de hoy
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                N° Orden
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Cliente
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Centro Costo
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Origen
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Fecha
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Usuario
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Guías
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="group bg-white transition-colors">
                <TableCell colSpan={8} className="py-24 text-center text-slate-500">
                  <p className="text-sm text-slate-400">Cargando órdenes...</p>
                </TableCell>
              </TableRow>
            ) : filteredOrdenes.length === 0 ? (
              <TableRow className="group bg-white transition-colors hover:bg-slate-50">
                <TableCell colSpan={8} className="py-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageOpen size={48} className="text-slate-300" />
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Sin órdenes registradas hoy
                    </p>
                    <p className="max-w-xl text-xs leading-5 text-slate-500">
                      No hay órdenes para el día de hoy.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrdenes.map((orden, index) => (
                <TableRow key={`${orden.id}-${index}`} className="group bg-white transition-colors hover:bg-slate-50">
                  <TableCell className="px-6 py-4 text-slate-700 font-medium">
                    {orden.numero}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {orden.customerDescripcion}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {orden.ccostoDescripcion}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {orden.ubigeoDistrito}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {new Date(orden.fecha_registro).toLocaleDateString("es-PE")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {orden.userNombre}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {orden.guiaCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-slate-700">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="Ver detalle"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Imprimir"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrdenForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadOrdenes}
      />
      <OrdenMasivaForm
        isOpen={isMasivaModalOpen}
        onClose={() => setIsMasivaModalOpen(false)}
        onSaved={loadOrdenes}
      />
    </div>
  );
};

export default OrdenPage;
