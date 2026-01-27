import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';

import { EtudiantListComponent } from './pages/etudiants/etudiant-list/etudiant-list.component';
import { EtudiantCreateComponent } from './pages/etudiants/etudiant-create/etudiant-create.component';
import { EtudiantDetailComponent } from './pages/etudiants/etudiant-detail/etudiant-detail.component';
import { EtudiantEditComponent } from './pages/etudiants/etudiant-edit/etudiant-edit.component';

/**
 * Routing de l'application.
 * - /login et /register restent publics
 * - toutes les routes /etudiants/** sont protégées par le guard (authGuard)
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'etudiants' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Etudiants (protégé)
  { path: 'etudiants', canActivate: [authGuard], component: EtudiantListComponent },
  { path: 'etudiants/new', canActivate: [authGuard], component: EtudiantCreateComponent },
  { path: 'etudiants/:id', canActivate: [authGuard], component: EtudiantDetailComponent },
  { path: 'etudiants/:id/edit', canActivate: [authGuard], component: EtudiantEditComponent },

  { path: '**', redirectTo: 'etudiants' }
];
