import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: { register: jest.Mock };

  beforeEach(async () => {
    userService = {
      register: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        // On remplace le vrai UserService par un mock pour vérifier l'appel à register()
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // déclenche ngOnInit() et initialise le formulaire
  });

  // Test : le composant se crée correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test ajouté : si le formulaire est invalide, on ne doit pas appeler le service
  it('onSubmit - formulaire invalide : ne lance pas l\'inscription', () => {
    component.registerForm.patchValue({
      firstName: '',
      lastName: '',
      login: '',
      password: '',
    });

    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.registerForm.invalid).toBe(true);
    expect(userService.register).not.toHaveBeenCalled();
  });

  // Test ajouté : si le formulaire est valide, on appelle le service et on affiche une alerte de succès
  it('onSubmit - formulaire valide : appelle register() et affiche une alerte', () => {
    userService.register.mockReturnValue(of(void 0));
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.registerForm.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'pwd',
    });

    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.registerForm.valid).toBe(true);
    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'pwd',
    });

    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  // Test ajouté : onReset réinitialise le formulaire et l'état "submitted"
  it('onReset : remet submitted à false et vide le formulaire', () => {
    component.submitted = true;
    component.registerForm.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'pwd',
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null,
    });
  });
});
