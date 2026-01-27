import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

/**
 * Interceptor HTTP :
 * - Ajoute automatiquement le header Authorization: Bearer <JWT>
 *   sur les appels vers /api/** (sauf /api/login et /api/register).
 *
 * Objectif : éviter de répéter ce header dans tous les services.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // On n'ajoute le Bearer token que pour les appels API
  const isApiCall = req.url.startsWith('/api/');
  const isAuthCall = req.url.startsWith('/api/login') || req.url.startsWith('/api/register');

  if (!isApiCall || isAuthCall) {
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    // Pas de token -> on laisse la requête passer telle quelle.
    // Le back-end renverra 401 si nécessaire.
    return next(req);
  }

  // Clone de la requête avec le header Authorization
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
