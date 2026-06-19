// src/components/salons/PartnershipCTA.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';

interface PartnershipCTAProps {
  onOpenModale: () => void;
}

const PartnershipCTA = ({ onOpenModale }: PartnershipCTAProps) => {
  return (
    <section
      className="relative overflow-hidden rounded-2xl p-8 md:p-14 text-center text-white"
      style={{ background: '#0D2B1A' }}
    >
      {/* Motif grille */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Lueurs */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-15"
        style={{ background: 'radial-gradient(ellipse at 100% 30%, #B85C38 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 0% 100%, #1A5C43 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
        {/* Icône */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#1A5C43', boxShadow: '0 8px 32px rgba(26,92,67,0.4)' }}
        >
          <Camera size={24} style={{ color: '#C8A84B' }} />
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8" style={{ background: '#C8A84B' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>
            Partenariats média
          </span>
          <div className="h-px w-8" style={{ background: '#C8A84B' }} />
        </div>

        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Vous exposez ?<br />
          <span style={{ color: '#C8A84B' }}>Faites-vous remarquer !</span>
        </h2>
        <p className="text-white/55 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Offices du tourisme, agences, institutions : bénéficiez d&apos;une couverture dédiée
          lors des grands salons. Articles, vidéos, interviews sponsorisées — contactez notre
          service partenariats.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* CTA principal */}
          <button
            onClick={onOpenModale}
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-full text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            Contacter le service Partenariats
            <ArrowRight size={16} />
          </button>

          {/* CTA secondaire */}
          <Link
            href="/partenaires-annonceurs"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-full text-white transition-all border-2"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            Nos Offres Annonceurs
          </Link>
        </div>
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
//     /* Fond sombre section → bg-it-emerald-dark */
//     <section className="bg-it-emerald-dark rounded-lg p-8 md:p-12 text-center text-white shadow-xl">
//       <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 uppercase italic">
//         Vous exposez ? Faites-vous remarquer !
//       </h2>
//       <p className="mb-8 opacity-90 max-w-2xl mx-auto text-sm leading-relaxed font-light">
//         Offices du tourisme, agences, institutions : bénéficiez d&apos;une couverture dédiée lors des grands salons.
//         Articles, vidéos, interviews sponsorisées - contactez notre service partenariats.
//       </p>

//       <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//         {/* CTA principal → bg-it-terracotta / hover bg-it-terracotta-dark */}
//         <button
//           onClick={onOpenModale}
//           className="w-full sm:w-auto bg-it-terracotta hover:bg-it-terracotta-dark text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest shadow-lg active:scale-95"
//         >
//           Contacter le service Partenariats
//         </button>

//         {/* Bouton secondaire → border white / hover bg-white text-it-emerald-dark */}
//         <Link
//           href="/partenaires-annonceurs"
//           className="w-full sm:w-auto border-2 border-white/50 hover:border-white hover:bg-white hover:text-it-emerald-dark text-white font-bold py-4 px-10 rounded transition-all text-[11px] uppercase tracking-widest flex items-center justify-center"
//         >
//           Nos Offres Annonceurs
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default PartnershipCTA;
















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