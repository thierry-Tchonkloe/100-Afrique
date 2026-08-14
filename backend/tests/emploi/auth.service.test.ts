// tests/emploi/auth.service.test.ts
//
// Flux critique #1 : authentification. Couvre les cas qui, en revue de
// code, étaient justement identifiés comme mal gérés (email déjà utilisé
// renvoyant une 500 générique au lieu d'un message clair).
//
// On mocke les repositories : le service est testé en isolation, sans
// base de données réelle — c'est justement l'intérêt de la séparation
// service/repository.

jest.mock('../../src/modules/emploi/repositories/emploiUser.repository');
jest.mock('../../src/modules/emploi/repositories/etablissement.repository');
jest.mock('../../src/modules/emploi/vitrine/vitrine.repository');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('fake-jwt-token') }));

import bcrypt from 'bcrypt';
import { authService } from '../../src/modules/emploi/auth/auth.service';
import { emploiUserRepository } from '../../src/modules/emploi/repositories/emploiUser.repository';
import { etablissementRepository } from '../../src/modules/emploi/repositories/etablissement.repository';
import { vitrineRepository } from '../../src/modules/emploi/vitrine/vitrine.repository';
import { ConflictError, UnauthorizedError } from '../../src/errors/http-errors';

const mockedUserRepo = emploiUserRepository as jest.Mocked<typeof emploiUserRepository>;
const mockedEtabRepo = etablissementRepository as jest.Mocked<typeof etablissementRepository>;
const mockedVitrineRepo = vitrineRepository as jest.Mocked<typeof vitrineRepository>;

describe('authService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('refuse une inscription avec un email déjà utilisé (ConflictError, pas une 500 générique)', async () => {
    mockedUserRepo.findByEmail.mockResolvedValue({ id: 1 } as any);

    await expect(
      authService.register({
        email: 'existe@deja.com',
        password: 'password123',
        firstName: 'A',
        lastName: 'B',
        role: 'CANDIDAT',
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('crée un établissement + le lien recruteur par défaut quand role=RECRUITER et companyName fourni', async () => {
    mockedUserRepo.findByEmail.mockResolvedValue(null);
    mockedUserRepo.create.mockResolvedValue({ id: 42, email: 'r@x.com', firstName: 'R', lastName: 'X', role: 'RECRUITER' } as any);
    mockedEtabRepo.findById.mockResolvedValue(null);
    mockedEtabRepo.create.mockResolvedValue({ id: 7 } as any);
    mockedEtabRepo.linkRecruiter.mockResolvedValue({} as any);
    mockedVitrineRepo.upsertEmpty.mockResolvedValue({} as any);

    const result = await authService.register({
      email: 'r@x.com',
      password: 'password123',
      firstName: 'R',
      lastName: 'X',
      role: 'RECRUITER',
      companyName: 'Hôtel Test',
    });

    expect(mockedEtabRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Hôtel Test' }),
    );
    // Le lien doit être marqué par défaut (isDefault=true) — c'est ce qui
    // manquait dans le bug historique "getEtabId() retourne null".
    expect(mockedEtabRepo.linkRecruiter).toHaveBeenCalledWith(42, 7, true);
    expect(result.token).toBe('fake-jwt-token');
  });
});

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejette avec UnauthorizedError si le mot de passe est incorrect (jamais d'infos sur l'existence du compte)", async () => {
    mockedUserRepo.findByIdForLogin.mockResolvedValue({
      id: 1, email: 'a@b.com', password: 'hashed', firstName: 'A', lastName: 'B', role: 'CANDIDAT', isActive: true, avatar: null,
    } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login({ email: 'a@b.com', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejette avec UnauthorizedError si le compte est désactivé', async () => {
    mockedUserRepo.findByIdForLogin.mockResolvedValue({
      id: 1, email: 'a@b.com', password: 'hashed', firstName: 'A', lastName: 'B', role: 'CANDIDAT', isActive: false, avatar: null,
    } as any);

    await expect(authService.login({ email: 'a@b.com', password: 'whatever' })).rejects.toBeInstanceOf(UnauthorizedError);
  });
});