export interface getMotivoResponse {
  status: number;
  success: boolean;
  message: string;
  data: gesMotivoResponseDetail[];
}

export interface gesMotivoResponseDetail {
  id: string;
  descripcion: string;
  estado: boolean;
  tipo: number;
}
