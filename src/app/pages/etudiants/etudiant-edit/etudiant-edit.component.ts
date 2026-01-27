import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantRequest } from '../../../core/models/etudiant-request.model';

@Component({
  selector: 'app-etudiant-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './etudiant-edit.component.html'
})
export class EtudiantEditComponent implements OnInit {
  id!: number;
  model: EtudiantRequest = { firstName: '', lastName: '', email: '' };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etudiantService: EtudiantService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.etudiantService.getById(this.id).subscribe({
      next: (data) => {
        // On remplit le modèle du formulaire à partir du DTO Response
        this.model = { firstName: data.firstName, lastName: data.lastName, email: data.email };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors du chargement';
      }
    });
  }

  submit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.etudiantService.update(this.id, this.model).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Étudiant mis à jour';
        this.router.navigate(['/etudiants', this.id]);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors de la mise à jour';
      }
    });
  }
}
