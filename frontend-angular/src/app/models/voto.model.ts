import { Candidato } from './candidato.model';

export interface VotoResumen {
  id: number;
  voter: { id: number; nombre: string; apellido: string };
  candidate: Candidato;
  voted_at: string;
}

export interface VotoDetalle {
  id: number;
  voted_at: string;
  voter: {
    id: number;
    documento: string;
    tipo: string;
    nombre: string;
    apellido: string;
    dob: string;
    direccion: string;
    telefono: string;
    sexo: string;
  };
  candidate: Candidato;
}

export interface ListadoVotosResponse {
  va_ganando: Candidato | null;
  empate: boolean;
  votos: {
    data: VotoResumen[];
    current_page: number;
    last_page: number;
  };
}