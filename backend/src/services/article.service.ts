// src/services/article.service.ts
import slugify from 'slugify';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { generateSlug } from '../utils/slugify';
import type { Prisma } from '@prisma/client';

export type ArticleType = "ARTICLE" | "PAGE" | "VIDEO" | "SALON" | "DESTINATION";

export interface ArticleFilters {
  type?: ArticleType;
  search?: string;
  categoryId?: number;
  categorySlug?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
  featured?: boolean;
  authorId?: number;
  hasVideo?: boolean;
  year?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  /** ✅ NOUVEAU — filtre les articles/vidéos liés à une destination donnée */
  destinationId?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export class ArticleService {

  /**
   * Crée rapidement un article "brouillon" minimal (titre + métadonnées de
   * base), à compléter ensuite dans l'éditeur dédié au type de contenu.
   *
   * ⚠️ Pour le type DESTINATION, destinationId est toujours ignoré : une
   * fiche destination ne doit jamais se lier à elle-même.
   *
   * ✅ CORRECTIF — la réponse de création renvoie désormais l'objet
   * Article complet (avec destinationId + relation destination), au lieu
   * d'un `select` tronqué à {id, slug, title}. Sans cela, tout composant
   * frontend qui utiliserait directement la réponse de création (sans
   * re-fetch immédiat de l'article complet) perdait silencieusement
   * l'association à la destination choisie dans le modal de création
   * rapide — obligeant à la resélectionner manuellement dans l'éditeur.
   */
  async quickCreateArticle(
    data: {
      title: string;
      status?: string;
      categoryId: number;
      type: ArticleType;
      location?: string;
      startDate?: string;
      endDate?: string;
      website?: string;
      relatedContentIds?: number[];
      destinationId?: number;
    },
    authorId: number
  ) {
    const baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'fr' });

    const count = await prisma.article.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    return prisma.article.create({
      data: {
        title: data.title.trim(),
        slug,
        content: [],
        coverImage: '',
        status: data.status ?? 'DRAFT',
        categoryId: data.categoryId,
        authorId,
        type: data.type,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        website: data.website,
        destinationId:
          data.type !== 'DESTINATION' && data.destinationId ? data.destinationId : undefined,
      },
      // ✅ AVANT : select: { id: true, slug: true, title: true }
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Récupère la liste des articles avec filtres, pagination et tri
   */
  async getArticles(
    filters: ArticleFilters,
    pagination: PaginationParams,
    sort?: SortOptions
  ) {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ArticleWhereInput = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.categorySlug) {
      where.category = {
        slug: filters.categorySlug
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    // ✅ filtre les contenus liés à une destination donnée.
    // Utilisé par la page publique /destinations/[slug] pour afficher
    // les articles & vidéos associés.
    if (filters.destinationId) {
      where.destinationId = filters.destinationId;
    }

    if (filters.hasVideo) {
      where.content = {
        path: '$[*].type',
        array_contains: 'video'
      } as Prisma.JsonFilter;
    }

    if (filters.year) {
      where.createdAt = {
        gte: new Date(`${filters.year}-01-01`),
        lt: new Date(`${filters.year + 1}-01-01`)
      };
    }

    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {
        ...(filters.startDateFrom && { gte: filters.startDateFrom }),
        ...(filters.startDateTo && { lte: filters.startDateTo }),
      };
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput = sort
      ? { [sort.field]: sort.order }
      : { createdAt: 'desc' };

    const [articles, totalItems] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              color: true,
              content: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          destination: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              coverImage: true,
              slogan: true,
              typeZone: true,
              niveauGeographique: true,
              continent: true,
              regionAssociee: true,
              langue: true,
              monnaie: true,
              fuseauHoraire: true,
              officeTourisme: true,
              climatDominant: true,
              population: true,
              codeTel: true,
              meillerePeriode: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      totalItems,
    };
  }

  /**
   * Récupère un article par son slug
   */
  async getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            color: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!article) {
      throw new AppError('Article non trouvé', 404);
    }

    return article;
  }

