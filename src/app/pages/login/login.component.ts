import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  login = '';
  password = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login({
      login: this.login,	
      password: this.password
    }).subscribe({
      next: (token: string) => {
        this.loading = false;
        this.successMessage = 'Authentification réussie';
        localStorage.setItem('token', token);
      // Redirection vers /étudiants après authentification réussie
        this.router.navigate(['/etudiants']);
      },
      error: (_error: unknown) => {
        this.loading = false;
        this.errorMessage = 'Login ou mot de passe incorrect';
      }
    });
  }
}
