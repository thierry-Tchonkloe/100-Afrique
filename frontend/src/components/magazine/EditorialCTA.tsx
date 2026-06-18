// src/components/magazine/EditorialCTA.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PenLine, Users, ArrowRight } from 'lucide-react';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import ModaleDestination from '@/components/shared/ModaleDestination';

const EditorialCTA = () => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto">

          {/* Heading centré */}
          <div
            className="text-center mb-14 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)' }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#B85C38' }}>
              — Équipe éditoriale
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none  mb-5" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
              Rejoignez notre<br />
              <span style={{ color: '#1A5C43' }}>Équipe Éditoriale</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Proposez un sujet, devenez rédacteur ou collaborez avec notre magazine. Notre équipe est à votre écoute.
            </p>
          </div>

          {/* Deux cartes CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Carte 1 — Contacter la rédaction */}
            <div
              className="group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-700 delay-100"
              style={{
                background: '#0D2B1A',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
              }}
              onClick={() => setIsCouvertureOpen(true)}
            >
              {/* Motif */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20" style={{ background: 'radial-gradient(circle at 100% 0%, #B85C38 0%, transparent 70%)' }} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: '#1A5C43' }}>
                  <Users size={22} style={{ color: '#C8A84B' }} />
                </div>
                <h3 className="text-white font-black text-xl mb-2 leading-tight">
                  Contacter la rédaction
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Une question, un partenariat ou un sujet à suggérer ? Notre équipe répond sous 48h.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color: '#C8A84B' }}>
                  Écrire à la rédaction <ArrowRight size={15} />
                </span>
              </div>
            </div>

            {/* Carte 2 — Proposer un article */}
            <div
              className="group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-700 delay-200 border-2"
              style={{
                borderColor: '#1A5C43',
                background: '#fff',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
              }}
              onClick={() => setIsDestinationOpen(true)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = '#F0FAF5';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = '#fff';
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(26,92,67,0.08)' }}>
                <PenLine size={22} style={{ color: '#1A5C43' }} />
              </div>
              <h3 className="font-black text-xl mb-2 leading-tight" style={{ color: '#0D1A10' }}>
                Proposer un article
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Vous avez un sujet à traiter sur le tourisme africain ? Soumettez votre proposition éditoriale.
              </p>
              <span className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color: '#1A5C43' }}>
                Soumettre un sujet <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <ModaleCouverture isOpen={isCouvertureOpen} onClose={() => setIsCouvertureOpen(false)} />
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
//   const [isCouvertureOpen, setIsCouvertureOpen]   = useState(false);
//   const [isDestinationOpen, setIsDestinationOpen] = useState(false);

//   return (
//     <>
//       <section className="bg-gray-50 py-24 px-6 text-center">
//         <div className="max-w-4xl mx-auto space-y-8">

//           {/* Titre — bleu nuit (texte sur fond blanc) */}
//           <h2
//             className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight"
//             style={{ color: '#001A4D' }}
//           >
//             Rejoignez notre équipe éditoriale
//           </h2>

//           <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
//             Vous souhaitez proposer un sujet, devenir rédacteur ou collaborer avec notre magazine ?
//             Notre équipe éditoriale est à votre écoute pour donner vie à vos projets.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">

//             {/* Bouton 1 — terre cuite */}
//             <button
//               onClick={() => setIsCouvertureOpen(true)}
//               className="w-full sm:w-auto text-white font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl"
//               style={{ background: '#B85C38', boxShadow: '0 8px 24px rgba(184,92,56,0.25)' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//             >
//               Contacter la rédaction
//             </button>

//             {/* Bouton 2 — contour émeraude foncé */}
//             <button
//               onClick={() => setIsDestinationOpen(true)}
//               className="w-full sm:w-auto font-black px-12 py-5 rounded-xl text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95"
//               style={{ border: '2px solid #1A5C43', color: '#1A5C43', background: 'transparent' }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = '#1A5C43';
//                 e.currentTarget.style.color = '#ffffff';
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = 'transparent';
//                 e.currentTarget.style.color = '#1A5C43';
//               }}
//             >
//               Proposer un article
//             </button>
//           </div>

//         </div>
//       </section>

//       <ModaleCouverture  isOpen={isCouvertureOpen}  onClose={() => setIsCouvertureOpen(false)} />
//       <ModaleDestination isOpen={isDestinationOpen} onClose={() => setIsDestinationOpen(false)} />
//     </>
//   );
// };

// export default EditorialCTA;













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