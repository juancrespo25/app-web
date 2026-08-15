export interface getDestinatarioResponse {
  status: number;
  message: string;
  data: GetDestinatarioResponseDetail[];
}

export interface GetDestinatarioResponseDetail {
  id: string;
  nombre: string;
  nombres?: string;
  ubigeo: string;
  direccion: string;
}
