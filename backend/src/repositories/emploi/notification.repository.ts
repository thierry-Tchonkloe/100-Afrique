// src/repositories/emploi/notification.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const notificationRepository = {
  findManyForUser(userId: number, take: number) {
    return prisma.emploiNotification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take });
  },

  create(data: { userId: number; type: string; title: string; description: string; relatedId?: string }) {
    return prisma.emploiNotification.create({ data: data as any });
  },

  createMany(rows: { userId: number; type: string; title: string; description: string; relatedId?: string }[]) {
    return prisma.emploiNotification.createMany({ data: rows as any });
  },

  markRead(id: number) {
    return prisma.emploiNotification.update({ where: { id }, data: { isRead: true } });
  },

  markAllReadForUser(userId: number) {
    return prisma.emploiNotification.updateMany({ where: { userId }, data: { isRead: true } });
  },
};