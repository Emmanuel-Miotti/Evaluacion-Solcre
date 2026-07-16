import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface CambiarClavePayload {
  clave_actual: string;
  clave_nueva: string;
  clave_nueva_confirmation: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  cambiarClave(payload: CambiarClavePayload): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.base}/clave`, payload);
  }
}