
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  // Rapport de couverture (HTML et résumé console)
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary'],
  // On compte la couverture uniquement sur le code applicatif (hors bootstrap)
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/main.ts',
    '!src/app/**/polyfills.ts',
    '!src/app/**/test.ts',
    '!src/app/**/app.routes.ts',
  ],
  // Seuil demandé (80%)
  coverageThreshold: {
    global: {
      functions: 80,
      statements: 80,
    },
  },
};
