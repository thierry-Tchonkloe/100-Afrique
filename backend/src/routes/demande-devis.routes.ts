// src/routes/demande-devis.routes.ts
import { Router } from 'express';
import { demandeDevisController } from '../controllers/demande-devis.controller';

const router = Router();

/**
 * @route   POST /api/contacts/demande-devis
 * @desc    Soumettre une demande de devis
 * @access  Public
 * 
 * Body:
 * {
 *   "serviceType": "publicite" | "partenariat" | "evenement" | "video" | "autre",
 *   "budget": "moins-5k" | "5k-10k" | "10k-25k" | "25k-50k" | "plus-50k" | "non-defini",
 *   "firstname": "Jean",
 *   "lastname": "Dupont",
 *   "company": "Ma Société",
 *   "email": "jean@example.com",
 *   "phone": "+229 XX XX XX XX",
 *   "message": "Détails supplémentaires..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Demande envoyée avec succès...",
 *   "data": { "contactId": 1 }
 * }
 */
router.post('/', demandeDevisController.submit);

export default router;