// src/routes/contact.routes.ts
import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';

const router = Router();

/**
 * @route   POST /api/contact
 * @desc    Soumettre une demande via le formulaire de contact général
 * @access  Public
 * 
 * Body:
 * {
 *   "type": "partenariat" | "publicite" | "technique",
 *   "firstname": "Jean",
 *   "lastname": "Dupont",
 *   "email": "jean@example.com",
 *   "message": "Je souhaite en savoir plus sur...",
 *   "rgpd": true
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Message envoyé avec succès !...",
 *   "data": { "contactId": 1 }
 * }
 */
router.post('/', contactController.submit);

export default router;