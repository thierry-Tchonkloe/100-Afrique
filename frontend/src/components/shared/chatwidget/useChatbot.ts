// src/components/shared/chatwidget/useChatbot.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotSettings {
  isActive: boolean;
  welcomeMessage: string;
  defaultLanguage: string;
  failureMessage: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  priority: string;
}

export function useChatbot() {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    const fetchChatbotData = async () => {
      try {
        const [settingsRes, faqsRes] = await Promise.all([
          api.get('/chatbot/settings'),
          api.get('/chatbot/faqs'),
        ]);
        if (settingsRes.data.data) setSettings(settingsRes.data.data);
        if (faqsRes.data.data) setFaqs(faqsRes.data.data);
      } catch (error) {
        console.error('Erreur chargement chatbot:', error);
      }
    };
    fetchChatbotData();
  }, []);

  const findBestAnswer = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();
    for (const faq of faqs) {
      if (lowerMessage.includes(faq.question.toLowerCase())) return faq.answer;
    }
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase().split(' ');
      const matchCount = keywords.filter((k) => lowerMessage.includes(k) && k.length > 3).length;
      if (matchCount >= 2) return faq.answer;
    }
    return null;
  };

  return { settings, findBestAnswer };
}

/**
 * Gère l'état conversationnel (messages, saisie, indicateur de frappe,
 * message d'accueil) indépendamment du fetch settings/faqs ci-dessus.
 */
export function useChatConversation(isOpen: boolean, settings: ChatbotSettings | null, findBestAnswer: (msg: string) => string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [welcomeMessageAdded, setWelcomeMessageAdded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setWelcomeMessageAdded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !welcomeMessageAdded && settings?.welcomeMessage) {
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return [{
          id: Date.now().toString(),
          text: settings.welcomeMessage,
          isBot: true,
          timestamp: new Date(),
        }];
      });
      setWelcomeMessageAdded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, welcomeMessageAdded, settings?.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }]);
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, {
      id: (Date.now() + 1).toString(),
      text,
      isBot: true,
      timestamp: new Date(),
    }]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);
    setIsTyping(true);
    setTimeout(() => {
      const answer = findBestAnswer(userMessage);
      addBotMessage(
        answer ??
        (settings?.failureMessage ||
          "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe ?")
      );
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages, inputValue, setInputValue, isTyping, messagesEndRef,
    handleSendMessage, handleKeyPress,
  };
}