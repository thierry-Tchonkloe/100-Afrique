// tests/integration/emploi/auth.integration.test.ts
//
// Tests D'INTÉGRATION du module auth.
// Différence avec tests/emploi/auth.service.test.ts (tests unitaires) :
// ici, AUCUN repository n'est mocké. On utilise une vraie connexion Prisma
// vers une base PostgreSQL dédiée aux tests (voir .env.test), donc on
// vérifie le comportement réel du service + du repository + des
// contraintes de la base (ex : unicité de l'email) de bout en bout.

import { PrismaClient } from '@prisma/client'; // client Prisma réel (pas de mock)
import jwt from 'jsonwebtoken'; // pour décoder/vérifier le vrai token renvoyé, pas juste constater sa présence
import bcrypt from 'bcrypt'; // pour vérifier que le hash en base correspond réellement au mot de passe saisi
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
  it('cas nominal : crée un candidat réel en base, avec un vrai token signé et le bon mot de passe réellement haché', async () => {
    // Appel du service réel, sans mock : il va vraiment écrire en base.
    const result = await authService.register({
      email: 'candidat@test.com',
      password: 'password123',
      firstName: 'Awa',
      lastName: 'Koné',
      role: 'CANDIDAT',
    });

    // Vérification du token
    // jwt.verify() recalcule la signature avec JWT_SECRET et lève une exception si la signature est invalide, si le
    // secret ne correspond pas, ou si le format n'est pas un JWT valide. Un `toBeDefined()` sur une simple chaîne aurait laissé passer n'importe quelle valeur ("abc", "123"...) comme avant.
    const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    expect(decoded.email).toBe('candidat@test.com'); // le payload correspond bien à l'utilisateur créé
    expect(decoded.role).toBe('CANDIDAT');
    expect(decoded).not.toHaveProperty('password'); // garde-fou : un mot de passe (même haché) ne doit jamais finir dans le payload d'un JWT (il est seulement signé, pas chiffré : n'importe qui peut le décoder et le lire)

    expect(result.user.email).toBe('candidat@test.com'); // les infos utilisateur renvoyées correspondent à la saisie

    // Vérification en base (pas via le service)
    const userInDb = await prisma.emploiUser.findUnique({ where: { email: 'candidat@test.com' } });
    expect(userInDb).not.toBeNull(); // l'utilisateur a bien été persisté

    // Vérification du mot de passe
    // Un simple `startsWith('$2b$')` prouve seulement qu'il y a un hash bcrypt en base, pas que c'est le hash du mot de passe
    // saisi (une valeur par défaut ou un hash codé en dur aurait aussi ce préfixe et ferait passer le test à tort).
    const passwordMatches = await bcrypt.compare('password123', userInDb!.password); // compare le mot de passe saisi avec le hash en base
    expect(passwordMatches).toBe(true); // le hash en base correspond bien au mot de passe réellement saisi

    // Contre-épreuve : un autre mot de passe ne doit pas matcher.
    const wrongPasswordMatches = await bcrypt.compare('un-autre-mot-de-passe', userInDb!.password);
    expect(wrongPasswordMatches).toBe(false);

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
  it('cas nominal : connecte un utilisateur existant avec le bon mot de passe et renvoie un vrai token, sans exposer le mot de passe', async () => {
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

    // Même vérification "vrai JWT" qu'au register, pas un simple toBeDefined().
    const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as { email: string; role: string };
    expect(decoded.email).toBe('login@test.com');

    // Vérification, c'est que l'objet utilisateur renvoyé à côté du token
    // (result.user, pas result.token) ne contient pas le champ password.
    expect(result.user).not.toHaveProperty('password');
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