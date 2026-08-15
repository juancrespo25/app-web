export interface EmpresaTransporteResponse {
  status: number;
  success: boolean;
  message: string;
  data: EmpresaTransporteResponseDetail[];
}

export interface EmpresaTransporteResponseDetail {
  id: string;
  descripcion: string;
}