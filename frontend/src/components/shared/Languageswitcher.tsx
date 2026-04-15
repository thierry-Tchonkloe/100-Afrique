"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const router   = useRouter();
  const pathname = usePathname();

  // Détecte la langue active depuis l'URL (ex: /en/actualites → EN)
  const getActiveLang = (): Language => {
    if (pathname.startsWith('/en')) return 'EN';
    return 'FR';
  };

  const [activeLang, setActiveLang] = useState<Language>(getActiveLang());
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (lang: LangOption) => {
    if (lang.code === activeLang) {
      setIsExpanded(false);
      return;
    }

    setActiveLang(lang.code);
    setIsExpanded(false);

    // Logique de redirection selon la langue choisie
    // Adapte selon ton système i18n (next-intl, i18next, etc.)
    if (lang.code === 'EN') {
      // Ajoute le préfixe /en si absent
      const newPath = pathname.startsWith('/en') ? pathname : `/en${pathname}`;
      router.push(newPath);
    } else {
      // Retire le préfixe /en si présent
      const newPath = pathname.startsWith('/en') ? pathname.replace(/^\/en/, '') || '/' : pathname;
      router.push(newPath);
    }
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
                  ? 'bg-[#001A4D] text-white border-[#001A4D] shadow-[#001A4D]/30'
                  : 'bg-white text-[#001A4D] border-slate-200 hover:bg-orange-50 hover:border-orange-300'
                }
              `}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
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
            ? 'bg-[#001A4D] text-white border-[#001A4D] shadow-[#001A4D]/40'
            : 'bg-white text-[#001A4D] border-slate-200 hover:shadow-2xl hover:border-orange-300'
          }
        `}
        aria-label="Changer de langue"
        aria-expanded={isExpanded}
      >
        {/* Icône globe */}
        <Globe
          size={16}
          className={`transition-all duration-300 ${isExpanded ? 'text-orange-400 rotate-12' : 'text-[#001A4D] group-hover:text-orange-500'}`}
        />

        {/* Flag + code langue actif */}
        <span className="text-sm leading-none">{activeLangData.flag}</span>
        <span
          className={`
            text-sm font-bold tracking-widest transition-colors duration-300
            ${isExpanded ? 'text-white' : 'text-[#001A4D]'}
          `}
        >
          {activeLangData.code}
        </span>

        {/* Indicateur de direction */}
        <span
          className={`
            text-[10px] transition-all duration-300 ml-0.5
            ${isExpanded ? 'text-orange-300 -translate-y-0.5' : 'text-slate-400 translate-y-0'}
          `}
        >
          {isExpanded ? '▾' : '▴'}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;