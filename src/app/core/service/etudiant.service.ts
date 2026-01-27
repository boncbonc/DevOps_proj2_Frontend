import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtudiantRequest } from '../models/etudiant-request.model';
import { EtudiantResponse } from '../models/etudiant-response.model';

/**
 * Service CRUD Etudiants.
 * Toutes les routes passent par l'interceptor, qui ajoute le Bearer token.
 */
@Injectable({ providedIn: 'root' })
export class EtudiantService {
  private http = inject(HttpClient);

  // Base URL de l'API Etudiants (proxy -> back-end)
  private readonly baseUrl = '/api/etudiants';

  list(): Observable<EtudiantResponse[]> {
    return this.http.get<EtudiantResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<EtudiantResponse> {
    return this.http.get<EtudiantResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: EtudiantRequest): Observable<EtudiantResponse> {
    return this.http.post<EtudiantResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: EtudiantRequest): Observable<EtudiantResponse> {
    return this.http.put<EtudiantResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
