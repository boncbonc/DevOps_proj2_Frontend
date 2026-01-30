import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { EtudiantListComponent } from './etudiant-list.component';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { AuthService } from '../../../core/service/auth.service';
import { EtudiantResponse } from '../../../core/models/etudiant-response.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('EtudiantListComponent', () => {
  const etudiants: EtudiantResponse[] = [
    { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
  ];

  let etudiantServiceMock: { list: jest.Mock; delete: jest.Mock };
  let authServiceMock: { logout: jest.Mock };

  beforeEach(async () => {
    etudiantServiceMock = {
      list: jest.fn().mockReturnValue(of(etudiants)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };

    authServiceMock = {
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      // RouterTestingModule évite les erreurs liées aux directives routerLink dans le template
      imports: [EtudiantListComponent, RouterTestingModule],
      providers: [
        { provide: EtudiantService, useValue: etudiantServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        // RouterLink injecte ActivatedRoute : on fournit un stub minimal pour les tests
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([]),
            params: of({}),
            queryParams: of({}),
            fragment: of(null),
            data: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  // Test ajouté : should load students on init
  it('should load students on init', () => {
    const fixture = TestBed.createComponent(EtudiantListComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges(); // ngOnInit

    expect(etudiantServiceMock.list).toHaveBeenCalledTimes(1);
    expect(component.etudiants).toEqual(etudiants);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  // Test ajouté : should display an error message when list fails
  it('should display an error message when list fails', () => {
    const err = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      url: '/api/etudiants',
      error: { message: 'Boom' },
    });
    etudiantServiceMock.list.mockReturnValueOnce(throwError(() => err));

    const fixture = TestBed.createComponent(EtudiantListComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Boom');
  });

  // Test ajouté : should call delete and reload when confirm is true
  it('should call delete and reload when confirm is true', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    const fixture = TestBed.createComponent(EtudiantListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const loadSpy = jest.spyOn(component, 'load');
    component.delete(1);

    expect(etudiantServiceMock.delete).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
  });

  // Test ajouté : should not delete when confirm is false
  it('should not delete when confirm is false', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    const fixture = TestBed.createComponent(EtudiantListComponent);
    const component = fixture.componentInstance;

    component.delete(1);

    expect(etudiantServiceMock.delete).not.toHaveBeenCalled();
  });
});
