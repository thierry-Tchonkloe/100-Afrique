// src/controllers/destination.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';
import type { Prisma } from '@prisma/client';
import { destinationService, } from '../services/destination.service';


// Sélection complète réutilisable pour les destinations
const destinationFullSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  coverImage: true,
  continent: true,
  featured: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  // ── Nouveaux champs ──────────────────────────────────────
  slogan: true,
  typeZone: true,
  niveauGeographique: true,
  regionAssociee: true,
  langue: true,
  monnaie: true,
  fuseauHoraire: true,
  officeTourisme: true,
  climatDominant: true,
  population: true,
  codeTel: true,
  meillerePeriode: true,
} satisfies Prisma.DestinationSelect;

class DestinationController {
  /**
   * @route   GET /api/destinations
   * @desc    Liste des destinations avec filtres
   * @access  Public
   */
  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      continent,
      typeZone,   // ← nouveau filtre
      search,
      page = 1,
      pageSize = 8,
      status = 'PUBLISHED'
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    const where: Prisma.DestinationWhereInput = {
      status: status as string
    };

    if (continent && continent !== 'TOUTES') {
      where.continent = continent as string;
    }

    if (typeZone && typeZone !== 'TOUS') {
      where.typeZone = typeZone as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { slogan: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: Number(pageSize),
        select: {
          ...destinationFullSelect,
          _count: {
            select: { articles: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.destination.count({ where })
    ]);

    const formattedDestinations = destinations.map(({ _count, ...dest }) => ({
      ...dest,
      articleCount: _count.articles
    }));

    successResponse(res, {
      data: formattedDestinations,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(pageSize)),
        totalItems: total,
        pageSize: Number(pageSize)
      }
    });
  });

  /**
   * @route   GET /api/destinations/featured
   * @desc    Destinations coup de cœur
   * @access  Public
   */
  getFeatured = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = 6, region } = req.query;

    const where: Prisma.DestinationWhereInput = {
      featured: true,
      status: 'PUBLISHED'
    };

    if (region && region !== 'all') {
      where.continent = region as string;
    }

    const destinations = await prisma.destination.findMany({
      where,
      take: Number(limit),
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        coverImage: true,
        continent: true,
        slogan: true,      // ← nouveau
        typeZone: true,    // ← nouveau
      },
      orderBy: { createdAt: 'desc' }
    });

    // Mapper vers format Article pour compatibilité frontend
    const articles = destinations.map((dest) => ({
      id: dest.id,
      title: dest.name,
      slug: dest.slug,
      excerpt: dest.description || '',
      coverImage: dest.coverImage,
      category: {
        id: 0,
        name: 'Destination'
      }
    }));

    successResponse(res, articles);
  });

  /**
   * @route   GET /api/destinations/:slug
   * @desc    Détail d'une destination
   * @access  Public
   */
  getBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    // ✅ Validation : Vérifier que slug est bien un string
    if (!slug || Array.isArray(slug)) {
      errorResponse(res, 'Slug invalide', 400);
      return;
    }

    const destination = await prisma.destination.findUnique({
      where: { slug },
      select: {
        ...destinationFullSelect,
        articles: {
          where: { status: 'PUBLISHED' },
          take: 10,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            createdAt: true
          }
        }
      }
    });

    if (!destination) {
      errorResponse(res, 'Destination non trouvée', 404);
      return;
    }

    successResponse(res, destination);
  });

  // ════════════════════════════════════════════════
  // BACK-OFFICE (routes admin)
  // ════════════════════════════════════════════════

  /**
   * @route   GET /api/admin/destinations
   * @desc    Liste toutes les destinations (tous statuts)
   * @access  Private (Admin)
   */
  getAllAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      search,
      continent,
      typeZone,
      status,
      featured,
      page = '1',
      pageSize = '10',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize as string)));
    const skip = (pageNum - 1) * pageSizeNum;

    const where: Prisma.DestinationWhereInput = {};

    if (status) where.status = status as string;
    if (continent && continent !== 'TOUTES') where.continent = continent as string;
    if (typeZone && typeZone !== 'TOUS') where.typeZone = typeZone as string;
    if (featured === 'true') where.featured = true;
    if (featured === 'false') where.featured = false;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { slogan: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: pageSizeNum,
        select: { ...destinationFullSelect, _count: { select: { articles: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.destination.count({ where }),
    ]);

    successResponse(res, {
      data: destinations.map(({ _count, ...d }) => ({ ...d, articleCount: _count.articles })),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / pageSizeNum),
        totalItems: total,
        pageSize: pageSizeNum,
      },
    });
  });

  /**
   * @route   GET /api/admin/destinations/:id
   * @desc    Détail par ID
   * @access  Private (Admin)
   */
  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    const destination = await destinationService.getDestinationById(id);
    successResponse(res, destination);
  });

  /**
   * @route   POST /api/admin/destinations
   * @desc    Créer une destination
   * @access  Private (Admin)
   */
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const destination = await destinationService.createDestination(req.body);
    successResponse(res, destination, 'Destination créée avec succès', 201);
  });

  /**
   * @route   PUT /api/admin/destinations/:id
   * @desc    Modifier une destination
   * @access  Private (Admin)
   */
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (!id) {
      errorResponse(res, 'ID invalide', 400);
      return;
    }

    const destination = await destinationService.updateDestination(id, req.body);
    successResponse(res, destination, 'Destination modifiée avec succès');
  });

  /**
   * @route   DELETE /api/admin/destinations/:id
   * @desc    Supprimer une destination
   * @access  Private (Admin)
   */
  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (!id) {
      errorResponse(res, 'ID invalide', 400);
      return;
    }

    const result = await destinationService.deleteDestination(id);
    successResponse(res, result);
  });

  /**
   * @route   PATCH /api/admin/destinations/:id/featured
   * @desc    Basculer le statut featured
   * @access  Private (Admin)
   */
  toggleFeatured = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (!id) {
      errorResponse(res, 'ID invalide', 400);
      return;
    }

    const result = await destinationService.toggleFeatured(id);
    successResponse(res, result, `Destination ${result.featured ? 'mise en avant' : 'retirée des favoris'}`);
  });
}



export const destinationController = new DestinationController();
