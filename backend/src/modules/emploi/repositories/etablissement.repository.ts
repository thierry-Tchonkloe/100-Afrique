// src/modules/emploi/repositories/etablissement.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const etablissementRepository = {
  findById(id: number) {
    return prisma.etablissement.findUnique({ where: { id } });
  },

  create(data: { name: string; sector: string; city: string }) {
    return prisma.etablissement.create({ data });
  },

  update(id: number, data: Partial<{ name: string; sector: string; city: string; logo: string }>) {
    return prisma.etablissement.update({ where: { id }, data });
  },

  linkRecruiter(userId: number, etablissementId: number, isDefault: boolean) {
    return prisma.recruteurEtablissement.create({ data: { userId, etablissementId, isDefault } });
  },

  findLinksForUser(userId: number) {
    return prisma.recruteurEtablissement.findMany({
      where: { userId },
      include: { etablissement: true },
    });
  },

  /**
   * Vérifie qu'un lien recruteur ↔ établissement existe réellement.
   *
   * FIX SÉCURITÉ : l'ancienne implémentation dans
   * candidatures-rec.controller.ts faisait juste `Number(requested)` sans
   * jamais vérifier que ce recruteur avait accès à cet établissement — un
   * recruteur authentifié pouvait passer n'importe quel `etablissementId`
   * en query string et voir les candidatures d'une autre entreprise.
   * Toute résolution passe maintenant par cette fonction, qui vérifie le
   * lien avant de retourner un id.
   */
  async findVerifiedLink(userId: number, etablissementId: number) {
    return prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId, etablissementId } },
    });
  },

  findDefaultLink(userId: number) {
    return prisma.recruteurEtablissement.findFirst({ where: { userId, isDefault: true } });
  },

  findFirstLink(userId: number) {
    return prisma.recruteurEtablissement.findFirst({ where: { userId } });
  },

  /** Sens inverse de findLinksForUser : tous les recruteurs rattachés à UN
   *  établissement donné. Utilisé pour notifier l'équipe recruteur quand
   *  une nouvelle candidature arrive. */
  findRecruiterUserIdsForEtablissement(etablissementId: number) {
    return prisma.recruteurEtablissement.findMany({ where: { etablissementId }, select: { userId: true } });
  },

  clearDefaultForUser(userId: number) {
    return prisma.recruteurEtablissement.updateMany({ where: { userId }, data: { isDefault: false } });
  },

  setDefault(userId: number, etablissementId: number) {
    return prisma.recruteurEtablissement.update({
      where: { userId_etablissementId: { userId, etablissementId } },
      data: { isDefault: true },
    });
  },

  findManyWithOffresAndVitrine() {
    return prisma.etablissement.findMany({
      include: { vitrine: true, offres: { where: { status: 'ACTIVE' }, select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByIdWithVitrineAndOffres(id: number) {
    return prisma.etablissement.findUnique({
      where: { id },
      include: {
        vitrine: true,
        offres: {
          where: { status: 'ACTIVE' },
          select: {
            id: true, title: true, sector: true, contractType: true,
            location: true, salaryMin: true, salaryMax: true, remote: true,
            isPremium: true, publishedAt: true,
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });
  },
};