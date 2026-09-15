// src/components/chatbot/types.ts
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  priority: Priority;
  isActive: boolean;
  order?: number;
}

export interface ChatbotSettings {
  isActive: boolean;
  defaultLanguage: string;
  welcomeMessage: string;
  escalationKeywords: string[];
  contactFormUrl: string;
  contactFormEnabled: boolean;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  failureMessage: string;
}

export interface ApiError {
  response?: {
    data?: { success?: boolean; message?: string; error?: string };
    status?: number;
  };
  message?: string;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiError;
  return e.response?.data?.message || e.message || fallback;
}

export const DEFAULT_SETTINGS: ChatbotSettings = {
  isActive: true,
  defaultLanguage: 'fr',
  welcomeMessage: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
  escalationKeywords: ['parler à un humain', 'devis', 'urgence', 'contact', 'aide', 'assistance'],
  contactFormUrl: '/contact/annonceurs',
  contactFormEnabled: true,
  whatsappNumber: '',
  whatsappEnabled: false,
  failureMessage: "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe pour une assistance personnalisée ?",
};