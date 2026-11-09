export interface IDescargaListItem {
  id: string;
  id_guia: number;
  fecha_descarga: string;
  hora_descarga: string;
  item: number;
  guia_estado: string;
  orden: number;
  cliente: string;
  centrocosto: string;
  destino: string;
  usuario: string;
}

export interface IDescargaListResponse {
  status: number;
  success: boolean;
  message: string;
  data: IDescargaListItem[];
}

export interface DescargaFormData {
  nroCargo: string;
  fecha: string;
  cliente: string;
  cCosto: string;
  origen: string;
  estado: string;
  destino: string;
  contenido: string;
  tEnvio: string;
  peso: string;
  bultos: string;
  unidades: string;
  cantidadDocadjuntos: number;
}

export interface IGuiaDescargaResponseDetail{
  status: number;
  success: boolean;
  message: string;
  data: IGuiaDescargaDetail;
}

export interface IGuiaDescargaDetail {
    id_guia: number;
    estado: string;
    tipo: string;
    recibido: string;
    parentesco: string;
    documento: string;
    motivo: string;
    puerta: number | string;
    colorpuerta: string;
    suministro: string;
    fecha_descarga: Date;
    hora_descarga: string;
}

export interface IGuiaDescargaResponse {
  status: number;
  success: boolean;
  message: string;
  data:GuiaDescargaRDetail;
}

export interface GuiaDescargaRDetail {
  destinatario_name: string;
  direccion: string;
  peso: number;
  bultos: number;
  unidades: number;
  origen: string;
  destino: string;
  tenvio: number;
  contenido: string;
  estado: string;
  fecha: string;
  customer: string;
  ccosto: string;
  provincia: string;
  cantidad_docadjuntos: number;
}

export interface ISaveDescarga {
  id_guia: number;
  estado: string;
  tipo: string;
  recibido: string;
  parentesco: string;
  documento: string;
  motivo: string;
  puerta: number;
  colorpuerta: string;
  suministro: string;
  fecha_descarga: string;
  hora_descarga: string;
  userCreated: string;
}

// userCreated se agrega en el service a partir de la sesión
export type DescargaSavePayload = Omit<ISaveDescarga, "userCreated">;


