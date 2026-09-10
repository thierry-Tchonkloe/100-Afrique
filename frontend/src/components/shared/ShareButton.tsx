// src/components/shared/ShareButton.tsx
"use client";
import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* utilisateur a annulé le partage natif — pas d'action */
    }
  };

  return (
    <button
      onClick={handle}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
      style={{
        background: copied ? 'rgba(26,92,67,0.2)' : 'rgba(255,255,255,0.12)',
        color: copied ? '#C8A84B' : '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {copied ? <Check size={12} /> : <Share2 size={12} />}
      {copied ? 'Copié !' : 'Partager'}
    </button>
  );
};

export default ShareButton;