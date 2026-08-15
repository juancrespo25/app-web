import { useState, useEffect } from "react";
import { Search, PackageOpen, PackagePlus, Download } from "lucide-react";
import { getAllZonas } from "@/modules/zonas/services/zona.service";
import type { ZonaResponseDetail } from "@/modules/zonas/types/zona.type";
import { getUserType } from "@/modules/user/services/user.service";
import type { UserTypeResponseDetail } from "@/modules/user/types/UserForm.types";
import { getAllManifiesto } from "@/modules/manifiesto/services/manifiesto.service";
import type { getAllManifiestoResponseDetail } from "@/modules/manifiesto/types/manifiesto.type";
import ManifiestoForm from "@/modules/manifiesto/components/ManifiestoForm";
import ManifiestoDescargaForm from "@/modules/manifiesto/components/ManifiestoDescargaForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const today = new Date().toISOString().split("T")[0];

const ManifiestoPage = () => {
  const [fechaInicial, setFechaInicial] = useState(today);
  const [fechaFinal, setFechaFinal] = useState(today);
  const [manifiesto, setManifiesto] = useState("");
  const [estado, setEstado] = useState("");
  const [courier, setCourier] = useState("");
  const [couriers, setCouriers] = useState<UserTypeResponseDetail[]>([]);
  const [zona, setZona] = useState("");
  const [zonas, setZonas] = useState<ZonaResponseDetail[]>([]);

  useEffect(() => {
    getAllZonas()
      .then(setZonas)
      .catch((err) => console.error("Error cargando zonas:", err));
    getUserType()
      .then(setCouriers)
      .catch((err) => console.error("Error cargando couriers:", err));
  }, []);

  useEffect(() => {
    handleConsultar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [manifiestos, setManifiestos] = useState<getAllManifiestoResponseDetail[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDescargaOpen, setIsDescargaOpen] = useState(false);
  const [selectedManifiesto, setSelectedManifiesto] = useState<getAllManifiestoResponseDetail | null>(null);

  const handleConsultar = async () => {
    setIsLoading(true);
    try {
      const data = await getAllManifiesto(
        new Date(`${fechaInicial}T00:00:00`),
        new Date(`${fechaFinal}T23:59:59`),
        manifiesto || undefined,
        estado || undefined,
        courier || undefined,
        zona || undefined,
      );
      setManifiestos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error consultando manifiestos:", err);
      setManifiestos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-full">

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-black uppercase">
          Registro de <span className="text-red-600">Manifiestos</span>
        </h1>
      </div>

      {/* Panel de Filtros */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">

          {/* Fecha Inicial */}
          <div className="flex items-center gap-3">
            <label htmlFor="fecha-inicial" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Fecha Inicial
            </label>
            <input
              id="fecha-inicial"
              type="date"
              value={fechaInicial}
              onChange={(e) => setFechaInicial(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          {/* Fecha Final */}
          <div className="flex items-center gap-3">
            <label htmlFor="fecha-final" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Fecha Final
            </label>
            <input
              id="fecha-final"
              type="date"
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          {/* Manifiesto */}
          <div className="flex items-center gap-3">
            <label htmlFor="manifiesto" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Manifiesto
            </label>
            <input
              id="manifiesto"
              type="text"
              value={manifiesto}
              onChange={(e) => setManifiesto(e.target.value)}
              placeholder="N° manifiesto"
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <label htmlFor="estado" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            >
              <option value="">Todos</option>
              <option value="ER">EN RUTA</option>
              <option value="EF">ENTREGADO</option>
              <option value="EN">MOTIVADO</option>
              <option value="RT">RETORNO</option>
            </select>
          </div>

          {/* Courier */}
          <div className="flex items-center gap-3">
            <label htmlFor="courier" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Courier
            </label>
            <select
              id="courier"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            >
              <option value="">Todos</option>
              {couriers.map((c) => (
                <option key={c.codigo} value={c.codigo}>
                  {c.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Zona */}
          <div className="flex items-center gap-3">
            <label htmlFor="zona" className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600">
              Zona
            </label>
            <select
              id="zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            >
              <option value="">Todas</option>
              {zonas.map((z) => (
                <option key={z.codigo} value={z.codigo}>
                  {z.descripcion}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          id="crear"
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <PackagePlus size={16} />
          Crear
        </button>
        <button
          type="button"
          id="descarga"
          onClick={() => setIsDescargaOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Descargar
        </button>
        <button
          type="button"
          id='consultar'
          onClick={handleConsultar}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          {isLoading ? "Consultando..." : "Consultar"}
        </button>
      </div>

      {/* Contenedor de Tabla */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
            Manifiestos registrados según los filtros aplicados
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Manifiesto
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Zona
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Courier
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Estado
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Fecha
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Total
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                PD
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                EF
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                MT
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                RE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="group bg-white transition-colors">
                <TableCell colSpan={10} className="py-24 text-center">
                  <p className="text-sm text-slate-400">Cargando manifiestos...</p>
                </TableCell>
              </TableRow>
            ) : manifiestos.length === 0 ? (
              <TableRow className="group bg-white transition-colors hover:bg-slate-50">
                <TableCell colSpan={10} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageOpen size={48} className="text-slate-300" />
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Sin manifiestos encontrados
                    </p>
                    <p className="max-w-xl text-xs leading-5 text-slate-500">
                      Aplica los filtros y presiona Consultar para buscar manifiestos.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              manifiestos.map((m, index) => (
                <TableRow
                  key={`${m.codigo}-${index}`}
                  onClick={() => setSelectedManifiesto(m)}
                  className={`group transition-colors cursor-pointer ${selectedManifiesto?.codigo === m.codigo
                      ? 'bg-red-50 border-l-2 border-red-500'
                      : 'bg-white hover:bg-slate-50'
                    }`}
                >
                  <TableCell className="px-6 py-4 text-slate-700 font-medium">{m.codigo}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{m.zona}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{m.courier}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{m.estado}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">
                    {new Date(m.createdAt).toLocaleDateString("es-PE")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600">{m.total}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-yellow-100 text-yellow-700">{m.total_pendientes}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-green-100 text-green-700">{m.total_entregados}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-blue-100 text-blue-700">{m.total_motivados}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold bg-red-100 text-red-700">{m.total_retorno}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ManifiestoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleConsultar}
      />
      <ManifiestoDescargaForm
        isOpen={isDescargaOpen}
        onClose={() => setIsDescargaOpen(false)}
      />

    </div>
  );
};

export default ManifiestoPage;
