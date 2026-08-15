export interface UserFormData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  area: string;
  user: string;
  password: string;
}


export interface UserUpdate {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  area: string;
  user: string;
  password: string;
}


export interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  initialData?: UserFormData | UserUpdate | null;
  isProcessing?: boolean;
}

export interface Area {
  codigo: string;
  descripcion: string;
}

export interface UserTypeInnerResponse {
  status: number;
  success: boolean;
  message: string;
  data: UserTypeResponseDetail[];
}

export interface UserTypeResponse {
  status: number;
  message: string;
  data: UserTypeInnerResponse;
}

export interface UserTypeResponseDetail {
  codigo: string;
  nombre_completo: string;
}