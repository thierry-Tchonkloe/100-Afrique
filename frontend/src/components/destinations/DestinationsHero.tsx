// src/components/destinations/DestinationsHero.tsx
"use client";

import React from 'react';
import Image from 'next/image';

const DestinationsHero = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* --- IMAGE D'ARRIÈRE-PLAN --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/destinations-hero.png" // Remplace par ton image de savane au coucher du soleil
          alt="Destinations Afrique et International"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay dégradé pour la lisibilité du texte (Bleu Nuit vers Transparent) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D3A8A]/80 via-[#1D3A8A]/40 to-transparent" />
      </div>

      {/* --- CONTENU TEXTUEL --- */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase leading-[1.1] tracking-tight">
            Découvrez le monde : <br />
            <span className="text-white/90">Afrique et International</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-50 font-light leading-relaxed max-w-xl">
            Des fiches pays détaillées, des reportages exclusifs et l&apos;actualité des destinations phares.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DestinationsHero;