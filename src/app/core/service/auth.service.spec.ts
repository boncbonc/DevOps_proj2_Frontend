import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { LoginRequest } from '../models/LoginRequest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Vérifie : POST /api/login avec le bon body et renvoie le token (réponse texte)
  it('should POST /api/login with expected body and return the token', () => {
    const payload: LoginRequest = { login: 'ninja', password: 'secret' };
    const mockToken = 'jwt-token';

    let received: string | undefined;
    service.login(payload).subscribe((res) => (received = res));

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    // AuthService.login() attend une réponse en texte (string)
    req.flush(mockToken);
    expect(received).toBe(mockToken);
    // Le token est aussi stocké via le tap() dans le service
    expect(service.getToken()).toBe(mockToken);
  });

  // Vérifie : should store and read token from localStorage

  it('should store and read token from localStorage', () => {
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    service.setToken('abc');
    expect(service.getToken()).toBe('abc');
    expect(service.isAuthenticated()).toBe(true);

    // AuthService n'expose pas de clearToken() : la déconnexion se fait via logout()
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
