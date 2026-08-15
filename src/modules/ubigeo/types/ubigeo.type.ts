export interface UbigeoItem {
  codigo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface UbigeoApiResponse {
  status: number;
  message: string;
  data: UbigeoItem[];
}