// src/repositories/emploi/settings.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const settingsRepository = {
  findByUserId(userId: number) {
    return prisma.emploiSettings.findUnique({ where: { userId } });
  },

  upsert(userId: number, updateData: object, createExtra: object = {}) {
    return prisma.emploiSettings.upsert({
      where: { userId },
      update: updateData as any,
      create: { userId, ...(createExtra as object) } as any,
    });
  },
};
