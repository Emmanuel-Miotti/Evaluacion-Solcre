import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NuevoVotante } from '../models/votante.model';

@Injectable({ providedIn: 'root' })
export class VotantesService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  agregar(votante: NuevoVotante): Observable<unknown> {
    return this.http.post(`${this.base}/votantes`, votante);
  }
}