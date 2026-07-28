// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  clearMocks: true,
  // isolatedModules ne se configure plus ici depuis ts-jest v29+ : il doit
  // être déclaré dans tsconfig.json ("compilerOptions.isolatedModules": true).
  // Voir le commentaire dans tsconfig.json.
};