  /**
   * Incrémente les vues d'un article
   */
  async incrementViews(id: number): Promise<void> {
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  /**
   * Récupère un article par son ID
   */
  async getArticleById(id: number) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        destination: {
          select: {
            id: true, name: true, slug: true,
            description: true, coverImage: true,
            slogan: true, typeZone: true, niveauGeographique: true,
            continent: true, regionAssociee: true,
            langue: true, monnaie: true, fuseauHoraire: true,
            officeTourisme: true, climatDominant: true,
            population: true, codeTel: true, meillerePeriode: true,
            status: true, featured: true,
          },
        },
      },
    });

    if (!article) {
      throw new AppError('Article non trouvé', 404);
    }

    return article;
  }

  /**
   * Crée un nouvel article
   */
  async createArticle(
    data: {
      title: string;
      content: Prisma.InputJsonValue;
      excerpt?: string;
      coverImage: string;
      categoryId: number;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
      featured?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      type: ArticleType;
      destinationId?: number;
      tags?: number[];
      sourceUrl?: string;
      duration?: string;
      videoType?: string;
      visibility?: string;
      pageTemplate?: string;
      includeInMainMenu?: boolean;
      includeInFooter?: boolean;
      sortOrder?: number;
      linkGroup?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      website?: string;
      relatedContentIds?: number[];
    },
    authorId: number
  ) {
    const baseSlug = generateSlug(data.title);

    const existingSlugs = await prisma.article.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: { slug: true },
    });

    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.some((a) => a.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        authorId,
        status: data.status ?? 'DRAFT',
        featured: data.featured ?? false,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        type: data.type ?? 'ARTICLE',
        destinationId: data.type !== 'DESTINATION' ? data.destinationId : undefined,
        tags: data.tags
          ? {
              connect: data.tags.map((id: number) => ({ id })),
            }
          : undefined,
        sourceUrl: data.sourceUrl,
        duration: data.duration,
        videoType: data.videoType,
        visibility: data.visibility,
        pageTemplate: data.pageTemplate,
        includeInMainMenu: data.includeInMainMenu ?? false,
        includeInFooter: data.includeInFooter ?? false,
        sortOrder: data.sortOrder,
        linkGroup: data.linkGroup,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        website: data.website,
        relatedContentIds: data.relatedContentIds,
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        destination: {
          select: {
            id: true, name: true, slug: true, description: true, coverImage: true,
            continent: true, status: true, featured: true, slogan: true, typeZone: true,
            niveauGeographique: true, regionAssociee: true, langue: true, monnaie: true,
            fuseauHoraire: true, officeTourisme: true, climatDominant: true, population: true,
            codeTel: true, meillerePeriode: true,
          },
        },
      },
    });

    return article;
  }

  /**
   * Met à jour un article existant
   */
  async updateArticle(
    id: number,
    data: {
      title?: string;
      content?: Prisma.InputJsonValue;
      excerpt?: string;
      coverImage?: string;
      categoryId?: number;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
      featured?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      destinationId?: number | null;
      tags?: number[];
      sourceUrl?: string | null;
      duration?: string | null;
      videoType?: string | null;
      visibility?: string | null;
      pageTemplate?: string | null;
      includeInMainMenu?: boolean;
      includeInFooter?: boolean;
      sortOrder?: number | null;
      linkGroup?: string | null;
      location?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      website?: string | null;
      relatedContentIds?: number[] | [];
    }
  ) {
    const existingArticle = await this.getArticleById(id);

    let slug = existingArticle.slug;
    if (data.title && data.title !== existingArticle.title) {
      const baseSlug = generateSlug(data.title);
      const existingSlugs = await prisma.article.findMany({
        where: {
          slug: { startsWith: baseSlug },
          NOT: { id },
        },
        select: { slug: true },
      });

      slug = baseSlug;
      let counter = 1;
      while (existingSlugs.some((a) => a.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updateData: Prisma.ArticleUpdateInput = {
      slug,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;

    if (data.categoryId !== undefined) {
      updateData.category = {
        connect: { id: data.categoryId }
      };
    }

    // ── Destination ──
    // Garde-fou : si l'article édité est lui-même de type DESTINATION,
    // on ignore toute tentative de le lier à une destination (y compris la sienne).
    if (data.destinationId !== undefined && existingArticle.type !== 'DESTINATION') {
      updateData.destination = data.destinationId
        ? { connect: { id: data.destinationId } }
        : { disconnect: true };
    }

    if (data.tags !== undefined) {
      updateData.tags = {
        set: data.tags.map((id: number) => ({ id })),
      };
    }

    if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.videoType !== undefined) updateData.videoType = data.videoType;

    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.pageTemplate !== undefined) updateData.pageTemplate = data.pageTemplate;
    if (data.includeInMainMenu !== undefined) updateData.includeInMainMenu = data.includeInMainMenu;
    if (data.includeInFooter !== undefined) updateData.includeInFooter = data.includeInFooter;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.linkGroup !== undefined) updateData.linkGroup = data.linkGroup;

    if (data.location !== undefined) updateData.location = data.location;
    if (data.startDate !== undefined)
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.relatedContentIds !== undefined) updateData.relatedContentIds = data.relatedContentIds;

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    return article;
  }

  /**
   * Supprime un article
   */
  async deleteArticle(id: number) {
    await this.getArticleById(id);

    await prisma.article.delete({
      where: { id },
    });

    return { message: 'Article supprimé avec succès' };
  }

  /**
   * Récupère les articles mis en avant
   */
  async getFeaturedArticles(limit: number = 5) {
    const articles = await prisma.article.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            content: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        destination: { select: { id: true, name: true, slug: true } },
      },
    });

    return articles;
  }
}

export const articleService = new ArticleService();












// // src/services/article.service.ts
// import slugify from 'slugify';
// import { prisma } from '../config/database';
// import { AppError } from '../middlewares/errorHandler';
// import { generateSlug } from '../utils/slugify';
// import type { Prisma } from '@prisma/client';

// export type ArticleType = "ARTICLE" | "PAGE" | "VIDEO" | "SALON" | "DESTINATION";

// export interface ArticleFilters {
//   type?: ArticleType;
//   search?: string;
//   categoryId?: number;
//   categorySlug?: string;
//   status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//   featured?: boolean;
//   authorId?: number;
//   hasVideo?: boolean;
//   year?: number;
//   startDateFrom?: Date;
//   startDateTo?: Date;
//   /** ✅ NOUVEAU — filtre les articles/vidéos liés à une destination donnée */
//   destinationId?: number;
// }

// export interface PaginationParams {
//   page: number;
//   pageSize: number;
// }

// export interface SortOptions {
//   field: string;
//   order: 'asc' | 'desc';
// }

// export class ArticleService {

//   /**
//    * Crée rapidement un article "brouillon" minimal (titre + métadonnées de
//    * base), à compléter ensuite dans l'éditeur dédié au type de contenu.
//    *
//    * ⚠️ Pour le type DESTINATION, destinationId est toujours ignoré : une
//    * fiche destination ne doit jamais se lier à elle-même.
//    */
//   async quickCreateArticle(
//     data: {
//       title: string;
//       status?: string;
//       categoryId: number;
//       type: ArticleType;
//       location?: string;
//       startDate?: string;
//       endDate?: string;
//       website?: string;
//       relatedContentIds?: number[];
//       destinationId?: number;
//     },
//     authorId: number
//   ) {
//     const baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'fr' });

//     const count = await prisma.article.count({
//       where: { slug: { startsWith: baseSlug } },
//     });
//     const slug = count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

//     return prisma.article.create({
//       data: {
//         title: data.title.trim(),
//         slug,
//         content: [],
//         coverImage: '',
//         status: data.status ?? 'DRAFT',
//         categoryId: data.categoryId,
//         authorId,
//         type: data.type,
//         location: data.location,
//         startDate: data.startDate ? new Date(data.startDate) : undefined,
//         endDate: data.endDate ? new Date(data.endDate) : undefined,
//         website: data.website,
//         destinationId:
//           data.type !== 'DESTINATION' && data.destinationId ? data.destinationId : undefined,
//       },
//       select: {
//         id: true,
//         slug: true,
//         title: true,
//       },
//     });
//   }

//   /**
//    * Récupère la liste des articles avec filtres, pagination et tri
//    */
//   async getArticles(
//     filters: ArticleFilters,
//     pagination: PaginationParams,
//     sort?: SortOptions
//   ) {
//     const { page, pageSize } = pagination;
//     const skip = (page - 1) * pageSize;

//     const where: Prisma.ArticleWhereInput = {};

//     if (filters.type) {
//       where.type = filters.type;
//     }

//     if (filters.search) {
//       where.OR = [
//         { title: { contains: filters.search, mode: 'insensitive' } },
//         { excerpt: { contains: filters.search, mode: 'insensitive' } },
//       ];
//     }

