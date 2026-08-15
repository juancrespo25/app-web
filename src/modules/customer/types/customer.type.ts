export interface CustomerSave {
    descripcion: string;
    ruc: string;
    direccion: string;
    ubigeo: string;
    contacto: string;
    email: string;
    telefono: string;
    status: boolean;
    user: string;
    password: string;
}
export interface CustomerData  extends CustomerSave {
    codigo: string;
}

export interface CustomerOption {
    codigo: string;
    descripcion: string;
}

export interface CustomerFromProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: CustomerSave) => void;
    initialData?: CustomerSave | CustomerData | null;
    isProcessing?: boolean;
}