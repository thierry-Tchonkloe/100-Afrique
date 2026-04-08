// src/controllers/destination-partnership.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

/**
 * Schéma de validation Zod pour les partenariats destination
 */
const destinationPartnershipSchema = z.object({
  destinations: z.string().min(3, 'Le nom de la destination est requis'),
  collabType: z.enum(['campaign', 'video', 'edito'], {
    message: 'Type de collaboration invalide',
  }),
  officeName: z.string().min(3, 'Le nom de l\'institution est requis'),
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  objectives: z.string().optional(),
});

/**
 * Contrôleur pour les demandes de partenariat destination
 */
class DestinationPartnershipController {
  /**
   * @route   POST /api/contacts/partenariat-destination
   * @desc    Soumettre une demande de partenariat destination
   * @access  Public
   */
  submit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validation des données
    const validation = destinationPartnershipSchema.safeParse(req.body);

    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { destinations, collabType, officeName, firstname, lastname, email, objectives } = validation.data;

    // Mapper collabType → service_type
    const serviceTypeMapping: Record<string, string> = {
      campaign: 'display',
      video: 'magazine',
      edito: 'content',
    };

    const serviceType = serviceTypeMapping[collabType] || 'display';

    // Construire le message complet
    const fullMessage = `
🌍 Destinations: ${destinations}
🎯 Type de collaboration: ${collabType}
🏢 Institution: ${officeName}

${objectives ? `📋 Objectifs:\n${objectives}` : ''}

📍 Source: Magazine Waxeho - Modal Partenariat Destination
    `.trim();

    // Créer l'entrée dans la base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName: lastname,
        firstName: firstname,
        company: officeName,
        email,
        serviceType,
        message: fullMessage,
        status: 'NEW',
      },
    });

    // TODO: Envoyer email de notification à l'équipe partenariats
    // TODO: Envoyer email de confirmation au demandeur

    // Réponse de succès
    successResponse(
      res,
      { contactId: contact.id },
      'Demande reçue ! Un responsable des partenariats destinations reviendra vers vous sous 24h.',
      201
    );
  });
}

export const destinationPartnershipController = new DestinationPartnershipController();