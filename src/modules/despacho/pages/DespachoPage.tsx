import {
  Plus,
  Search,
  LockOpen,
  Lock,
  PlusCircle,
  Printer,
  AlertTriangle,
  FolderOpen,
  ChartGantt,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import DespachoForm from "@/modules/despacho/components/DespachoForm";
import DespachoAddForm from "@/modules/despacho/components/DespachoAddForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCaption,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDespachoFormOptions } from "../hooks/useDespachoFormOptions";
import { useDespachoTable } from "../hooks/useDespachoTable";
import { useUpdateDespachoEstado } from "../hooks/useUpdateDespachoEstado";
import { useConfirmDespacho } from "../hooks/useConfirmDespacho";
import type { DespachoResponseDetail } from "../types/despacho.type";

const today = new Date().toISOString().split("T")[0];
const DespachoPage = () => {
  const [agente, setAgente] = useState("");
  const [estado, setEstado] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDespacho, setSelectedDespacho] =
    useState<DespachoResponseDetail | null>(null);
  const [fechaInicial, setFechaInicial] = useState(today);
  const [fechaFinal, setFechaFinal] = useState(today);

  const { agentes } = useDespachoFormOptions();
  const { despachos, loading, error, loadDespachos } = useDespachoTable();
const { despachoToUpdate, setDespachoToUpdate, isUpdating, handleConfirmar } =
    useUpdateDespachoEstado(() => {
      loadDespachos(fechaInicial, fechaFinal, agente, estado);
    });
  const {
    despachoToConfirm,
    setDespachoToConfirm,
    isConfirming,
    handleConfirmar: handleConfirmarRecepcion,
} = useConfirmDespacho(() => {
    loadDespachos(fechaInicial, fechaFinal, agente, estado);
  });

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-full">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-black uppercase">
          Registro de <span className="text-red-600">Despachos</span>
        </h1>
      </div>

      {/* Panel de Filtros */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          {/* Fecha Inicial */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="fecha-inicial"
              className="w-25 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
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
            <label
              htmlFor="fecha-final"
              className="w-25 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
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

          {/* Agentes */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="agente"
              className="w-15 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Agente
            </label>
            <select
              id="agente"
              value={agente}
              onChange={(e) => setAgente(e.target.value)}
              className="w-40 h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            >
              <option value="" disabled>
                [SELECCIONAR]
              </option>
              {agentes.map((a, idx) => (
                <option key={a.id ?? `agente-${idx}`} value={a.id}>
                  {a.provincia_agente}
                </option>
              ))}
            </select>
          </div>

          {/* Estados */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="estado"
              className="w-15 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-600"
            >
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            >
              <option value="">[TODOS]</option>
              <option value="DP">DESPACHO ABIERTO</option>
              <option value="DA">DESPACHO EN CURSO</option>
              <option value="DC">DESPACHO CERRADO</option>
              <option value="DF">DESPACHO CONFIRMADO</option>
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
          <Plus size={16} />
          Crear
        </button>
        <button
          type="button"
          id="consultar"
          onClick={() =>
            loadDespachos(fechaInicial, fechaFinal, agente, estado)
          }
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          {loading ? "Cargando..." : "Consultar"}
        </button>
      </div>

      {/* Contenedor de Tabla */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm" id="tabla-despacho">
          <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
            Despachos registrados según los filtros aplicados
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Codigo
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Agente
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Provincia
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Empresa
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                T.Envio
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Fecha
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Estado
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {despachos.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  {error ? error : "No se encontraron despachos"}
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  Cargando despachos...
                </TableCell>
              </TableRow>
            )}
            {despachos.map((despacho, index) => (
              <TableRow
                key={despacho.id ?? `despacho-${index}`}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <TableCell className="px-6 py-3.5 font-medium text-slate-800">
                  {despacho.id}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-slate-600">
                  {despacho.agente_name}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-center text-slate-600">
                  {despacho.provincia}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-slate-600">
                  {despacho.empresatransporte}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-slate-600">
                  {despacho.tenvio_name}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-slate-600">
                  {new Date(despacho.fecha_creacion).toLocaleDateString(
                    "es-PE",
                  )}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                      despacho.estado === "DF"
                        ? "bg-green-100 text-green-700"
                        : despacho.estado === "DC"
                          ? "bg-blue-100 text-blue-700"
                          : despacho.estado === "DA"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {despacho.estado === "DP"
                      ? "DESPACHO ABIERTO"
                      : despacho.estado === "DA"
                        ? "DESPACHO EN CURSO"
                        : despacho.estado === "DC"
                          ? "DESPACHO CERRADO"
                          : despacho.estado === "DF"
                            ? "DESPACHO CONFIRMADO"
                            : despacho.estado}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-3.5 text-center">
                  <div className="inline-flex items-center gap-1">
                    {/* Cerrar */}
                    <button
                      type="button"
                      title={
                        ["DP", "DA"].includes(despacho.estado)
                          ? "Cerrar despacho"
                          : "Cerrado"
                      }
                      disabled={!["DP", "DA"].includes(despacho.estado)}
                      onClick={() =>
                        setDespachoToUpdate({ id: despacho.id, estado: "DC" })
                      }
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {["DP", "DA"].includes(despacho.estado) ? (
                        <LockOpen size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </button>

                    {/* Agregar */}
                    <button
                      type="button"
                      title={
                        ["DP", "DA"].includes(despacho.estado)
                          ? "Agregar guía"
                          : "Cerrado"
                      }
                      disabled={!["DP", "DA"].includes(despacho.estado)}
                      onClick={() => {
                        setSelectedDespacho(despacho);
                        setIsAddFormOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {["DP", "DA"].includes(despacho.estado) ? (
                        <PlusCircle size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </button>

{/* Despacho cerrado: confirmar */}
                    <button
                      type="button"
                      title={
                        despacho.estado === "DC"
                          ? "Confirmar recepcion del despacho"
                          : "Solo disponible en Despacho Cerrado"
                      }
                      disabled={despacho.estado !== "DC"}
                      onClick={() =>
                        setDespachoToConfirm({
                          id: despacho.id,
                          estado: "DF",
                        })
                      }
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserCheck size={16} />
                    </button>

                    {/* Abrir */}
                    <button
                      type="button"
                      title={
                        despacho.estado === "DC" ? "Abrir despacho" : "Cerrado"
                      }
                      disabled={despacho.estado !== "DC"}
                      onClick={() =>
                        setDespachoToUpdate({ id: despacho.id, estado: "DA" })
                      }
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FolderOpen size={16} />
                    </button>

                    {/* detail */}
                    <button
                      type="button"
                      title="Detalle de despacho"
                      onClick={() => {
                        setSelectedDespacho(despacho);
                        setIsDetailOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <ChartGantt size={16} />
                    </button>

                    {/* Imprimir */}
                    <button
                      type="button"
                      title="Imprimir despacho"
                      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DespachoForm
        key={isFormOpen ? "open" : "closed"}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() =>
          loadDespachos(fechaInicial, fechaFinal, agente, estado)
        }
      />
      <DespachoAddForm
        key={isAddFormOpen ? "open-add" : "closed-add"}
        isOpen={isAddFormOpen}
        onOpenChange={(open) => {
          setIsAddFormOpen(open);
          if (!open) setSelectedDespacho(null);
        }}
        despachoId={selectedDespacho?.id}
        onSuccess={() => {
          setIsAddFormOpen(false);
          setSelectedDespacho(null);
          loadDespachos(fechaInicial, fechaFinal, agente, estado);
        }}
      />

      {/* Detalle de despacho (solo lectura) */}
      <DespachoAddForm
        key={isDetailOpen ? "open-detail" : "closed-detail"}
        isOpen={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) setSelectedDespacho(null);
        }}
        despachoId={selectedDespacho?.id}
        readOnly
      />

{/* Dialog de confirmación para confirmar recepción del despacho */}
      <Dialog
        open={!!despachoToConfirm}
        onOpenChange={(open) => !open && setDespachoToConfirm(null)}
      >
        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-base font-black uppercase tracking-tight text-slate-900">
                Confirmar Despacho
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Confirmación de recepción del despacho
              </DialogDescription>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-base text-slate-600">
              ¿Desea confirmar la recepción del despacho{" "}
              <span className="font-bold text-slate-900">
                #{despachoToConfirm?.id}
              </span>
              ?
            </p>
          </div>

          <div className="flex justify-end items-center gap-3 border-t border-zinc-200 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDespachoToConfirm(null)}
              disabled={isConfirming}
              className="min-w-24 rounded-xl border-zinc-300 bg-white! px-5 text-slate-700 hover:bg-zinc-50!"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmarRecepcion}
              disabled={isConfirming}
              className="min-w-24 rounded-xl bg-green-600 px-5 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isConfirming ? "Procesando..." : "Sí, confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para actualizar estado del despacho */}
      <Dialog
        open={!!despachoToUpdate}
        onOpenChange={(open) => !open && setDespachoToUpdate(null)}
      >
        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-base font-black uppercase tracking-tight text-slate-900">
                {despachoToUpdate?.estado === "DC"
                  ? "Cerrar Despacho"
                  : "Abrir Despacho"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Confirmación de cambio de estado
              </DialogDescription>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-base text-slate-600">
              ¿Desea {despachoToUpdate?.estado === "DC" ? "cerrar" : "abrir"} el
              despacho{" "}
              <span className="font-bold text-slate-900">
                #{despachoToUpdate?.id}
              </span>
              ?
            </p>
          </div>

          <div className="flex justify-end items-center gap-3 border-t border-zinc-200 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDespachoToUpdate(null)}
              disabled={isUpdating}
              className="min-w-24 rounded-xl border-zinc-300 bg-white! px-5 text-slate-700 hover:bg-zinc-50!"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmar}
              disabled={isUpdating}
              className="min-w-24 rounded-xl bg-red-600 px-5 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdating
                ? "Procesando..."
                : despachoToUpdate?.estado === "DC"
                  ? "Sí, cerrar"
                  : "Sí, abrir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DespachoPage;
