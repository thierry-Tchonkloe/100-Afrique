// src/components/secteurs/SecteurHero.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { SecteurMeta } from './secteurMeta';

interface SecteurHeroProps {
  meta: SecteurMeta;
  total: number | undefined;
  draftQuery: string;
  onDraftChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SecteurHero = ({ meta, total, draftQuery, onDraftChange, onSearch, onClear }: SecteurHeroProps) => {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${meta.accentFrom} 0%, ${meta.accentTo} 100%)`,
        minHeight: 380,
      }}
    >
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at 100% 30%, rgba(200,168,75,0.5) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 py-16 md:py-24">

        <div
          className="flex items-center gap-2 mb-8 text-white/50 text-[11px] font-semibold uppercase tracking-wider transition-all duration-500"
          style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '80ms' }}
        >
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link>
          <span>/</span>
          <span className="text-white/80">{meta.label}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">

          <div className="flex-1">
            <div
              className="text-5xl sm:text-6xl mb-5 transition-all duration-700"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(16px)', transitionDelay: '120ms' }}
            >
              {meta.emoji}
            </div>

            <div
              className="flex items-center gap-3 mb-3 transition-all duration-500"
              style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '180ms' }}
            >
              <div className="h-px w-8" style={{ background: '#C8A84B' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>Secteur</span>
            </div>

            <h1
              className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-none mb-5 transition-all duration-700"
              style={{
                letterSpacing: '-0.03em',
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'none' : 'translateY(20px)',
                transitionDelay: '240ms',
              }}
            >
              {meta.label}
            </h1>

            <p
              className="text-white/60 text-base max-w-lg leading-relaxed transition-all duration-500"
              style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '340ms' }}
            >
              {meta.description}
            </p>
          </div>

          <div
            className="flex flex-col gap-4 lg:min-w-[340px] transition-all duration-700"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateX(20px)', transitionDelay: '300ms' }}
          >
            {total !== undefined && (
              <div
                className="inline-flex items-baseline gap-2 px-6 py-4 rounded-2xl self-start"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <span className="text-3xl font-black text-white">{total.toLocaleString('fr-FR')}</span>
                <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">article{total > 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={`Rechercher dans ${meta.label}…`}
                  value={draftQuery}
                  onChange={e => onDraftChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white text-sm outline-none shadow-sm font-medium"
                  style={{ color: '#0D1A10' }}
                />
                {draftQuery && (
                  <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X size={13} />
                  </button>
                )}
              </div>
              <button
                onClick={onSearch}
                className="px-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
                style={{ background: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
                onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
              >
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecteurHero;