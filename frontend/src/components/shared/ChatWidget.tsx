// src/components/shared/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
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

// ── Icône Robot custom (remplace Bot de lucide-react) ──
interface RobotIconProps {
  size?: number;
  className?: string;
}

const RobotIcon = ({ size = 24, className = '' }: RobotIconProps) => (
  <svg
    viewBox="0 -0.5 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 14.462V12.538C4.52129 11.6681 5.2431 10.9799 6.113 11H6.774C7.34208 9.24261 8.96147 8.03831 10.808 8H14.192C16.0385 8.03831 17.6579 9.24261 18.226 11C18.4082 11.5231 18.5009 12.0731 18.5 12.627V14.373C18.5849 16.8392 16.6579 18.9088 14.192 19H10.808C8.96147 18.9617 7.34208 17.7574 6.774 16H6.113C5.2431 16.0201 4.52129 15.3319 4.5 14.462Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 12.5C14.5 13.6046 13.6046 14.5 12.5 14.5C11.3954 14.5 10.5 13.6046 10.5 12.5C10.5 11.3954 11.3954 10.5 12.5 10.5C13.6046 10.5 14.5 11.3954 14.5 12.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.25 5C13.25 4.58579 12.9142 4.25 12.5 4.25C12.0858 4.25 11.75 4.58579 11.75 5H13.25ZM11.75 8C11.75 8.41421 12.0858 8.75 12.5 8.75C12.9142 8.75 13.25 8.41421 13.25 8H11.75ZM6.06579 16.2467C6.20206 16.6379 6.62963 16.8445 7.02079 16.7082C7.41194 16.572 7.61856 16.1444 7.48228 15.7533L6.06579 16.2467ZM6.50004 14.373L7.25004 14.3742V14.373H6.50004ZM6.50004 12.627H7.25004L7.25004 12.6258L6.50004 12.627ZM7.48228 11.2467C7.61856 10.8556 7.41194 10.428 7.02079 10.2918C6.62963 10.1555 6.20206 10.3621 6.06579 10.7533L7.48228 11.2467ZM18.226 10.25C17.8118 10.25 17.476 10.5858 17.476 11C17.476 11.4142 17.8118 11.75 18.226 11.75V10.25ZM18.887 11V11.75C18.8928 11.75 18.8986 11.7499 18.9044 11.7498L18.887 11ZM20.5 12.538H21.25C21.25 12.5319 21.25 12.5258 21.2498 12.5197L20.5 12.538ZM20.5 14.462L21.2498 14.4803C21.25 14.4742 21.25 14.4681 21.25 14.462H20.5ZM18.887 16L18.9044 15.2502C18.8986 15.2501 18.8928 15.25 18.887 15.25V16ZM18.226 15.25C17.8118 15.25 17.476 15.5858 17.476 16C17.476 16.4142 17.8118 16.75 18.226 16.75V15.25ZM10.5 15.75C10.0858 15.75 9.75004 16.0858 9.75004 16.5C9.75004 16.9142 10.0858 17.25 10.5 17.25V15.75ZM14.5 17.25C14.9142 17.25 15.25 16.9142 15.25 16.5C15.25 16.0858 14.9142 15.75 14.5 15.75V17.25ZM11.75 5V8H13.25V5H11.75ZM7.48228 15.7533C7.32782 15.3099 7.2493 14.8437 7.25004 14.3742L5.75004 14.3718C5.74904 15.0101 5.85579 15.644 6.06579 16.2467L7.48228 15.7533ZM7.25004 14.373V12.627H5.75004V14.373H7.25004ZM7.25004 12.6258C7.2493 12.1563 7.32782 11.6901 7.48228 11.2467L6.06579 10.7533C5.85579 11.356 5.74904 11.9899 5.75004 12.6282L7.25004 12.6258ZM18.226 11.75H18.887V10.25H18.226V11.75ZM18.9044 11.7498C19.3606 11.7392 19.7391 12.1002 19.7503 12.5563L21.2498 12.5197C21.2184 11.2361 20.1533 10.2205 18.8697 10.2502L18.9044 11.7498ZM19.75 12.538V14.462H21.25V12.538H19.75ZM19.7503 14.4437C19.7391 14.8998 19.3606 15.2608 18.9044 15.2502L18.8697 16.7498C20.1533 16.7795 21.2184 15.7639 21.2498 14.4803L19.7503 14.4437ZM18.887 15.25H18.226V16.75H18.887V15.25ZM10.5 17.25H14.5V15.75H10.5V17.25Z"
      fill="currentColor"
    />
  </svg>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [welcomeMessageAdded, setWelcomeMessageAdded] = useState(false);

  const findBestAnswer = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();
    for (const faq of faqs) {
      if (lowerMessage.includes(faq.question.toLowerCase())) return faq.answer;
    }
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase().split(' ');
      const matchCount = keywords.filter(k => lowerMessage.includes(k) && k.length > 3).length;
      if (matchCount >= 2) return faq.answer;
    }
    return null;
  };

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

  if (settings && !settings.isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

      {/* ── Fenêtre de chat ── */}
      {isOpen && (
        <div
          className="mb-4 w-[350px] h-[500px] rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between text-white"
            style={{ backgroundColor: '#1A5C43' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <RobotIcon size={40} />
              </div>
              <div>
                <p className="font-bold text-sm">Assistant 100% Afrique</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#C8A84B' }}
                  />
                  <span className="text-[10px]" style={{ color: '#D4EDE5' }}>En ligne</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full transition-colors"
              style={{ color: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Zone messages */}
          <div
            className="flex-grow p-4 overflow-y-auto space-y-4"
            style={{ backgroundColor: '#f8fafc' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className="max-w-[85%] p-3 rounded-2xl"
                  style={
                    message.isBot
                      ? {
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderTopLeftRadius: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }
                      : {
                          backgroundColor: '#B85C38',
                          color: '#ffffff',
                          borderTopRightRadius: '4px',
                        }
                  }
                >
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className="text-[9px] mt-1"
                    style={{ color: message.isBot ? '#94a3b8' : '#F2D9CE' }}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderTopLeftRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: '#cbd5e1', animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div
            className="p-4"
            style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}
          >
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                disabled={isTyping}
                className="w-full rounded-xl px-4 py-3 text-xs outline-none pr-10 transition-all"
                style={{
                  backgroundColor: '#f8fafc',
                  border: 'none',
                  color: '#001A4D',
                }}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 2px rgba(26,92,67,0.2)')}
                onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#8A3E22')}
                onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bouton flottant ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 active:scale-95 overflow-hidden"
        style={{
          backgroundColor: '#B85C38',
          boxShadow: '0 10px 25px rgba(184,92,56,0.4)',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 20px 40px rgba(184,92,56,0.5)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 10px 25px rgba(184,92,56,0.4)')}
      >
        {isOpen ? (
          <X className="text-white w-8 h-8" />
        ) : (
          <RobotIcon size={60} className="text-white group-hover:scale-110 transition-transform" />
        )}

        {/* Badge de notification */}
        {!isOpen && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: '#C8A84B' }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white"
              style={{ backgroundColor: '#C8A84B' }}
            />
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;













// // src/components/shared/ChatWidget.tsx
// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { MessageCircle, X, Send, Bot } from 'lucide-react';
// import api from '@/lib/api';

// interface Message {
//   id: string;
//   text: string;
//   isBot: boolean;
//   timestamp: Date;
// }

// interface ChatbotSettings {
//   isActive: boolean;
//   welcomeMessage: string;
//   defaultLanguage: string;
//   failureMessage: string;
// }

// interface FAQItem {
//   id: number;
//   question: string;
//   answer: string;
//   priority: string;
// }

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [settings, setSettings] = useState<ChatbotSettings | null>(null);
//   const [faqs, setFaqs] = useState<FAQItem[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // ✅ CORRECTION FINALE: Utiliser un état pour tracker si le message de bienvenue a été ajouté
//   const [welcomeMessageAdded, setWelcomeMessageAdded] = useState(false);

//   // ✅ CORRECTION: Fonction de recherche de réponse
//   const findBestAnswer = (userMessage: string): string | null => {
//     const lowerMessage = userMessage.toLowerCase();

//     // Recherche exacte
//     for (const faq of faqs) {
//       if (lowerMessage.includes(faq.question.toLowerCase())) {
//         return faq.answer;
//       }
//     }

//     // Recherche par mots-clés
//     for (const faq of faqs) {
//       const keywords = faq.question.toLowerCase().split(' ');
//       const matchCount = keywords.filter(keyword => 
//         lowerMessage.includes(keyword) && keyword.length > 3
//       ).length;

//       if (matchCount >= 2) {
//         return faq.answer;
//       }
//     }

//     return null;
//   };

//   // ✅ CORRECTION: Fetch data au montage uniquement
//   useEffect(() => {
//     const fetchChatbotData = async () => {
//       try {
//         const [settingsRes, faqsRes] = await Promise.all([
//           api.get('/chatbot/settings'),
//           api.get('/chatbot/faqs'),
//         ]);

//         if (settingsRes.data.data) {
//           setSettings(settingsRes.data.data);
//         }

//         if (faqsRes.data.data) {
//           setFaqs(faqsRes.data.data);
//         }
//       } catch (error) {
//         console.error('Erreur chargement chatbot:', error);
//       }
//     };

//     fetchChatbotData();
//   }, []);

//   // ✅ CORRECTION FINALE: Reset des messages et du flag quand le chat se ferme
//   useEffect(() => {
//     if (!isOpen) {
//       setMessages([]);
//       setWelcomeMessageAdded(false);
//     }
//   }, [isOpen]);

//   // ✅ CORRECTION FINALE: Ajouter le message de bienvenue via un handler au lieu d'un effet
//   useEffect(() => {
//     if (isOpen && !welcomeMessageAdded && settings?.welcomeMessage) {
//       // On évite setState dans effect en utilisant un pattern de dérivation
//       setMessages((prevMessages) => {
//         // Si le message de bienvenue existe déjà, ne rien faire
//         if (prevMessages.length > 0) return prevMessages;
        
//         return [{
//           id: Date.now().toString(),
//           text: settings.welcomeMessage,
//           isBot: true,
//           timestamp: new Date(),
//         }];
//       });
//       setWelcomeMessageAdded(true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen, welcomeMessageAdded, settings?.welcomeMessage]);

//   // ── Scroll to Bottom ─────────────────────────────────────────────────────

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // ── Message Handlers ─────────────────────────────────────────────────────

//   const addUserMessage = (text: string) => {
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text,
//       isBot: false,
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   const addBotMessage = (text: string) => {
//     const newMessage: Message = {
//       id: (Date.now() + 1).toString(),
//       text,
//       isBot: true,
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   const handleSendMessage = () => {
//     if (!inputValue.trim()) return;

//     const userMessage = inputValue.trim();
//     setInputValue('');
//     addUserMessage(userMessage);

//     // Simulate bot typing
//     setIsTyping(true);

//     setTimeout(() => {
//       const answer = findBestAnswer(userMessage);

//       if (answer) {
//         addBotMessage(answer);
//       } else {
//         addBotMessage(
//           settings?.failureMessage || 
//           "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe ?"
//         );
//       }

//       setIsTyping(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Don't render if chatbot is disabled
//   if (settings && !settings.isActive) {
//     return null;
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
//       {/* Chat Window */}
//       {isOpen && (
//         <div className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between text-white">
//             <div className="flex items-center gap-3">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Bot size={20} />
//               </div>
//               <div>
//                 <p className="font-bold text-sm">Assistant iTourisme Nomade</p>
//                 <div className="flex items-center gap-1.5">
//                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                   <span className="text-[10px] text-orange-100">En ligne</span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="hover:bg-white/10 p-1 rounded-full transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-grow p-4 bg-slate-50 overflow-y-auto space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
//               >
//                 <div
//                   className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
//                     message.isBot
//                       ? 'bg-white border border-slate-100 rounded-tl-none'
//                       : 'bg-orange-500 text-white rounded-tr-none'
//                   }`}
//                 >
//                   <p className="text-xs leading-relaxed whitespace-pre-wrap">
//                     {message.text}
//                   </p>
//                   <p
//                     className={`text-[9px] mt-1 ${
//                       message.isBot ? 'text-slate-400' : 'text-orange-100'
//                     }`}
//                   >
//                     {message.timestamp.toLocaleTimeString('fr-FR', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
//                   <div className="flex gap-1">
//                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-white border-t border-slate-100">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Écrivez votre message..."
//                 className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-orange-500/20 pr-10"
//                 disabled={isTyping}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputValue.trim() || isTyping}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
//       >
//         {isOpen ? (
//           <X className="text-white w-8 h-8" />
//         ) : (
//           <Bot className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
//         )}

//         {/* Notification Badge */}
//         {!isOpen && (
//           <span className="absolute top-0 right-0 flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-400 border-2 border-white" />
//           </span>
//         )}
//       </button>
//     </div>
//   );
// };

// export default ChatWidget;