//     if (filters.categoryId) {
//       where.categoryId = filters.categoryId;
//     }

//     if (filters.categorySlug) {
//       where.category = {
//         slug: filters.categorySlug
//       };
//     }

//     if (filters.status) {
//       where.status = filters.status;
//     }

//     if (filters.featured !== undefined) {
//       where.featured = filters.featured;
//     }

//     if (filters.authorId) {
//       where.authorId = filters.authorId;
//     }

//     // ✅ NOUVEAU — filtre les contenus liés à une destination donnée.
//     // Utilisé par la page publique /destinations/[slug] pour afficher
//     // les articles & vidéos associés.
//     if (filters.destinationId) {
//       where.destinationId = filters.destinationId;
//     }

//     if (filters.hasVideo) {
//       where.content = {
//         path: '$[*].type',
//         array_contains: 'video'
//       } as Prisma.JsonFilter;
//     }

//     if (filters.year) {
//       where.createdAt = {
//         gte: new Date(`${filters.year}-01-01`),
//         lt: new Date(`${filters.year + 1}-01-01`)
//       };
//     }

//     if (filters.startDateFrom || filters.startDateTo) {
//       where.startDate = {
//         ...(filters.startDateFrom && { gte: filters.startDateFrom }),
//         ...(filters.startDateTo && { lte: filters.startDateTo }),
//       };
//     }

//     const orderBy: Prisma.ArticleOrderByWithRelationInput = sort
//       ? { [sort.field]: sort.order }
//       : { createdAt: 'desc' };

//     const [articles, totalItems] = await Promise.all([
//       prisma.article.findMany({
//         where,
//         skip,
//         take: pageSize,
//         orderBy,
//         include: {
//           category: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               type: true,
//               color: true,
//               content: true,
//             },
//           },
//           author: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           destination: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               description: true,
//               coverImage: true,
//               slogan: true,
//               typeZone: true,
//               niveauGeographique: true,
//               continent: true,
//               regionAssociee: true,
//               langue: true,
//               monnaie: true,
//               fuseauHoraire: true,
//               officeTourisme: true,
//               climatDominant: true,
//               population: true,
//               codeTel: true,
//               meillerePeriode: true,
//             },
//           },
//         },
//       }),
//       prisma.article.count({ where }),
//     ]);

//     return {
//       articles,
//       totalItems,
//     };
//   }

//   /**
//    * Récupère un article par son slug
//    */
//   async getArticleBySlug(slug: string) {
//     const article = await prisma.article.findUnique({
//       where: { slug },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             type: true,
//             color: true,
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: { id: true, name: true, slug: true },
//         },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Incrémente les vues d'un article
//    */
//   async incrementViews(id: number): Promise<void> {
//     await prisma.article.update({
//       where: { id },
//       data: { views: { increment: 1 } },
//     });
//   }

//   /**
//    * Récupère un article par son ID
//    */
//   async getArticleById(id: number) {
//     const article = await prisma.article.findUnique({
//       where: { id },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: {
//             id: true, name: true, slug: true,
//             description: true, coverImage: true,
//             slogan: true, typeZone: true, niveauGeographique: true,
//             continent: true, regionAssociee: true,
//             langue: true, monnaie: true, fuseauHoraire: true,
//             officeTourisme: true, climatDominant: true,
//             population: true, codeTel: true, meillerePeriode: true,
//             status: true, featured: true,
//           },
//         },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Crée un nouvel article
//    */
//   async createArticle(
//     data: {
//       title: string;
//       content: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage: string;
//       categoryId: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       type: ArticleType;
//       destinationId?: number;
//       tags?: number[];
//       sourceUrl?: string;
//       duration?: string;
//       videoType?: string;
//       visibility?: string;
//       pageTemplate?: string;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number;
//       linkGroup?: string;
//       location?: string;
//       startDate?: string;
//       endDate?: string;
//       website?: string;
//       relatedContentIds?: number[];
//     },
//     authorId: number
//   ) {
//     const baseSlug = generateSlug(data.title);

//     const existingSlugs = await prisma.article.findMany({
//       where: {
//         slug: {
//           startsWith: baseSlug,
//         },
//       },
//       select: { slug: true },
//     });

//     let slug = baseSlug;
//     let counter = 1;
//     while (existingSlugs.some((a) => a.slug === slug)) {
//       slug = `${baseSlug}-${counter}`;
//       counter++;
//     }

//     const article = await prisma.article.create({
//       data: {
//         title: data.title,
//         slug,
//         content: data.content,
//         excerpt: data.excerpt,
//         coverImage: data.coverImage,
//         categoryId: data.categoryId,
//         authorId,
//         status: data.status ?? 'DRAFT',
//         featured: data.featured ?? false,
//         metaTitle: data.metaTitle,
//         metaDescription: data.metaDescription,
//         type: data.type ?? 'ARTICLE',
//         destinationId: data.type !== 'DESTINATION' ? data.destinationId : undefined,
//         tags: data.tags
//           ? {
//               connect: data.tags.map((id: number) => ({ id })),
//             }
//           : undefined,
//         sourceUrl: data.sourceUrl,
//         duration: data.duration,
//         videoType: data.videoType,
//         visibility: data.visibility,
//         pageTemplate: data.pageTemplate,
//         includeInMainMenu: data.includeInMainMenu ?? false,
//         includeInFooter: data.includeInFooter ?? false,
//         sortOrder: data.sortOrder,
//         linkGroup: data.linkGroup,
//         location: data.location,
//         startDate: data.startDate ? new Date(data.startDate) : undefined,
//         endDate: data.endDate ? new Date(data.endDate) : undefined,
//         website: data.website,
//         relatedContentIds: data.relatedContentIds,
//       },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: {
//             id: true, name: true, slug: true, description: true, coverImage: true,
//             continent: true, status: true, featured: true, slogan: true, typeZone: true,
//             niveauGeographique: true, regionAssociee: true, langue: true, monnaie: true,
//             fuseauHoraire: true, officeTourisme: true, climatDominant: true, population: true,
//             codeTel: true, meillerePeriode: true,
//           },
//         },
//       },
//     });

//     return article;
//   }

