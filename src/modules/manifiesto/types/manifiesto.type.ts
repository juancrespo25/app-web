export interface GuiaManifiestoValidateResponse {
  status: number;
  success: boolean;
  message: string;
  data: GuiaManifiestoValidateDetail;
}

export interface GuiaManifiestoValidateDetail {
  id_guia: number;
  estado: string;
  provincia: string;
  manifiesto: string;
}

export interface getByidManifiestoResponse {
  status: number;
  success: boolean;
  message: string;
  data: getDetailManifiesto;
}

export interface getDetailManifiesto {
  codigo: string;
  nombre_courier: string;
  estado: string;
  zona_name: string;
  createdAt: Date;
  total: number;
  total_pendientes: number
}

export interface getAllManifiestoResponse {
  status: number;
  message: string;
  data: getAllManifiestoResponseDetail[];
}

export interface getAllManifiestoResponseDetail {
    codigo: string;
    zona: string;
    courier: string;
    estado: string;
    createdAt: Date;
    total: number;
    total_pendientes: number;
    total_entregados: number;
    total_motivados: number;
    total_retorno: number;
}

export interface UpdateManifiesto {
  codigo: string;
  estado: string;
  userUpdated: string;
  guias: UpdateGuiaManifiesto[];
}

export interface UpdateGuiaManifiesto {
  id_guia: number;
  estado: string;
  recibido: string;
  parentesco: string;
  documento: string;
  motivo: string;
  colorpuerta: number;
  suministro: string;
  fecha_descarga: Date;
  hora_descarga: string;
}
export interface saveManifiesto {
  codigo: string;
  zona: string;
  courier: string;
  estado: string;
  userCreated: string;
  guias: GuiaManifiesto[]
}

export interface GuiaManifiesto {
  id_guia: number;
  ordenamiento: number;
  estado: string;
}

