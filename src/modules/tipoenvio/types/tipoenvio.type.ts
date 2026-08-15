export interface getTipoEnvioResponse {
  status: number;
  success: boolean;
  message: string;
  data: getTipoEnvioResponseDetail[];
}

export interface getTipoEnvioResponseDetail {
  id: string;
  descripcion: string;
  estado: boolean;
}
