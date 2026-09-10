// src/components/evenements/detail/EvenementHero.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, User, Clock, Eye } from 'lucide-react';
import DateRange from '@/components/shared/DateRange';
import ShareButton from '@/components/shared/ShareButton';
import type { Evenement } from './useEvenementDetail';

interface EvenementHeroProps {
  evenement: Evenement;
  heroVisible: boolean;
  readingTime: number;
}

const EvenementHero = ({ evenement, heroVisible, readingTime }: EvenementHeroProps) => {
  const router = useRouter();

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '72vh', maxHeight: 820, background: '#0D2B1A' }}>

      <div
        className="absolute inset-0 transition-transform ease-linear"
        style={{ transitionDuration: '10000ms', transform: heroVisible ? 'scale(1.07)' : 'scale(1)' }}
      >
        <Image src={evenement.coverImage || '/images/placeholder.jpg'} alt={evenement.title} fill className="object-cover" priority />
      </div>

      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.98) 0%, rgba(10,35,20,0.55) 45%, rgba(10,35,20,0.15) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,35,20,0.65) 0%, transparent 65%)' }} />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #1A5C43, #C8A84B, #B85C38)' }} />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="absolute top-6 left-0 right-0 px-6 md:px-12 flex items-center justify-between z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={12} /> Retour
        </button>
        <ShareButton />
      </div>

      {evenement.edition && (
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-500"
          style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '100ms' }}
        >
          <span
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white"
            style={{ background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.4)' }}
          >
            {evenement.edition}
          </span>
        </div>
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 md:pb-16" style={{ minHeight: '72vh' }}>

        <div
          className="flex items-center gap-2 mb-5 transition-all duration-500"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(12px)', transitionDelay: '150ms' }}
        >
          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white" style={{ background: '#B85C38' }}>
            {evenement.category.name}
          </span>
          {evenement.featured && (
            <span
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/80"
              style={{ background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.35)' }}
            >
              ★ Événement phare
            </span>
          )}
        </div>

        <h1
          className="text-white font-bold text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-[1.05] mb-6 transition-all duration-700"
          style={{
            letterSpacing: '-0.025em', textShadow: '0 4px 24px rgba(0,0,0,0.3)',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(24px)', transitionDelay: '240ms',
          }}
        >
          {evenement.title}
        </h1>

        <div
          className="flex flex-wrap items-center gap-5 mb-4 transition-all duration-600"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(14px)', transitionDelay: '350ms' }}
        >
          {evenement.startDate && (
            <span className="flex items-center gap-1.5 text-white/70 text-sm">
              <Calendar size={14} style={{ color: '#C8A84B' }} />
              <DateRange startDate={evenement.startDate} endDate={evenement.endDate} />
            </span>
          )}
          {evenement.location && (
            <span className="flex items-center gap-1.5 text-white/70 text-sm">
              <MapPin size={14} style={{ color: '#C8A84B' }} />
              {evenement.location}{evenement.city && `, ${evenement.city}`}{evenement.country && ` — ${evenement.country}`}
            </span>
          )}
        </div>

        <div
          className="flex flex-wrap items-center gap-4 transition-all duration-500"
          style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '440ms' }}
        >
          <span className="flex items-center gap-1.5 text-white/45 text-xs"><User size={11} style={{ color: '#C8A84B' }} />{evenement.author.name}</span>
          <span className="flex items-center gap-1.5 text-white/45 text-xs"><Clock size={11} style={{ color: '#C8A84B' }} />{readingTime} min de lecture</span>
          {evenement.views > 0 && <span className="flex items-center gap-1.5 text-white/45 text-xs"><Eye size={11} style={{ color: '#C8A84B' }} />{evenement.views.toLocaleString('fr-FR')} lectures</span>}
        </div>
      </div>
    </div>
  );
};

export default EvenementHero;