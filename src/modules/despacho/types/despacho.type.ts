export interface IGetByIdGuiaDespachoResponse {
  status: number;
  success: boolean;
  message: string;
  data: DespachoDetail;
}

export interface IGuiaDespachoValidateResponse {
  status: number;
  success: boolean;
  message: string;
  data: IGuiaDespachoValidateResponseDetail;
}

export interface IGuiaDespachoValidateResponseDetail {
  id_guia: number;
  estado: string;
  provincia: string;
  destino: string;
  dnombres: string;
}

export interface DespachoResponse {
  status: number;
  success: boolean;
  message: string;
  data: DespachoResponseDetail[];
}

export interface DespachoResponseDetail {
  id: string;
  agente_name: string;
  provincia: string;
  empresatransporte: string;
  tenvio_name: string;
  fecha_creacion: Date;
  estado: string;
}

export interface DespachoDetailResponse {
  status: number;
  success: boolean;
  message: string;
  data: DespachoDetail;
}

export interface DespachoDetail extends DespachoResponseDetail {
  guias: DespachoGuiaDetail[];
  provincia_code: string;
  status: boolean;
}

export interface DespachoGuiaDetail {
  id_guia: number;
  estado: string;
  provincia: string;
  destino: string;
  dnombres: string;
}

export interface ISaveDespacho {
    agente: number;
    tipoenvio: number;
    empresatransporte: string;
    estado: string;
    status: boolean;
    fecha_creacion: string | Date;
    tipo: number;
    userCreated?: string;
}

export interface IUpdateDespacho {
  id: number;
  userUpdated: string;
  estado: string;
  guias: IUpdateDespachoGuias[];
}

export interface IUpdateDespachoGuias {
  despacho_id: number;
  id_guia: number;
  estado: string;
  userCreated: string;
}