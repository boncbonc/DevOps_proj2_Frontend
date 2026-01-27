import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';

/**
 * Service d'authentification.
 * - Appelle le back-end (/api/login)
 * - Centralise le stockage / lecture du JWT dans le navigateur
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Clé unique pour stocker le JWT (évite les "magic strings" partout)
  private readonly TOKEN_KEY = 'auth_token';

  /**
   * Appelle l'API de login.
   * Le back-end retourne un JWT en texte (string).
   */
  login(payload: LoginRequest): Observable<string> {
    return this.http.post('/api/login', payload, { responseType: 'text' }).pipe(
      // IMPORTANT : on sauvegarde le token dès qu'il est reçu
      tap((token) => this.setToken(token))
    );
  }

  /**
   * Retourne le JWT si présent.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Indique si l'utilisateur est connecté (JWT présent).
   * (On reste volontairement simple pour ce projet : présence du token = connecté.)
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Sauvegarde du token.
   * (Méthode isolée : facile à modifier si on change de stratégie de stockage.)
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Déconnexion : suppression du token.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
