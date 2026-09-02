// tests/emploi/auth.service.test.ts

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
  beforeEach(() => jest.clearAllMocks()); // remet à zéro tous les mocks

  it('refuse une inscription avec un email déjà utilisé (ConflictError, pas une 500 générique)', async () => {
    mockedUserRepo.findByEmail.mockResolvedValue({ id: 1 } as any); // Ça simule le cas où un utilisateur avec cet email existe déjà en base.

    await expect(
      authService.register({
        email: 'existe@deja.com',
        password: 'password123',
        firstName: 'A',
        lastName: 'B',
        role: 'CANDIDAT',
      }),
    ).rejects.toBeInstanceOf(ConflictError); // vérifie que l'erreur reçue est bien une instance de la classe ConflictError
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
      expect.objectContaining({ name: 'Hôtel Test' }), // on vérifie que create a été appelé avec l'objet contenant le nom de l'établissement
    ); //  on vérifie comment un mock a été appelé
    expect(mockedEtabRepo.linkRecruiter).toHaveBeenCalledWith(42, 7, true); // on vérifie que le recruteur a été lié à l'établissement créé
    expect(result.token).toBe('fake-jwt-token'); // vérifie que le token retourné est bien celui du mock de jwt.sign
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