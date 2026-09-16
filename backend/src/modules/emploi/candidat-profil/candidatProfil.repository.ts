// src/repositories/emploi/candidatProfil.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const candidatProfilRepository = {
  findByUserId(userId: number) {
    return prisma.candidatProfil.findUnique({ where: { userId } });
  },

  findByUserIdWithRelations(userId: number) {
    return prisma.candidatProfil.findUnique({
      where: { userId },
      include: { experiences: { orderBy: { sortOrder: 'asc' } }, formations: true },
    });
  },

  findByUserIdWithDashboardRelations(userId: number) {
    return prisma.candidatProfil.findUnique({
      where: { userId },
      include: { experiences: true, formations: true },
    });
  },

  updateIdentity(userId: number, data: { headline?: string; city?: string; mobility?: string; bio?: string }) {
    return prisma.candidatProfil.update({ where: { userId }, data });
  },

  updateSkills(userId: number, data: { hardSkills?: unknown; softSkills?: unknown; languages?: unknown }) {
    // Les champs Json de Prisma (`hardSkills`, `softSkills`, `languages`)
    // attendent un `InputJsonValue` précis, pas `unknown`. On construit un
    // objet de mise à jour typé `any` explicitement — c'est le seul endroit
    // où le cast est nécessaire, car la donnée vient du contrôleur déjà
    // validée par Zod (voir validators/emploi/candidat.validator.ts), donc
    // sa forme est garantie correcte à l'exécution.
    const updateData: Record<string, unknown> = {};
    if (data.hardSkills !== undefined) updateData.hardSkills = data.hardSkills;
    if (data.softSkills !== undefined) updateData.softSkills = data.softSkills;
    if (data.languages !== undefined) updateData.languages = data.languages;

    return prisma.candidatProfil.update({ where: { userId }, data: updateData as any });
  },

  updateVisibility(userId: number, data: { isVisible?: boolean; availability?: string }) {
    return prisma.candidatProfil.update({
      where: { userId },
      data: {
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
        ...(data.availability !== undefined && { availability: data.availability }),
      },
    });
  },

  updateAvatar(userId: number, avatarUrl: string) {
    return prisma.candidatProfil.update({ where: { userId }, data: { avatar: avatarUrl } });
  },

  updateCv(userId: number, data: { cvFileUrl: string; cvFileName: string }) {
    return prisma.candidatProfil.update({
      where: { userId },
      data: { cvFileUrl: data.cvFileUrl, cvFileName: data.cvFileName, cvUpdatedAt: new Date() },
    });
  },

  clearCv(userId: number) {
    return prisma.candidatProfil.update({
      where: { userId },
      data: { cvFileUrl: null, cvFileName: null, cvUpdatedAt: null },
    });
  },

  setAllVisibility(userId: number, isVisible: boolean) {
    return prisma.candidatProfil.updateMany({ where: { userId }, data: { isVisible } });
  },

  // ── Expériences ──────────────────────────────────────────────────────────
  createExperience(profilId: number, data: {
    jobTitle: string; companyName: string; location?: string;
    startDate: string; endDate?: string | null; contractType?: string; missions?: unknown;
  }) {
    return prisma.experience.create({
      data: {
        profilId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        contractType: data.contractType ?? 'CDI',
        missions: (data.missions as any) ?? [],
      },
    });
  },

  updateExperience(id: number, data: Record<string, unknown>) {
    return prisma.experience.update({ where: { id }, data: data as any });
  },

  deleteExperience(id: number) {
    return prisma.experience.delete({ where: { id } });
  },

  // ── Formations ───────────────────────────────────────────────────────────
  createFormation(profilId: number, data: { diploma: string; school: string; year: string }) {
    return prisma.formation.create({ data: { profilId, ...data } });
  },

  updateFormation(id: number, data: Record<string, unknown>) {
    return prisma.formation.update({ where: { id }, data: data as any });
  },

  deleteFormation(id: number) {
    return prisma.formation.delete({ where: { id } });
  },
};