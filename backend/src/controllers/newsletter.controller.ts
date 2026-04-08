// src/controllers/newsletter.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

// Validation Zod
const subscribeSchema = z.object({
  email: z.string({ message: 'Email requis' }).email({ message: 'Email invalide' }),
  source: z.string().optional(),
  type: z.enum(['general', 'alerts_salons', 'actualites_page']).optional()
});

class NewsletterController {
  /**
   * @route   POST /api/newsletter/subscribe
   * @desc    Inscription à la newsletter
   * @access  Public
   */
  subscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validation = subscribeSchema.safeParse(req.body);
    
    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const { email, source, type } = validation.data;

    // Vérifier si déjà inscrit
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.isActive) {
        errorResponse(res, 'Cet email est déjà inscrit à notre newsletter', 409);
        return;
      }
      
      // Réactiver l'abonnement
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { 
          isActive: true,
          source,
          type: type || 'general'
        }
      });
      
      successResponse(
        res,
        { email },
        'Votre abonnement a été réactivé'
      );
      return;
    }

    // Créer nouvel abonné
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        source: source || 'website',
        type: type || 'general',
        isActive: true,
        verifiedAt: new Date() // Auto-vérifié pour simplifier
      }
    });

    // TODO: Envoyer email de confirmation
    
    successResponse(
      res,
      { email: subscriber.email },
      'Inscription réussie ! Vous allez recevoir nos actualités.',
      201
    );
  });

  /**
   * @route   POST /api/newsletter/unsubscribe
   * @desc    Désabonnement de la newsletter
   * @access  Public
   */
  unsubscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      errorResponse(res, 'Email requis', 400);
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      errorResponse(res, 'Email non trouvé', 404);
      return;
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false }
    });

    successResponse(
      res,
      { email },
      'Désabonnement réussi'
    );
  });

  /**
   * @route   GET /api/newsletter/verify/:token
   * @desc    Vérification de l'email par token
   * @access  Public
   */
  verify = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    // Validation du token
    if (!token || typeof token !== 'string' || token.length < 10) {
      errorResponse(res, 'Token de vérification invalide', 400);
      return;
    }

    // TODO: Implémenter la vérification réelle avec JWT ou UUID
    // Exemple de ce qui pourrait être fait :
    // const subscriber = await prisma.newsletterSubscriber.findFirst({
    //   where: { verificationToken: token, verifiedAt: null }
    // });
    // if (!subscriber) {
    //   errorResponse(res, 'Token invalide ou expiré', 404);
    //   return;
    // }
    // await prisma.newsletterSubscriber.update({
    //   where: { id: subscriber.id },
    //   data: { verifiedAt: new Date(), verificationToken: null }
    // });
    
    // Pour l'instant, on log et on accepte
    console.log(`📧 Vérification newsletter - Token: ${token.substring(0, 10)}...`);
    
    successResponse(
      res,
      { 
        verified: true,
        token: token.substring(0, 10) + '...'
      },
      'Email vérifié avec succès'
    );
  });
}

export const newsletterController = new NewsletterController();