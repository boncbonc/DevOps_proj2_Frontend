import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

// Groupe de tests : AppComponent
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  // Cas de test : should create the app
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // Vérification (assertion) : on attend le résultat ci-dessous
    expect(app).toBeTruthy();
  });

  // Cas de test : should have the 
  it(`should have the 'etudiant-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // Vérification (assertion) : on attend le résultat ci-dessous
    expect(app.title).toEqual('etudiant-frontend');
  });
});
