// src/components/magazine/EditorialCTA.tsx
"use client";

import React, { useState } from 'react';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import ModaleDestination from '@/components/shared/ModaleDestination';

const EditorialCTA = () => {
  const [isCouvertureOpen, setIsCouvertureOpen]   = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-50 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Titre — bleu nuit (texte sur fond blanc) */}
          <h2
            className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight"
            style={{ color: '#001A4D' }}
          >
            Rejoignez notre équipe éditoriale
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Vous souhaitez proposer un sujet, devenir rédacteur ou collaborer avec notre magazine ?
            Notre équipe éditoriale est à votre écoute pour donner vie à vos projets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">

            {/* Bouton 1 — terre cuite */}
            <button
              onClick={() => setIsCouvertureOpen(true)}
              className="w-full sm:w-auto text-white font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl"
              style={{ background: '#B85C38', boxShadow: '0 8px 24px rgba(184,92,56,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
              onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
            >
              Contacter la rédaction
            </button>

            {/* Bouton 2 — contour émeraude foncé */}
            <button
              onClick={() => setIsDestinationOpen(true)}
              className="w-full sm:w-auto font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95"
              style={{ border: '2px solid #1A5C43', color: '#1A5C43', background: 'transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A5C43';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#1A5C43';
              }}
            >
              Proposer un article
            </button>
          </div>

        </div>
      </section>

      <ModaleCouverture  isOpen={isCouvertureOpen}  onClose={() => setIsCouvertureOpen(false)} />
      <ModaleDestination isOpen={isDestinationOpen} onClose={() => setIsDestinationOpen(false)} />
    </>
  );
};

export default EditorialCTA;













// // src/components/magazine/EditorialCTA.tsx
// "use client";

// import React, { useState } from 'react';
// import ModaleCouverture from '@/components/shared/ModaleCouverture';
// import ModaleDestination from '@/components/shared/ModaleDestination';

// const EditorialCTA = () => {
//   // 1. États pour gérer l'ouverture des modales
//   const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
//   const [isDestinationOpen, setIsDestinationOpen] = useState(false);

//   // 2. Fonctions d'ouverture
//   const openCouverture = () => setIsCouvertureOpen(true);
//   const openDestination = () => setIsDestinationOpen(true);

//   // 3. Fonctions de fermeture
//   const closeCouverture = () => setIsCouvertureOpen(false);
//   const closeDestination = () => setIsDestinationOpen(false);

//   return (
//     <>
//       <section className="bg-gray-50 py-24 px-6 text-center">
//         <div className="max-w-4xl mx-auto space-y-8">
          
//           {/* Titre Principal - Style Presse Premium */}
//           <h2 className="text-3xl md:text-5xl font-serif font-bold text-it-blue uppercase tracking-tight">
//             Rejoignez notre équipe éditoriale
//           </h2>

//           {/* Sous-titre descriptif */}
//           <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
//             Vous souhaitez proposer un sujet, devenir rédacteur ou collaborer avec notre magazine ? 
//             Notre équipe éditoriale est à votre écoute pour donner vie à vos projets.
//           </p>

//           {/* Groupe de boutons d'action */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            
//             {/* Bouton 1 : Déclenche ModaleCouverture */}
//             <button 
//               onClick={openCouverture}
//               className="w-full sm:w-auto bg-[#F19300] hover:bg-[#d98400] text-[#0A235C] font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-orange-900/20"
//             >
//               Contacter la rédaction
//             </button>
            
//             {/* Bouton 2 : Déclenche ModaleDestination */}
//             <button 
//               onClick={openDestination}
//               className="w-full sm:w-auto border-2 border-it-blue text-it-blue hover:text-white hover:bg-it-blue font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95"
//             >
//               Proposer un article
//             </button>
//           </div>
          
//         </div>
//       </section>

//       {/* --- INJECTION DES MODALES --- */}

//       {/* Modale 1 : Contacter la rédaction (Couverture) */}
//       <ModaleCouverture 
//         isOpen={isCouvertureOpen} 
//         onClose={closeCouverture} 
//       />

//       {/* Modale 2 : Proposer un article (Destination) */}
//       <ModaleDestination 
//         isOpen={isDestinationOpen} 
//         onClose={closeDestination} 
//       />
//     </>
//   );
// };

// export default EditorialCTA;