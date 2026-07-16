import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidato, CandidatoResultado, VotosPorSexo } from '../models/candidato.model';

@Injectable({ providedIn: 'root' })
export class CandidatosService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(`${this.base}/candidatos`);
  }

  getMasVotados(): Observable<CandidatoResultado[]> {
    return this.http.get<CandidatoResultado[]>(`${this.base}/candidatos-mas-votados`);
  }

  getEstadisticasSexo(): Observable<VotosPorSexo[]> {
    return this.http.get<VotosPorSexo[]>(`${this.base}/estadisticas-sexo`);
  }
}