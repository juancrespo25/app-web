export interface FiltrosEnvios {
  fecha_inicial: string;
  fecha_final: string;
  estado?: string;
  origen?: string;
  destino?: string;
  numero?: string;
  numero_documento?: string;
  customer?: string;
  ccosto?: string;
  nombre?: string;
}

export interface EnvioPorCliente {
  id_guia: number;
  cliente: string;
  ccosto: string;
  nombres: string;
  direccion: string;
  destino: string;
  fecha_registro: string;
  estado: string;
  total_documentos: number;
}

export interface EnviosPorClienteResponse {
  status: number;
  success: boolean;
  message: string;
  data: EnvioPorCliente[];
}
