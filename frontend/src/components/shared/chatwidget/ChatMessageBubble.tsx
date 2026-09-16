// src/components/shared/chatwidget/ChatMessageBubble.tsx
"use client";
import React from 'react';
import type { Message } from './useChatbot';

const ChatMessageBubble = ({ message }: { message: Message }) => (
  <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
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
);

export default ChatMessageBubble;