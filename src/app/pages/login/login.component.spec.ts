import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        // On remplace le vrai AuthService par un mock pour piloter les r�ponses (succ�s/erreur)
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Nettoie le localStorage avant chaque test
    localStorage.clear();

    fixture.detectChanges();
  });

  // Test : le composant se crée correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ajouté : en cas de succès, on affiche un message et on stocke le token
  it('onSubmit - succès : stocke le token et affiche un message de succès', () => {
    authService.login.mockReturnValue(of('jwt-token'));

    component.login = 'seb';
    component.password = 'secret';

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({ login: 'seb', password: 'secret' });
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('Authentification réussie');
    expect(localStorage.getItem('token')).toBe('jwt-token');
  });

  // Test ajouté : en cas d'erreur, on affiche un message d'erreur et on stoppe le chargement
  it('onSubmit - erreur : affiche un message d\'erreur', () => {
    authService.login.mockReturnValue(throwError(() => new Error('401')));

    component.login = 'seb';
    component.password = 'bad';

    component.onSubmit();

    expect(component.loading).toBe(false);
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('Login ou mot de passe incorrect');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
