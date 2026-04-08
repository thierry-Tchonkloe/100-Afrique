// src/routes/annonceurs.routes.ts
import { Router } from 'express';
import { annonceursController } from '../controllers/annonceurs.controller';

const router = Router();

/**
 * @route   POST /api/contacts/annonceurs
 * @desc    Soumettre une demande de kit média annonceur
 * @access  Public
 * 
 * Body:
 * {
 *   "interest": "publicite" | "partenariat" | "webtv" | "evenement",
 *   "firstName": "Jean",
 *   "lastName": "Dupont",
 *   "company": "Ma Société",
 *   "email": "jean@example.com",
 *   "phone": "+229 XX XX XX XX",
 *   "message": "Message optionnel"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Demande envoyée avec succès...",
 *   "data": { "contactId": 1 }
 * }
 */
router.post('/', annonceursController.submit);

export default router;