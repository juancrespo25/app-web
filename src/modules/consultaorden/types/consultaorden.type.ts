export interface EnvioOrden {
  id_guia: number;
  nombres: string;
  direccion: string;
  destino: string;
  estado: string;
}

export interface DetalleOrden {
  numero: number;
  cliente: string;
  centrocosto: string;
  origen: string;
  provincia_cubierta: string;
  fecha_registro: string;
  usuario: string;
  envios: EnvioOrden[];
}

export interface DetalleOrdenResponse {
  status: number;
  success: boolean;
  message: string;
  data: DetalleOrden | null;
}

export interface DetalleGuia {
  numero: number;
  item: number;
  cliente: string;
  ccosto: string;
  origen: string;
  destino: string;
  empresa: string | null;
  fecha_registro: string;
  nombres: string;
  direccion: string;
  observaciones: string | null;
  peso: number;
  bultos: number;
  unidades: number;
  contenido: string | null;
  descripcion: string | null;
  imagen1: string | null;
  imagen2: string | null;
  imagen3: string | null;
  estado: string;
  total_documentos: number;
  usuario: string;
}

export interface DetalleGuiaResponse {
  status: number;
  success: boolean;
  message: string;
  data: DetalleGuia | null;
}
