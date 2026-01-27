import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantRequest } from '../../../core/models/etudiant-request.model';

@Component({
  selector: 'app-etudiant-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etudiant-create.component.html'
})
export class EtudiantCreateComponent {
  model: EtudiantRequest = { firstName: '', lastName: '', email: '' };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private etudiantService: EtudiantService, private router: Router) {}

  submit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.etudiantService.create(this.model).subscribe({
      next: (created) => {
        this.loading = false;
        this.successMessage = 'Étudiant créé avec succès';
        // Redirection vers le détail (pratique pour vérifier)
        this.router.navigate(['/etudiants', created.id]);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la création';
      }
    });
  }
}
