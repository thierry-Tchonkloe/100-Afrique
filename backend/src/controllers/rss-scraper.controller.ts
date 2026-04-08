// src/controllers/rss-scraper.controller.ts
import { Request, Response } from 'express';
import { rssScraperService } from '../services/rss-scraper.service';
import { successResponse, errorResponse } from '../utils/response';
import { prisma } from '../config/database';
 
interface SourceGroup {
  source: string;
  _count: {
    source: number;
  };
}
 
/**
* Importe les articles depuis toutes les sources RSS
*/
export const importArticles = async (_req: Request, res: Response) => {
  try {
    console.log('🚀 Début de l\'importation RSS...');
    
    const result = await rssScraperService.scrapeAllSources();
    
    successResponse(res, result, 'Importation RSS terminée avec succès');
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'importation RSS:', error);
    errorResponse(res, error.message || 'Erreur lors de l\'importation RSS', 500);
  }
};
 
/**
* Récupère les magazines RSS avec pagination et filtres
*/
export const getRSSMagazines = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      pageSize = '12',
      search = '',
      source = '',
      category = '',
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;
 
    const pageNum = parseInt(page as string);
    const size = parseInt(pageSize as string);
    const skip = (pageNum - 1) * size;
 
    // Construction des filtres
    const where: any = {
      status: 'PUBLISHED'
    };
 
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { source: { contains: search as string, mode: 'insensitive' } }
      ];
    }
 
    if (source && typeof source === 'string') {
      where.source = { contains: source, mode: 'insensitive' };
    }
 
    // Récupération des magazines
    const [magazines, total] = await Promise.all([
      prisma.magazine.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: size
      }),
      prisma.magazine.count({ where })
    ]);
 
    // Enrichir les magazines avec les URLs de lecture/aperçu/téléchargement
    const enrichedMagazines = magazines.map((magazine: any) => ({
      ...magazine,
      readOnlineUrl: generateReadOnlineUrl(magazine),
      previewUrl: generatePreviewUrl(magazine),
      downloadUrl: generateDownloadUrl(magazine),
      shareUrl: generateShareUrl(magazine)
    }));
 
    const totalPages = Math.ceil(total / size);
 
    successResponse(res, {
      magazines: enrichedMagazines,
      pagination: {
        page: pageNum,
        pageSize: size,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        search,
        source,
        category,
        sortBy,
        sortOrder
      }
    }, 'Magazines RSS récupérés avec succès');
  } catch (error: any) {
    console.error('❌ Erreur récupération magazines RSS:', error);
    errorResponse(res, error.message || 'Erreur lors de la récupération des magazines', 500);
  }
};
 
/**
* Récupère un magazine RSS par son ID
*/
export const getRSSMagazineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNum = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
 
    const magazine = await prisma.magazine.findUnique({
      where: { id: idNum },
      include: {
        category: true
      }
    });
 
    if (!magazine) {
      return errorResponse(res, 'Magazine non trouvé', 404);
    }
 
    // Enrichir avec les URLs
    const enrichedMagazine = {
      ...magazine,
      readOnlineUrl: generateReadOnlineUrl(magazine),
      previewUrl: generatePreviewUrl(magazine),
      downloadUrl: generateDownloadUrl(magazine),
      shareUrl: generateShareUrl(magazine),
      relatedMagazines: await getRelatedMagazines(magazine.id, magazine.source)
    };
 
    successResponse(res, enrichedMagazine, 'Magazine récupéré avec succès');
  } catch (error: any) {
    console.error('❌ Erreur récupération magazine:', error);
    errorResponse(res, error.message || 'Erreur lors de la récupération du magazine', 500);
  }
};
 
/**
* Récupère un magazine RSS par son slug
*/
export const getRSSMagazineBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
 
    const magazine = await prisma.magazine.findUnique({
      where: { slug: Array.isArray(slug) ? slug[0] : slug },
      include: {
        category: true
      }
    });
 
    if (!magazine) {
      return errorResponse(res, 'Magazine non trouvé', 404);
    }
 
    // Enrichir avec les URLs
    const enrichedMagazine = {
      ...magazine,
      readOnlineUrl: generateReadOnlineUrl(magazine),
      previewUrl: generatePreviewUrl(magazine),
      downloadUrl: generateDownloadUrl(magazine),
      shareUrl: generateShareUrl(magazine),
      relatedMagazines: await getRelatedMagazines(magazine.id, magazine.source)
    };
 
    successResponse(res, enrichedMagazine, 'Magazine récupéré avec succès');
  } catch (error: any) {
    console.error('❌ Erreur récupération magazine par slug:', error);
    errorResponse(res, error.message || 'Erreur lors de la récupération du magazine', 500);
  }
};
 
/**
* Récupère les sources RSS disponibles
*/
export const getRSSSources = async (_req: Request, res: Response) => {
  try {
    const sources = await prisma.magazine.groupBy({
      by: ['source'],
      _count: {
        source: true
      },
      orderBy: {
        _count: {
          source: 'desc'
        }
      }
    });
 
    const sourceList = sources.map((item: SourceGroup) => ({
      name: item.source,
      count: item._count.source
    }));
 
    successResponse(res, sourceList, 'Sources RSS récupérées avec succès');
  } catch (error: any) {
    console.error('❌ Erreur récupération sources RSS:', error);
    errorResponse(res, error.message || 'Erreur lors de la récupération des sources', 500);
  }
};
 
/**
* Met à jour le statut d'un magazine RSS
*/
export const updateRSSMagazineStatus = async (_req: Request, res: Response) => {
  try {
    const { id } = _req.params;
    const idNum = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const { status } = _req.body;
 
    const magazine = await prisma.magazine.update({
      where: { id: idNum },
      data: { status }
    });
 
    successResponse(res, magazine, 'Statut du magazine mis à jour avec succès');
  } catch (error: any) {
    console.error('❌ Erreur mise à jour statut magazine:', error);
    errorResponse(res, error.message || 'Erreur lors de la mise à jour du statut', 500);
  }
};
 
// Fonctions utilitaires
function generateReadOnlineUrl(magazine: any): string {
  // Détecter le type de magazine et générer l'URL appropriée
  if (magazine.url && magazine.url.includes('issuu.com')) {
    return magazine.url;
  }
  if (magazine.url && magazine.url.includes('fliphtml5.com')) {
    return magazine.url;
  }
  // Pour les autres, retourner l'URL originale
  return magazine.url || '';
}
 
function generatePreviewUrl(magazine: any): string {
  // Générer une URL de preview
  return `/api/magazines/${magazine.id}/preview`;
}
 
function generateDownloadUrl(magazine: any): string {
  // Générer une URL de téléchargement
  return `/api/magazines/${magazine.id}/download`;
}
 
function generateShareUrl(magazine: any): string {
  // Générer une URL de partage
  return `${process.env.FRONTEND_URL || ''}/magazines/${magazine.id}`;
}
 
async function getRelatedMagazines(currentId: number, source: string, limit: number = 6) {
  return await prisma.magazine.findMany({
    where: {
      id: { not: currentId },
      source: source,
      status: 'PUBLISHED'
    },
    take: limit,
    orderBy: {
      publishedAt: 'desc'
    },
    include: {
      category: true
    }
  });
}
 