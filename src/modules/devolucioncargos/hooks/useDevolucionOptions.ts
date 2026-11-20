import { useEffect, useRef, useState } from "react";
import { getAll, getAllCustomer } from "@/modules/centrocosto/services/centercosto.service";
import type { CustomerOption } from "@/modules/customer/types/customer.type";
import { getToken } from "@/utils/token";

type Option = CustomerOption;

interface OptionsCache {
  token: string | null;
  customers?: Promise<Option[]>;
  centerCosts: Map<string, Promise<Option[]>>;
}

let cache: OptionsCache | undefined;

const getCache = () => {
  const token = getToken();
  if (!cache || cache.token !== token) {
    cache = { token, centerCosts: new Map() };
  }
  return cache;
};

const getCustomers = () => {
  const current = getCache();
  if (!current.customers) {
    current.customers = getAllCustomer().catch((error: unknown) => {
      current.customers = undefined;
      throw error;
    });
  }
  return current.customers;
};

const isOption = (value: unknown): value is Option => {
  if (typeof value !== "object" || value === null) return false;
  return "codigo" in value && typeof value.codigo === "string" &&
    "descripcion" in value && typeof value.descripcion === "string";
};

const getCenterCosts = (customer: string) => {
  const current = getCache();
  let request = current.centerCosts.get(customer);
  if (!request) {
    request = (async () => {
      const result: unknown = await getAll(customer, true);
      const data: unknown = Array.isArray(result)
        ? result
        : typeof result === "object" && result !== null && "data" in result
          ? result.data
          : undefined;
      if (!Array.isArray(data) || !data.every(isOption)) {
        throw new Error("Formato de centros de costo inválido.");
      }
      return data;
    })().catch((error: unknown) => {
      current.centerCosts.delete(customer);
      throw error;
    });
    current.centerCosts.set(customer, request);
  }
  return request;
};

export function useDevolucionOptions() {
  const [customers, setCustomers] = useState<Option[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customersError, setCustomersError] = useState(false);
  const [customerAttempt, setCustomerAttempt] = useState(0);
  const [customer, setCustomer] = useState("");
  const [centerCost, setCenterCost] = useState("");
  const [centerCosts, setCenterCosts] = useState<Option[]>([]);
  const [loadingCenterCosts, setLoadingCenterCosts] = useState(false);
  const [centerCostsError, setCenterCostsError] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    getCustomers()
      .then((data) => {
        if (active) setCustomers(data);
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Error cargando clientes:", error);
          setCustomersError(true);
        }
      })
      .finally(() => {
        if (active) setLoadingCustomers(false);
      });
    return () => { active = false; };
  }, [customerAttempt]);

  useEffect(() => {
    return () => { requestId.current += 1; };
  }, []);

  const selectCustomer = (value: string) => {
    const id = ++requestId.current;
    setCustomer(value);
    setCenterCost("");
    setCenterCosts([]);
    setCenterCostsError(false);
    setLoadingCenterCosts(Boolean(value));
    if (!value) return;

    getCenterCosts(value)
      .then((data) => {
        if (requestId.current === id) setCenterCosts(data);
      })
      .catch((error: unknown) => {
        if (requestId.current === id) {
          console.error("Error cargando centros de costo:", error);
          setCenterCostsError(true);
        }
      })
      .finally(() => {
        if (requestId.current === id) setLoadingCenterCosts(false);
      });
  };

  const retryCustomers = () => {
    setCustomersError(false);
    setLoadingCustomers(true);
    setCustomerAttempt((attempt) => attempt + 1);
  };

  return {
    customers, loadingCustomers, customersError, retryCustomers,
    customer, selectCustomer, centerCost, setCenterCost,
    centerCosts, loadingCenterCosts, centerCostsError,
  };
}
