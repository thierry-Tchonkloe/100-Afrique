// src/components/about/AboutHeroSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BRAND_LINKS = [
  { name: 'WAXEHO', url: 'https://waxeho.com' },
  { name: 'iTourisme TV', url: 'https://i-tourisme-tv.vercel.app' },
];

const AboutHeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Fond image avec overlay émeraude */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-about.jpg"
          alt="Équipe iTourisme"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,92,67,0.95) 0%, rgba(26,92,67,0.80) 60%, rgba(200,168,75,0.30) 100%)',
          }}
        />
      </div>

      {/* Logos Waxého & i Tourisme TV — filigrane pleine section */}
        <div
        className="absolute inset-0 z-[4] flex pointer-events-none mix-blend-multiply opacity-30 md:opacity-35"
        aria-hidden="true"
        >
        {/* Moitié gauche — Waxého */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
            <img
            src="/images/logo-waxeho.jpg"
            alt=""
            className="w-full h-full object-contain"
            style={{ maxHeight: '100%' }}
            />
        </div>

        {/* Séparateur vertical */}
        <div
            className="self-stretch w-px my-8"
            style={{ background: 'rgba(255,255,255,0.35)' }}
        />

        {/* Moitié droite — i Tourisme TV */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
            <img
            src="/images/logo-itourisme-tv.jpeg"
            alt=""
            className="w-full h-full object-contain"
            style={{ maxHeight: '100%' }}
            />
        </div>
        </div>

      {/* Barre accent terre cuite */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: '#B85C38' }} />

      {/* Vague décorative bas */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20" fill="white">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 md:py-36 flex flex-col items-center text-center gap-6">
        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em]"
          style={{ color: '#C8A84B' }}
        >
          Qui sommes-nous ?
        </p>

        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase tracking-tight leading-tight max-w-3xl">
          À propos de <span style={{ color: '#C8A84B' }}>Waxeho</span> et iTourisme TV
        </h1>

        <p className="text-white/75 text-base md:text-lg font-light max-w-2xl leading-relaxed">
          Le média de référence du tourisme afro-européen — informer, valoriser et connecter les acteurs du secteur depuis l'Afrique et vers le monde.
        </p>

        {/* Pills identité — boutons vers les sites respectifs */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {BRAND_LINKS.map((brand) => (
            <a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[160px] border-2 font-serif font-bold text-xl py-3 px-7 rounded-lg text-center transition-transform duration-300 hover:scale-105 active:scale-95"
              style={{ borderColor: '#C8A84B', color: '#C8A84B', background: 'rgba(200,168,75,0.08)' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = '#C8A84B';
                el.style.color = '#1A5C43';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'rgba(200,168,75,0.08)';
                el.style.color = '#C8A84B';
              }}
            >
              {brand.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 font-bold py-3 px-7 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg active:scale-95"
          style={{ background: '#B85C38' }}
        >
          Nous contacter <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
};

export default AboutHeroSection;