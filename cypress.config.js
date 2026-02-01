const { defineConfig } = require('cypress');

/**
 * Configuration Cypress (E2E)
 *
 * Les tests supposent que l'application Angular tourne en local sur :
 *   http://localhost:4200
 *
 * Lancement :
 *   - npm run e2e       (headless)
 *   - npm run e2e:open  (UI)
 */
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
  },
});
