// src/modules/emploi/candidatures/application.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applicationRepository = {
  findByUserAndOffre(userId: number, offreId: number) {
    return prisma.application.findUnique({ where: { userId_offreId: { userId, offreId } } });
  },

  findById(id: number) {
    return prisma.application.findUnique({ where: { id } });
  },

  findByIdWithMessageContext(id: number) {
    return prisma.application.findUnique({
      where: { id },
      include: { user: { select: { email: true, firstName: true } }, offre: { select: { title: true } } },
    });
  },

  findByIdWithCvContext(id: number) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        user: { include: { candidatProfil: { select: { cvFileUrl: true, cvFileName: true } } } },
        offre: { select: { etablissementId: true, title: true } },
      },
    });
  },

  findManyForUser(userId: number) {
    return prisma.application.findMany({
      where: { userId },
      include: { offre: { select: { title: true, sector: true, etablissement: { select: { name: true } } } } },
      orderBy: { appliedAt: 'desc' },
    });
  },

  findRecentForUser(userId: number, take: number) {
    return prisma.application.findMany({
      where: { userId },
      include: { offre: { select: { title: true, sector: true, etablissement: { select: { name: true } } } } },
      orderBy: { appliedAt: 'desc' },
      take,
    });
  },

  findManyForEtablissement(etablissementId: number, offreId?: number) {
    return prisma.application.findMany({
      where: { etablissementId, ...(offreId ? { offreId } : {}) },
      include: {
        user: { include: { candidatProfil: { include: { experiences: true, formations: true } } } },
        offre: { select: { title: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
  },

  findAllForEtablissement(etablissementId: number) {
    return prisma.application.findMany({
      where: { etablissementId },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } }, offre: { select: { title: true } } },
      orderBy: { appliedAt: 'desc' },
    });
  },

  findForEtablissementSince(etablissementId: number, since: Date) {
    return prisma.application.findMany({
      where: { etablissementId, appliedAt: { gte: since } },
      select: { appliedAt: true, offre: { select: { sector: true } } },
    });
  },

  findRecentReadForUser(userId: number, take: number) {
    return prisma.application.findMany({
      where: { userId, isRead: true },
      include: { etablissement: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take,
    });
  },

  findAllRawForUser(userId: number) {
    return prisma.application.findMany({ where: { userId } });
  },

  create(data: { userId: number; offreId: number; etablissementId: number; timeline: unknown }) {
    return prisma.application.create({
      data: {
        userId: data.userId,
        offreId: data.offreId,
        etablissementId: data.etablissementId,
        status: 'SENT',
        isRead: false,
        isFavorite: false,
        timeline: data.timeline as any,
      },
    });
  },

  updateStatusWithTimeline(id: number, status: any, timeline: unknown) {
    return prisma.application.update({ where: { id }, data: { status, timeline: timeline as any } });
  },

  markRead(id: number) {
    return prisma.application.update({ where: { id }, data: { isRead: true } });
  },

  toggleFavorite(id: number, isFavorite: boolean) {
    return prisma.application.update({ where: { id }, data: { isFavorite } });
  },

  saveNotes(id: number, notes: string) {
    return prisma.application.update({ where: { id }, data: { recruiterNotes: notes } });
  },

  delete(id: number) {
    return prisma.application.delete({ where: { id } });
  },
};