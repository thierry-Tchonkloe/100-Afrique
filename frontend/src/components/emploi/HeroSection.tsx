"use client"; // Obligatoire pour utiliser le onClick

import React from 'react';

const HeroSection = () => {
  // Fonction de scroll fluide
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-white">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/emploi-hero.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
          iTourisme Emploi : <br />
          Propulsez votre carrière <br />
          au cœur du tourisme en mouvement
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-lg font-light md:text-xl">
          Le premier carrefour emploi né de l&apos;expertise média. Connectez votre talent aux plus belles destinations.
        </p>

        {/* Boutons d'action dynamisés */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <button 
            onClick={() => scrollToSection('candidats')}
            className="w-full rounded-md bg-[#eb5e14] cursor-pointer px-8 py-4 text-sm font-semibold transition-all hover:bg-[#d45210] active:scale-95 sm:w-auto"
          >
            Découvrir l&apos;univers Talent
          </button>
          
          <button 
            onClick={() => scrollToSection('recruteurs')}
            className="w-full rounded-md border-2 cursor-pointer border-white bg-white/10 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white hover:text-[#1e293b] active:scale-95 sm:w-auto"
          >
            Espace Recruteur
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;