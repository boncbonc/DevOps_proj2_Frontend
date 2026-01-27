import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

/**
 * Guard :
 * - Empêche l'accès aux écrans "Etudiants" si l'utilisateur n'est pas connecté.
 * - Redirige vers /login.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirection si non authentifié
  return router.parseUrl('/login');
};
