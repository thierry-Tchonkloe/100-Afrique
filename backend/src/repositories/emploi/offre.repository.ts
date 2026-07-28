// src/repositories/emploi/offre.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const offreRepository = {
  findById(id: number) {
    return prisma.offre.findUnique({ where: { id } });
  },

  findByIdWithEtablissementAndVitrine(id: number) {
    return prisma.offre.findUnique({
      where: { id },
      include: { etablissement: { include: { vitrine: true } } },
    });
  },

  findManyForEtablissement(etablissementId: number) {
    return prisma.offre.findMany({
      where: { etablissementId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  countUnreadByOffre(etablissementId: number) {
    return prisma.application.groupBy({
      by: ['offreId'],
      where: { etablissementId, isRead: false },
      _count: { id: true },
    });
  },

  create(etablissementId: number, data: Record<string, unknown>) {
    return prisma.offre.create({
      data: {
        ...(data as any),
        etablissementId,
        status: 'ACTIVE',
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
        views: 0,
        isPremium: false,
      },
      include: { _count: { select: { applications: true } } },
    });
  },

  update(id: number, data: Record<string, unknown>) {
    return prisma.offre.update({
      where: { id },
      data: data as any,
      include: { _count: { select: { applications: true } } },
    });
  },

  updateStatus(id: number, status: string, setPublishedNow: boolean) {
    return prisma.offre.update({
      where: { id },
      data: { status: status as any, ...(setPublishedNow ? { publishedAt: new Date() } : {}) },
      include: { _count: { select: { applications: true } } },
    });
  },

  archive(id: number) {
    return prisma.offre.update({ where: { id }, data: { status: 'ARCHIVED' as any } });
  },

  duplicate(original: any) {
    return prisma.offre.create({
      data: {
        etablissementId: original.etablissementId,
        title: `${original.title} (copie)`,
        sector: original.sector,
        contractType: original.contractType,
        location: original.location,
        salaryMin: original.salaryMin,
        salaryMax: original.salaryMax,
        remote: original.remote,
        missions: original.missions,
        profileDesc: original.profileDesc,
        advantages: original.advantages,
        requiredSkills: (original.requiredSkills ?? []) as string[],
        requiredLangs: (original.requiredLangs ?? []) as string[],
        requiredSoftwares: (original.requiredSoftwares ?? []) as string[],
        isPremium: original.isPremium,
        status: 'DRAFT',
        views: 0,
        expiresAt: new Date(Date.now() + 30 * 86400000),
      },
      include: { _count: { select: { applications: true } } },
    });
  },

  countPublic(where: Prisma.OffreWhereInput) {
    return prisma.offre.count({ where });
  },

  findManyPublic(where: Prisma.OffreWhereInput, skip: number, take: number) {
    return prisma.offre.findMany({
      where,
      include: { etablissement: { select: { name: true, city: true, logo: true } } },
      orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take,
    });
  },

  findTitlesForEtablissement(etablissementId: number) {
    return prisma.offre.findMany({ where: { etablissementId }, select: { id: true, title: true } });
  },

  findWithEtablissementNameById(id: number) {
    return prisma.offre.findUnique({ where: { id }, select: { title: true, etablissement: { select: { name: true } } } });
  },

  findSummaryForEtablissement(etablissementId: number) {
    return prisma.offre.findMany({
      where: { etablissementId },
      select: { id: true, status: true, views: true, sector: true },
    });
  },

  incrementViews(ids: number[]) {
    return prisma.offre.updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } });
  },
};