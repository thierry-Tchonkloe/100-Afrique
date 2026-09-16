// src/components/shared/chatwidget/ChatWindow.tsx
"use client";
import React from 'react';
import { Send, X } from 'lucide-react';
import RobotIcon from '@/components/icons/RobotIcon';
import ChatMessageBubble from './ChatMessageBubble';
import type { Message } from './useChatbot';

interface ChatWindowProps {
  onClose: () => void;
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>; // ← corrigé
}

const ChatWindow = ({
  onClose, messages, isTyping, inputValue, setInputValue,
  handleSendMessage, handleKeyPress, messagesEndRef,
}: ChatWindowProps) => (
  <div
    className="mb-4 w-[350px] h-[500px] rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    }}
  >
    {/* Header */}
    <div className="p-4 flex items-center justify-between text-white" style={{ backgroundColor: '#1A5C43' }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <RobotIcon size={40} />
        </div>
        <div>
          <p className="font-bold text-sm">Assistant 100% Afrique</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C8A84B' }} />
            <span className="text-[10px]" style={{ color: '#D4EDE5' }}>En ligne</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full transition-colors"
        style={{ color: '#ffffff' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <X size={20} />
      </button>
    </div>

    {/* Zone messages */}
    <div className="flex-grow p-4 overflow-y-auto space-y-4" style={{ backgroundColor: '#f8fafc' }}>
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}

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
    <div className="p-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrivez votre message..."
          disabled={isTyping}
          className="w-full rounded-xl px-4 py-3 text-xs outline-none pr-10 transition-all"
          style={{ backgroundColor: '#f8fafc', border: 'none', color: '#001A4D' }}
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
);

export default ChatWindow;