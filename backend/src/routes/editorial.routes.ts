// src/routes/editorial.routes.ts
import { Router } from 'express';
import { editorialController } from '../controllers/editorial.controller';

const router = Router();

/**
 * @route   POST /api/contacts/editorial
 * @desc    Soumettre une demande de couverture éditoriale
 * @access  Public
 * 
 * Body:
 * {
 *   "subject": "Demande de Couverture Dédiée - Salon",
 *   "type": "presse" | "video" | "social" | "global",
 *   "eventName": "IFTM Top Resa 2025",
 *   "sender": {
 *     "firstname": "Jean",
 *     "lastname": "Dupont",
 *     "email": "jean@example.com",
 *     "company": "Ma Société"
 *   },
 *   "message": "Détails supplémentaires...",
 *   "source": "Magazine Waxeho - Modal Couverture"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Demande envoyée avec succès...",
 *   "data": { "contactId": 1 }
 * }
 */
router.post('/', editorialController.submit);

export default router;