//   /**
//    * Met à jour un article existant
//    */
//   async updateArticle(
//     id: number,
//     data: {
//       title?: string;
//       content?: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage?: string;
//       categoryId?: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       destinationId?: number | null;
//       tags?: number[];
//       sourceUrl?: string | null;
//       duration?: string | null;
//       videoType?: string | null;
//       visibility?: string | null;
//       pageTemplate?: string | null;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number | null;
//       linkGroup?: string | null;
//       location?: string | null;
//       startDate?: string | null;
//       endDate?: string | null;
//       website?: string | null;
//       relatedContentIds?: number[] | [];
//     }
//   ) {
//     const existingArticle = await this.getArticleById(id);

//     let slug = existingArticle.slug;
//     if (data.title && data.title !== existingArticle.title) {
//       const baseSlug = generateSlug(data.title);
//       const existingSlugs = await prisma.article.findMany({
//         where: {
//           slug: { startsWith: baseSlug },
//           NOT: { id },
//         },
//         select: { slug: true },
//       });

//       slug = baseSlug;
//       let counter = 1;
//       while (existingSlugs.some((a) => a.slug === slug)) {
//         slug = `${baseSlug}-${counter}`;
//         counter++;
//       }
//     }

//     const updateData: Prisma.ArticleUpdateInput = {
//       slug,
//     };

//     if (data.title !== undefined) updateData.title = data.title;
//     if (data.content !== undefined) updateData.content = data.content;
//     if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
//     if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
//     if (data.status !== undefined) updateData.status = data.status;
//     if (data.featured !== undefined) updateData.featured = data.featured;
//     if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
//     if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;

//     if (data.categoryId !== undefined) {
//       updateData.category = {
//         connect: { id: data.categoryId }
//       };
//     }

//     // ── Destination ──
//     // Garde-fou : si l'article édité est lui-même de type DESTINATION,
//     // on ignore toute tentative de le lier à une destination (y compris la sienne).
//     if (data.destinationId !== undefined && existingArticle.type !== 'DESTINATION') {
//       updateData.destination = data.destinationId
//         ? { connect: { id: data.destinationId } }
//         : { disconnect: true };
//     }

//     if (data.tags !== undefined) {
//       updateData.tags = {
//         set: data.tags.map((id: number) => ({ id })),
//       };
//     }

//     if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl;
//     if (data.duration !== undefined) updateData.duration = data.duration;
//     if (data.videoType !== undefined) updateData.videoType = data.videoType;

//     if (data.visibility !== undefined) updateData.visibility = data.visibility;
//     if (data.pageTemplate !== undefined) updateData.pageTemplate = data.pageTemplate;
//     if (data.includeInMainMenu !== undefined) updateData.includeInMainMenu = data.includeInMainMenu;
//     if (data.includeInFooter !== undefined) updateData.includeInFooter = data.includeInFooter;
//     if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
//     if (data.linkGroup !== undefined) updateData.linkGroup = data.linkGroup;

//     if (data.location !== undefined) updateData.location = data.location;
//     if (data.startDate !== undefined)
//       updateData.startDate = data.startDate ? new Date(data.startDate) : null;
//     if (data.endDate !== undefined)
//       updateData.endDate = data.endDate ? new Date(data.endDate) : null;
//     if (data.website !== undefined) updateData.website = data.website;
//     if (data.relatedContentIds !== undefined) updateData.relatedContentIds = data.relatedContentIds;

//     const article = await prisma.article.update({
//       where: { id },
//       data: updateData,
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return article;
//   }

//   /**
//    * Supprime un article
//    */
//   async deleteArticle(id: number) {
//     await this.getArticleById(id);

//     await prisma.article.delete({
//       where: { id },
//     });

//     return { message: 'Article supprimé avec succès' };
//   }

//   /**
//    * Récupère les articles mis en avant
//    */
//   async getFeaturedArticles(limit: number = 5) {
//     const articles = await prisma.article.findMany({
//       where: {
//         featured: true,
//         status: 'PUBLISHED',
//       },
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             color: true,
//             content: true,
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return articles;
//   }
// }

// export const articleService = new ArticleService();












// import slugify from 'slugify';
// import { prisma } from '../config/database';
// import { AppError } from '../middlewares/errorHandler';
// import { generateSlug } from '../utils/slugify';
// import type { Prisma } from '@prisma/client';

// export type ArticleType = "ARTICLE" | "PAGE" | "VIDEO" | "SALON" | "DESTINATION";

// export interface ArticleFilters {
//   type?: ArticleType;
//   search?: string;
//   categoryId?: number;
//   categorySlug?: string;
//   status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//   featured?: boolean;
//   authorId?: number;
//   hasVideo?: boolean;
//   year?: number;
//   startDateFrom?: Date;
//   startDateTo?: Date;
// }

// export interface PaginationParams {
//   page: number;
//   pageSize: number;
// }

// export interface SortOptions {
//   field: string;
//   order: 'asc' | 'desc';
// }

// export class ArticleService {

//   /**
//    * Crée rapidement un article "brouillon" minimal (titre + métadonnées de
//    * base), à compléter ensuite dans l'éditeur dédié au type de contenu.
//    *
//    * ⚠️ Pour le type DESTINATION, destinationId est toujours ignoré : une
//    * fiche destination ne doit jamais se lier à elle-même (cause historique
//    * du bug "1 articles & vidéos" affiché sur sa propre page publique).
//    */
//   async quickCreateArticle(
//     data: {
//       title: string;
//       status?: string;
//       categoryId: number;
//       type: ArticleType;
//       location?: string;
//       startDate?: string;
//       endDate?: string;
//       website?: string;
//       relatedContentIds?: number[];
//       /** Association optionnelle à une destination existante (ARTICLE/VIDEO uniquement) */
//       destinationId?: number;
//     },
//     authorId: number
//   ) {
//     const baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'fr' });

//     const count = await prisma.article.count({
//       where: { slug: { startsWith: baseSlug } },
//     });
//     const slug = count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

//     return prisma.article.create({
//       data: {
//         title: data.title.trim(),
//         slug,
//         content: [],
//         coverImage: '',
//         status: data.status ?? 'DRAFT',
//         categoryId: data.categoryId,
//         authorId,
//         type: data.type,
//         location: data.location,
//         startDate: data.startDate ? new Date(data.startDate) : undefined,
//         endDate: data.endDate ? new Date(data.endDate) : undefined,
//         website: data.website,
//         // ✅ Garde-fou anti self-link
//         destinationId:
//           data.type !== 'DESTINATION' && data.destinationId ? data.destinationId : undefined,
//       },
//       select: {
//         id: true,
//         slug: true,
//         title: true,
//       },
//     });
//   }

