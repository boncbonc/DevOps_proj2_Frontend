import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantResponse } from '../../../core/models/etudiant-response.model';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-etudiant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './etudiant-list.component.html'
})
export class EtudiantListComponent implements OnInit {
  etudiants: EtudiantResponse[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private etudiantService: EtudiantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  /**
   * Charge la liste depuis le back-end.
   */
  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.etudiantService.list().subscribe({
      next: (data: EtudiantResponse[]) => {
        this.etudiants = data;
        this.loading = false;
      },
      error: (err: unknown) => {
		const httpErr = err as HttpErrorResponse;
			this.errorMessage =
			(httpErr.error as any)?.message ??httpErr.message ??'Erreur lors du chargement des étudiants';
	  }
    });
  }

  /**
   * Supprime un étudiant puis recharge la liste.
   */
  delete(id: number): void {
    if (!confirm('Supprimer cet étudiant ?')) return;

    this.loading = true;
    this.errorMessage = '';

    this.etudiantService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la suppression';
      }
    });
  }

  /**
   * Bouton déconnexion (supprime le token).
   */
  logout(): void {
    this.authService.logout();
    // On laisse la redirection aux guards / routes (simple)
    window.location.href = '/login';
  }
}
