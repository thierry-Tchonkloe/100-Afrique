// src/controllers/demande-devis.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

/**
 * Schéma de validation Zod pour les demandes de devis vidéo
 */
const demandeDevisSchema = z.object({
  format: z.enum(['interview', 'reportage', 'mesure'], {
    message: 'Format invalide',
  }),
  theme: z.string().min(5, 'Le thème doit contenir au moins 5 caractères'),
  location: z.string().min(3, 'Le lieu de tournage est requis'),
  duration: z.enum(['1-3min', '3-5min', 'plus'], {
    message: 'Durée invalide',
  }),
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  organization: z.string().min(2, 'Le nom de l\'organisation est requis'),
  email: z.string().email('Email invalide'),
  budget: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Contrôleur pour les demandes de devis vidéo
 */
class DemandeDevisController {
  /**
   * @route   POST /api/contacts/demande-devis
   * @desc    Soumettre une demande de devis vidéo (i Tourisme TV)
   * @access  Public
   */
  submit = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validation des données
    const validation = demandeDevisSchema.safeParse(req.body);

    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { format, theme, location, duration, firstname, lastname, organization, email, budget, source } = validation.data;

    // Mapper format → service_type pour BDD
    const serviceTypeMapping: Record<string, string> = {
      interview: 'magazine',
      reportage: 'magazine',
      mesure: 'magazine',
    };

    const mappedServiceType = serviceTypeMapping[format] || 'magazine';

    // Construire le message complet
    const fullMessage = `
📹 Type de format: ${format}
🎬 Thème: ${theme}
📍 Lieu de tournage: ${location}
⏱️ Durée: ${duration}

${budget ? `💰 Budget estimé:\n${budget}\n` : ''}

📍 Source: ${source || 'i Tourisme TV - Demande de Devis'}
    `.trim();

    // Créer l'entrée dans la base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName: lastname,
        firstName: firstname,
        company: organization,
        email,
        serviceType: mappedServiceType,
        message: fullMessage,
        status: 'NEW',
      },
    });

    // TODO: Envoyer email de notification à l'équipe i Tourisme TV
    // TODO: Envoyer email de confirmation au demandeur avec devis

    // Réponse de succès
    successResponse(
      res,
      { contactId: contact.id },
      'Demande envoyée ! Notre équipe étudie votre projet et vous contactera sous 48h.',
      201
    );
  });
}

export const demandeDevisController = new DemandeDevisController();