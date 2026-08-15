export interface getContenidoResponse {
  status: number;
  success: boolean;
  message: string;
  data: getContenidoResponseDetail[];
}

export interface getContenidoResponseDetail {
  id: string;
  descripcion: string;
  estado: boolean;
}
