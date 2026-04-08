// src/components/videos/VideoCTASection.tsx
"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
// Importation de la modale spécifique aux devis vidéo
import ModaleDevis from '@/components/shared/ModaleDevis';

const VideoCTASection = () => {
  // État pour contrôler l'ouverture de la modale de devis
  const [isModaleOpen, setIsModaleOpen] = useState(false);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row bg-[#163066] rounded-xl overflow-hidden shadow-2xl min-h-[400px]">
          
          {/* --- PARTIE TEXTE --- */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white uppercase leading-tight">
              Créez votre reportage avec nous
            </h2>
            
            <p className="text-blue-100/80 leading-relaxed text-sm md:text-base">
              Donnez de la visibilité à votre destination, votre hôtel ou votre événement grâce à un reportage vidéo professionnel réalisé par i Tourisme TV. Nos équipes vous accompagnent de la conception à la diffusion.
            </p>

            {/* Bouton qui déclenche l'ouverture du formulaire de devis */}
            <button 
              onClick={() => setIsModaleOpen(true)}
              className="flex items-center gap-3 bg-[#F19300] hover:bg-[#d98400] text-[#163066] font-bold px-8 py-4 rounded-lg transition-all active:scale-95 shadow-lg group"
            >
              Demander un Devis Reportage
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* --- PARTIE IMAGE --- */}
          <div className="w-full md:w-1/2 relative h-64 md:h-auto">
            <img 
              src="/images/tournage-video.png" 
              alt="Équipe de tournage en action" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>
      </div>

      {/* --- INJECTION DE LA MODALE DEVIS --- */}
      <ModaleDevis 
        isOpen={isModaleOpen} 
        onClose={() => setIsModaleOpen(false)} 
      />
    </section>
  );
};

export default VideoCTASection;