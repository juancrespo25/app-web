import { UserPlus, Eye, Trash2, ShieldCheck, Search } from "lucide-react";
import CenterCostFrom from "../components/CenterCostFrom";
import { useCenterCost } from "../hooks/useCenterCost";
import { useCenterCostSearch } from "../hooks/useCenterCostSearch";
import { useCustomerOptions } from "../hooks/useCustomerOptions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

export default function CenterCostPage() {
  const {
    selectedCustomer,
    isModalOpen,
    currentCenterCost,
    centerCosts,
    isProcessing,
    showDeleted,
    newCenterCostKey,
    setNewCenterCostKey,
    handleSelectCustomer,
    handleNewCenterCostClick,
    handleViewCenterCost,
    handleDeleteCenterCost,
    handleSaveCenterCost,
    closeModal,
    handleToggleView,
  } = useCenterCost();

  const { filteredCenterCosts, handleSearchChange } = useCenterCostSearch(centerCosts);
  
  const { customers: customerOptions, isLoading: isLoadingCustomers, error: customerError } = useCustomerOptions();

  const selectedCustomerLabel = customerOptions.find((item) => item.codigo === selectedCustomer)?.descripcion || "";

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-full">
      <div className="mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase">
            Gestión de <span className="text-red-600">Centro de Costos</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:w-1/2">
          <div className="relative max-w-md">
            <label htmlFor="cliente" className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Clientes
            </label>
            <select
              id="cliente"
              value={selectedCustomer}
              onChange={(e) => void handleSelectCustomer(e.target.value)}
              disabled={isLoadingCustomers}
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 px-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:bg-zinc-100"
            >
              <option value="">
                {isLoadingCustomers ? "Cargando clientes..." : customerError ? "Error al cargar clientes" : "Selecciona un cliente"}
              </option>
              {customerOptions.map((customer) => (
                <option key={customer.codigo} value={customer.codigo}>
                  {customer.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 relative w-full max-w-md">
            <div className="flex relative w-full">
              <input
                type="text"
                placeholder="Buscar centros de costo por descripción"
                onChange={handleSearchChange}
                disabled={!selectedCustomer}
                className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-red-600/10 transition-all focus:border-red-600 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:bg-zinc-100"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>
            <button
              id="filtros-tabla"
              onClick={handleToggleView}
              disabled={!selectedCustomer}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors cursor-pointer whitespace-nowrap text-xs font-bold uppercase tracking-wider ${
                !selectedCustomer
                  ? "text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed"
                  : showDeleted
                  ? "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                  : "text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Search size={16} />
              {showDeleted ? "Activos" : "Eliminados"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewCenterCostKey((prev) => prev + 1);
              handleNewCenterCostClick();
            }}
            disabled={!selectedCustomer || showDeleted}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-colors cursor-pointer ${
              !selectedCustomer || showDeleted
                ? "text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <UserPlus size={20} />
            Nuevo
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <Table className="min-w-full text-sm">
          <TableCaption className="text-left text-sm text-slate-500 px-6 py-4">
            {selectedCustomer
              ? showDeleted
                ? `Centros de costo eliminados para ${selectedCustomerLabel}`
                : `Centros de costo activos para ${selectedCustomerLabel}`
              : "Selecciona un cliente para cargar los centros de costo."}
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-950 text-white border-b border-slate-200/70">
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Código
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Descripción
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Contacto
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Email
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Teléfono
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Estado
              </TableHead>
              <TableHead className="px-6 py-4 border-b border-slate-700/40 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCenterCosts.length === 0 ? (
              <TableRow className="group bg-white transition-colors hover:bg-slate-50">
                <TableCell colSpan={7} className="py-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck size={48} className="text-slate-300" />
                    <p className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {selectedCustomer
                        ? showDeleted
                          ? "Sin centros de costo eliminados"
                          : "Bandeja de centros de costo vacía"
                        : "Selecciona un cliente para ver sus centros de costo."}
                    </p>
                    <p className="max-w-xl text-xs leading-5 text-slate-500">
                      {selectedCustomer
                        ? showDeleted
                          ? "No hay registros eliminados para este cliente. Presiona Activos para regresar al listado activo."
                          : "No hay registros disponibles para este cliente. Presiona Nuevo para crear uno."
                        : "Elige un cliente en el combo para cargar su tabla de centros de costo."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCenterCosts.map((centerCost, index) => (
                <TableRow key={`${centerCost.codigo}-${index}`} className="group bg-white transition-colors hover:bg-slate-50">
                  <TableCell className="px-6 py-4 text-slate-700">{centerCost.codigo}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{centerCost.descripcion}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{centerCost.contacto}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{centerCost.email}</TableCell>
                  <TableCell className="px-6 py-4 text-slate-700">{centerCost.telefono}</TableCell>
                  <TableCell className="px-6 py-4 text-center text-slate-700">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${centerCost.status ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {centerCost.status ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-slate-700">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewCenterCost(centerCost)}
                        title="Ver detalle"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCenterCost(centerCost)}
                        title="Eliminar centro de costo"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CenterCostFrom
        key={isModalOpen ? (currentCenterCost ? currentCenterCost.codigo : `new-${newCenterCostKey}`) : "closed"}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveCenterCost}
        initialData={currentCenterCost}
        isProcessing={isProcessing}
        selectedCustomer={selectedCustomer}
      />
    </div>
  );
}
