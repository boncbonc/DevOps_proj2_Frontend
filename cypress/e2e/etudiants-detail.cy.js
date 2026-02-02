// Tests E2E : Détail d'un étudiant
// Objectif : vérifier l'affichage du détail (succès + erreur) via API mockée.

describe('Écran Détail étudiant', () => {
  const authToken = 'fake-jwt-token';

  function visitAsLoggedIn(url) {
    // Helper : simule un utilisateur connecté.
    return cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', authToken);
      },
    });
  }

  it('affiche les informations quand l\'API répond (succès)', () => {
    // Test : l'API renvoie un étudiant -> l'écran affiche prénom/nom/email.
    cy.intercept('GET', '/api/etudiants/1', {
      statusCode: 200,
      body: { id: 1, firstName: 'Serge', lastName: 'Karamazov', email: 's.karamazov@canal.fr' },
    }).as('getEtudiant');

    visitAsLoggedIn('/etudiants/1');
    cy.wait('@getEtudiant');

    cy.contains('h2', 'Détail étudiant').should('be.visible');
    cy.contains('Prénom').should('be.visible');
    cy.contains('Serge').should('be.visible');
    cy.contains('Karamazov').should('be.visible');
    cy.contains('s.karamazov@canal.fr').should('be.visible');
  });

  it('affiche un message d\'erreur quand l\'API échoue', () => {
    // Test : l'API renvoie 404 -> l'écran affiche le message.
    cy.intercept('GET', '/api/etudiants/999', {
      statusCode: 404,
      body: { message: 'Introuvable' },
    }).as('getEtudiant');

    visitAsLoggedIn('/etudiants/999');
    cy.wait('@getEtudiant');

    cy.contains('Introuvable').should('be.visible');
  });
});
