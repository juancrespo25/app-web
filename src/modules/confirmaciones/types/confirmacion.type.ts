export interface ConfirmacionFormData {
  nroCargo: string;
  destinatario: string;
  direccion: string;
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

export interface IGuiaConfirmacionesResponse {
  status: number;
  success: boolean;
  message: string;
  data: IGuiaConfirmacionesDetail;
}

export interface IGuiaConfirmacionesDetail {
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

export interface ISaveConfirmacion {
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

export interface IConfirmacionListItem {
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

export interface IConfirmacionListResponse {
  status: number;
  success: boolean;
  message: string;
  data: IConfirmacionListItem[];
}

// userCreated se agrega en el service a partir de la sesión
export type ConfirmacionSavePayload = Omit<ISaveConfirmacion, "userCreated">;