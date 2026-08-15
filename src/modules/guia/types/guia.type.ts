export interface GuiaOrden {
    id_guia: number;
    item: number;
    empresa: string;
    destinatario: number;
    destinatario_name: string;
    direccion: string;
    tarifa: number;
    peso: number;
    bultos: number;
    unidades: number;
    origen: string;
    destino: string;
    tenvio: number;
    contenido: string;
    observaciones: string;
    estado: string;
    digitalizado: boolean;
}

export interface Guia {
    id_guia: number;
    orden: string;
    item: number;
    empresa: string;
    destinatario: number;
    destinatario_name: string;
    direccion: string;
    tarifa: number;
    peso: number;
    bultos: number;
    unidades: number;
    origen: string;
    destino: string;
    tenvio: number;
    contenido: string;
    observaciones: string;
    estado: string;
    digitalizado: boolean;
    userCreated: string;
    customer: string;
    ccosto: string;
}

export interface ValidateGuia {
    status: number;
    success: boolean;
    message: string;
    data: ValidateGuiaDetails;
}

export interface ValidateGuiaDetails {
    id_guia: number;
    destinatario_name: string;
    destino: string;
    estado: string;
    customer: string;
    ccosto: string;
    provincia: string;
}