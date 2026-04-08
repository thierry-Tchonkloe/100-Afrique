// src/controllers/magazine.controller.ts
import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';  // ✅ Correction ici
import { successResponse } from '../utils/response';

class MagazineController {
  /**
   * @route   GET /api/magazine/subscription-plans
   * @desc    Plans d'abonnement disponibles
   * @access  Public
   */
  getSubscriptionPlans = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const plans = [
      {
        id: 'digital',
        name: 'Numérique',
        description: 'Version digitale',
        price: 49,
        currency: 'EUR',
        duration: 'an',
        issuesPerYear: 12,
        features: [
          'Accès illimité aux 12 numéros annuels',
          'Archives complètes en ligne',
          'Newsletter exclusive hebdomadaire',
          'Format PDF haute qualité'
        ],
        isPopular: false
      },
      {
        id: 'print',
        name: 'Papier',
        description: 'Version imprimée',
        price: 89,
        currency: 'EUR',
        duration: 'an',
        issuesPerYear: 12,
        features: [
          '12 numéros papier livrés chez vous',
          'Accès digital inclus',
          'Newsletter exclusive',
          'Invitations aux événements WAXEHO'
        ],
        isPopular: true
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Papier + Digital + Avantages',
        price: 129,
        currency: 'EUR',
        duration: 'an',
        issuesPerYear: 12,
        features: [
          'Tout le contenu Papier + Digital',
          'Accès prioritaire aux événements',
          'Réseau professionnel exclusif',
          'Annuaire des acteurs du tourisme',
          'Consultation téléphonique mensuelle'
        ],
        isPopular: false
      }
    ];

    successResponse(res, plans);
  });

  /**
   * @route   POST /api/magazine/create-checkout-session
   * @desc    Créer une session de paiement
   * @access  Public
   */
  createCheckoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.body;

    // Validation simple
    if (!planId) {
      res.status(400).json({
        success: false,
        message: 'Plan ID requis'
      });
      return;
    }

    // TODO: Intégration Stripe ou autre système de paiement
    // Pour l'instant, on retourne juste une URL de redirection mockée
    
    successResponse(res, {
      checkoutUrl: `/magazine/checkout?plan=${planId}`,
      sessionId: `mock_session_${Date.now()}`,
      planId
    });
  });
}

export const magazineController = new MagazineController();