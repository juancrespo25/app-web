import type { GuiaOrden } from "@/modules/guia/types/guia.type";

export interface GetOrdenResponseDetail {
  id: string;
  numero: number;
  customer: string;
  ccosto: string;
  provincia: string;
  origen: string;
  fecha_registro: Date;
  maxItem: number;
}

export interface GetAllOrdenResponseDetail {
    id: string;
    numero: number;
    customer: string;
    customerDescripcion: string;
    ccosto: string;
    ccostoDescripcion: string;
    provincia: string;
    provinciaDescripcion: string;
    origen: string;
    ubigeoDistrito: string;
    fecha_registro: Date;
    userCreated: string;
    userNombre: string;
    guiaCount: number;
}

export interface GetOrdenResponse {
  status: number;
  message: string;
  data: GetOrdenResponseDetail;
}

export interface GetAllOrdenResponse {
  status: number;
  message: string;
  data: GetAllOrdenResponseDetail[];
}

export interface OrdenSave {
  numero: number;
  customer: string;
  ccosto: string;
  provincia: string;
  origen: string;
  userCreated: string;
  fecha_registro: Date;
  guias: GuiaOrden[];
}
