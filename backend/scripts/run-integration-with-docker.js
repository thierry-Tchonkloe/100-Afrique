#!/usr/bin/env node
// scripts/run-integration-with-docker.js

// Orchestration COMPLÈTE des tests d'intégration avec Docker :
//   1. Démarre un conteneur PostgreSQL jetable (docker-compose.test.yml)
//   2. Applique le schéma Prisma dessus
//   3. Lance les tests d'intégration
//   4. Détruit le conteneur — QUE LES TESTS AIENT RÉUSSI OU ÉCHOUÉ (finally)

const { execSync } = require('child_process');

// URL de connexion vers le conteneur jetable (doit correspondre à
// docker-compose.test.yml : port 5433, user/password/db définis dedans).
const DATABASE_URL = 'postgresql://postgres:root@localhost:5433/itourisme_nomade_test';
const COMPOSE_FILE = 'docker-compose.test.yml';

// Exécute une commande en affichant sa sortie en direct dans ce terminal.
function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL },
  });
}

function up() {
  run(`docker compose -f ${COMPOSE_FILE} up -d --wait`);
}

function down() {
  run(`docker compose -f ${COMPOSE_FILE} down -v`);
}

function migrate() {
  run('npx prisma migrate deploy'); // applique le schéma Prisma sur la base fraîchement créée
}

function test() {
  run('npx jest --config jest.integration.config.js'); // lance la vraie suite de tests
}

try {
  up();
  migrate();
  test();
  console.log("\n✅ Tests d'intégration réussis.");
} catch (err) {
  console.error("\n❌ Les tests d'intégration ont échoué.");
  process.exitCode = 1; // on mémorise l'échec SANS sortir tout de suite, pour laisser le "finally" nettoyer
} finally {
  console.log('\n🧹 Destruction du conteneur de test...');
  down(); // le conteneur est TOUJOURS détruit, que les tests aient réussi ou échoué
}