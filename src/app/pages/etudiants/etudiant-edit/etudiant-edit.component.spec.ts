import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { EtudiantEditComponent } from './etudiant-edit.component';
import { EtudiantService } from '../../../core/service/etudiant.service';
import { EtudiantResponse } from '../../../core/models/etudiant-response.model';
import { EtudiantRequest } from '../../../core/models/etudiant-request.model';

describe('EtudiantEditComponent', () => {
  const etudiantMock: EtudiantResponse = {
    id: 42,
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
  };

  let etudiantService: {
    getById: jest.Mock;
    update: jest.Mock;
  };

  let router: { navigate: jest.Mock };

  beforeEach(async () => {
    etudiantService = {
      getById: jest.fn().mockReturnValue(of(etudiantMock)),
      update: jest.fn().mockReturnValue(of(etudiantMock)),
    };
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      // RouterTestingModule évite les erreurs liées aux directives routerLink
      imports: [EtudiantEditComponent, RouterTestingModule],
      providers: [
        { provide: EtudiantService, useValue: etudiantService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            // RouterLink souscrit à activatedRoute.url : on le fournit pour éviter "subscribe" sur undefined
            url: of([]),
            params: of({ id: '42' }),
            paramMap: of(convertToParamMap({ id: '42' })),
            snapshot: {
              paramMap: convertToParamMap({ id: '42' }),
            },
          },
        },
      ],
    })
      // Dans ce test unitaire, on n'a pas besoin de tester le template.
      // On le simplifie pour éviter que les directives routerLink soient instanciées.
      .overrideComponent(EtudiantEditComponent, {
        set: { template: '<div></div>' },
      })
      .compileComponents();
  });

  // Vérifie : should load student details on init

  it('should load student details on init', () => {
    const fixture = TestBed.createComponent(EtudiantEditComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(etudiantService.getById).toHaveBeenCalledWith(42);
    expect(component.loading).toBe(false);
    // Sur ce composant, errorMessage est une string ("" quand tout va bien)
    expect(component.errorMessage).toBe('');
    // Le modèle (utilisé par le formulaire template-driven) est pré-rempli
    expect(component.model.firstName).toBe('Ada');
  });

  // Test ajouté : should update student and navigate on success
  it('should update student and navigate on success', () => {
    const fixture = TestBed.createComponent(EtudiantEditComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    // Le composant utilise un modèle (FormsModule), pas un FormGroup
    component.model = {
      firstName: 'Ada2',
      lastName: 'Lovelace',
      email: 'ada2@example.com'
    };

    component.submit();

    const expectedRequest: EtudiantRequest = {
      firstName: 'Ada2',
      lastName: 'Lovelace',
      email: 'ada2@example.com',
    };

    expect(etudiantService.update).toHaveBeenCalledWith(42, expectedRequest);
    // Après succès, le composant navigue vers la fiche détail de l'étudiant
    expect(router.navigate).toHaveBeenCalledWith(['/etudiants', 42]);
    expect(component.errorMessage).toBe('');
  });

  // Test ajouté : should set error message when update fails
  it('should set error message when update fails', () => {
    etudiantService.update.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Erreur API' } }))
    );

    const fixture = TestBed.createComponent(EtudiantEditComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.model = {
      firstName: 'Ada2',
      lastName: 'Lovelace',
      email: 'ada2@example.com'
    };

    component.submit();

    expect(component.errorMessage).toContain('Erreur API');
  });
});
