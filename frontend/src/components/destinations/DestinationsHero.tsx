// src/components/destinations/DestinationsHero.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const DestinationsHero = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '400px' }}>

      {/* ── Image de fond ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/destinations-hero.png"
          alt="Destinations Afrique et International"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{
            transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
            transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
          }}
        />
        {/* Overlay émeraude */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(13,43,26,0.78) 0%, rgba(13,43,26,0.95) 60%, rgba(13,43,26,0.70) 100%)',
          }}
        />
        {/* Motif grille doré */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Accent barre haute */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left"
        style={{
          background: '#B85C38',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
          transform: heroVisible ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      {/* Lumières ambiantes */}
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-0 left-0 w-1/3 h-2/3 opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, #1A5C43 0%, transparent 70%)' }}
      />

      {/* Vague basse */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" fill="white">
          <path d="M0,30 C400,60 1040,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* ── Contenu centré ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 py-20 sm:py-24 md:py-28 text-center">

        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3"
          style={{
            color: '#C8A84B',
            transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Explorez le monde
        </p>

        {/* Trait décoratif */}
        <div
          className="flex items-center justify-center gap-3 mb-5"
          style={{ transition: 'opacity 0.6s 0.3s', opacity: heroVisible ? 1 : 0 }}
        >
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
        </div>

        {/* Titre */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight"
          style={{
            letterSpacing: '-0.02em',
            transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
          }}
        >
          Afrique &amp; <span style={{ color: '#C8A84B' }}>International</span>
        </h1>

        {/* Sous-titre */}
        <p
          className="text-white/65 text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed"
          style={{
            transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          Des fiches pays détaillées, des reportages exclusifs et l&apos;actualité
          des destinations phares pour les professionnels et voyageurs passionnés.
        </p>

        {/* Pills */}
        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-7 sm:mt-8"
          style={{
            transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          {['Fiches pays', 'Reportages exclusifs', 'Actualité destinations', 'Guides voyage'].map((label) => (
            <span
              key={label}
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 sm:px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(200,168,75,0.35)',
                color: 'rgba(255,255,255,0.80)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsHero;
