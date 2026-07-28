// src/repositories/emploi/vitrine.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMPTY_JSON_FIELDS = {
  kpis: [], values: [], perks: [], photos: [], videos: [], socials: {},
  certifications: [], moments: [],
};

export const vitrineRepository = {
  findByEtablissementId(etablissementId: number) {
    return prisma.vitrine.findUnique({ where: { etablissementId } });
  },

  upsertEmpty(etablissementId: number) {
    return prisma.vitrine.upsert({
      where: { etablissementId },
      update: {},
      create: { etablissementId, ...EMPTY_JSON_FIELDS, completionScore: 0, views: 0 },
    });
  },

  upsertWithData(etablissementId: number, updateData: Record<string, unknown>, createData: Record<string, unknown>) {
    return prisma.vitrine.upsert({
      where: { etablissementId },
      update: updateData,
      create: { etablissementId, ...EMPTY_JSON_FIELDS, ...createData },
    });
  },

  updateCompletionScore(etablissementId: number, score: number) {
    return prisma.vitrine.update({ where: { etablissementId }, data: { completionScore: score } });
  },

  incrementViewsById(id: number) {
    return prisma.vitrine.update({ where: { id }, data: { views: { increment: 1 } } });
  },

  update(etablissementId: number, data: Record<string, unknown>) {
    return prisma.vitrine.update({ where: { etablissementId }, data: data as any });
  },
};