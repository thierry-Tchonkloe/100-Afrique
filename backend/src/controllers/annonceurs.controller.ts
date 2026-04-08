// src/controllers/annonceurs.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

/**
 * Schéma de validation Zod pour les demandes annonceurs
 */
const annonceurSchema = z.object({
  interest: z.enum(['publicite', 'partenariat', 'webtv', 'evenement'], {
    // ✅ CORRECTION: Utiliser "message" au lieu de "errorMap"
    message: 'Type d\'intérêt invalide. Valeurs acceptées : publicite, partenariat, webtv, evenement'
  }),
  firstName: z.string({ message: 'Prénom requis' }).min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string({ message: 'Nom requis' }).min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string({ message: 'Société requise' }).min(2, 'Le nom de la société est requis'),
  email: z.string({ message: 'Email requis' }).email('Email invalide'),
  phone: z.string({ message: 'Téléphone requis' }).min(8, 'Numéro de téléphone invalide'),
  message: z.string().optional(),
});

/**
 * Contrôleur pour les demandes annonceurs
 */
class AnnonceursController {
  /**
   * @route   POST /api/contacts/annonceurs
   * @desc    Soumettre une demande de kit média
   * @access  Public
   */
  submit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validation des données
    const validation = annonceurSchema.safeParse(req.body);

    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { interest, firstName, lastName, company, email, phone, message } = validation.data;

    // Mapper interest → service_type pour compatibilité avec le modèle PartnerContact
    const serviceTypeMapping: Record<string, string> = {
      publicite: 'display',
      partenariat: 'content',
      webtv: 'magazine',
      evenement: 'event',
    };

    const serviceType = serviceTypeMapping[interest] || 'display';

    // Créer l'entrée dans la base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName,
        firstName,
        company,
        email,
        serviceType,
        message: `📞 Téléphone: ${phone}\n\n${message || 'Aucun message supplémentaire'}`,
        status: 'NEW',
      },
    });

    // TODO: Envoyer email avec kit média PDF en pièce jointe
    // Exemple:
    // await sendKitMediaEmail(email, firstName, company);

    // Réponse de succès
    successResponse(
      res,
      { contactId: contact.id },
      'Demande envoyée avec succès. Vous allez recevoir le kit média par email.',
      201
    );
  });
}

export const annonceursController = new AnnonceursController();