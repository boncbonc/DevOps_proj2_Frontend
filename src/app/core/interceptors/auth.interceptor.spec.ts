import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Test ajouté : ajoute le header Authorization quand un token est présent
  it("ajoute le header Authorization quand un token est présent", () => {
    authService.setToken('jwt-token');

    http.get('/api/etudiants').subscribe();

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush([]);
  });

  // Test ajouté : n'ajoute pas le header Authorization quand aucun token n'est présent
  it("n'ajoute pas le header Authorization quand aucun token n'est présent", () => {
    // AuthService n'expose pas de clearToken() : la déconnexion se fait via logout()
    authService.logout();

    http.get('/api/etudiants').subscribe();

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
