import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantResponse } from '../../../core/models/etudiant-response.model';

@Component({
  selector: 'app-etudiant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './etudiant-detail.component.html'
})
export class EtudiantDetailComponent implements OnInit {
  etudiant?: EtudiantResponse;

  loading = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private etudiantService: EtudiantService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.etudiantService.getById(id).subscribe({
      next: (data) => {
        this.etudiant = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ?? 'Erreur lors du chargement du détail';
      }
    });
  }
}
