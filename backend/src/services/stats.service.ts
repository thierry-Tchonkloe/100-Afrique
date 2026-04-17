import { prisma } from '../config/database';

/**
 * Service de statistiques pour le dashboard admin
 */
export class StatsService {
  /**
   * Récupère les statistiques globales
   */
  async getGlobalStats() {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalUsers,
      totalMedia,
      totalViews,
    ] = await Promise.all([
      // Total des articles
      prisma.article.count(),

      // Articles publiés
      prisma.article.count({
        where: { status: 'PUBLISHED' },
      }),

      // Brouillons
      prisma.article.count({
        where: { status: 'DRAFT' },
      }),

      // Total des catégories
      prisma.category.count(),

      // Total des utilisateurs
      prisma.user.count(),

      // Total des médias
      prisma.media.count(),

      // Total des vues
      prisma.article.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      articles: {
        total: totalArticles,
        published: publishedArticles,
        draft: draftArticles,
      },
      categories: totalCategories,
      users: totalUsers,
      media: totalMedia,
      totalViews: totalViews._sum.views || 0,
    };
  }

  /**
   * Récupère les articles les plus vus
   */
  async getMostViewedArticles(limit: number = 10) {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: limit,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return articles;
  }

  /**
   * Récupère les articles récents
   */
  async getRecentArticles(limit: number = 10) {
    const articles = await prisma.article.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return articles;
  }

  /**
   * Statistiques par catégorie
   */
  async getCategoryStats() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      articlesCount: cat._count.articles,
      content: cat.content, // ✅ Inclure le champ content pour les catégories
    }));
  }

  /**
   * Statistiques par auteur
   */
  async getAuthorStats() {
    const authors = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
    });

    return authors.map((author: any) => ({
      id: author.id,
      name: author.name,
      email: author.email,
      role: author.role,
      articlesCount: author._count.articles,
    }));
  }
}

export const statsService = new StatsService();