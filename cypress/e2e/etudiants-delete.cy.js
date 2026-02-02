// Tests E2E : Suppression d'un étudiant
// Objectif : tester les 2 branches du confirm() (oui/non) et l'appel DELETE.

describe('Suppression depuis la liste', () => {
  const authToken = 'fake-jwt-token';

  function visitAsLoggedIn(url) {
    return cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', authToken);
      },
    });
  }

  it('supprime un étudiant quand confirm() retourne true', () => {
    // Test : si l'utilisateur confirme, on appelle DELETE puis on recharge la liste.
    cy.on('window:confirm', () => true);

    // Première charge de liste : 1 étudiant
    cy.intercept('GET', '/api/etudiants', {
      statusCode: 200,
      body: [{ id: 1, firstName: 'Serge', lastName: 'Karamazov', email: 's.karamazov@canal.fr' }],
    }).as('getEtudiants1');

    // Suppression
    cy.intercept('DELETE', '/api/etudiants/1', {
      statusCode: 204,
      body: {},
    }).as('deleteEtudiant');

    // Recharge après suppression : liste vide
    let callCount = 0;
    cy.intercept('GET', '/api/etudiants', (req) => {
      callCount += 1;
      if (callCount === 1) {
        req.reply({ statusCode: 200, body: [{ id: 1, firstName: 'Serge', lastName: 'Karamazov', email: 's.karamazov@canal.fr' }] });
      } else {
        req.reply({ statusCode: 200, body: [] });
      }
    }).as('getEtudiants');

    visitAsLoggedIn('/etudiants');
    cy.wait('@getEtudiants');

    // On clique sur le bouton Supprimer
    cy.contains('tr', 'Serge').within(() => {
      cy.contains('button', 'Supprimer').click();
    });

    cy.wait('@deleteEtudiant');
    cy.wait('@getEtudiants');

    cy.contains('Aucun étudiant.').should('be.visible');
  });

  it('ne supprime pas quand confirm() retourne false', () => {
    // Test : si l'utilisateur annule, aucun appel DELETE n'est fait.
    cy.on('window:confirm', () => false);

    cy.intercept('GET', '/api/etudiants', {
      statusCode: 200,
      body: [{ id: 2, firstName: 'Odile', lastName: 'Deray', email: 'o.deray@canal.fr' }],
    }).as('getEtudiants');

    // On met un intercept DELETE pour pouvoir vérifier qu'il n'est PAS appelé
    cy.intercept('DELETE', '/api/etudiants/2', {
      statusCode: 204,
      body: {},
    }).as('deleteEtudiant');

    visitAsLoggedIn('/etudiants');
    cy.wait('@getEtudiants');

    cy.contains('tr', 'Odile').within(() => {
      cy.contains('button', 'Supprimer').click();
    });

    // Petite pause pour laisser le temps à l'app de potentiellement appeler DELETE
    cy.wait(300);

    // Vérifie qu'aucune requête DELETE n'a été faite
    cy.get('@deleteEtudiant.all').should('have.length', 0);

    // L'étudiant est toujours visible
    cy.contains('td', 'Odile').should('be.visible');
  });
});
