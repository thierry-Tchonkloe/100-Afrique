// src/services/users.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cacheService } from '../utils/cache';
import bcrypt from 'bcrypt';

const CACHE_KEY_ALL_USERS = 'users:all';

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: 'SUPER_ADMIN' | 'EDITOR';
}

/**
 * Service de gestion des utilisateurs
 */
export class UsersService {
  /**
   * Récupère tous les utilisateurs (avec cache)
   */
  async getAllUsers() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ALL_USERS);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Mettre en cache
    cacheService.set(CACHE_KEY_ALL_USERS, users);

    return users;
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return user;
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id: number, data: UpdateUserInput) {
    // Vérifier que l'utilisateur existe
    await this.getUserById(id);

    // Vérifier l'unicité de l'email si modifié
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new AppError('Un utilisateur avec cet email existe déjà', 409);
      }
    }

    // Hasher le mot de passe si fourni
    const updateData: UpdateUserInput & { password?: string } = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Mettre à jour
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Invalider le cache
    this.clearCache();

    return user;
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: number) {
    // Vérifier que l'utilisateur existe
    await this.getUserById(id);

    // Supprimer
    await prisma.user.delete({
      where: { id },
    });

    // Invalider le cache
    this.clearCache();

    return { message: 'Utilisateur supprimé avec succès' };
  }

  /**
   * Change le statut d'un utilisateur
   */
  async updateUserStatus(id: number, status: 'ACTIVE' | 'SUSPENDED') {
    // Vérifier que l'utilisateur existe
    await this.getUserById(id);

    // Mettre à jour le statut
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Invalider le cache
    this.clearCache();

    return user;
  }

  /**
   * Invalide le cache des utilisateurs
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_ALL_USERS);
  }
}

export const usersService = new UsersService();