// tests/integration/emploi/candidat-application.integration.test.ts
//
// Tests D'INTÉGRATION du flux "un candidat postule à une offre".
// Comme pour auth.integration.test.ts : aucun repository n'est mocké.
// On crée de vraies lignes (établissement, offre, candidat, recruteur) en
// base de test, puis on appelle le service réel et on vérifie l'état réel
// de la base après coup (candidature créée, notification envoyée, etc.).

import { PrismaClient } from '@prisma/client';
import { candidatApplicationService } from '../../../src/modules/emploi/candidatures/candidat-application.service';
import { NotFoundError, ConflictError } from '../../../src/errors/http-errors';

const prisma = new PrismaClient(); // connexion réelle à la base de test (.env.test)

// Nettoie toutes les tables touchées par ces tests, tables "enfants" d'abord
// (contraintes de clé étrangère), pour repartir d'une base vide à chaque test.
async function cleanDatabase(): Promise<void> {
  await prisma.emploiNotification.deleteMany(); // dépend de EmploiUser
  await prisma.application.deleteMany(); // dépend de EmploiUser + Offre + Etablissement
  await prisma.offre.deleteMany(); // dépend de Etablissement
  await prisma.recruteurEtablissement.deleteMany(); // dépend de EmploiUser + Etablissement
  await prisma.vitrine.deleteMany(); // dépend de Etablissement
  await prisma.etablissement.deleteMany();
  await prisma.candidatProfil.deleteMany(); // dépend de EmploiUser
  await prisma.emploiSettings.deleteMany(); // dépend de EmploiUser
  await prisma.emploiUser.deleteMany(); // en dernier
}

// Prépare le jeu de données minimal nécessaire à un scénario de candidature :
// - un établissement (l'entreprise qui recrute)
// - un recruteur RATTACHÉ à cet établissement (pour vérifier la notification)
// - une offre ACTIVE publiée par cet établissement
// - un candidat qui va postuler
async function seedData() {
  const etab = await prisma.etablissement.create({
    data: { name: 'Hôtel Test', sector: 'Hôtellerie', city: 'Cotonou' },
  });

  const recruiter = await prisma.emploiUser.create({
    data: { email: 'recruteur@test.com', password: 'x', firstName: 'R', lastName: 'X', role: 'RECRUITER' },
  });
  await prisma.recruteurEtablissement.create({
    data: { userId: recruiter.id, etablissementId: etab.id, isDefault: true },
  });

  const offre = await prisma.offre.create({
    data: {
      etablissementId: etab.id,
      title: 'Réceptionniste',
      sector: 'Hôtellerie',
      contractType: 'CDI',
      location: 'Cotonou',
      status: 'ACTIVE', // seule une offre ACTIVE peut recevoir des candidatures côté métier
      views: 0,
      isPremium: false,
    },
  });

  const candidat = await prisma.emploiUser.create({
    data: { email: 'candidat@test.com', password: 'x', firstName: 'Awa', lastName: 'K.', role: 'CANDIDAT' },
  });

  return { etab, recruiter, offre, candidat };
}

beforeEach(async () => {
  await cleanDatabase(); // état propre avant chaque test
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect(); // ferme proprement la connexion Prisma à la fin du fichier
});

describe('candidatApplicationService.applyToJob (intégration)', () => {
  it("cas nominal : crée la candidature en base et notifie le recruteur rattaché à l'établissement", async () => {
    const { offre, recruiter, candidat } = await seedData();

    const result = await candidatApplicationService.applyToJob(
      { id: candidat.id, firstName: candidat.firstName, lastName: candidat.lastName },
      offre.id,
    );

    expect(result.message).toBe('Candidature envoyée'); // message de confirmation renvoyé par le service

    // Vérification EN BASE : la candidature doit réellement exister, avec le bon statut initial.
    const appInDb = await prisma.application.findUnique({
      where: { userId_offreId: { userId: candidat.id, offreId: offre.id } },
    });
    expect(appInDb).not.toBeNull();
    expect(appInDb!.status).toBe('SENT'); // statut par défaut à la création

    // Vérification EN BASE : le recruteur lié à l'établissement doit avoir reçu UNE notification.
    const notifs = await prisma.emploiNotification.findMany({ where: { userId: recruiter.id } });
    expect(notifs).toHaveLength(1);
    expect(notifs[0].type).toBe('NEW_APPLICATION');
  });

  it("cas d'échec : refuse une deuxième candidature à la même offre, sans créer de doublon en base", async () => {
    const { offre, candidat } = await seedData();

    // Première candidature : doit réussir.
    await candidatApplicationService.applyToJob(
      { id: candidat.id, firstName: candidat.firstName, lastName: candidat.lastName },
      offre.id,
    );

    // Deuxième tentative sur la MÊME offre par le MÊME candidat : doit être rejetée
    // (contrainte métier "un candidat ne postule qu'une fois par offre").
    await expect(
      candidatApplicationService.applyToJob(
        { id: candidat.id, firstName: candidat.firstName, lastName: candidat.lastName },
        offre.id,
      ),
    ).rejects.toBeInstanceOf(ConflictError);

    // Vérification EN BASE : une seule candidature doit exister malgré la double tentative.
    const count = await prisma.application.count({ where: { userId: candidat.id, offreId: offre.id } });
    expect(count).toBe(1);
  });

  it("cas d'échec : lève NotFoundError si l'offre n'existe pas, sans créer de candidature", async () => {
    // Ici on ne seed volontairement qu'un candidat, sans offre associée.
    const candidat = await prisma.emploiUser.create({
      data: { email: 'seul@test.com', password: 'x', firstName: 'Seul', lastName: 'E', role: 'CANDIDAT' },
    });

    await expect(
      candidatApplicationService.applyToJob({ id: candidat.id, firstName: 'Seul', lastName: 'E' }, 999999),
    ).rejects.toBeInstanceOf(NotFoundError); // id d'offre inexistant => erreur métier propre, pas de crash Prisma

    const count = await prisma.application.count(); // aucune candidature n'a dû être créée
    expect(count).toBe(0);
  });
});