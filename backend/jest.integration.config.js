// jest.integration.config.js
// Configuration Jest DÉDIÉE aux tests d'intégration
module.exports = {
  preset: 'ts-jest', // compile le TypeScript à la volée pour l'exécution des tests
  testEnvironment: 'node', // environnement Node.js (pas de DOM, ce sont des tests backend)
  rootDir: '.', // racine du projet = dossier où se trouve ce fichier
  testMatch: ['<rootDir>/tests/integration/**/*.integration.test.ts'], // ne cible QUE les fichiers *.integration.test.ts
  setupFiles: ['<rootDir>/tests/integration/jest.setup.ts'], // charge .env.test avant chaque suite de tests
  testTimeout: 20000, // les vrais appels réseau/DB sont plus lents qu'un mock, on augmente le délai par défaut (5s)
  maxWorkers: 1, // exécute les fichiers de test un par un : évite que deux tests en parallèle se "nettoient" mutuellement la même base
};