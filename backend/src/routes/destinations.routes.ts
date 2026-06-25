import { Router } from 'express';
import { destinationController } from '../controllers/destination.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import {
  createDestinationSchema,
  updateDestinationSchema,
  getDestinationByIdSchema,
  //getDestinationBySlugSchema,
} from '../validators/destination.schema';

const router = Router();

// ════════════════════════════════════════════════
// FRONT-OFFICE (public, sans authentification)
// ════════════════════════════════════════════════

/**
 * @route   GET /api/destinations
 * @desc    Liste des destinations avec filtres
 * @access  Public
 */
router.get('/', destinationController.getAll);

/**
 * @route   GET /api/destinations/featured
 * @desc    Destinations coup de cœur
 * @access  Public
 */
router.get('/featured', destinationController.getFeatured);

/**
 * @route   GET /api/destinations/:slug
 * @desc    Détail d'une destination
 * @access  Public
 *
 * ⚠️ Doit rester déclarée après les routes statiques ci-dessus
 * (featured, admin) pour éviter qu'Express ne les intercepte
 * en les interprétant comme un :slug.
 */
router.get('/:slug', destinationController.getBySlug);

// ════════════════════════════════════════════════
// BACK-OFFICE (admin, authentification requise)
// ════════════════════════════════════════════════

// ✅ Toutes les routes /admin/destinations* nécessitent désormais une
// authentification — elles étaient auparavant accessibles sans token.
router.use('/admin/destinations', authenticate);

router.get(   '/admin/destinations',              destinationController.getAllAdmin);
router.get(   '/admin/destinations/:id',          validate(getDestinationByIdSchema),    destinationController.getById);
router.post(  '/admin/destinations',              validate(createDestinationSchema),      destinationController.create);
router.put(   '/admin/destinations/:id',          validate(updateDestinationSchema),      destinationController.update);
router.delete('/admin/destinations/:id',          validate(getDestinationByIdSchema),     destinationController.delete);
router.patch( '/admin/destinations/:id/featured', validate(getDestinationByIdSchema),     destinationController.toggleFeatured);

export default router;













// // src/routes/destinations.routes.ts
// import { Router } from 'express';
// import { destinationController } from '../controllers/destination.controller';
// import { validate } from '../middlewares/validate';
// import {
//   createDestinationSchema,
//   updateDestinationSchema,
//   getDestinationByIdSchema,
//   //getDestinationBySlugSchema,
// } from '../validators/destination.schema';

// const router = Router();

// /**
//  * @route   GET /api/destinations
//  * @desc    Liste des destinations avec filtres
//  * @access  Public
//  */
// router.get('/', destinationController.getAll);

// /**
//  * @route   GET /api/destinations/featured
//  * @desc    Destinations coup de cœur
//  * @access  Public
//  */
// router.get('/featured', destinationController.getFeatured);

// /**
//  * @route   GET /api/destinations/:slug
//  * @desc    Détail d'une destination
//  * @access  Public
//  */
// router.get('/:slug', destinationController.getBySlug);


// // ── Back-Office (admin) ─────────────────────────────────────

// router.get(   '/admin/destinations',              destinationController.getAllAdmin);
// router.get(   '/admin/destinations/:id',          validate(getDestinationByIdSchema),    destinationController.getById);
// router.post(  '/admin/destinations',              validate(createDestinationSchema),      destinationController.create);
// router.put(   '/admin/destinations/:id',          validate(updateDestinationSchema),      destinationController.update);
// router.delete('/admin/destinations/:id',          validate(getDestinationByIdSchema),     destinationController.delete);
// router.patch( '/admin/destinations/:id/featured', validate(getDestinationByIdSchema),     destinationController.toggleFeatured);

// export default router;