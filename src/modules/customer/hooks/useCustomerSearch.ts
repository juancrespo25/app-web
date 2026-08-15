import { useState, useMemo } from "react";
import type { CustomerItem } from "./useCustomer";

export const UserCustomerSearch = (customers: CustomerItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) {
      return customers;
    }

    return customers.filter((customer) =>
      customer.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return { filteredCustomers, setSearchTerm, handleSearchChange };
};
