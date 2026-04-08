"use client";

import React from 'react';

const MagazineHero = () => {
  return (
    <section className="relative w-full bg-[#1E3A8A] py-20 px-6 flex flex-col items-center justify-center text-center">
      {/* Conteneur principal sans fioritures pour correspondre à l'image */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Titre Principal : Police Serif blanche, tout en majuscules */}
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase tracking-tight">
          LE MAGAZINE WAXEHO
        </h1>

        {/* Sous-titre : Tracking large (espacement des lettres) comme sur la capture */}
        <h2 className="text-xl md:text-3xl font-serif text-white uppercase tracking-[0.2em]">
          VOYAGES, INSPIRATION, DÉCRYPTAGE
        </h2>

        {/* Description : Texte blanc, centré, sans gras superflu */}
        <p className="max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed text-white">
          Le magazine de référence pour les professionnels du tourisme et les passionnés de voyages en Afrique et à l&apos;international
        </p>
        
      </div>
    </section>
  );
};

export default MagazineHero;