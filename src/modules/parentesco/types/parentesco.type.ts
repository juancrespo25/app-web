export interface getParentescoResponse {
  status: number;
  success: boolean;
  message: string;
  data: gesParentescoResponseDetail[];
}

export interface gesParentescoResponseDetail {
  id: string;
  descripcion: string;
  estado: boolean;
}
