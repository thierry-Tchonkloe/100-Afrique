// tests/integration/jest.setup.ts
//
// Ce fichier est chargé par Jest AVANT tout test d'intégration (voir
// "setupFiles" dans jest.integration.config.js). Son seul rôle : injecter
// les variables d'environnement du fichier .env.test dans process.env,
// AVANT que `new PrismaClient()` ne soit exécuté dans les fichiers de test.
//
// Sans ça, PrismaClient utiliserait le DATABASE_URL du .env "normal"
// (dev/prod) et les tests risqueraient de supprimer de vraies données.

import dotenv from 'dotenv'; // même librairie que celle déjà utilisée dans src/config/env.ts
import path from 'path'; // pour construire un chemin absolu fiable vers .env.test

dotenv.config({
  path: path.resolve(__dirname, '../../.env.test'), // remonte de tests/integration/ vers la racine du projet
});