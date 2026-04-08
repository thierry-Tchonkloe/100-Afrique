// src/services/chatbot.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cacheService } from '../utils/cache';

const CACHE_KEY_SETTINGS = 'chatbot:settings';
const CACHE_KEY_FAQS = 'chatbot:faqs:all';
const CACHE_KEY_ACTIVE_FAQS = 'chatbot:faqs:active';

interface ChatbotSettingsInput {
  isActive?: boolean;
  defaultLanguage?: string;
  welcomeMessage?: string;
  escalationKeywords?: string[];
  contactFormUrl?: string;
  contactFormEnabled?: boolean;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  failureMessage?: string;
}

// On exporte l'interface pour que le contrôleur puisse l'utiliser
export interface ChatbotSettings {
  id: number;
  isActive: boolean;
  defaultLanguage: string;
  welcomeMessage: string;
  escalationKeywords: string[];
  contactFormUrl: string;
  contactFormEnabled: boolean;
  whatsappNumber: string | null;
  whatsappEnabled: boolean;
  failureMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FAQInput {
  question: string;
  answer: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  isActive?: boolean;
  order?: number;
}

/**
 * Service de gestion du chatbot
 */
// export class ChatbotService {
//   // ═══════════════════════════════════════════════════════════════════════════
//   // CHATBOT SETTINGS
//   // ═══════════════════════════════════════════════════════════════════════════

//   /**
//    * Récupère les paramètres du chatbot (avec cache)
//    */
//   async getSettings() {
//     // Vérifier le cache
//     const cached = cacheService.get(CACHE_KEY_SETTINGS);
//     if (cached) {
//       return cached;
//     }

//     // Récupérer depuis la BDD
//     let settings = await prisma.chatbotSettings.findFirst();

//     // Si aucun paramètre n'existe, créer les valeurs par défaut
//     if (!settings) {
//       settings = await prisma.chatbotSettings.create({
//         data: {
//           isActive: true,
//           defaultLanguage: 'fr',
//           welcomeMessage: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
//           escalationKeywords: ['parler à un humain', 'devis', 'urgence', 'contact', 'aide', 'assistance'],
//           contactFormUrl: '/contact/annonceurs',
//           contactFormEnabled: true,
//           whatsappNumber: '',
//           whatsappEnabled: false,
//           failureMessage: "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe pour une assistance personnalisée ?",
//         },
//       });
//     }

//     // Mettre en cache
//     cacheService.set(CACHE_KEY_SETTINGS, settings);

//     return settings;
//   }

export class ChatbotService {
  /**
   * Récupère les paramètres du chatbot (avec cache)
   * On précise ici que la promesse retourne ChatbotSettings
   */
  async getSettings(): Promise<ChatbotSettings> {
    const cached = cacheService.get(CACHE_KEY_SETTINGS);
    if (cached) {
      return cached as ChatbotSettings;
    }

    let settings = await prisma.chatbotSettings.findFirst();

    if (!settings) {
      settings = await prisma.chatbotSettings.create({
        data: {
          isActive: true,
          defaultLanguage: 'fr',
          welcomeMessage: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
          escalationKeywords: ['parler à un humain', 'devis', 'urgence', 'contact', 'aide', 'assistance'],
          contactFormUrl: '/contact/annonceurs',
          contactFormEnabled: true,
          whatsappNumber: '',
          whatsappEnabled: false,
          failureMessage: "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe pour une assistance personnalisée ?",
        },
      });
    }

    cacheService.set(CACHE_KEY_SETTINGS, settings);
    return settings as ChatbotSettings;
  }

  /**
   * Met à jour les paramètres du chatbot
   */
  async updateSettings(data: ChatbotSettingsInput) {
    // Récupérer les paramètres existants ou créer
    let settings = await prisma.chatbotSettings.findFirst();

    if (settings) {
      // Mettre à jour
      settings = await prisma.chatbotSettings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      // Créer
      settings = await prisma.chatbotSettings.create({
        data: {
          ...data,
          isActive: data.isActive ?? true,
          defaultLanguage: data.defaultLanguage ?? 'fr',
        },
      });
    }

    // Invalider le cache
    this.clearSettingsCache();

    return settings;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHATBOT FAQ
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Récupère toutes les FAQs (Admin)
   */
  async getAllFAQs() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_FAQS);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const faqs = await prisma.chatbotFAQ.findMany({
      orderBy: [
        { priority: 'desc' }, // HIGH > MEDIUM > LOW
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        question: true,
        answer: true,
        priority: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Mettre en cache
    cacheService.set(CACHE_KEY_FAQS, faqs);

    return faqs;
  }

  /**
   * Récupère les FAQs actives uniquement (Public)
   */
  async getActiveFAQs() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ACTIVE_FAQS);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const faqs = await prisma.chatbotFAQ.findMany({
      where: { isActive: true },
      orderBy: [
        { priority: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        question: true,
        answer: true,
        priority: true,
      },
    });

    // Mettre en cache
    cacheService.set(CACHE_KEY_ACTIVE_FAQS, faqs);

    return faqs;
  }

  /**
   * Récupère une FAQ par son ID
   */
  async getFAQById(id: number) {
    const faq = await prisma.chatbotFAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new AppError('Question FAQ non trouvée', 404);
    }

    return faq;
  }

  /**
   * Crée une nouvelle FAQ
   */
  async createFAQ(data: FAQInput) {
    const faq = await prisma.chatbotFAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        priority: data.priority || 'MEDIUM',
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });

    // Invalider le cache
    this.clearFAQCache();

    return faq;
  }

  /**
   * Met à jour une FAQ
   */
  async updateFAQ(id: number, data: Partial<FAQInput>) {
    // Vérifier que la FAQ existe
    await this.getFAQById(id);

    // Mettre à jour
    const faq = await prisma.chatbotFAQ.update({
      where: { id },
      data,
    });

    // Invalider le cache
    this.clearFAQCache();

    return faq;
  }

  /**
   * Supprime une FAQ
   */
  async deleteFAQ(id: number) {
    // Vérifier que la FAQ existe
    await this.getFAQById(id);

    // Supprimer
    await prisma.chatbotFAQ.delete({
      where: { id },
    });

    // Invalider le cache
    this.clearFAQCache();

    return { message: 'Question FAQ supprimée avec succès' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Invalide le cache des paramètres
   */
  private clearSettingsCache() {
    cacheService.del(CACHE_KEY_SETTINGS);
  }

  /**
   * Invalide le cache des FAQs
   */
  private clearFAQCache() {
    cacheService.del(CACHE_KEY_FAQS);
    cacheService.del(CACHE_KEY_ACTIVE_FAQS);
  }
}

export const chatbotService = new ChatbotService();