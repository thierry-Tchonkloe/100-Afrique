// src/routes/destination-partnership.routes.ts
import { Router } from 'express';
import { destinationPartnershipController } from '../controllers/destination-partnership.controller';

const router = Router();

/**
 * @route   POST /api/contacts/partenariat-destination
 * @desc    Soumettre une demande de partenariat destination
 * @access  Public
 * 
 * Body:
 * {
 *   "destinations": "Sénégal, région de Marrakech",
 *   "collabType": "campaign" | "video" | "edito",
 *   "officeName": "Office de Tourisme du Sénégal",
 *   "firstname": "Jean",
 *   "lastname": "Dupont",
 *   "email": "jean@example.com",
 *   "objectives": "Augmenter la notoriété..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Demande reçue !...",
 *   "data": { "contactId": 1 }
 * }
 */
router.post('/', destinationPartnershipController.submit);

export default router;