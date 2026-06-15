// src/components/destinations/DestinationCTA.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Handshake } from 'lucide-react';
import ModaleDestination from '@/components/shared/ModaleDestination';

const DestinationCTA = () => {
  const [isModaleOpen, setIsModaleOpen] = useState(false);

  return (
    <>
      <section className="relative py-20 px-6 bg-it-emerald-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/images/pattern-dots.png')] bg-repeat" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

          <div className="flex justify-center">
            <div className="p-4 bg-transparent border-2 border-it-gold rounded-xl transform rotate-3">
              <Handshake size={48} className="text-it-gold -rotate-3" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase leading-tight tracking-[0.05em]">
            Offices de Tourisme : <br />
            <span className="text-white">Faites la promotion de votre destination</span>
          </h2>

          <p className="text-white/75 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
            Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité exceptionnelle
            auprès des professionnels du tourisme et du grand public passionné de voyages.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-6">
            <button
              onClick={() => setIsModaleOpen(true)}
              className="w-full sm:w-auto bg-it-terracotta hover:bg-it-terracotta-dark text-white font-extrabold px-8 py-5 rounded-lg text-xs uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95"
            >
              Contact Partenariats Destination
            </button>

            <Link
              href="/partenaires-annonceurs"
              className="w-full sm:w-auto border-2 border-white/30 hover:border-white text-white font-bold px-8 py-5 rounded-lg text-xs uppercase tracking-[0.15em] transition-all hover:bg-white/10 text-center"
            >
              Découvrir nos offres
            </Link>
          </div>
        </div>
      </section>

      <ModaleDestination isOpen={isModaleOpen} onClose={() => setIsModaleOpen(false)} />
    </>
  );
};

export default DestinationCTA;
















// // src/components/destinations/DestinationCTA.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Handshake } from 'lucide-react';
// import ModaleDestination from '@/components/shared/ModaleDestination'; // Import du modale que nous avons finalisé

// const DestinationCTA = () => {
//   // État pour gérer l'ouverture du modale
//   const [isModaleOpen, setIsModaleOpen] = useState(false);

//   const openPartnershipModale = () => {
//     setIsModaleOpen(true);
//   };

//   const closePartnershipModale = () => {
//     setIsModaleOpen(false);
//   };

//   return (
//     <>
//       <section className="relative py-20 px-6 bg-[#163066] overflow-hidden">
//         {/* Texture de fond légère pour le look premium */}
//         <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/images/pattern-dots.png')] bg-repeat" />

//         <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
//           {/* --- ICÔNE HANDSHAKE --- */}
//           <div className="flex justify-center">
//             <div className="p-4 bg-transparent border-2 border-[#F19300] rounded-xl transform rotate-3">
//                <Handshake size={48} className="text-[#F19300] -rotate-3" strokeWidth={1.5} />
//             </div>
//           </div>

//           {/* --- TITRE PRINCIPAL --- */}
//           <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase leading-tight tracking-[0.05em]">
//             Offices de Tourisme : <br />
//             <span className="text-white">Faites la promotion de votre destination</span>
//           </h2>

//           {/* --- DESCRIPTION --- */}
//           <p className="text-blue-100/80 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
//             Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité exceptionnelle 
//             auprès des professionnels du tourisme et du grand public passionné de voyages.
//           </p>

//           {/* --- BOUTONS D'ACTION --- */}
//           <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-6">
//             <button 
//               onClick={openPartnershipModale}
//               className="w-full sm:w-auto bg-[#F19300] hover:bg-[#d98400] text-[#163066] font-extrabold px-8 py-5 rounded-lg text-xs uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95"
//             >
//               Contact Partenariats Destination
//             </button>

//             <Link 
//               href="/partenaires-annonceurs"
//               className="w-full sm:w-auto border-2 border-white/30 hover:border-white text-white font-bold px-8 py-5 rounded-lg text-xs uppercase tracking-[0.15em] transition-all hover:bg-white/10 text-center"
//             >
//               Découvrir nos offres
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* --- LE MODALE --- */}
//       <ModaleDestination 
//         isOpen={isModaleOpen} 
//         onClose={closePartnershipModale} 
//       />
//     </>
//   );
// };

// export default DestinationCTA;