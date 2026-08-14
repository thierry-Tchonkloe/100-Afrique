// src/services/emploi/candidat-profil.service.ts
import { candidatProfilRepository } from './candidatProfil.repository';
import { emploiUserRepository } from '../repositories/emploiUser.repository';
import { NotFoundError, BadRequestError } from '../../../errors/http-errors';
import type {
  CandidatProfilOutput, CreateExperienceInput, UpdateExperienceInput,
  CreateFormationInput, UpdateFormationInput, UpdateIdentityInput,
  UpdateSkillsInput, UpdateVisibilityInput,
} from './candidat.types';

/** Calcule un score de complétion de profil sur 100. Petite fonction pure,
 *  testable isolément (voir consigne "flux critiques à tester"). */
export function calcProfileStrength(p: {
  headline?: string | null; city?: string | null; bio?: string | null; avatar?: string | null;
  hardSkills: unknown; softSkills: unknown; languages: unknown; cvFileUrl?: string | null;
}): number {
  let score = 0;
  if (p.headline) score += 15;
  if (p.city) score += 5;
  if (p.bio) score += 10;
  if (p.avatar) score += 10;
  if ((p.hardSkills as string[]).length) score += 10;
  if ((p.softSkills as string[]).length) score += 5;
  if ((p.languages as unknown[]).length) score += 10;
  if (p.cvFileUrl) score += 5;
  return Math.min(score, 100);
}

function toProfilOutput(user: { firstName: string; lastName: string }, profil: any): CandidatProfilOutput {
  return {
    id: String(profil.userId),
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: profil.avatar,
    headline: profil.headline ?? '',
    city: profil.city ?? '',
    mobility: profil.mobility ?? '',
    bio: profil.bio ?? '',
    experiences: (profil.experiences ?? []).map((e: any) => ({
      id: String(e.id),
      jobTitle: e.jobTitle,
      companyName: e.companyName,
      location: e.location ?? '',
      startDate: e.startDate,
      endDate: e.endDate ?? undefined,
      contractType: e.contractType,
      missions: e.missions as string[],
    })),
    formations: (profil.formations ?? []).map((f: any) => ({
      id: String(f.id), diploma: f.diploma, school: f.school, year: f.year,
    })),
    hardSkills: profil.hardSkills as string[],
    softSkills: profil.softSkills as string[],
    languages: profil.languages as object[],
    cvFile: profil.cvFileName
      ? {
          name: profil.cvFileName,
          updatedAt: profil.cvUpdatedAt?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) ?? '',
        }
      : undefined,
    isVisible: profil.isVisible,
    availability: profil.availability,
    profileStrength: calcProfileStrength(profil),
  };
}

export const candidatProfilService = {
  async getProfil(userId: number): Promise<CandidatProfilOutput> {
    const [user, profil] = await Promise.all([
      emploiUserRepository.findByIdSafe(userId),
      candidatProfilRepository.findByUserIdWithRelations(userId),
    ]);
    if (!user || !profil) throw new NotFoundError('Profil candidat introuvable');
    return toProfilOutput(user, profil);
  },

  async updateIdentity(userId: number, input: UpdateIdentityInput): Promise<void> {
    await Promise.all([
      emploiUserRepository.updateIdentity(userId, { firstName: input.firstName, lastName: input.lastName }),
      candidatProfilRepository.updateIdentity(userId, {
        headline: input.headline, city: input.city, mobility: input.mobility, bio: input.bio,
      }),
    ]);
  },

  async updateSkills(userId: number, input: UpdateSkillsInput): Promise<void> {
    await candidatProfilRepository.updateSkills(userId, input);
  },

  async updateVisibility(userId: number, input: UpdateVisibilityInput): Promise<void> {
    await candidatProfilRepository.updateVisibility(userId, input);
  },

  async uploadAvatar(userId: number, avatarUrl: string): Promise<{ avatarUrl: string }> {
    if (!avatarUrl) throw new BadRequestError('Fichier manquant');
    await Promise.all([
      emploiUserRepository.updateAvatar(userId, avatarUrl),
      candidatProfilRepository.updateAvatar(userId, avatarUrl),
    ]);
    return { avatarUrl };
  },

  async uploadCv(userId: number, fileUrl: string, fileName: string) {
    if (!fileUrl) throw new BadRequestError('Fichier manquant');
    await candidatProfilRepository.updateCv(userId, { cvFileUrl: fileUrl, cvFileName: fileName });
    return {
      fileName,
      updatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
  },

  async deleteCv(userId: number): Promise<void> {
    await candidatProfilRepository.clearCv(userId);
  },

  async createExperience(userId: number, input: CreateExperienceInput) {
    const profil = await candidatProfilRepository.findByUserId(userId);
    if (!profil) throw new NotFoundError('Profil candidat introuvable');
    const exp = await candidatProfilRepository.createExperience(profil.id, input);
    return { ...exp, id: String(exp.id), missions: exp.missions as string[] };
  },

  async updateExperience(experienceId: number, input: UpdateExperienceInput) {
    const exp = await candidatProfilRepository.updateExperience(experienceId, input as Record<string, unknown>);
    return { ...exp, id: String(exp.id), missions: exp.missions as string[] };
  },

  async deleteExperience(experienceId: number): Promise<void> {
    await candidatProfilRepository.deleteExperience(experienceId);
  },

  async createFormation(userId: number, input: CreateFormationInput) {
    const profil = await candidatProfilRepository.findByUserId(userId);
    if (!profil) throw new NotFoundError('Profil candidat introuvable');
    const f = await candidatProfilRepository.createFormation(profil.id, input);
    return { ...f, id: String(f.id) };
  },

  async updateFormation(formationId: number, input: UpdateFormationInput) {
    const f = await candidatProfilRepository.updateFormation(formationId, input as Record<string, unknown>);
    return { ...f, id: String(f.id) };
  },

  async deleteFormation(formationId: number): Promise<void> {
    await candidatProfilRepository.deleteFormation(formationId);
  },
};