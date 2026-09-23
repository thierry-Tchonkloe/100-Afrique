// tests/integration/emploi/auth.integration.test.ts
//
// Tests D'INTÉGRATION du module auth.
// Différence avec tests/emploi/auth.service.test.ts (tests unitaires) :
// ici, AUCUN repository n'est mocké. On utilise une vraie connexion Prisma
// vers une base PostgreSQL dédiée aux tests (voir .env.test), donc on
// vérifie le comportement réel du service + du repository + des
// contraintes de la base (ex : unicité de l'email) de bout en bout.

import { PrismaClient } from '@prisma/client'; // client Prisma réel (pas de mock)
import { authService } from '../../../src/modules/emploi/auth/auth.service'; // service testé tel quel
import { ConflictError, UnauthorizedError } from '../../../src/errors/http-errors'; // erreurs métier attendues

// Instance Prisma dédiée à ce fichier de test. Elle se connecte à l'URL
// définie par DATABASE_URL dans .env.test (chargé par jest.setup.ts),
// PAS à la base de développement.
const prisma = new PrismaClient();

// Supprime toutes les données créées par ces tests, dans l'ordre qui
// respecte les clés étrangères (les tables "enfants" avant les "parents").
// Objectif : que chaque test parte d'une base vide, donc indépendant
// des autres tests (pas d'ordre imposé, pas d'effet de bord).
async function cleanDatabase(): Promise<void> {
  await prisma.recruteurEtablissement.deleteMany(); // dépend de EmploiUser + Etablissement
  await prisma.vitrine.deleteMany(); // dépend de Etablissement
  await prisma.etablissement.deleteMany();
  await prisma.candidatProfil.deleteMany(); // dépend de EmploiUser
  await prisma.emploiSettings.deleteMany(); // dépend de EmploiUser
  await prisma.emploiUser.deleteMany(); // en dernier : plus aucune table n'en dépend
}

// Avant CHAQUE test ("it"), on repart d'une base propre.
beforeEach(async () => {
  await cleanDatabase();
});

// Une fois TOUS les tests de ce fichier terminés : on nettoie une dernière
// fois (pour ne rien laisser traîner) puis on ferme la connexion Prisma
// (sinon Jest peut rester bloqué en attente de la connexion ouverte).
afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe('authService.register (intégration)', () => {
  it('cas nominal : crée un candidat réel en base avec un mot de passe hashé (jamais en clair)', async () => {
    // Appel du service réel, sans mock : il va vraiment écrire en base.
    const result = await authService.register({
      email: 'candidat@test.com',
      password: 'password123',
      firstName: 'Awa',
      lastName: 'Koné',
      role: 'CANDIDAT',
    });

    expect(result.token).toBeDefined(); // un vrai JWT a été signé (JWT_SECRET vient de .env.test)
    expect(result.user.email).toBe('candidat@test.com'); // les infos renvoyées correspondent à la saisie

    // On vérifie directement EN BASE (pas via le service) que l'utilisateur existe réellement.
    const userInDb = await prisma.emploiUser.findUnique({ where: { email: 'candidat@test.com' } });
    expect(userInDb).not.toBeNull(); // l'utilisateur a bien été persisté
    expect(userInDb!.password).not.toBe('password123'); // le mot de passe stocké n'est PAS le mot de passe en clair
    expect(userInDb!.password.startsWith('$2b$')).toBe(true); // préfixe standard d'un hash bcrypt

    // Un candidat doit avoir un CandidatProfil auto-créé (voir emploiUserRepository.create).
    const profil = await prisma.candidatProfil.findUnique({ where: { userId: userInDb!.id } });
    expect(profil).not.toBeNull(); // le profil candidat a bien été créé en cascade
  });

  it("cas d'échec : refuse une inscription avec un email déjà utilisé, sans créer de doublon en base", async () => {
    // Première inscription : doit réussir normalement.
    await authService.register({
      email: 'existe@test.com',
      password: 'password123',
      firstName: 'A',
      lastName: 'B',
      role: 'CANDIDAT',
    });

    // Deuxième inscription avec le MÊME email : doit être rejetée par le service
    // (findByEmail trouve l'utilisateur existant) avant même d'écrire en base.
    await expect(
      authService.register({
        email: 'existe@test.com',
        password: 'autreMotDePasse',
        firstName: 'C',
        lastName: 'D',
        role: 'CANDIDAT',
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    // Vérification en base : il ne doit y avoir qu'UN SEUL utilisateur avec cet email,
    // pas deux lignes créées malgré la tentative de doublon.
    const count = await prisma.emploiUser.count({ where: { email: 'existe@test.com' } });
    expect(count).toBe(1);
  });
});

describe('authService.login (intégration)', () => {
  it('cas nominal : connecte un utilisateur existant avec le bon mot de passe', async () => {
    // On crée le compte via le VRAI service register, donc avec un mot de
    // passe réellement hashé par bcrypt (pas une valeur fixée à la main).
    await authService.register({
      email: 'login@test.com',
      password: 'password123',
      firstName: 'A',
      lastName: 'B',
      role: 'CANDIDAT',
    });

    const result = await authService.login({ email: 'login@test.com', password: 'password123' });

    expect(result.token).toBeDefined(); // un token est bien renvoyé
    expect(result.user.email).toBe('login@test.com'); // les bonnes infos utilisateur
    expect((result.user as any).password).toBeUndefined(); // le hash ne doit JAMAIS être renvoyé au frontend
  });

  it("cas d'échec : rejette une connexion avec un mauvais mot de passe (UnauthorizedError)", async () => {
    await authService.register({
      email: 'login2@test.com',
      password: 'bonMotDePasse',
      firstName: 'A',
      lastName: 'B',
      role: 'CANDIDAT',
    });

    // Mauvais mot de passe : bcrypt.compare va réellement échouer (pas de mock),
    // le service doit lever UnauthorizedError sans révéler que le compte existe.
    await expect(
      authService.login({ email: 'login2@test.com', password: 'mauvaisMotDePasse' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});