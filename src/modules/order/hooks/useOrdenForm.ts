import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useCustomerOptions } from "@/modules/centrocosto/hooks/useCustomerOptions";
import { getAll as getCenterCosts } from "@/modules/centrocosto/services/centercosto.service";
import type { CentroCostoData } from "@/modules/centrocosto/types/centercost.type";
import { getOrden, saveOrden } from "../services/order.service";
import { saveGuia } from "@/modules/guia/services/guia.service";
import type { Guia } from "@/modules/guia/types/guia.type";
import { findByCode as findUbigeoByCode } from "@/modules/ubigeo/services/ubigeo.service";
import type { GetOrdenResponseDetail } from "../types/order.type";
import { getDestinatario } from "@/modules/destinatario/services/destinatario.service";
import type { GetDestinatarioResponseDetail } from "@/modules/destinatario/types/destinatario.type";
import { getAll as getContenidos } from "@/modules/contenido/services/contenido.service";
import type { getContenidoResponseDetail } from "@/modules/contenido/types/contenido.type";
import { getAll as getTipoEnvios } from "@/modules/tipoenvio/services/tipoenvio.service";
import type { getTipoEnvioResponseDetail } from "@/modules/tipoenvio/types/tipoenvio.type";

export const useOrdenForm = (onSaved?: () => void) => {
  // N° Orden
  const [numeroOrden, setNumeroOrden] = useState("");
  const [isSearchingOrden, setIsSearchingOrden] = useState(false);
  const [isOrdenFound, setIsOrdenFound] = useState(false);
  const [ordenId, setOrdenId] = useState("");
  const [showOrdenConfirm, setShowOrdenConfirm] = useState(false);
  const [pendingOrden, setPendingOrden] = useState<GetOrdenResponseDetail | null>(null);
  const customerButtonRef = useRef<HTMLSelectElement>(null);
  const destinoButtonRef = useRef<HTMLButtonElement>(null);
  const numeroOrdenRef = useRef<HTMLInputElement>(null);
  const centerCostRef = useRef<HTMLSelectElement>(null);
  const origenButtonRef = useRef<HTMLButtonElement>(null);
  const destinatarioInputRef = useRef<HTMLInputElement>(null);
  const direccionRef = useRef<HTMLInputElement>(null);
  const empresaRef = useRef<HTMLInputElement>(null);
  const contenidoRef = useRef<HTMLSelectElement>(null);
  const tipoEnvioRef = useRef<HTMLSelectElement>(null);
  const pesoRef = useRef<HTMLInputElement>(null);
  const bultosRef = useRef<HTMLInputElement>(null);
  const unidadesRef = useRef<HTMLInputElement>(null);

  const observacionesRef = useRef<HTMLTextAreaElement>(null);
  const grabarButtonRef = useRef<HTMLButtonElement>(null);

  // Cliente
  const { customers, isLoading: isLoadingCustomers } = useCustomerOptions();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  // Centro de Costo
  const [centerCosts, setCenterCosts] = useState<CentroCostoData[]>([]);
  const [isLoadingCenterCosts, setIsLoadingCenterCosts] = useState(false);
  const [selectedCenterCost, setSelectedCenterCost] = useState("");
  const [selectedCenterCostLabel, setSelectedCenterCostLabel] = useState("");
  const [centerCostSearch, setCenterCostSearch] = useState("");
  const [isCenterCostOpen, setIsCenterCostOpen] = useState(false);

  // Origen (Ubigeo)
  const [selectedOrigen, setSelectedOrigen] = useState("");
  const [selectedOrigenLabel, setSelectedOrigenLabel] = useState("");
  const [isUbigeoOpen, setIsUbigeoOpen] = useState(false);

  // Destino (Ubigeo)
  const [selectedDestino, setSelectedDestino] = useState("");
  const [selectedDestinoLabel, setSelectedDestinoLabel] = useState("");
  const [isUbigeoDestinoOpen, setIsUbigeoDestinoOpen] = useState(false);

  // Correlativo
  const [correlativo, setCorrelativo] = useState("");

  // Contenido
  const [contenidos, setContenidos] = useState<getContenidoResponseDetail[]>([]);
  const [selectedContenido, setSelectedContenido] = useState("");
  const [isLoadingContenidos, setIsLoadingContenidos] = useState(false);

  // Tipo de Envio
  const [tipoEnvios, setTipoEnvios] = useState<getTipoEnvioResponseDetail[]>([]);
  const [selectedTipoEnvio, setSelectedTipoEnvio] = useState("");
  const [isLoadingTipoEnvios, setIsLoadingTipoEnvios] = useState(false);

  // Destinatario
  const [destinatario, setDestinatario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [destinatarioOptions, setDestinatarioOptions] = useState<GetDestinatarioResponseDetail[]>([]);
  const [isSearchingDestinatario, setIsSearchingDestinatario] = useState(false);
  const [showDestinatarioOptions, setShowDestinatarioOptions] = useState(false);
  const [stopDestinatarioSearch, setStopDestinatarioSearch] = useState(false);
  const isSelectingDestinatario = useRef(false);

  // Datos de la Guia
  const [idDestinatario, setIdDestinatario] = useState(0);
  const [empresa, setEmpresa] = useState("");
  const [peso, setPeso] = useState("");
  const [bultos, setBultos] = useState("");
  const [unidades, setUnidades] = useState("");

  const [observaciones, setObservaciones] = useState("");

  // Fecha
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);

  // Grabar orden
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadContenidos = async () => {
      setIsLoadingContenidos(true);
      try {
        const data = await getContenidos(true);
        setContenidos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando contenidos:", error);
        setContenidos([]);
      } finally {
        setIsLoadingContenidos(false);
      }
    };

    loadContenidos();
  }, []);

  useEffect(() => {
    const loadTipoEnvios = async () => {
      setIsLoadingTipoEnvios(true);
      try {
        const data = await getTipoEnvios(true);
        setTipoEnvios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando tipos de envio:", error);
        setTipoEnvios([]);
      } finally {
        setIsLoadingTipoEnvios(false);
      }
    };

    loadTipoEnvios();
  }, []);

  // Buscar destinatario con debounce cuando se escriben 3+ caracteres
  useEffect(() => {
    // Si el cambio vino de una selección, no buscar
    if (isSelectingDestinatario.current) {
      isSelectingDestinatario.current = false;
      return;
    }
    const searchText = destinatario.trim();
    if (searchText.length < 3) {
      setDestinatarioOptions([]);
      setShowDestinatarioOptions(false);
      setStopDestinatarioSearch(false);
      return;
    }

    if (stopDestinatarioSearch) {
      setDestinatarioOptions([]);
      setShowDestinatarioOptions(false);
      return;
    }

    setShowDestinatarioOptions(true);
    const timer = setTimeout(async () => {
      setIsSearchingDestinatario(true);
      try {
        const results = await getDestinatario(
          searchText,
          selectedCustomer,
          selectedCenterCost,
          selectedOrigen
        );
        setDestinatarioOptions(results);
        if (results.length === 0) {
          setShowDestinatarioOptions(false);
          setStopDestinatarioSearch(true);
        }
      } catch (error) {
        console.error("Error buscando destinatario:", error);
        setDestinatarioOptions([]);
      } finally {
        setIsSearchingDestinatario(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [destinatario, selectedCustomer, selectedCenterCost, selectedOrigen, stopDestinatarioSearch]);

  const handleDestinatarioChange = useCallback((value: string) => {
    const searchText = value.trim();
    setDestinatario(value);
    if (searchText.length < 3) {
      setStopDestinatarioSearch(false);
      setShowDestinatarioOptions(false);
      setDestinatarioOptions([]);
      return;
    }
    if (!stopDestinatarioSearch) {
      setShowDestinatarioOptions(true);
    }
  }, [stopDestinatarioSearch]);

  const handleSelectDestinatario = useCallback(async (item: GetDestinatarioResponseDetail) => {
    isSelectingDestinatario.current = true;
    setDestinatario(item.nombre);
    setIdDestinatario(Number(item.id));
    setDireccion(item.direccion);
    setDestinatarioOptions([]);
    setShowDestinatarioOptions(false);
    setStopDestinatarioSearch(false);
    if (item.ubigeo) {
      const ubigeoCode = item.ubigeo.trim();
      setSelectedDestino(ubigeoCode);
      const ubigeo = await findUbigeoByCode(ubigeoCode);
      if (ubigeo) {
        setSelectedDestinoLabel(`${ubigeo.departamento} - ${ubigeo.provincia} - ${ubigeo.distrito}`);
      } else {
        setSelectedDestinoLabel(ubigeoCode);
      }
    }
    setTimeout(() => direccionRef.current?.focus(), 50);
  }, []);

  // Cargar centros de costo cuando cambia el cliente
  const loadCenterCosts = useCallback(async (customerCode: string) => {
    if (!customerCode) {
      setCenterCosts([]);
      setSelectedCenterCost("");
      setSelectedCenterCostLabel("");
      return;
    }
    setIsLoadingCenterCosts(true);
    try {
      const result = await getCenterCosts(customerCode, true);
      const data = Array.isArray(result) ? result : result?.data ?? [];
      setCenterCosts(data);
    } catch (error) {
      console.error("Error cargando centros de costo:", error);
      setCenterCosts([]);
    } finally {
      setIsLoadingCenterCosts(false);
    }
  }, []);

  useEffect(() => {
    loadCenterCosts(selectedCustomer);
  }, [selectedCustomer, loadCenterCosts]);

  // Filtros de búsqueda
  const filteredCustomers = customers.filter((c) =>
    c.descripcion.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredCenterCosts = centerCosts.filter((cc) =>
    cc.descripcion.toLowerCase().includes(centerCostSearch.toLowerCase())
  );

  const handleSelectCustomer = (codigo: string, descripcion: string) => {
    setSelectedCustomer(codigo);
    setSelectedCustomerLabel(descripcion);
    setCustomerSearch("");
    setIsCustomerOpen(false);
    // Resetear centro de costo al cambiar cliente
    setSelectedCenterCost("");
    setSelectedCenterCostLabel("");
    setTimeout(() => centerCostRef.current?.focus(), 50);
  };

  const handleSelectCenterCost = (codigo: string, descripcion: string) => {
    setSelectedCenterCost(codigo);
    setSelectedCenterCostLabel(descripcion);
    setCenterCostSearch("");
    setIsCenterCostOpen(false);
    setTimeout(() => origenButtonRef.current?.focus(), 50);
  };

  const isOrdenFormValid =
    !!numeroOrden && !!selectedCustomer && !!selectedCenterCost && !!selectedOrigen && !!fecha &&
    !!destinatario && !!direccion && !!selectedDestino && !!selectedContenido &&
    !!selectedTipoEnvio && !!peso && !!bultos && !!unidades && !!observaciones;

  const handleSaveOrden = useCallback(async () => {
    if (!numeroOrden || !destinatario || !direccion || !selectedDestino || !selectedContenido ||
        !selectedTipoEnvio || !peso || !bultos || !unidades || !observaciones) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      if (isOrdenFound) {
        // Orden existente → guardar solo la guía
        const guia: Guia = {
          id_guia: Number(numeroOrden + correlativo),
          orden: ordenId,
          item: Number(correlativo),
          empresa,
          destinatario: idDestinatario,
          destinatario_name: destinatario,
          direccion,
          tarifa: 150,
          peso: Number(peso),
          bultos: Number(bultos),
          unidades: Number(unidades),
          origen: selectedOrigen,
          destino: selectedDestino,
          tenvio: Number(selectedTipoEnvio),
          contenido: selectedContenido,
          observaciones,
          estado: 'PD',
          digitalizado: false,
          userCreated: '',
          customer: selectedCustomer,
          ccosto: selectedCenterCost,
        };
        await saveGuia(guia);
        // Incrementar correlativo y limpiar campos de guía para la siguiente
        setCorrelativo(String(Number(correlativo) + 1));
        setIdDestinatario(0);
        setDestinatario("");
        setDireccion("");
        setEmpresa("");
        setSelectedDestino("");
        setSelectedDestinoLabel("");
        setPeso("");
        setBultos("");
        setUnidades("");
        setObservaciones("");
        setSelectedContenido("");
        setSelectedTipoEnvio("");
        toast.success('Guia registrada');
        onSaved?.();
        setTimeout(() => destinatarioInputRef.current?.focus(), 50);
      } else {
        // Orden nueva → guardar orden con su primera guía
        if (!selectedCustomer || !selectedCenterCost || !selectedOrigen || !fecha) return;
        await saveOrden({
          numero: Number(numeroOrden),
          customer: selectedCustomer,
          ccosto: selectedCenterCost,
          origen: selectedOrigen,
          provincia: '001',
          userCreated: localStorage.getItem('user_code') ?? '',
          fecha_registro: new Date(`${fecha}T00:00:00`),
          guias: [
            {
              id_guia: Number(numeroOrden + correlativo),
              item: Number(correlativo),
              empresa,
              destinatario: idDestinatario,
              destinatario_name: destinatario,
              direccion,
              tarifa: 150,
              peso: Number(peso),
              bultos: Number(bultos),
              unidades: Number(unidades),
              origen: selectedOrigen,
              destino: selectedDestino,
              tenvio: Number(selectedTipoEnvio),
              contenido: selectedContenido,
              observaciones,
              estado: 'PD',
              digitalizado: false,
            },
          ],
        });
        // Limpiar todo y volver al foco de N° Orden
        setNumeroOrden("");
        setIsOrdenFound(false);
        setSelectedCustomer("");
        setSelectedCustomerLabel("");
        setCenterCosts([]);
        setSelectedCenterCost("");
        setSelectedCenterCostLabel("");
        setSelectedOrigen("");
        setSelectedOrigenLabel("");
        setSelectedDestino("");
        setSelectedDestinoLabel("");
        setCorrelativo("");
        setIdDestinatario(0);
        setDestinatario("");
        setDireccion("");
        setEmpresa("");
        setPeso("");
        setBultos("");
        setUnidades("");
        setObservaciones("");
        setSelectedContenido("");
        setSelectedTipoEnvio("");
        setFecha(new Date().toISOString().split("T")[0]);
        toast.success('Orden registrada');
        onSaved?.();
        setTimeout(() => setSaveSuccess(false), 3000);
        setTimeout(() => numeroOrdenRef.current?.focus(), 50);
      }
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error al grabar:', error);
      setSaveError('No se pudo grabar. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  }, [isOrdenFound, numeroOrden, selectedCustomer, selectedCenterCost, selectedOrigen, selectedDestino, fecha, correlativo, ordenId, empresa, idDestinatario, destinatario, direccion, peso, bultos, unidades, observaciones, selectedTipoEnvio, selectedContenido, onSaved]);

  // Buscar orden por número
  const handleOrdenSearch = useCallback(async () => {
    if (!numeroOrden) return;

    setIsOrdenFound(false);
    setIsSearchingOrden(true);
    try {
      const found = await getOrden(numeroOrden);

      if (!found) {
        // No existe → limpiar campos, desbloquear, correlativo = 1, foco al combo cliente
        setIsOrdenFound(false);
        setSelectedCustomer("");
        setSelectedCustomerLabel("");
        setSelectedCenterCost("");
        setSelectedCenterCostLabel("");
        setCenterCosts([]);
        setSelectedOrigen("");
        setSelectedOrigenLabel("");
        setFecha(new Date().toISOString().split("T")[0]);
        setCorrelativo("1");
        customerButtonRef.current?.focus();
        return;
      }

      // Existe → mostrar confirmación
      setPendingOrden(found);
      setShowOrdenConfirm(true);
    } catch (error) {
      console.error("Error buscando orden:", error);
      customerButtonRef.current?.focus();
    } finally {
      setIsSearchingOrden(false);
    }
  }, [numeroOrden]);

  // Confirmar: autocompletar campos con la orden encontrada
  const handleConfirmOrden = useCallback(async () => {
    if (!pendingOrden) return;
    const found = pendingOrden;
    setShowOrdenConfirm(false);

    // Cliente
    const cliente = customers.find((c) => c.codigo === found.customer);
    if (cliente) {
      handleSelectCustomer(cliente.codigo, cliente.descripcion);
    }

    // Centro de costo
    if (found.customer) {
      setIsLoadingCenterCosts(true);
      try {
        const result = await getCenterCosts(found.customer, true);
        const data: CentroCostoData[] = Array.isArray(result) ? result : result?.data ?? [];
        setCenterCosts(data);
        const cc = data.find((c) => c.codigo === found.ccosto);
        if (cc) {
          setSelectedCenterCost(cc.codigo);
          setSelectedCenterCostLabel(cc.descripcion);
        }
      } finally {
        setIsLoadingCenterCosts(false);
      }
    }

    // Origen
    if (found.origen) {
      const origenCode = found.origen.trim();
      setSelectedOrigen(origenCode);
      const ubigeo = await findUbigeoByCode(origenCode);
      if (ubigeo) {
        setSelectedOrigenLabel(`${ubigeo.departamento} - ${ubigeo.provincia} - ${ubigeo.distrito}`);
      } else {
        setSelectedOrigenLabel(origenCode);
      }
    }

    // Correlativo
    setCorrelativo(String((found.maxItem ?? 0) + 1));

    // UUID de la orden encontrada
    setOrdenId(found.id);

    // Marcar orden encontrada y enfocar destino
    setIsOrdenFound(true);
    setTimeout(() => destinoButtonRef.current?.focus(), 50);

    // Fecha
    if (found.fecha_registro) {
      const d = new Date(found.fecha_registro);
      setFecha(d.toISOString().split("T")[0]);
    }
  }, [pendingOrden, customers]);

  const resetForm = useCallback(() => {
    setNumeroOrden("");
    setIsSearchingOrden(false);
    setIsOrdenFound(false);
    setOrdenId("");
    setShowOrdenConfirm(false);
    setPendingOrden(null);

    setSelectedCustomer("");
    setSelectedCustomerLabel("");
    setCustomerSearch("");
    setIsCustomerOpen(false);

    setCenterCosts([]);
    setIsLoadingCenterCosts(false);
    setSelectedCenterCost("");
    setSelectedCenterCostLabel("");
    setCenterCostSearch("");
    setIsCenterCostOpen(false);

    setSelectedOrigen("");
    setSelectedOrigenLabel("");
    setIsUbigeoOpen(false);

    setSelectedDestino("");
    setSelectedDestinoLabel("");
    setIsUbigeoDestinoOpen(false);

    setCorrelativo("");
    setSelectedContenido("");
    setSelectedTipoEnvio("");
    setDestinatario("");
    setDireccion("");
    setDestinatarioOptions([]);
    setIsSearchingDestinatario(false);
    setShowDestinatarioOptions(false);
    setStopDestinatarioSearch(false);
    isSelectingDestinatario.current = false;

    setIdDestinatario(0);
    setEmpresa("");
    setPeso("");
    setBultos("");
    setUnidades("");
    setObservaciones("");

    setFecha(new Date().toISOString().split("T")[0]);
  }, []);

  return {
    // N° Orden
    numeroOrden,
    setNumeroOrden,
    isSearchingOrden,
    isOrdenFound,
    resetForm,
    handleOrdenSearch,
    showOrdenConfirm,
    setShowOrdenConfirm,
    pendingOrden,
    handleConfirmOrden,
    customerButtonRef,
    destinoButtonRef,
    numeroOrdenRef,
    centerCostRef,
    origenButtonRef,
    destinatarioInputRef,
    direccionRef,
    empresaRef,
    contenidoRef,
    tipoEnvioRef,
    pesoRef,
    bultosRef,
    unidadesRef,
    observacionesRef,
    grabarButtonRef,
    // Cliente
    customers,
    isLoadingCustomers,
    selectedCustomer,
    selectedCustomerLabel,
    customerSearch,
    setCustomerSearch,
    isCustomerOpen,
    setIsCustomerOpen,
    filteredCustomers,
    handleSelectCustomer,
    // Centro Costo
    centerCosts,
    isLoadingCenterCosts,
    selectedCenterCost,
    selectedCenterCostLabel,
    centerCostSearch,
    setCenterCostSearch,
    isCenterCostOpen,
    setIsCenterCostOpen,
    filteredCenterCosts,
    handleSelectCenterCost,
    // Origen
    selectedOrigen,
    setSelectedOrigen,
    selectedOrigenLabel,
    setSelectedOrigenLabel,
    isUbigeoOpen,
    setIsUbigeoOpen,
    // Destino
    selectedDestino,
    setSelectedDestino,
    selectedDestinoLabel,
    setSelectedDestinoLabel,
    isUbigeoDestinoOpen,
    setIsUbigeoDestinoOpen,
    // Correlativo
    correlativo,
    setCorrelativo,
    // Contenido
    contenidos,
    selectedContenido,
    setSelectedContenido,
    isLoadingContenidos,
    // Tipo de Envio
    tipoEnvios,
    selectedTipoEnvio,
    setSelectedTipoEnvio,
    isLoadingTipoEnvios,
    // Destinatario
    destinatario,
    setDestinatario,
    handleDestinatarioChange,
    direccion,
    setDireccion,
    destinatarioOptions,
    setDestinatarioOptions,
    isSearchingDestinatario,
    showDestinatarioOptions,
    setShowDestinatarioOptions,
    handleSelectDestinatario,
    // Datos de la Guia
    idDestinatario,
    empresa,
    setEmpresa,
    peso,
    setPeso,
    bultos,
    setBultos,
    unidades,
    setUnidades,

    observaciones,
    setObservaciones,
    // Fecha
    fecha,
    setFecha,
    // Grabar orden
    isSaving,
    saveError,
    setSaveError,
    saveSuccess,
    isOrdenFormValid,
    handleSaveOrden,
  };
};
