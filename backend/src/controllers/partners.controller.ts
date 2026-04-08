// src/controllers/partners.controller.ts
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler } from '../middlewares/errorHandler';
import { successResponse, errorResponse } from '../utils/response';

// Validation du formulaire
const contactSchema = z.object({
  lastname: z.string({ message: 'Nom requis' }).min(2, { message: 'Nom trop court' }),
  firstname: z.string({ message: 'Prénom requis' }).min(2, { message: 'Prénom trop court' }),
  company: z.string({ message: 'Organisation requise' }),
  email: z.string({ message: 'Email requis' }).email({ message: 'Email invalide' }),
  service_type: z.enum(['display', 'content', 'magazine', 'event'], { message: 'Type de service requis' }),
  message: z.string({ message: 'Message requis' }).min(10, { message: 'Message trop court' })
});

class PartnersController {
  /**
   * @route   GET /api/pages/partners
   * @desc    Données complètes de la page partenaires
   * @access  Public
   */
  getPageData = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const data = {
      hero: {
        title: "Devenez partenaire du média référence du tourisme afro-européen",
        description: "Augmentez votre visibilité auprès des professionnels, offices de tourisme et voyageurs passionnés.",
        imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
      },
      values: [
        {
          id: '1',
          title: "Public Cible Qualifié",
          description: "Professionnels du tourisme, offices de tourisme et institutions spécialisées",
          iconName: 'users'
        },
        {
          id: '2',
          title: "Portée Internationale",
          description: "Couverture complète Afrique et International avec focus afro-européen",
          iconName: 'globe'
        },
        {
          id: '3',
          title: "Contenu Multi-Formats",
          description: "Articles, vidéos, magazine papier et présence événementielle",
          iconName: 'play'
        },
        {
          id: '4',
          title: "Notoriété Reconnue",
          description: "Média de référence reconnu par les acteurs du secteur",
          iconName: 'award'
        }
      ],
      stats: [
        { id: '1', value: "250K+", label: "Visiteurs Uniques / Mois" },
        { id: '2', value: "15K+", label: "Abonnés Newsletter" },
        { id: '3', value: "2M+", label: "Vues Vidéos / An" },
        { id: '4', value: "75%", label: "Professionnels dans notre audience" }
      ],
      mediaKitUrl: "/files/waxeho-media-kit.pdf",
      opportunities: [
        {
          id: '1',
          title: "Publicité Display",
          subtitle: "Bannières stratégiquement placées : Header, Sidebar, In-Article, Footer",
          description: "Optimisez votre visibilité sur l'ensemble de notre plateforme web.",
          iconType: 'display',
          features: ["Formats standards IAB", "Ciblage géographique", "Statistiques détaillées"]
        },
        {
          id: '2',
          title: "Contenus Sponsorisés",
          subtitle: "Articles, dossiers spéciaux, vidéos avec mention \"Sponsorisé\"",
          description: "Engagez notre audience avec du contenu à forte valeur ajoutée.",
          iconType: 'content',
          features: ["Rédaction professionnelle", "Optimisation SEO", "Promotion multi-canaux"]
        },
        {
          id: '3',
          title: "Partenariat Magazine",
          subtitle: "Espaces publicitaires dans l'édition papier et numérique",
          description: "Associez votre image à notre support de prestige trimestriel.",
          iconType: 'magazine',
          features: ["Double exposition print/digital", "Formats premium", "Distribution ciblée"]
        },
        {
          id: '4',
          title: "Couverture Salons",
          subtitle: "Reportages, interviews et mise en avant lors des événements",
          description: "Devenez l'acteur incontournable des grands rendez-vous du tourisme.",
          iconType: 'salons',
          features: ["Couverture en direct", "Interviews exclusives", "Contenu multi-format"]
        }
      ],
      partners: [
        { id: '1', name: "MINISTÈRE TOURISME", logoUrl: "" },
        { id: '2', name: "OFFICE DE TOURISME", logoUrl: "" },
        { id: '3', name: "AIR AFRIQUE", logoUrl: "" },
        { id: '4', name: "HOTELS GROUP", logoUrl: "" },
        { id: '5', name: "TRAVEL AGENCY", logoUrl: "" },
        { id: '6', name: "TOURISM BOARD", logoUrl: "" }
      ]
    };

    successResponse(res, data);
  });

  /**
   * @route   POST /api/contacts/partners
   * @desc    Formulaire de contact partenariat
   * @access  Public
   */
  submitContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validation = contactSchema.safeParse(req.body);
    
    if (!validation.success) {
      errorResponse(res, 'Données invalides', 400, validation.error.issues);
      return;
    }

    const contactData = validation.data;

    // Enregistrer en base de données
    const contact = await prisma.partnerContact.create({
      data: {
        lastName: contactData.lastname,
        firstName: contactData.firstname,
        company: contactData.company,
        email: contactData.email,
        serviceType: contactData.service_type,
        message: contactData.message,
        status: 'NEW'
      }
    });

    // TODO: Envoyer email de notification à l'équipe commerciale
    // TODO: Envoyer email de confirmation au demandeur

    successResponse(
      res,
      { contactId: contact.id },
      'Votre demande a été envoyée avec succès. Notre équipe vous contactera sous 24h.',
      201
    );
  });
}

export const partnersController = new PartnersController();