import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListadoVotosResponse, VotoDetalle } from '../models/voto.model';

@Injectable({ providedIn: 'root' })
export class VotosService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  emitirVoto(documento: string, candidatoId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/votos`, {
      documento,
      candidato_id: candidatoId,
    });
  }

  getVotos(pagina: number): Observable<ListadoVotosResponse> {
    return this.http.get<ListadoVotosResponse>(`${this.base}/votos?page=${pagina}`);
  }

  getDetalle(id: number): Observable<VotoDetalle> {
    return this.http.get<VotoDetalle>(`${this.base}/votos/${id}`);
  }
}