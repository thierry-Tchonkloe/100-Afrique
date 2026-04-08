// src/services/tags.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cacheService } from '../utils/cache';

const CACHE_KEY_ALL_TAGS = 'tags:all';

/**
 * Service de gestion des tags
 */
export class TagsService {
  /**
   * Récupère tous les tags (avec cache)
   */
  async getAllTags() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ALL_TAGS);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    // Mettre en cache
    cacheService.set(CACHE_KEY_ALL_TAGS, tags);

    return tags;
  }

  /**
   * Récupère un tag par son ID
   */
  async getTagById(id: number) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!tag) {
      throw new AppError('Tag non trouvé', 404);
    }

    return tag;
  }

  /**
   * Crée un nouveau tag
   */
  async createTag(data: { name: string; slug: string }) {
    // Vérifier l'unicité du slug
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new AppError('Un tag avec ce slug existe déjà', 409);
    }

    // Vérifier l'unicité du nom
    const existingName = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new AppError('Un tag avec ce nom existe déjà', 409);
    }

    // Créer le tag
    const tag = await prisma.tag.create({
      data,
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    // Invalider le cache
    this.clearCache();

    return tag;
  }

  /**
   * Met à jour un tag
   */
  async updateTag(id: number, data: { name?: string; slug?: string }) {
    // Vérifier que le tag existe
    await this.getTagById(id);

    // Vérifier l'unicité du slug si modifié
    if (data.slug) {
      const existing = await prisma.tag.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new AppError('Un tag avec ce slug existe déjà', 409);
      }
    }

    // Vérifier l'unicité du nom si modifié
    if (data.name) {
      const existing = await prisma.tag.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
      });

      if (existing) {
        throw new AppError('Un tag avec ce nom existe déjà', 409);
      }
    }

    // Mettre à jour
    const tag = await prisma.tag.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    // Invalider le cache
    this.clearCache();

    return tag;
  }

  /**
   * Supprime un tag
   */
  async deleteTag(id: number) {
    // ✅ CORRECTION: Vérifier l'existence sans stocker le résultat
    // On vérifie juste que le tag existe, l'AppError sera levée si non trouvé
    await this.getTagById(id);

    // Supprimer
    await prisma.tag.delete({
      where: { id },
    });

    // Invalider le cache
    this.clearCache();

    return { message: 'Tag supprimé avec succès' };
  }

  /**
   * Invalide le cache des tags
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_ALL_TAGS);
  }
}

export const tagsService = new TagsService();