// src/services/category.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { generateSlug } from '../utils/slugify';
import { cacheService } from '../utils/cache';

const CACHE_KEY_ALL_CATEGORIES = 'categories:all';
const CACHE_KEY_DESTINATIONS = 'categories:destinations';
const CACHE_KEY_MAGAZINE = 'categories:magazine';

/**
 * Service de gestion des catégories
 */
export class CategoryService {
  /**
   * Récupère toutes les catégories (avec cache)
   */
  async getAllCategories() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ALL_CATEGORIES);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const categories = await prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    // Mettre en cache
    cacheService.set(CACHE_KEY_ALL_CATEGORIES, categories);

    return categories;
  }

  /**
   * Récupère les catégories par type
   */
  async getCategoriesByType(type: 'MAGAZINE' | 'DESTINATION') {
    const cacheKey = type === 'DESTINATION' ? CACHE_KEY_DESTINATIONS : CACHE_KEY_MAGAZINE;

    // Vérifier le cache
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    // Mettre en cache
    cacheService.set(cacheKey, categories);

    return categories;
  }

  /**
   * Récupère une catégorie par son slug
   */
  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Catégorie non trouvée', 404);
    }

    return category;
  }

  /**
   * Récupère une catégorie par son ID
   */
  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new AppError('Catégorie non trouvée', 404);
    }

    return category;
  }

  /**
   * Crée une nouvelle catégorie
   */
  async createCategory(data: {
    name: string;
    description?: string;
    type: 'MAGAZINE' | 'DESTINATION';
    order?: number;
  }) {
    // Générer le slug
    const slug = generateSlug(data.name);

    // Vérifier l'unicité du slug
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new AppError('Une catégorie avec ce nom existe déjà', 409);
    }

    // Créer la catégorie
    const category = await prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });

    // Invalider le cache
    this.clearCache();

    return category;
  }

  /**
   * Met à jour une catégorie
   */
  async updateCategory(
    id: number,
    data: {
      name?: string;
      description?: string;
      type?: 'MAGAZINE' | 'DESTINATION';
      order?: number;
    }
  ) {
    // Vérifier que la catégorie existe
    await this.getCategoryById(id);

    // Générer un nouveau slug si le nom change
    let slug: string | undefined;
    if (data.name) {
      slug = generateSlug(data.name);
      
      // Vérifier l'unicité du nouveau slug
      const existing = await prisma.category.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new AppError('Une catégorie avec ce nom existe déjà', 409);
      }
    }

    // Mettre à jour
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
    });

    // Invalider le cache
    this.clearCache();

    return category;
  }

  /**
   * Supprime une catégorie
   */
  async deleteCategory(id: number) {
    // Vérifier que la catégorie existe
    const category = await this.getCategoryById(id);

    // Vérifier qu'elle n'a pas d'articles
    if (category._count.articles > 0) {
      throw new AppError(
        'Impossible de supprimer une catégorie contenant des articles',
        400
      );
    }

    // Supprimer
    await prisma.category.delete({
      where: { id },
    });

    // Invalider le cache
    this.clearCache();

    return { message: 'Catégorie supprimée avec succès' };
  }

  /**
   * Invalide tous les caches de catégories
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_ALL_CATEGORIES);
    cacheService.del(CACHE_KEY_DESTINATIONS);
    cacheService.del(CACHE_KEY_MAGAZINE);
  }
}

export const categoryService = new CategoryService();