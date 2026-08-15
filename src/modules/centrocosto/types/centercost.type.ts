export interface CentroCostoSave {
    descripcion: string;
    cliente: string;
    status: boolean;
    contacto: string;
    email: string;
    telefono: string;
    user: string;
    password: string;
}

export interface CentroCostoData extends CentroCostoSave {
    codigo: string;
}

export interface CentroCostoFromProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CentroCostoSave) => void;
    initialData?: CentroCostoSave | CentroCostoData | null;
    isProcessing?: boolean;
    selectedCustomer: string;
}
