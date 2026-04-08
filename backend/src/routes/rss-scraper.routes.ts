// // src/routes/rss-scraper.routes.ts
// import { Router } from 'express';
// import { asyncHandler } from '../middlewares/errorHandler';
// import {
//   importArticles,
//   getRSSMagazines,
//   getRSSMagazineById,
//   getRSSMagazineBySlug,
//   getRSSSources,
//   updateRSSMagazineStatus
// } from '../controllers/rss-scraper.controller';
 
// const router = Router();
 
// /**
// * @route   POST /api/admin/scraper/import
// * @desc    Importe les articles depuis toutes les sources RSS
// * @access  Private (ADMIN)
// */
// router.post('/import', asyncHandler(importArticles));
 
// /**
// * @route   GET /api/magazines/rss
// * @desc    Récupère les magazines RSS avec pagination et filtres
// * @access  Public
// */
// router.get('/', asyncHandler(getRSSMagazines));
 
// /**
// * @route   GET /api/magazines/rss/:id
// * @desc    Récupère un magazine RSS par son ID
// * @access  Public
// */
// router.get('/:id', asyncHandler(getRSSMagazineById));
 
// /**
// * @route   GET /api/magazines/rss/slug/:slug
// * @desc    Récupère un magazine RSS par son slug
// * @access  Public
// */
// router.get('/slug/:slug', asyncHandler(getRSSMagazineBySlug));
 
// /**
// * @route   GET /api/magazines/rss/sources
// * @desc    Récupère les sources RSS disponibles
// * @access  Public
// */
// router.get('/sources/list', asyncHandler(getRSSSources));
 
// /**
// * @route   PUT /api/admin/magazines/rss/:id/status
// * @desc    Met à jour le statut d'un magazine RSS
// * @access  Private (ADMIN)
// */
// router.put('/:id/status', asyncHandler(updateRSSMagazineStatus));
 
// export default router;





// src/routes/rss-scraper.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  //importArticles,
  getRSSMagazines,
  getRSSMagazineById,
  getRSSMagazineBySlug,
  getRSSSources,
  //updateRSSMagazineStatus
} from '../controllers/rss-scraper.controller';
 
const router = Router();
 
 
/**
* @route   GET /api/magazines/rss
* @desc    Récupère les magazines RSS avec pagination et filtres
* @access  Public
*/
router.get('/', asyncHandler(getRSSMagazines));
 
/**
* @route   GET /api/magazines/rss/:id
* @desc    Récupère un magazine RSS par son ID
* @access  Public
*/
router.get('/:id', asyncHandler(getRSSMagazineById));
 
/**
* @route   GET /api/magazines/rss/slug/:slug
* @desc    Récupère un magazine RSS par son slug
* @access  Public
*/
router.get('/slug/:slug', asyncHandler(getRSSMagazineBySlug));
 
/**
* @route   GET /api/magazines/rss/sources
* @desc    Récupère les sources RSS disponibles
* @access  Public
*/
router.get('/sources/list', asyncHandler(getRSSSources));
 
// Note: admin-only routes (import, update status) have been moved to a dedicated
// admin router to avoid exposing them under the public `/magazines/rss` prefix.
 
export default router;