//   /**
//    * Récupère la liste des articles avec filtres, pagination et tri
//    */
//   async getArticles(
//     filters: ArticleFilters,
//     pagination: PaginationParams,
//     sort?: SortOptions
//   ) {
//     const { page, pageSize } = pagination;
//     const skip = (page - 1) * pageSize;

//     const where: Prisma.ArticleWhereInput = {};

//     if (filters.type) {
//       where.type = filters.type;
//     }

//     if (filters.search) {
//       where.OR = [
//         { title: { contains: filters.search, mode: 'insensitive' } },
//         { excerpt: { contains: filters.search, mode: 'insensitive' } },
//       ];
//     }

//     if (filters.categoryId) {
//       where.categoryId = filters.categoryId;
//     }

//     if (filters.categorySlug) {
//       where.category = {
//         slug: filters.categorySlug
//       };
//     }

//     if (filters.status) {
//       where.status = filters.status;
//     }

//     if (filters.featured !== undefined) {
//       where.featured = filters.featured;
//     }

//     if (filters.authorId) {
//       where.authorId = filters.authorId;
//     }

//     if (filters.hasVideo) {
//       where.content = {
//         path: '$[*].type',
//         array_contains: 'video'
//       } as Prisma.JsonFilter;
//     }

//     if (filters.year) {
//       where.createdAt = {
//         gte: new Date(`${filters.year}-01-01`),
//         lt: new Date(`${filters.year + 1}-01-01`)
//       };
//     }

//     if (filters.startDateFrom || filters.startDateTo) {
//       where.startDate = {
//         ...(filters.startDateFrom && { gte: filters.startDateFrom }),
//         ...(filters.startDateTo && { lte: filters.startDateTo }),
//       };
//     }

//     const orderBy: Prisma.ArticleOrderByWithRelationInput = sort
//       ? { [sort.field]: sort.order }
//       : { createdAt: 'desc' };

//     const [articles, totalItems] = await Promise.all([
//       prisma.article.findMany({
//         where,
//         skip,
//         take: pageSize,
//         orderBy,
//         include: {
//           category: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               type: true,
//               color: true,
//               content: true,
//             },
//           },
//           author: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           destination: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               description: true,
//               coverImage: true,
//               slogan: true,
//               typeZone: true,
//               niveauGeographique: true,
//               continent: true,
//               regionAssociee: true,
//               langue: true,
//               monnaie: true,
//               fuseauHoraire: true,
//               officeTourisme: true,
//               climatDominant: true,
//               population: true,
//               codeTel: true,
//               meillerePeriode: true,
//             },
//           },
//         },
//       }),
//       prisma.article.count({ where }),
//     ]);

//     return {
//       articles,
//       totalItems,
//     };
//   }

//   /**
//    * Récupère un article par son slug
//    */
//   async getArticleBySlug(slug: string) {
//     const article = await prisma.article.findUnique({
//       where: { slug },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             type: true,
//             color: true,
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: { id: true, name: true, slug: true },
//         },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Incrémente les vues d'un article
//    */
//   async incrementViews(id: number): Promise<void> {
//     await prisma.article.update({
//       where: { id },
//       data: { views: { increment: 1 } },
//     });
//   }

//   /**
//    * Récupère un article par son ID
//    */
//   async getArticleById(id: number) {
//     const article = await prisma.article.findUnique({
//       where: { id },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: {
//             id: true, name: true, slug: true,
//             description: true, coverImage: true,
//             slogan: true, typeZone: true, niveauGeographique: true,
//             continent: true, regionAssociee: true,
//             langue: true, monnaie: true, fuseauHoraire: true,
//             officeTourisme: true, climatDominant: true,
//             population: true, codeTel: true, meillerePeriode: true,
//             status: true, featured: true,
//           },
//         },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Crée un nouvel article
//    */
//   async createArticle(
//     data: {
//       title: string;
//       content: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage: string;
//       categoryId: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       type: ArticleType;
//       destinationId?: number;
//       tags?: number[];
//       sourceUrl?: string;
//       duration?: string;
//       videoType?: string;
//       visibility?: string;
//       pageTemplate?: string;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number;
//       linkGroup?: string;
//       location?: string;
//       startDate?: string;
//       endDate?: string;
//       website?: string;
//       relatedContentIds?: number[];
//     },
//     authorId: number
//   ) {
//     const baseSlug = generateSlug(data.title);

//     const existingSlugs = await prisma.article.findMany({
//       where: {
//         slug: {
//           startsWith: baseSlug,
//         },
//       },
//       select: { slug: true },
//     });

//     let slug = baseSlug;
//     let counter = 1;
//     while (existingSlugs.some((a) => a.slug === slug)) {
//       slug = `${baseSlug}-${counter}`;
//       counter++;
//     }

//     const article = await prisma.article.create({
//       data: {
//         title: data.title,
//         slug,
//         content: data.content,
//         excerpt: data.excerpt,
//         coverImage: data.coverImage,
//         categoryId: data.categoryId,
//         authorId,
//         status: data.status ?? 'DRAFT',
//         featured: data.featured ?? false,
//         metaTitle: data.metaTitle,
//         metaDescription: data.metaDescription,
//         type: data.type ?? 'ARTICLE',
//         // ✅ Même garde-fou que quickCreateArticle
//         destinationId: data.type !== 'DESTINATION' ? data.destinationId : undefined,
//         tags: data.tags
//           ? {
//               connect: data.tags.map((id: number) => ({ id })),
//             }
//           : undefined,
//         sourceUrl: data.sourceUrl,
//         duration: data.duration,
//         videoType: data.videoType,
//         visibility: data.visibility,
//         pageTemplate: data.pageTemplate,
//         includeInMainMenu: data.includeInMainMenu ?? false,
//         includeInFooter: data.includeInFooter ?? false,
//         sortOrder: data.sortOrder,
//         linkGroup: data.linkGroup,
//         location: data.location,
//         startDate: data.startDate ? new Date(data.startDate) : undefined,
//         endDate: data.endDate ? new Date(data.endDate) : undefined,
//         website: data.website,
//         relatedContentIds: data.relatedContentIds,
//       },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: {
//             id: true, name: true, slug: true, description: true, coverImage: true,
//             continent: true, status: true, featured: true, slogan: true, typeZone: true,
//             niveauGeographique: true, regionAssociee: true, langue: true, monnaie: true,
//             fuseauHoraire: true, officeTourisme: true, climatDominant: true, population: true,
//             codeTel: true, meillerePeriode: true,
//           },
//         },
//       },
//     });

