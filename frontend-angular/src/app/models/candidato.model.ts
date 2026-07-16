export interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
}

export interface CandidatoResultado extends Candidato {
  votes_received_count: number;
}

export interface VotosPorSexo {
  sexo: string;
  total: number;
}