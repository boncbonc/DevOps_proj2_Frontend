import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

describe('authGuard', () => {
  // Test ajouté : should allow navigation when user is authenticated
  it('should allow navigation when user is authenticated', () => {
    const authServiceMock = { isAuthenticated: jest.fn(() => true) } as unknown as AuthService;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // Test ajouté : should redirect to /login when user is not authenticated
  it('should redirect to /login when user is not authenticated', () => {
    const authServiceMock = { isAuthenticated: jest.fn(() => false) } as unknown as AuthService;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', component: class Dummy {} }]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();

    // UrlTree correspond à la redirection
    expect(router.serializeUrl(result as any)).toBe('/login');
  });
});