//     return article;
//   }

//   /**
//    * Met à jour un article existant
//    */
//   async updateArticle(
//     id: number,
//     data: {
//       title?: string;
//       content?: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage?: string;
//       categoryId?: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       destinationId?: number | null;
//       tags?: number[];
//       sourceUrl?: string | null;
//       duration?: string | null;
//       videoType?: string | null;
//       visibility?: string | null;
//       pageTemplate?: string | null;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number | null;
//       linkGroup?: string | null;
//       location?: string | null;
//       startDate?: string | null;
//       endDate?: string | null;
//       website?: string | null;
//       relatedContentIds?: number[] | [];
//     }
//   ) {
//     const existingArticle = await this.getArticleById(id);

//     let slug = existingArticle.slug;
//     if (data.title && data.title !== existingArticle.title) {
//       const baseSlug = generateSlug(data.title);
//       const existingSlugs = await prisma.article.findMany({
//         where: {
//           slug: { startsWith: baseSlug },
//           NOT: { id },
//         },
//         select: { slug: true },
//       });

//       slug = baseSlug;
//       let counter = 1;
//       while (existingSlugs.some((a) => a.slug === slug)) {
//         slug = `${baseSlug}-${counter}`;
//         counter++;
//       }
//     }

//     const updateData: Prisma.ArticleUpdateInput = {
//       slug,
//     };

//     if (data.title !== undefined) updateData.title = data.title;
//     if (data.content !== undefined) updateData.content = data.content;
//     if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
//     if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
//     if (data.status !== undefined) updateData.status = data.status;
//     if (data.featured !== undefined) updateData.featured = data.featured;
//     if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
//     if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;

//     if (data.categoryId !== undefined) {
//       updateData.category = {
//         connect: { id: data.categoryId }
//       };
//     }

//     // ── Destination ──
//     // ✅ Garde-fou : si l'article édité est lui-même de type DESTINATION,
//     // on ignore toute tentative de le lier à une destination (y compris la sienne).
//     if (data.destinationId !== undefined && existingArticle.type !== 'DESTINATION') {
//       updateData.destination = data.destinationId
//         ? { connect: { id: data.destinationId } }
//         : { disconnect: true };
//     }

//     if (data.tags !== undefined) {
//       updateData.tags = {
//         set: data.tags.map((id: number) => ({ id })),
//       };
//     }

//     if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl;
//     if (data.duration !== undefined) updateData.duration = data.duration;
//     if (data.videoType !== undefined) updateData.videoType = data.videoType;

//     if (data.visibility !== undefined) updateData.visibility = data.visibility;
//     if (data.pageTemplate !== undefined) updateData.pageTemplate = data.pageTemplate;
//     if (data.includeInMainMenu !== undefined) updateData.includeInMainMenu = data.includeInMainMenu;
//     if (data.includeInFooter !== undefined) updateData.includeInFooter = data.includeInFooter;
//     if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
//     if (data.linkGroup !== undefined) updateData.linkGroup = data.linkGroup;

//     if (data.location !== undefined) updateData.location = data.location;
//     if (data.startDate !== undefined)
//       updateData.startDate = data.startDate ? new Date(data.startDate) : null;
//     if (data.endDate !== undefined)
//       updateData.endDate = data.endDate ? new Date(data.endDate) : null;
//     if (data.website !== undefined) updateData.website = data.website;
//     if (data.relatedContentIds !== undefined) updateData.relatedContentIds = data.relatedContentIds;

//     const article = await prisma.article.update({
//       where: { id },
//       data: updateData,
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return article;
//   }

//   /**
//    * Supprime un article
//    */
//   async deleteArticle(id: number) {
//     await this.getArticleById(id);

//     await prisma.article.delete({
//       where: { id },
//     });

//     return { message: 'Article supprimé avec succès' };
//   }

//   /**
//    * Récupère les articles mis en avant
//    */
//   async getFeaturedArticles(limit: number = 5) {
//     const articles = await prisma.article.findMany({
//       where: {
//         featured: true,
//         status: 'PUBLISHED',
//       },
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             color: true,
//             content: true,
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return articles;
//   }
// }

// export const articleService = new ArticleService();










// // src/services/article.service.ts
// import slugify from 'slugify';
// import { prisma } from '../config/database';
// import { AppError } from '../middlewares/errorHandler';
// import { generateSlug } from '../utils/slugify';
// import type { Prisma } from '@prisma/client';
// //import { slugify } from 'zod';

// export type ArticleType = "ARTICLE" | "PAGE" | "VIDEO" | "SALON" | "DESTINATION";
// /**
//  * Interface pour les filtres de recherche d'articles
//  */
// export interface ArticleFilters {
//   type ?: ArticleType;
//   search?: string;
//   categoryId?: number;
//   categorySlug?: string;
//   status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//   featured?: boolean;
//   authorId?: number;
//   hasVideo?: boolean;
//   year?: number;
//   // ── Nouveaux filtres SALON ──
//   startDateFrom?: Date;
//   startDateTo?: Date;
// }

// /**
//  * Interface pour la pagination
//  */
// export interface PaginationParams {
//   page: number;
//   pageSize: number;
// }

// /**
//  * Interface pour les options de tri
//  */
// export interface SortOptions {
//   field: string;
//   order: 'asc' | 'desc';
// }

// /**
//  * Service de gestion des articles
//  */
// export class ArticleService {

//   // Dans articleService, ajoute cette méthode

// async quickCreateArticle(
//   data: { title: string; status?: string; categoryId: number, type: ArticleType, location?: string; startDate?: string; endDate?: string; website?: string; relatedContentIds?: number[] },
//   authorId: number
// ) {
//   const baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'fr' });
  
//   // Slug unique
//   const count = await prisma.article.count({
//     where: { slug: { startsWith: baseSlug } },
//   });
//   const slug = count > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

//   return prisma.article.create({
//     data: {
//       title:      data.title.trim(),
//       slug,
//       content:    [],   // tableau vide, rempli par l'éditeur
//       coverImage: '',   // idem
//       status:     data.status ?? 'DRAFT',
//       categoryId: data.categoryId,
//       authorId,
//       type: data.type,
//       location: data.location,
//       startDate: data.startDate ? new Date(data.startDate) : undefined,
//       endDate: data.endDate ? new Date(data.endDate) : undefined,
//       website: data.website,
//     },
//     select: {
//       id:    true,
//       slug:  true,
//       title: true,
//     },
//   });
// }

