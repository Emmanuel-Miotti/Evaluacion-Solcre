export interface NuevoVotante {
  documento: string;
  tipo: 'votante' | 'candidato';
  nombre: string;
  apellido: string;
  dob: string;
  direccion: string;
  telefono: string;
  sexo: 'M' | 'F' | 'Otro';
}