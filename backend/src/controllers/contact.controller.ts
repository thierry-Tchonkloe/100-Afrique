// src/controllers/contact.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

/**
 * Schéma de validation Zod pour le formulaire de contact général
 */
const contactSchema = z.object({
  type: z.enum(['partenariat', 'publicite', 'technique'], {
    message: 'Type de demande invalide',
  }),
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  rgpd: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité',
  }),
});

/**
 * Contrôleur pour le formulaire de contact général
 */
class ContactController {
  /**
   * @route   POST /api/contact
   * @desc    Soumettre une demande via le formulaire de contact général
   * @access  Public
   */
  submit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validation des données
    const validation = contactSchema.safeParse(req.body);

    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { type, firstname, lastname, email, message } = validation.data;

    // Mapper type → service_type pour BDD
    const serviceTypeMapping: Record<string, string> = {
      partenariat: 'content',
      publicite: 'display',
      technique: 'event', // Temporaire, vous pouvez créer un type "support"
    };

    const mappedServiceType = serviceTypeMapping[type] || 'content';

    // Construire le message complet
    const fullMessage = `
📋 Type de demande: ${type}

💬 Message:
${message}

📍 Source: Formulaire de Contact Général
    `.trim();

    // Créer l'entrée dans la base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName: lastname,
        firstName: firstname,
        company: 'Contact Général', // Pas de champ société dans le formulaire
        email,
        serviceType: mappedServiceType,
        message: fullMessage,
        status: 'NEW',
      },
    });

    // TODO: Envoyer email de notification à l'équipe
    // TODO: Envoyer email de confirmation au demandeur

    // Réponse de succès
    successResponse(
      res,
      { contactId: contact.id },
      'Message envoyé avec succès ! Notre équipe vous répondra dans les plus brefs délais.',
      201
    );
  });
}

export const contactController = new ContactController();