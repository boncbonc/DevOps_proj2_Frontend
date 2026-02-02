describe('Inscription (Register)', () => {
  it("permet de créer un compte via le formulaire d'inscription", () => {
    // Mock de l'API : on intercepte le POST /api/register et on renvoie un succès.
    cy.intercept('POST', '/api/register', (req) => {
      // On vérifie aussi que le front envoie bien les champs attendus
      expect(req.body).to.deep.equal({
        firstName: 'Serge',
        lastName: 'Karamazov',
        login: 'serge',
        password: 'RickHunter',
      });

      req.reply({ statusCode: 200, body: {} });
    }).as('register');

    // On espionne l'alerte de succès
    cy.on('window:alert', (text) => {
      expect(text).to.equal('SUCCESS!! :-)');
    });

    cy.visit('/register');

    // Remplir le formulaire (sélecteurs stables : formControlName)
    cy.get('input[formcontrolname="firstName"]').type('Serge');
    cy.get('input[formcontrolname="lastName"]').type('Karamazov');
    cy.get('input[formcontrolname="login"]').type('serge');
    cy.get('input[formcontrolname="password"]').type('RickHunter');

    // Soumettre
    cy.contains('button', 'Register').click();

    // Attendre l'appel API mocké
    cy.wait('@register');
  });
});
