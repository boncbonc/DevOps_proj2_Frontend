/**
 * Tests E2E Cypress – Écran d’édition d’un étudiant
 *
 * Objectifs :
 * - Vérifier que le formulaire est pré-rempli avec les données de l’étudiant
 * - Vérifier la mise à jour réussie d’un étudiant (succès)
 * - Vérifier l’affichage d’une erreur si la mise à jour échoue
 *
 * Tous les appels API sont mockés (aucun backend réel).
 */

describe("Écran Édition étudiant", () => {
  const authToken = "fake-jwt-token";

  /**
   * Simule un utilisateur connecté : on met un token dans le localStorage
   * avant que l'application Angular ne se charge.
   */
  function visitAsLoggedIn(url) {
    return cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem("auth_token", authToken);
      },
    });
  }

  it("pré-remplit le formulaire puis enregistre et revient sur le détail (succès)", () => {
    /**
     * Ici on garde un "état" en mémoire dans le test.
     * Quand le PUT réussit, on met à jour cet état.
     * Ainsi, le GET du détail après redirection affichera les nouvelles données.
     */
    const etudiantStore = {
      1: {
        id: 1,
        firstName: "Serge",
        lastName: "Karamazov",
        email: "s.karamazov@canal.fr",
      },
    };

    // Mock GET /api/etudiants/:id (renvoie toujours la donnée courante du store)
    cy.intercept("GET", /\/api\/etudiants\/(\d+)(\?.*)?$/, (req) => {
      const id = Number(req.url.match(/\/api\/etudiants\/(\d+)/)?.[1]);
      req.reply({ statusCode: 200, body: etudiantStore[id] });
    }).as("getEtudiant");

    // Mock PUT /api/etudiants/1 (met à jour le store)
    cy.intercept("PUT", /\/api\/etudiants\/1(\?.*)?$/, (req) => {
      // Vérifie que le front envoie bien les nouvelles valeurs
      expect(req.body).to.deep.include({
        firstName: "Serge2",
        lastName: "Karamazov",
        email: "s2.karamazov@canal.fr",
      });

      // Met à jour l'état "mocké" (comme si le backend avait sauvegardé)
      etudiantStore[1] = { ...etudiantStore[1], ...req.body };

      // Réponse 200 OK
      req.reply({ statusCode: 200, body: etudiantStore[1] });
    }).as("updateEtudiant");

    // Mock liste (utile si l'app la recharge quelque part)
    cy.intercept("GET", /\/api\/etudiants(\?.*)?$/, {
      statusCode: 200,
      body: Object.values(etudiantStore),
    }).as("getEtudiants");

    // Aller sur l'écran d'édition
    visitAsLoggedIn("/etudiants/1/edit");
    cy.url().should("include", "/etudiants/1/edit");

    // Vérifie que le formulaire est visible
    cy.get('input[name="firstName"]').should("be.visible");

    // Vérifie le pré-remplissage
    cy.get('input[name="firstName"]').should("have.value", "Serge");
    cy.get('input[name="email"]').should("have.value", "s.karamazov@canal.fr");

    // Modifie le formulaire
    cy.get('input[name="firstName"]').clear().type("Serge2");
    cy.get('input[name="email"]').clear().type("s2.karamazov@canal.fr");

    // Soumet le formulaire
    cy.contains("button", "Enregistrer").click();

    // Vérifie que l'API PUT est bien appelée
    cy.wait("@updateEtudiant");

    // Vérifie la redirection vers le détail
    cy.url().should("include", "/etudiants/1");

    /**
     * Important :
     * la page détail va souvent refaire un GET /api/etudiants/1
     * => on attend le GET, puis on vérifie l'affichage.
     */
    cy.wait("@getEtudiant");

    // Vérifie que la page détail affiche bien la donnée mise à jour
    cy.contains("s2.karamazov@canal.fr").should("be.visible");
  });

  it("affiche une erreur si la mise à jour échoue", () => {
    // Mock GET étudiant 2
    cy.intercept("GET", /\/api\/etudiants\/2(\?.*)?$/, {
      statusCode: 200,
      body: {
        id: 2,
        firstName: "Odile",
        lastName: "Deray",
        email: "o.deray@canal.fr",
      },
    }).as("getEtudiant2");

    // Mock PUT étudiant 2 en erreur
    cy.intercept("PUT", /\/api\/etudiants\/2(\?.*)?$/, {
      statusCode: 500,
      body: { message: "Erreur serveur" },
    }).as("updateEtudiant2");

    visitAsLoggedIn("/etudiants/2/edit");
    cy.url().should("include", "/etudiants/2/edit");

    // Modifie un champ puis enregistre
    cy.get('input[name="email"]').should("be.visible").clear().type("o2.deray@canal.fr");
    cy.contains("button", "Enregistrer").click();

    // Vérifie l'appel PUT
    cy.wait("@updateEtudiant2");

    // Vérifie l'erreur affichée
    cy.contains("Erreur serveur").should("be.visible");

    // Vérifie qu'on reste sur la page d'édition
    cy.url().should("include", "/etudiants/2/edit");
  });
});
