// src/modules/emploi/auth/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { emploiUserRepository } from '../repositories/emploiUser.repository';
import { etablissementRepository } from '../repositories/etablissement.repository';
import { vitrineRepository } from '../vitrine/vitrine.repository';
import { ConflictError, UnauthorizedError } from '../../../errors/http-errors';
import { logger } from '../../../utils/logger';
import type {
  RegisterInput, LoginInput, ChangePasswordInput, AuthSessionOutput, AuthUserOutput,
} from './auth.types';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

function signToken(id: number, email: string, role: string): string {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
  });
}

async function ensureRecruiterEtablissement(userId: number, input: RegisterInput): Promise<void> {
  let etabId: number | null = null;

  if (input.etablissementId) {
    const etab = await etablissementRepository.findById(input.etablissementId);
    if (etab) etabId = etab.id;
  }

  if (!etabId) {
    const newEtab = await etablissementRepository.create({
      name: input.companyName!,
      sector: input.etablissementSector ?? '',
      city: input.etablissementCity ?? '',
    });
    etabId = newEtab.id;
  }

  await etablissementRepository.linkRecruiter(userId, etabId, true);

  await vitrineRepository.upsertEmpty(etabId).catch((err) => {
    logger.error(`[auth.service] Échec création vitrine pour établissement ${etabId}`, err);
  });
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthSessionOutput> {
    const exists = await emploiUserRepository.findByEmail(input.email);
    if (exists) {
      throw new ConflictError('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(input.password, ROUNDS);

    const user = await emploiUserRepository.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      createCandidatProfil: input.role === 'CANDIDAT',
    });

    if (input.role === 'RECRUITER') {
      await ensureRecruiterEtablissement(user.id, input);
    }

    return {
      user: user as AuthUserOutput,
      token: signToken(user.id, user.email, user.role),
    };
  },

  async login(input: LoginInput): Promise<AuthSessionOutput> {
    const user = await emploiUserRepository.findByIdForLogin(input.email);

    if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    const { password: _password, ...safeUser } = user;
    return {
      user: safeUser as AuthUserOutput,
      token: signToken(user.id, user.email, user.role),
    };
  },

  async getMe(userId: number) {
    return emploiUserRepository.findByIdSafe(userId);
  },

  async changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    const user = await emploiUserRepository.findByIdWithPassword(userId);
    if (!user || !(await bcrypt.compare(input.currentPassword, user.password))) {
      throw new UnauthorizedError('Le mot de passe actuel est incorrect');
    }
    const hashed = await bcrypt.hash(input.newPassword, ROUNDS);
    await emploiUserRepository.updatePassword(userId, hashed);
  },
};