// Tests E2E : Création d'un étudiant
// Objectif : tester le formulaire de création (validation + succès) avec API mockée.

describe('Écran Création étudiant', () => {
  const authToken = 'fake-jwt-token';

  function visitAsLoggedIn(url) {
    // Helper : simule l'utilisateur connecté via le token attendu par le guard.
    return cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', authToken);
      },
    });
  }

  it("désactive le bouton Créer tant que le formulaire est invalide", () => {
    // Test : les champs requis sont vides -> le bouton 'Créer' doit être désactivé.
    visitAsLoggedIn('/etudiants/new');
    cy.contains('h2', 'Ajouter un étudiant').should('be.visible');
    cy.contains('button', 'Créer').should('be.disabled');

    // Dès qu'on remplit tout, le bouton devient activable.
    cy.get('input[name="firstName"]').type('Serge');
    cy.get('input[name="lastName"]').type('Karamazov');
    cy.get('input[name="email"]').type('s.karamazov@canal.fr');
    cy.contains('button', 'Créer').should('not.be.disabled');
  });

  it("crée un étudiant et redirige vers son détail (succès)", () => {
    // Test : on mocke la création et on vérifie la redirection vers le **détail** (comportement du composant).
    cy.intercept('POST', '/api/etudiants', (req) => {
      expect(req.body).to.deep.include({
        firstName: 'Odile',
        lastName: 'Deray',
        email: 'o.deray@canal.fr',
      });
      req.reply({
        statusCode: 201,
        body: { id: 42, ...req.body },
      });
    }).as('createEtudiant');

    // Après création, on est redirigé vers /etudiants/42 et la page détail recharge l'étudiant.
    cy.intercept('GET', '/api/etudiants/42', {
      statusCode: 200,
      body: { id: 42, firstName: 'Odile', lastName: 'Deray', email: 'o.deray@canal.fr' },
    }).as('getEtudiant');

    visitAsLoggedIn('/etudiants/new');

    cy.get('input[name="firstName"]').type('Odile');
    cy.get('input[name="lastName"]').type('Deray');
    cy.get('input[name="email"]').type('o.deray@canal.fr');
    cy.contains('button', 'Créer').click();

    cy.wait('@createEtudiant');

    // Validation : redirection vers le détail, et affichage des infos.
    cy.url().should('include', '/etudiants/42');
    cy.wait('@getEtudiant');
    cy.contains('h2', 'Détail étudiant').should('be.visible');
    cy.contains('Odile').should('be.visible');
  });
});