//   /**
//    * Récupère la liste des articles avec filtres, pagination et tri
//    */
//   async getArticles(
//     filters: ArticleFilters,
//     pagination: PaginationParams,
//     sort?: SortOptions
//   ) {
//     const { page, pageSize } = pagination;
//     const skip = (page - 1) * pageSize;

//     // Construction des conditions de filtrage
//     const where: Prisma.ArticleWhereInput = {};

//     if (filters.type) {
//       where.type = filters.type; // ✅ IMPORTANT
//     }

//     // Filtre de recherche textuelle
//     if (filters.search) {
//       where.OR = [
//         { title: { contains: filters.search, mode: 'insensitive' } },
//         { excerpt: { contains: filters.search, mode: 'insensitive' } },
//       ];
//     }

//     // Filtre par ID de catégorie
//     if (filters.categoryId) {
//       where.categoryId = filters.categoryId;
//     }

//     // Filtre par slug de catégorie
//     if (filters.categorySlug) {
//       where.category = {
//         slug: filters.categorySlug
//       };
//     }

//     // Filtre par statut
//     if (filters.status) {
//       where.status = filters.status;
//     }


//     // Filtre featured
//     if (filters.featured !== undefined) {
//       where.featured = filters.featured;
//     }

//     // Filtre par auteur
//     if (filters.authorId) {
//       where.authorId = filters.authorId;
//     }

//     // ✅ NOUVEAU: Filtre pour les articles avec vidéos
//     if (filters.hasVideo) {
//       where.content = {
//         path: '$[*].type',
//         array_contains: 'video'
//       } as Prisma.JsonFilter;
//     }

//     // ✅ NOUVEAU: Filtre par année
//     if (filters.year) {
//       where.createdAt = {
//         gte: new Date(`${filters.year}-01-01`),
//         lt: new Date(`${filters.year + 1}-01-01`)
//       };
//     }

//     // ── Filtre SALON par plage de dates ──────────────────────
//     if (filters.startDateFrom || filters.startDateTo) {
//       where.startDate = {
//         ...(filters.startDateFrom && { gte: filters.startDateFrom }),
//         ...(filters.startDateTo && { lte: filters.startDateTo }),
//       };
//     }

//     // Options de tri
//     const orderBy: Prisma.ArticleOrderByWithRelationInput = sort 
//       ? { [sort.field]: sort.order }
//       : { createdAt: 'desc' };

//     // Récupération des articles et du total
//     const [articles, totalItems] = await Promise.all([
//       prisma.article.findMany({
//         where,
//         skip,
//         take: pageSize,
//         orderBy,
//         include: {
//           category: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               type: true,
//               color: true,
//               content: true, // ✅ Inclure le champ content pour les blocs de type vidéo
//             },
//           },
//           author: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           destination: {
//             select: {
//               id: true,
//               name: true,
//               slug: true,
//               description: true,
//               coverImage: true,
//               slogan: true,
//               typeZone: true,
//               niveauGeographique: true,
//               continent: true,
//               regionAssociee: true,
//               langue: true,
//               monnaie: true,
//               fuseauHoraire: true,
//               officeTourisme: true,
//               climatDominant: true,
//               population: true,
//               codeTel: true,
//               meillerePeriode: true,
//             },
//           },
//         },
//       }),
//       prisma.article.count({ where }),
//     ]);

//     return {
//       articles,
//       totalItems,
//     };
//   }

//   /**
//    * Récupère un article par son slug
//    */
//   async getArticleBySlug(slug: string) {
//     const article = await prisma.article.findUnique({
//       where: { slug },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             type: true,
//             color: true,
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: {
//           select: { id: true, name: true, slug: true },
//         },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Incrémente les vues d'un article
//    */
//   async incrementViews(id: number): Promise<void> {
//     await prisma.article.update({
//       where: { id },
//       data: { views: { increment: 1 } },
//     });
//   }

//   /**
//    * Récupère un article par son ID
//    */
//   async getArticleById(id: number) {
//     const article = await prisma.article.findUnique({
//       where: { id },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       destination: {
//         select: {
//           id: true, name: true, slug: true,
//           description: true, coverImage: true,
//           slogan: true, typeZone: true, niveauGeographique: true,
//           continent: true, regionAssociee: true,
//           langue: true, monnaie: true, fuseauHoraire: true,
//           officeTourisme: true, climatDominant: true,
//           population: true, codeTel: true, meillerePeriode: true,
//           status: true, featured: true,
//         },
//       },
//       },
//     });

//     if (!article) {
//       throw new AppError('Article non trouvé', 404);
//     }

//     return article;
//   }

//   /**
//    * Crée un nouvel article
//    */
//   async createArticle(
//     data: {
//       title: string;
//       content: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage: string;
//       categoryId: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       type: ArticleType;
//       destinationId?: number;
//       tags?: number[];
//       // ── VIDEO ──
//       sourceUrl?: string;
//       duration?: string;
//       videoType?: string;
//       // ── PAGE ──
//       visibility?: string;
//       pageTemplate?: string;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number;
//       linkGroup?: string;
//       // ── SALON ──
//       location?: string;
//       startDate?: string;
//       endDate?: string;
//       website?: string;
//       relatedContentIds?: number[];
//     },
//     authorId: number
//   ) {
//     // Générer le slug à partir du titre
//     const baseSlug = generateSlug(data.title);

//     // Vérifier l'unicité du slug
//     const existingSlugs = await prisma.article.findMany({
//       where: {
//         slug: {
//           startsWith: baseSlug,
//         },
//       },
//       select: { slug: true },
//     });

//     let slug = baseSlug;
//     let counter = 1;
//     while (existingSlugs.some((a) => a.slug === slug)) {
//       slug = `${baseSlug}-${counter}`;
//       counter++;
//     }

//     // Créer l'article
//     const article = await prisma.article.create({
//       data: {
//         title: data.title,
//         slug,
//         content: data.content,
//         excerpt: data.excerpt,
//         coverImage: data.coverImage,
//         categoryId: data.categoryId,
//         authorId,
//         status: data.status ?? 'DRAFT',
//         featured: data.featured ?? false,
//         metaTitle: data.metaTitle,
//         metaDescription: data.metaDescription,
//         type: data.type ?? 'ARTICLE',
//         // ── Destination ──
//         // ...(data.destinationId && {
//         //   destination: { connect: { id: data.destinationId } },
//         // }),
//         destinationId: data.destinationId,
//         tags: data.tags
//         ? {
//             connect: data.tags.map((id: number) => ({ id })),
//           }
//         : undefined,

//         // ── VIDEO ──
//         sourceUrl: data.sourceUrl,
//         duration: data.duration,
//         videoType: data.videoType,
//         // ── PAGE ──
//         visibility: data.visibility,
//         pageTemplate: data.pageTemplate,
//         includeInMainMenu: data.includeInMainMenu ?? false,
//         includeInFooter: data.includeInFooter ?? false,
//         sortOrder: data.sortOrder,
//         linkGroup: data.linkGroup,
//         // ── SALON ──
//         location: data.location,
//         startDate: data.startDate ? new Date(data.startDate) : undefined,
//         endDate: data.endDate ? new Date(data.endDate) : undefined,
//         website: data.website,
//         relatedContentIds: data.relatedContentIds,
//       },
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true, description:true, coverImage: true, continent: true, status: true, featured: true, slogan: true, typeZone: true, niveauGeographique: true, regionAssociee: true, langue: true, monnaie: true, fuseauHoraire: true, officeTourisme: true, climatDominant: true, population: true, codeTel: true, meillerePeriode: true } },
//       },
//     });

