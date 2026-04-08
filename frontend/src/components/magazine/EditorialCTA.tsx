// src/components/magazine/EditorialCTA.tsx
"use client";

import React, { useState } from 'react';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import ModaleDestination from '@/components/shared/ModaleDestination';

const EditorialCTA = () => {
  // 1. États pour gérer l'ouverture des modales
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  // 2. Fonctions d'ouverture
  const openCouverture = () => setIsCouvertureOpen(true);
  const openDestination = () => setIsDestinationOpen(true);

  // 3. Fonctions de fermeture
  const closeCouverture = () => setIsCouvertureOpen(false);
  const closeDestination = () => setIsDestinationOpen(false);

  return (
    <>
      <section className="bg-[#1A3A8A] py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Titre Principal - Style Presse Premium */}
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-tight">
            Rejoignez notre équipe éditoriale
          </h2>

          {/* Sous-titre descriptif */}
          <p className="text-blue-100/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Vous souhaitez proposer un sujet, devenir rédacteur ou collaborer avec notre magazine ? 
            Notre équipe éditoriale est à votre écoute pour donner vie à vos projets.
          </p>

          {/* Groupe de boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            
            {/* Bouton 1 : Déclenche ModaleCouverture */}
            <button 
              onClick={openCouverture}
              className="w-full sm:w-auto bg-[#F19300] hover:bg-[#d98400] text-[#0A235C] font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-orange-900/20"
            >
              Contacter la rédaction
            </button>
            
            {/* Bouton 2 : Déclenche ModaleDestination */}
            <button 
              onClick={openDestination}
              className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white hover:text-[#1A3A8A] font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              Proposer un article
            </button>
          </div>
          
        </div>
      </section>

      {/* --- INJECTION DES MODALES --- */}

      {/* Modale 1 : Contacter la rédaction (Couverture) */}
      <ModaleCouverture 
        isOpen={isCouvertureOpen} 
        onClose={closeCouverture} 
      />

      {/* Modale 2 : Proposer un article (Destination) */}
      <ModaleDestination 
        isOpen={isDestinationOpen} 
        onClose={closeDestination} 
      />
    </>
  );
};

export default EditorialCTA;