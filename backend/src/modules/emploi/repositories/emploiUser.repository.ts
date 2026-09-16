// src/modules/emploi/repositories/emploiUser.repository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Repository = SEUL endroit qui parle à Prisma pour cette entité. Un
 * service ne doit jamais faire `prisma.emploiUser...` directement : il
 * appelle ce repository. Si demain on change de couche de persistance,
 * seul ce fichier bouge.
 */
export const emploiUserRepository = {
  findByEmail(email: string) {
    return prisma.emploiUser.findUnique({ where: { email } });
  },

  findByIdSafe(id: number) {
    return prisma.emploiUser.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, createdAt: true },
    });
  },

  findForExport(id: number) {
    return prisma.emploiUser.findUnique({
      where: { id },
      select: { email: true, firstName: true, lastName: true, createdAt: true },
    });
  },

  findByIdWithPassword(id: number) {
    return prisma.emploiUser.findUnique({ where: { id } });
  },

  findByIdForLogin(email: string) {
    return prisma.emploiUser.findUnique({
      where: { email },
      select: {
        id: true, email: true, password: true,
        firstName: true, lastName: true, role: true,
        isActive: true, avatar: true,
      },
    });
  },

  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'CANDIDAT' | 'RECRUITER';
    createCandidatProfil: boolean;
  }) {
    return prisma.emploiUser.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        settings: { create: {} },
        ...(data.createCandidatProfil && {
          candidatProfil: {
            create: { hardSkills: [], softSkills: [], languages: [], isVisible: true },
          },
        }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  },

  updatePassword(id: number, hashedPassword: string) {
    return prisma.emploiUser.update({ where: { id }, data: { password: hashedPassword } });
  },

  updateEmail(id: number, email: string) {
    return prisma.emploiUser.update({ where: { id }, data: { email } });
  },

  updateIdentity(id: number, data: { firstName: string; lastName: string }) {
    return prisma.emploiUser.update({ where: { id }, data });
  },

  updateAvatar(id: number, avatarUrl: string) {
    return prisma.emploiUser.update({ where: { id }, data: { avatar: avatarUrl } });
  },

  delete(id: number) {
    return prisma.emploiUser.delete({ where: { id } });
  },
};