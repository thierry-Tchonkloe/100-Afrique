// src/components/contact/AboutHeroSection.tsx
import React from 'react';

const AboutHeroSection = () => {
  return (
    <section className="relative w-full py-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-it-emerald-dark" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase tracking-tight leading-tight">
          À propos de Waxého et i Tourisme TV
        </h1>
        <p className="text-white/75 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Le média référence du tourisme afro-européen et international
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <button className="min-w-[180px] bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-it-gold font-serif font-bold text-2xl py-4 px-8 rounded-lg transition-all duration-300 shadow-lg">
            WAXÉHO
          </button>
          <button className="min-w-[180px] bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-it-gold font-serif font-bold text-2xl py-4 px-8 rounded-lg transition-all duration-300 shadow-lg">
            i Tourisme TV
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
