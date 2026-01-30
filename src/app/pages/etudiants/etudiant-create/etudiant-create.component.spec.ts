import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EtudiantCreateComponent } from './etudiant-create.component';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantRequest } from '../../../core/models/etudiant-request.model';

describe('EtudiantCreateComponent', () => {
  const etudiantServiceMock = {
    create: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [EtudiantCreateComponent],
      providers: [
        { provide: EtudiantService, useValue: etudiantServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  // Test ajouté : should create an etudiant and navigate to list on success
  it('should create an etudiant and navigate to list on success', () => {
    etudiantServiceMock.create.mockReturnValue(of({ id: 1 }));
    const fixture = TestBed.createComponent(EtudiantCreateComponent);
    const component = fixture.componentInstance;

    const payload: EtudiantRequest = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    };

    component.model = payload;
    component.submit();

    expect(etudiantServiceMock.create).toHaveBeenCalledWith(payload);
    expect(component.loading).toBe(false);
    expect(component.successMessage).toContain('créé');
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  // Test ajouté : should show an error message when create fails
  it('should show an error message when create fails', () => {
    etudiantServiceMock.create.mockReturnValue(
      throwError(() => ({ error: { message: 'Erreur backend' } }))
    );

    const fixture = TestBed.createComponent(EtudiantCreateComponent);
    const component = fixture.componentInstance;

    component.model = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
    };
    component.submit();

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Erreur backend');
  });
});
