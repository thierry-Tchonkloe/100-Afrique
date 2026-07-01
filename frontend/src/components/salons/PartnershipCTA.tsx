// src/components/salons/PartnershipCTA.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CaptureMark } from '@/components/icons/CustomIcons';

interface PartnershipCTAProps {
  onOpenModale: () => void;
}

// ─── Hook reveal ──────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

// ─── Composant ────────────────────────────────────────────────────────────────

const PartnershipCTA = ({ onOpenModale }: PartnershipCTAProps) => {
  const { ref, visible } = useReveal(0.1);

  return (
    <section
      ref={ref as React.RefCallback<HTMLElement>}
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
      {/* Lueur terracotta */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 100% 30%, #B85C38 0%, transparent 65%)',
          opacity: visible ? 0.18 : 0,
        }}
      />
      {/* Lueur émeraude */}
      <div
        className="absolute bottom-0 left-0 w-1/3 h-2/3 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 0% 100%, #1A5C43 0%, transparent 70%)',
          opacity: visible ? 0.22 : 0,
          transitionDelay: '200ms',
        }}
      />

      {/* Barre accent top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] origin-left"
        style={{
          background: '#B85C38',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      <div className="relative z-10">
        {/* Icône — CaptureMark remplace Camera */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-700"
          style={{
            background: '#1A5C43',
            boxShadow: '0 8px 32px rgba(26,92,67,0.4)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
          }}
        >
          <CaptureMark size={40} style={{ color: '#C8A84B' }} />
        </div>

        {/* Eyebrow */}
        <div
          className="flex items-center justify-center gap-3 mb-4 transition-all duration-700"
          style={{
            transitionDelay: '100ms',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <div
            className="h-px transition-all duration-700"
            style={{
              background: '#C8A84B',
              width: visible ? 32 : 0,
              transitionDelay: '300ms',
            }}
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#C8A84B' }}>
            Partenariats média
          </span>
          <div
            className="h-px transition-all duration-700"
            style={{
              background: '#C8A84B',
              width: visible ? 32 : 0,
              transitionDelay: '300ms',
            }}
          />
        </div>

        {/* Titre */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 transition-all duration-700"
          style={{
            letterSpacing: '-0.02em',
            transitionDelay: '150ms',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Vous exposez ?<br />
          <span style={{ color: '#C8A84B' }}>Faites-vous remarquer !</span>
        </h2>

        {/* Description */}
        <p
          className="text-white/55 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700"
          style={{
            transitionDelay: '230ms',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          Offices du tourisme, agences, institutions : bénéficiez d&apos;une couverture dédiée
          lors des grands salons. Articles, vidéos, interviews sponsorisées — contactez notre
          service partenariats.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 transition-all duration-700"
          style={{
            transitionDelay: '320ms',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          <button
            onClick={onOpenModale}
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            Contacter le service Partenariats
            <ArrowRight size={16} />
          </button>

          <Link
            href="/partenaires"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all border-2"
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