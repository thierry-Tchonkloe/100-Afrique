// src/components/shared/LanguageSwitcher.tsx
"use client";

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

type Language = 'FR' | 'EN';

interface LangOption {
  code: Language;
  label: string;
  flag: string;
}

const LANGUAGES: LangOption[] = [
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'EN', label: 'English',  flag: '🇬🇧' },
];

const LanguageSwitcher = () => {
  const [activeLang, setActiveLang] = useState<Language>('FR');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (lang: LangOption) => {
    setActiveLang(lang.code);
    setIsExpanded(false);
    // TODO: brancher la logique i18n ici quand les routes seront prêtes
  };

  const activeLangData = LANGUAGES.find(l => l.code === activeLang)!;

  return (
    <div
      className="fixed bottom-6 left-6 z-[9998] flex flex-col items-start"
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Options de langue (apparaissent au-dessus du bouton) */}
      <div
        className={`
          mb-2 flex flex-col gap-1.5 transition-all duration-300 origin-bottom
          ${isExpanded ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-75 pointer-events-none'}
        `}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === activeLang;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
                shadow-lg border transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-[#1A5C43] text-white border-[#1A5C43] shadow-[#1A5C43]/30'
                  : 'bg-white text-[#001A4D] border-slate-200 hover:bg-[#F4EDD4] hover:border-[#C8A84B]'
                }
              `}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8A84B]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bouton principal flottant */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        className={`
          group relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5
          rounded-2xl shadow-xl border transition-all duration-300
          ${isExpanded
            ? 'bg-[#1A5C43] text-white border-[#1A5C43] shadow-[#1A5C43]/40'
            : 'bg-white text-[#001A4D] border-slate-200 hover:shadow-2xl hover:border-[#C8A84B]'
          }
        `}
        aria-label="Changer de langue"
        aria-expanded={isExpanded}
      >
        <Globe
          size={16}
          className={`transition-all duration-300 ${isExpanded ? 'text-[#C8A84B] rotate-12' : 'text-[#001A4D] group-hover:text-[#9A7C2E]'}`}
        />
        <span className="text-sm leading-none">{activeLangData.flag}</span>
        <span
          className={`
            text-sm font-bold tracking-widest transition-colors duration-300
            ${isExpanded ? 'text-white' : 'text-[#001A4D]'}
          `}
        >
          {activeLangData.code}
        </span>
        <span
          className={`
            text-[10px] transition-all duration-300 ml-0.5
            ${isExpanded ? 'text-[#C8A84B] -translate-y-0.5' : 'text-slate-400 translate-y-0'}
          `}
        >
          {isExpanded ? '▾' : '▴'}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
