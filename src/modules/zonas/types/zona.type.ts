export interface ZonaResponse {
  status: number;
  message: string;
  data: ZonaResponseDetail[];
}

export interface ZonaResponseDetail {
    id: string;
    codigo: string;
    descripcion: string;
    estado: boolean;
}