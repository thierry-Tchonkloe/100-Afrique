// tests/emploi/candidat-application.service.test.ts
//
// Flux critique #4 : candidature côté candidat. Deux points verrouillés :
//   1. `applyToJob` doit refuser une double candidature (ConflictError) —
//      c'est une règle métier invisible si on ne la teste pas explicitement,
//      un refactor du repository pourrait la faire disparaître sans que
//      rien ne plante à la compilation.
//   2. `applyToJob` doit notifier TOUS les recruteurs liés à l'établissement
//      (et aucun s'il n'y en a pas) — un oubli ici = les recruteurs ne
//      savent jamais qu'une nouvelle candidature est arrivée.

jest.mock('../../src/modules/emploi/candidatures/application.repository');
jest.mock('../../src/modules/emploi/offres/offre.repository');
jest.mock('../../src/modules/emploi/repositories/etablissement.repository');
jest.mock('../../src/modules/emploi/notifications/notification.repository');

import { candidatApplicationService } from '../../src/modules/emploi/candidatures/candidat-application.service';
import { applicationRepository } from '../../src/modules/emploi/candidatures/application.repository';
import { offreRepository } from '../../src/modules/emploi/offres/offre.repository';
import { etablissementRepository } from '../../src/modules/emploi/repositories/etablissement.repository';
import { notificationRepository } from '../../src/modules/emploi/notifications/notification.repository';
import { NotFoundError, ConflictError } from '../../src/errors/http-errors';

const mockedAppRepo = applicationRepository as jest.Mocked<typeof applicationRepository>;
const mockedOffreRepo = offreRepository as jest.Mocked<typeof offreRepository>;
const mockedEtabRepo = etablissementRepository as jest.Mocked<typeof etablissementRepository>;
const mockedNotifRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;

describe('candidatApplicationService.getApplications', () => {
  beforeEach(() => jest.resetAllMocks());

  it('calcule total / inProgress / interviews à partir des statuts bruts', async () => {
    const baseOffre = {
      title: 'Développeur', sector: 'Tech', location: 'Paris', contractType: 'CDI',
      publishedAt: null, createdAt: new Date('2024-01-01'),
      etablissement: { name: 'Acme' },
    };
    mockedAppRepo.findManyForUser.mockResolvedValue([
      { id: 1, status: 'SENT', appliedAt: new Date(), timeline: [], offre: baseOffre }, // in_progress
      { id: 2, status: 'INTERVIEW', appliedAt: new Date(), timeline: [], offre: baseOffre }, // in_progress + interview
      { id: 3, status: 'REFUSED', appliedAt: new Date(), timeline: [], offre: baseOffre }, // ni l'un ni l'autre
    ] as any);

    const result = await candidatApplicationService.getApplications(1);

    expect(result.stats).toEqual({ total: 3, inProgress: 2, interviews: 1 });
  });
});

describe('candidatApplicationService.applyToJob', () => {
  beforeEach(() => jest.resetAllMocks());

  it("lève NotFoundError si l'offre n'existe pas", async () => {
    mockedOffreRepo.findById.mockResolvedValue(null as any);

    await expect(
      candidatApplicationService.applyToJob({ id: 3, firstName: 'Awa', lastName: 'K.' }, 999),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(mockedAppRepo.create).not.toHaveBeenCalled();
  });

  it("lève ConflictError si le candidat a déjà postulé à cette offre (empêche la double candidature)", async () => {
    mockedOffreRepo.findById.mockResolvedValue({ id: 50, etablissementId: 7, title: 'Chef de projet' } as any);
    mockedAppRepo.findByUserAndOffre.mockResolvedValue({ id: 1 } as any);

    await expect(
      candidatApplicationService.applyToJob({ id: 3, firstName: 'Awa', lastName: 'K.' }, 50),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(mockedAppRepo.create).not.toHaveBeenCalled();
  });

  it('crée la candidature et notifie TOUS les recruteurs liés à cet établissement', async () => {
    mockedOffreRepo.findById.mockResolvedValue({ id: 50, etablissementId: 7, title: 'Chef de projet' } as any);
    mockedAppRepo.findByUserAndOffre.mockResolvedValue(null);
    mockedAppRepo.create.mockResolvedValue({ id: 99 } as any);
    mockedEtabRepo.findRecruiterUserIdsForEtablissement.mockResolvedValue([
      { userId: 1 }, { userId: 2 },
    ] as any);

    const result = await candidatApplicationService.applyToJob({ id: 3, firstName: 'Awa', lastName: 'K.' }, 50);

    expect(mockedAppRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 3, offreId: 50, etablissementId: 7 }),
    );
    expect(mockedEtabRepo.findRecruiterUserIdsForEtablissement).toHaveBeenCalledWith(7);
    expect(mockedNotifRepo.createMany).toHaveBeenCalledWith([
      { userId: 1, type: 'NEW_APPLICATION', title: 'Nouvelle candidature', description: 'Awa K. a postulé pour Chef de projet', relatedId: '99' },
      { userId: 2, type: 'NEW_APPLICATION', title: 'Nouvelle candidature', description: 'Awa K. a postulé pour Chef de projet', relatedId: '99' },
    ]);
    expect(result).toEqual({ message: 'Candidature envoyée', id: '99' });
  });

  it("n'appelle PAS createMany si aucun recruteur n'est lié à l'établissement", async () => {
    mockedOffreRepo.findById.mockResolvedValue({ id: 50, etablissementId: 7, title: 'Chef de projet' } as any);
    mockedAppRepo.findByUserAndOffre.mockResolvedValue(null);
    mockedAppRepo.create.mockResolvedValue({ id: 99 } as any);
    mockedEtabRepo.findRecruiterUserIdsForEtablissement.mockResolvedValue([]);

    await candidatApplicationService.applyToJob({ id: 3, firstName: 'Awa', lastName: 'K.' }, 50);

    expect(mockedNotifRepo.createMany).not.toHaveBeenCalled();
  });
});

describe('candidatApplicationService.withdraw', () => {
  beforeEach(() => jest.resetAllMocks());

  it('supprime la candidature via le repository', async () => {
    await candidatApplicationService.withdraw(15);
    expect(mockedAppRepo.delete).toHaveBeenCalledWith(15);
  });
});