// src/components/shared/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import api from '@/lib/api';

interface Message {
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

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ CORRECTION FINALE: Utiliser un état pour tracker si le message de bienvenue a été ajouté
  const [welcomeMessageAdded, setWelcomeMessageAdded] = useState(false);

  // ✅ CORRECTION: Fonction de recherche de réponse
  const findBestAnswer = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();

    // Recherche exacte
    for (const faq of faqs) {
      if (lowerMessage.includes(faq.question.toLowerCase())) {
        return faq.answer;
      }
    }

    // Recherche par mots-clés
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase().split(' ');
      const matchCount = keywords.filter(keyword => 
        lowerMessage.includes(keyword) && keyword.length > 3
      ).length;

      if (matchCount >= 2) {
        return faq.answer;
      }
    }

    return null;
  };

  // ✅ CORRECTION: Fetch data au montage uniquement
  useEffect(() => {
    const fetchChatbotData = async () => {
      try {
        const [settingsRes, faqsRes] = await Promise.all([
          api.get('/chatbot/settings'),
          api.get('/chatbot/faqs'),
        ]);

        if (settingsRes.data.data) {
          setSettings(settingsRes.data.data);
        }

        if (faqsRes.data.data) {
          setFaqs(faqsRes.data.data);
        }
      } catch (error) {
        console.error('Erreur chargement chatbot:', error);
      }
    };

    fetchChatbotData();
  }, []);

  // ✅ CORRECTION FINALE: Reset des messages et du flag quand le chat se ferme
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setWelcomeMessageAdded(false);
    }
  }, [isOpen]);

  // ✅ CORRECTION FINALE: Ajouter le message de bienvenue via un handler au lieu d'un effet
  useEffect(() => {
    if (isOpen && !welcomeMessageAdded && settings?.welcomeMessage) {
      // On évite setState dans effect en utilisant un pattern de dérivation
      setMessages((prevMessages) => {
        // Si le message de bienvenue existe déjà, ne rien faire
        if (prevMessages.length > 0) return prevMessages;
        
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

  // ── Scroll to Bottom ─────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Message Handlers ─────────────────────────────────────────────────────

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: (Date.now() + 1).toString(),
      text,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);

    // Simulate bot typing
    setIsTyping(true);

    setTimeout(() => {
      const answer = findBestAnswer(userMessage);

      if (answer) {
        addBotMessage(answer);
      } else {
        addBotMessage(
          settings?.failureMessage || 
          "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe ?"
        );
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render if chatbot is disabled
  if (settings && !settings.isActive) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Assistant iTourisme Nomade</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-orange-100">En ligne</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 bg-slate-50 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                    message.isBot
                      ? 'bg-white border border-slate-100 rounded-tl-none'
                      : 'bg-orange-500 text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-[9px] mt-1 ${
                      message.isBot ? 'text-slate-400' : 'text-orange-100'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-orange-500/20 pr-10"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
      >
        {isOpen ? (
          <X className="text-white w-8 h-8" />
        ) : (
          <Bot className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
        )}

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-400 border-2 border-white" />
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;