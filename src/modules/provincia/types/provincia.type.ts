export interface Provincia {
  codigo: string;
  descripcion: string;
}

export interface ProvinciaResponse {
  status: number;
  message: string;
  data: Provincia[];
}
