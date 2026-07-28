// src/repositories/emploi/alerteJob.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const alerteJobRepository = {
  findManyForUser(userId: number) {
    return prisma.alerteJob.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  },

  countActiveForUser(userId: number) {
    return prisma.alerteJob.count({ where: { userId, isActive: true } });
  },

  create(userId: number, data: Record<string, unknown>) {
    return prisma.alerteJob.create({ data: { userId, ...(data as any) } });
  },

  update(id: number, data: Record<string, unknown>) {
    return prisma.alerteJob.update({ where: { id }, data: data as any });
  },

  toggle(id: number, isActive: boolean) {
    return prisma.alerteJob.update({ where: { id }, data: { isActive } });
  },

  delete(id: number) {
    return prisma.alerteJob.delete({ where: { id } });
  },
};