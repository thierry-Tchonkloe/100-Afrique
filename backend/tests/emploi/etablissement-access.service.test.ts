// tests/emploi/etablissement-access.service.test.ts
//
// Flux critique #2 : accès aux données sensibles. Ce test verrouille
// EXACTEMENT le bug de sécurité repéré en revue : un recruteur pouvait
// passer un `etablissementId` arbitraire (via ?etablissementId=... sur
// GET /recruteur/candidatures) et consulter les candidatures d'une autre
// entreprise, car l'ancienne implémentation ne vérifiait jamais que le
// lien recruteur ↔ établissement existait réellement pour un id fourni
// explicitement. Si quelqu'un réintroduit ce bug par erreur, ce test
// doit échouer.

jest.mock('../../src/modules/emploi/repositories/etablissement.repository');

import { etablissementRepository } from '../../src/modules/emploi/repositories/etablissement.repository';
import { resolveActiveEtablissementId, assertOffreAccess } from '../../src/modules/emploi/services/etablissement-access.service';
import { ForbiddenError, NotFoundError } from '../../src/errors/http-errors';

const mockedEtabRepo = etablissementRepository as jest.Mocked<typeof etablissementRepository>;

describe('resolveActiveEtablissementId', () => {
  beforeEach(() => jest.clearAllMocks());

  it("lève ForbiddenError si l'établissement demandé n'appartient pas au recruteur", async () => {
    mockedEtabRepo.findVerifiedLink.mockResolvedValue(null);

    await expect(resolveActiveEtablissementId(1, 999)).rejects.toBeInstanceOf(ForbiddenError);
    expect(mockedEtabRepo.findVerifiedLink).toHaveBeenCalledWith(1, 999);
  });

  it("retourne l'id demandé uniquement si le lien recruteur↔établissement est vérifié", async () => {
    mockedEtabRepo.findVerifiedLink.mockResolvedValue({ etablissementId: 5 } as any);

    const result = await resolveActiveEtablissementId(1, 5);
    expect(result).toBe(5);
  });

  it("retombe sur l'établissement par défaut si aucun id n'est demandé", async () => {
    mockedEtabRepo.findDefaultLink.mockResolvedValue({ etablissementId: 3 } as any);

    const result = await resolveActiveEtablissementId(1);
    expect(result).toBe(3);
    expect(mockedEtabRepo.findVerifiedLink).not.toHaveBeenCalled();
  });

  it("lève NotFoundError si le recruteur n'a aucun établissement lié", async () => {
    mockedEtabRepo.findDefaultLink.mockResolvedValue(null);
    mockedEtabRepo.findFirstLink.mockResolvedValue(null);

    await expect(resolveActiveEtablissementId(1)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('assertOffreAccess', () => {
  beforeEach(() => jest.clearAllMocks());

  it("empêche un recruteur de modifier une offre d'un autre établissement", async () => {
    mockedEtabRepo.findVerifiedLink.mockResolvedValue(null);
    await expect(assertOffreAccess(1, 42)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('autorise un recruteur ayant un lien vérifié avec cet établissement', async () => {
    mockedEtabRepo.findVerifiedLink.mockResolvedValue({ etablissementId: 42 } as any);
    await expect(assertOffreAccess(1, 42)).resolves.toBeUndefined();
  });
});