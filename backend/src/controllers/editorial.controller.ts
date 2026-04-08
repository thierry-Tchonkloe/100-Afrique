// src/controllers/editorial.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

/**
 * Schéma de validation Zod pour les demandes éditoriales
 */
const editorialSchema = z.object({
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  type: z.enum(['presse', 'video', 'social', 'global'], {
    message: 'Type de partenariat invalide',
  }),
  eventName: z.string().min(3, 'Le nom de l\'événement est requis'),
  sender: z.object({
    firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    company: z.string().optional(),
  }),
  message: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Contrôleur pour les demandes éditoriales (couverture salons, articles)
 */
class EditorialController {
  /**
   * @route   POST /api/contacts/editorial
   * @desc    Soumettre une demande de couverture éditoriale
   * @access  Public
   */
  submit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validation des données
    const validation = editorialSchema.safeParse(req.body);

    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { subject, type, eventName, sender, message, source } = validation.data;

    // Mapper type → service_type
    const serviceTypeMapping: Record<string, string> = {
      presse: 'content',
      video: 'magazine',
      social: 'display',
      global: 'event',
    };

    const serviceType = serviceTypeMapping[type] || 'content';

    // Construire le message complet
    const fullMessage = `
📝 Sujet: ${subject}
🎯 Type de couverture: ${type}
🎪 Événement: ${eventName}
${sender.company ? `🏢 Société: ${sender.company}` : ''}
📍 Source: ${source || 'Magazine Waxeho'}

${message ? `\n💬 Message:\n${message}` : ''}
    `.trim();

    // Créer l'entrée dans la base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName: sender.lastname,
        firstName: sender.firstname,
        company: sender.company || 'Non renseigné',
        email: sender.email,
        serviceType,
        message: fullMessage,
        status: 'NEW',
      },
    });

    // TODO: Envoyer email de notification à l'équipe éditoriale
    // TODO: Envoyer email de confirmation au demandeur

    // Réponse de succès
    successResponse(
      res,
      { contactId: contact.id },
      'Demande envoyée avec succès. Notre équipe éditoriale vous contactera sous 24h ouvrées.',
      201
    );
  });
}

export const editorialController = new EditorialController();