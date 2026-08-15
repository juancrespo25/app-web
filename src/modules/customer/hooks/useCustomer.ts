import { useCallback, useEffect, useState } from "react";
import type { CustomerSave, CustomerData } from "../types/customer.type";
import {
  save,
  getAll,
  deleteByCode,
  update,
} from "../services/customer.service";

export type CustomerItem = CustomerData;

export const useCustomer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerItem | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [newCustomerKey, setNewCustomerKey] = useState(0);

  const normalizeCustomers = (result: unknown): CustomerItem[] => {
    const normalized = result as { data?: unknown; customers?: unknown };

    if (Array.isArray(result)) {
      return result as CustomerItem[];
    }

    if (Array.isArray(normalized.data)) {
      return normalized.data as CustomerItem[];
    }

    if (Array.isArray(normalized.customers)) {
      return normalized.customers as CustomerItem[];
    }

    return [];
  };

  const loadCustomers = useCallback(async (status = true) => {
    try {
      const result = await getAll(status);
      setCustomers(normalizeCustomers(result));
      setShowDeleted(status === false);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setCustomers([]);
    }
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      await loadCustomers();
    };
    fetchCustomers();
  }, [loadCustomers]);

  const handleNewCustomerClick = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  }

  const handleViewUser = (customer: CustomerItem) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  }

  const handleDeleteCustomer = async (customerItem: CustomerItem) => {
    const confirmed = window.confirm(`¿Eliminar cliente ${customerItem.codigo}?`);
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await deleteByCode(customerItem.codigo);
      await loadCustomers(showDeleted ? false: true);
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    } finally {
      setIsProcessing(false);
    }
  }


  const handleSaveCustomer = async (customerData: CustomerSave) => {
    setIsProcessing(true);
    try {
      if (currentCustomer) {
        await update(currentCustomer.codigo, customerData);
        alert("Registro actualizado");
      } else {
        await save(customerData);
        alert("Registro grabado");
      }
      await loadCustomers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error guardando cliente:", error);
      alert("No se pudo guardar el cliente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggleView = async () => {
    await loadCustomers(showDeleted);
  };

  return {
    isModalOpen,
     currentCustomer,
    customers,
   isProcessing,
    showDeleted,
    newCustomerKey,
    setNewCustomerKey,
    handleNewCustomerClick,
    handleViewUser,
    handleDeleteCustomer,
    handleSaveCustomer,
    closeModal,
    handleToggleView,
  };
};
