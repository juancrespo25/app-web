export interface getLineaResponse {
  status: number;
  success: boolean;
  message: string;
  data: getLineaResponseDetail[];
}

export interface getLineaResponseDetail {
  id: string;
  descripcion: string;
  estado: boolean;
}
