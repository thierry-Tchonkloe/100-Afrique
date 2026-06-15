// src/components/salons/PartnershipCTA.tsx
import React from 'react';
import Link from 'next/link';

interface PartnershipCTAProps {
  onOpenModale: () => void;
}

const PartnershipCTA = ({ onOpenModale }: PartnershipCTAProps) => {
  return (
    /* Fond sombre section → bg-it-emerald-dark */
    <section className="bg-it-emerald-dark rounded-lg p-8 md:p-12 text-center text-white shadow-xl">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 uppercase italic">
        Vous exposez ? Faites-vous remarquer !
      </h2>
      <p className="mb-8 opacity-90 max-w-2xl mx-auto text-sm leading-relaxed font-light">
        Offices du tourisme, agences, institutions : bénéficiez d&apos;une couverture dédiée lors des grands salons.
        Articles, vidéos, interviews sponsorisées - contactez notre service partenariats.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* CTA principal → bg-it-terracotta / hover bg-it-terracotta-dark */}
        <button
          onClick={onOpenModale}
          className="w-full sm:w-auto bg-it-terracotta hover:bg-it-terracotta-dark text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest shadow-lg active:scale-95"
        >
          Contacter le service Partenariats
        </button>

        {/* Bouton secondaire → border white / hover bg-white text-it-emerald-dark */}
        <Link
          href="/partenaires-annonceurs"
          className="w-full sm:w-auto border-2 border-white/50 hover:border-white hover:bg-white hover:text-it-emerald-dark text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest flex items-center justify-center"
        >
          Nos Offres Annonceurs
        </Link>
      </div>
    </section>
  );
};

export default PartnershipCTA;
















// // src/components/salons/PartnershipCTA.tsx
// import React from 'react';
// import Link from 'next/link';

// interface PartnershipCTAProps {
//   onOpenModale: () => void;
// }

// const PartnershipCTA = ({ onOpenModale }: PartnershipCTAProps) => {
//   return (
//     <section className="bg-[#1D3A8A] rounded-lg p-8 md:p-12 text-center text-white shadow-xl">
//       <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 uppercase italic">
//         Vous exposez ? Faites-vous remarquer !
//       </h2>
//       <p className="mb-8 opacity-90 max-w-2xl mx-auto text-sm leading-relaxed font-light">
//         Offices du tourisme, agences, institutions : bénéficiez d&apos;une couverture dédiée lors des grands salons. 
//         Articles, vidéos, interviews sponsorisées - contactez notre service partenariats.
//       </p>
      
//       <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//         <button 
//           onClick={onOpenModale}
//           className="w-full sm:w-auto bg-[#F19300] hover:bg-[#d98400] text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest shadow-lg active:scale-95"
//         >
//           Contacter le service Partenariats
//         </button>

//         <Link 
//           href="/partenaires-annonceurs" 
//           className="w-full sm:w-auto border-2 border-white/50 hover:border-white hover:bg-white hover:text-[#1D3A8A] text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest flex items-center justify-center"
//         >
//           Nos Offres Annonceurs
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default PartnershipCTA;