//     return article;
//   }

//   /**
//    * Met à jour un article existant
//    */
//   async updateArticle(
//     id: number,
//     data: {
//       title?: string;
//       content?: Prisma.InputJsonValue;
//       excerpt?: string;
//       coverImage?: string;
//       categoryId?: number;
//       status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REVIEW';
//       featured?: boolean;
//       metaTitle?: string;
//       metaDescription?: string;
//       destinationId?: number | null;
//       tags?: number[];
//       // ── VIDEO ──
//       sourceUrl?: string | null;
//       duration?: string | null;
//       videoType?: string | null;
//       // ── PAGE ──
//       visibility?: string | null;
//       pageTemplate?: string | null;
//       includeInMainMenu?: boolean;
//       includeInFooter?: boolean;
//       sortOrder?: number | null;
//       linkGroup?: string | null;
//       // ── SALON ──
//       location?: string | null;
//       startDate?: string | null;
//       endDate?: string | null;
//       website?: string | null;
//       relatedContentIds?: number[] | [];
//     }
//   ) {
//     // Vérifier que l'article existe
//     const existingArticle = await this.getArticleById(id);

//     // Si le titre change, régénérer le slug
//     let slug = existingArticle.slug;
//     if (data.title && data.title !== existingArticle.title) {
//       const baseSlug = generateSlug(data.title);
//       const existingSlugs = await prisma.article.findMany({
//         where: {
//           slug: { startsWith: baseSlug },
//           NOT: { id },
//         },
//         select: { slug: true },
//       });

//       slug = baseSlug;
//       let counter = 1;
//       while (existingSlugs.some((a) => a.slug === slug)) {
//         slug = `${baseSlug}-${counter}`;
//         counter++;
//       }
//     }

//     // Construire l'objet de mise à jour
//     const updateData: Prisma.ArticleUpdateInput = {
//       slug,
//     };

//     if (data.title !== undefined) updateData.title = data.title;
//     if (data.content !== undefined) updateData.content = data.content;
//     if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
//     if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
//     if (data.status !== undefined) updateData.status = data.status;
//     if (data.featured !== undefined) updateData.featured = data.featured;
//     if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
//     if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;

//     // Gestion spéciale pour categoryId (relation)
//     if (data.categoryId !== undefined) {
//       updateData.category = {
//         connect: { id: data.categoryId }
//       };
//     }

//     // ── Destination ──
//     if (data.destinationId !== undefined) {
//       updateData.destination = data.destinationId
//         ? { connect: { id: data.destinationId } }
//         : { disconnect: true };
//     }

//     // if (data.tags !== undefined) {
//     //   updateData.tags = data.tags
//     //     ? {
//     //         connect: data.tags.map((id: number) => ({ id })),
//     //       }
//     //     : undefined;
//     // }
//     if (data.tags !== undefined) {
//       updateData.tags = {
//         set: data.tags.map((id: number) => ({ id })),
//     };
// }

//     // ── VIDEO ──
//     if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl;
//     if (data.duration !== undefined) updateData.duration = data.duration;
//     if (data.videoType !== undefined) updateData.videoType = data.videoType;

//     // ── PAGE ──
//     if (data.visibility !== undefined) updateData.visibility = data.visibility;
//     if (data.pageTemplate !== undefined) updateData.pageTemplate = data.pageTemplate;
//     if (data.includeInMainMenu !== undefined) updateData.includeInMainMenu = data.includeInMainMenu;
//     if (data.includeInFooter !== undefined) updateData.includeInFooter = data.includeInFooter;
//     if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
//     if (data.linkGroup !== undefined) updateData.linkGroup = data.linkGroup;


//     // ── SALON ──
//     if (data.location !== undefined) updateData.location = data.location;
//     if (data.startDate !== undefined)
//       updateData.startDate = data.startDate ? new Date(data.startDate) : null;
//     if (data.endDate !== undefined)
//       updateData.endDate = data.endDate ? new Date(data.endDate) : null;
//     if (data.website !== undefined) updateData.website = data.website;
//       if (data.relatedContentIds !== undefined) updateData.relatedContentIds = data.relatedContentIds;

//     // Mettre à jour l'article
//     const article = await prisma.article.update({
//       where: { id },
//       data: updateData,
//       include: {
//         category: true,
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return article;
//   }

//   /**
//    * Supprime un article
//    */
//   async deleteArticle(id: number) {
//     // Vérifier que l'article existe
//     await this.getArticleById(id);

//     // Supprimer l'article
//     await prisma.article.delete({
//       where: { id },
//     });

//     return { message: 'Article supprimé avec succès' };
//   }

//   /**
//    * Récupère les articles mis en avant
//    */
//   async getFeaturedArticles(limit: number = 5) {
//     const articles = await prisma.article.findMany({
//       where: {
//         featured: true,
//         status: 'PUBLISHED',
//       },
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//       include: {
//         category: {
//           select: {
//             id: true,
//             name: true,
//             slug: true,
//             color: true,
//             content: true, // ✅ Inclure le champ content pour les blocs de type vidéo
//           },
//         },
//         author: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         destination: { select: { id: true, name: true, slug: true } },
//       },
//     });

//     return articles;
//   }
// }

// // ✅ IMPORTANT : Exporter l'instance du service
// export const articleService = new ArticleService();