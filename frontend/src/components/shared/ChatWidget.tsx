// src/components/shared/ChatWidget.tsx
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import RobotIcon from '@/components/icons/RobotIcon';
import { useChatbot, useChatConversation } from './chatwidget/useChatbot';
import ChatWindow from './chatwidget/ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, findBestAnswer } = useChatbot();
  const {
    messages, inputValue, setInputValue, isTyping, messagesEndRef,
    handleSendMessage, handleKeyPress,
  } = useChatConversation(isOpen, settings, findBestAnswer);

  if (settings && !settings.isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

      {isOpen && (
        <ChatWindow
          onClose={() => setIsOpen(false)}
          messages={messages}
          isTyping={isTyping}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          messagesEndRef={messagesEndRef}
        />
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