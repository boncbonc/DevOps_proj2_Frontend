// Test E2E “Login réussi” en ayant ajouté la redirection vers /etudiants que j'avais oublié

describe('Connexion utilisateur', () => {
  beforeEach(() => {
    // Mock strict de l’API de login
    cy.intercept('POST', '/api/login', (req) => {
      expect(req.body).to.deep.equal({
        login: 'serge',
        password: 'RickHunter',
      });

      req.reply({
        statusCode: 200,
        body: 'fake-jwt-token',
      });
    }).as('login');

    // Empêche un appel réel backend après redirection.
    cy.intercept('GET', '/api/etudiants', {
      statusCode: 200,
      body: [],
    }).as('getEtudiants');
  });

  it('se connecte et redirige vers /etudiants', () => {
    cy.visit('/login');

    cy.get('form').should('exist');

    // Template-driven forms → name=
    cy.get('input[name="login"]').should('be.visible').type('serge');
    cy.get('input[name="password"]').should('be.visible').type('RickHunter');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@login');

    // Token stocké
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token');
    });

    // ✅ Redirection attendue
    cy.url().should('include', '/etudiants');

    // Si la page /etudiants appelle l’API, on attend le mock (si intercept activé)
    cy.wait('@getEtudiants');
  });
});

