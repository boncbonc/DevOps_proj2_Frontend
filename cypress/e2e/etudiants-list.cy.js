// Tests E2E : Liste des étudiants
// Objectif : tester le chargement de la liste (succès + erreur) en mockant l'API.

describe('Écran Liste des étudiants', () => {
  const authToken = 'fake-jwt-token';

  function visitAsLoggedIn(url) {
    // Helper : visite une page en simulant un utilisateur connecté.
    return cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', authToken);
      },
    });
  }

  it('affiche les étudiants quand l\'API répond (succès)', () => {
    // Test : l'API renvoie 2 étudiants, on doit les voir dans le tableau.
    cy.intercept('GET', '/api/etudiants', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Serge', lastName: 'Karamazov', email: 's.karamazov@canal.fr' },
        { id: 2, firstName: 'Odile', lastName: 'Deray', email: 'o.deray@canal.fr' },
      ],
    }).as('getEtudiants');

    visitAsLoggedIn('/etudiants');
    cy.wait('@getEtudiants');

    cy.contains('h2', 'Étudiants').should('be.visible');
    cy.contains('td', 'Serge').should('be.visible');
    cy.contains('td', 'Karamazov').should('be.visible');
    cy.contains('Aucun étudiant.').should('not.exist');
  });

  it('affiche un message d\'erreur quand l\'API échoue', () => {
    // Test : l'API renvoie une erreur, l'écran doit afficher un message d'erreur.
    cy.intercept('GET', '/api/etudiants', {
      statusCode: 500,
      body: { message: 'Boom' },
    }).as('getEtudiants');

    visitAsLoggedIn('/etudiants');
    cy.wait('@getEtudiants');

    cy.contains('Boom').should('be.visible');
  });
});
