import { useCallback, useState } from "react";
import type { CentroCostoData, CentroCostoSave } from "../types/centercost.type";
import { save, getAll, deleteByCode, update } from "../services/centercosto.service";

export type CentroCostoItem = CentroCostoData;

export const useCenterCost = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centerCosts, setCenterCosts] = useState<CentroCostoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCenterCost, setCurrentCenterCost] = useState<CentroCostoItem | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [newCenterCostKey, setNewCenterCostKey] = useState(0);

  const normalizeCenterCosts = (result: unknown): CentroCostoItem[] => {
    const normalized = result as { data?: unknown; centerCosts?: unknown };

    if (Array.isArray(result)) {
      return result as CentroCostoItem[];
    }

    if (Array.isArray(normalized.data)) {
      return normalized.data as CentroCostoItem[];
    }

    if (Array.isArray(normalized.centerCosts)) {
      return normalized.centerCosts as CentroCostoItem[];
    }

    return [];
  };

  const loadCenterCosts = useCallback(async (customer: string, status = true) => {
    if (!customer) {
      setCenterCosts([]);
      setShowDeleted(false);
      return;
    }

    try {
      const result = await getAll(customer, status);
      setCenterCosts(normalizeCenterCosts(result));
      setShowDeleted(status === false);
    } catch (error) {
      console.error("Error cargando centros de costo:", error);
      setCenterCosts([]);
    }
  }, []);

  const handleSelectCustomer = async (customerCode: string) => {
    setSelectedCustomer(customerCode);
    setCurrentCenterCost(null);

    if (customerCode) {
      await loadCenterCosts(customerCode, true);
    } else {
      setCenterCosts([]);
    }
  };

  const handleNewCenterCostClick = () => {
    if (!selectedCustomer) return;
    setCurrentCenterCost(null);
    setIsModalOpen(true);
  };

  const handleViewCenterCost = (centerCost: CentroCostoItem) => {
    setCurrentCenterCost(centerCost);
    setIsModalOpen(true);
  };

  const handleDeleteCenterCost = async (centerCost: CentroCostoItem) => {
    const confirmed = window.confirm(`¿Eliminar centro de costo ${centerCost.codigo}?`);
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await deleteByCode(centerCost.codigo);
      await loadCenterCosts(selectedCustomer, showDeleted ? false : true);
    } catch (error) {
      console.error("Error eliminando centro de costo:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCenterCost = async (centerCostData: CentroCostoSave) => {
    if (!selectedCustomer) {
      alert("Selecciona un cliente primero.");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = { ...centerCostData, cliente: selectedCustomer };
      if (currentCenterCost) {
        await update(currentCenterCost.codigo, payload);
        alert("Registro actualizado");
      } else {
        await save(payload);
        alert("Registro grabado");
      }
      await loadCenterCosts(selectedCustomer);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error guardando centro de costo:", error);
      alert("No se pudo guardar el centro de costo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggleView = async () => {
    await loadCenterCosts(selectedCustomer, showDeleted);
  };

  return {
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
  };
};
