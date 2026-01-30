import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { EtudiantDetailComponent } from './etudiant-detail.component';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantResponse } from '../../../core/models/etudiant-response.model';

describe('EtudiantDetailComponent', () => {
  const etudiantServiceMock = {
    getById: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EtudiantDetailComponent, RouterTestingModule],
      providers: [
        { provide: EtudiantService, useValue: etudiantServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '42' }),
            },
          },
        },
      ],
    });
  });

  // Test ajouté : should load student detail on init
  it('should load student detail on init', () => {
    const dto: EtudiantResponse = { id: 42, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' };
    etudiantServiceMock.getById.mockReturnValue(of(dto));

    const fixture = TestBed.createComponent(EtudiantDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(etudiantServiceMock.getById).toHaveBeenCalledWith(42);
    expect(component.loading).toBe(false);
    expect(component.etudiant).toEqual(dto);
  });

  // Test ajouté : should expose an error message when API fails
  it('should expose an error message when API fails', () => {
    etudiantServiceMock.getById.mockReturnValue(
      throwError(() => ({ error: { message: 'Boom' } }))
    );

    const fixture = TestBed.createComponent(EtudiantDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toContain('Boom');
  });
});
