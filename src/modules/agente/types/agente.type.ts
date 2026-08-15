export interface AgenteResponse {
  status: number;
  success: boolean;
  message: string;
  data: AgenteResponseDetail[];
}

export interface AgenteResponseDetail {
  id: string;
  provincia_agente: string;
}