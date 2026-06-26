// src/components/destinations/DestinationCTA.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Handshake, ArrowRight } from 'lucide-react';
import ModaleDestination from '@/components/shared/ModaleDestination';

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

const DestinationCTA = () => {
  const [isModaleOpen, setIsModaleOpen] = useState(false);
  const { ref, visible } = useReveal(0.1);

  return (
    <>
      <section
        className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/destination-cta-bg.jpg)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay sombre émeraude */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(13,43,26,0.88) 0%, rgba(26,92,67,0.78) 60%, rgba(13,27,16,0.90) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Motif grille doré */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(200,168,75,0.13) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* Lumière ambiante droite */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(ellipse at 100% 30%, rgba(184,92,56,0.22) 0%, transparent 65%)',
            opacity: visible ? 1 : 0,
            transitionDelay: '300ms',
          }}
          aria-hidden="true"
        />

        {/* Lumière ambiante gauche */}
        <div
          className="absolute bottom-0 left-0 w-1/3 h-2/3 z-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: 'radial-gradient(ellipse at 0% 100%, rgba(200,168,75,0.18) 0%, transparent 70%)',
            opacity: visible ? 1 : 0,
            transitionDelay: '400ms',
          }}
          aria-hidden="true"
        />

        {/* Barre accent top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-10 origin-left"
          style={{
            background: '#B85C38',
            transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          }}
          aria-hidden="true"
        />

        {/* Reflet supérieur glassmorphism */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
          aria-hidden="true"
        />

        {/* Contenu flottant */}
        <div
          ref={ref as React.RefCallback<HTMLDivElement>}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Icône */}
          <div
            className="flex justify-center mb-6 transition-all duration-700"
            style={{
              transitionDelay: '80ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
            }}
          >
            <div
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(200,168,75,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transform: 'rotate(3deg)',
              }}
            >
              <Handshake
                size={40}
                style={{ color: '#C8A84B', transform: 'rotate(-3deg)' }}
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Eyebrow */}
          <p
            className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 transition-all duration-700"
            style={{
              color: '#C8A84B',
              transitionDelay: '150ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(14px)',
            }}
          >
            Partenariats destinations
          </p>

          {/* Trait décoratif */}
          <div
            className="flex items-center justify-center gap-3 mb-6 transition-all duration-700"
            style={{ transitionDelay: '200ms', opacity: visible ? 1 : 0 }}
          >
            <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
            <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
          </div>

          {/* Titre */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase leading-tight mb-5 transition-all duration-700"
            style={{
              letterSpacing: '-0.01em',
              transitionDelay: '250ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            Offices de Tourisme :<br />
            <span style={{ color: '#C8A84B' }}>Faites la promotion de votre destination</span>
          </h2>

          {/* Description */}
          <p
            className="text-white/65 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-700"
            style={{
              transitionDelay: '330ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité exceptionnelle
            auprès des professionnels du tourisme et du grand public passionné de voyages.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 transition-all duration-700"
            style={{
              transitionDelay: '420ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(14px)',
            }}
          >
            <button
              onClick={() => setIsModaleOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all active:scale-95"
              style={{ background: '#B85C38' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
              onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
            >
              Contact Partenariats Destination
              <ArrowRight size={15} />
            </button>

            <Link
              href="/partenaires"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)';
              }}
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

// import React, { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { Handshake, ArrowRight } from 'lucide-react';
// import ModaleDestination from '@/components/shared/ModaleDestination';

// // ─── Hook reveal ──────────────────────────────────────────────────────────────

// function useReveal(threshold = 0.1) {
//   const [el, setEl] = useState<HTMLElement | null>(null);
//   const [visible, setVisible] = useState(false);
//   const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

//   useEffect(() => {
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// // ─── Composant ────────────────────────────────────────────────────────────────

// const DestinationCTA = () => {
//   const [isModaleOpen, setIsModaleOpen] = useState(false);
//   const { ref, visible } = useReveal(0.1);

//   return (
//     <>
//       <section className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden" style={{ background: '#1A5C43' }}>

//         {/* Motif grille doré */}
//         <div
//           className="absolute inset-0 pointer-events-none opacity-[0.04]"
//           style={{
//             backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
//             backgroundSize: '32px 32px',
//           }}
//         />

//         {/* Lumières ambiantes */}
//         <div
//           className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-opacity duration-1000"
//           style={{
//             background: 'radial-gradient(ellipse at 100% 30%, #B85C38 0%, transparent 65%)',
//             opacity: visible ? 0.15 : 0,
//             transitionDelay: '300ms',
//           }}
//         />
//         <div
//           className="absolute bottom-0 left-0 w-1/3 h-2/3 pointer-events-none transition-opacity duration-1000"
//           style={{
//             background: 'radial-gradient(ellipse at 0% 100%, rgba(200,168,75,0.3) 0%, transparent 70%)',
//             opacity: visible ? 1 : 0,
//             transitionDelay: '400ms',
//           }}
//         />

//         {/* Barre accent top — scaleX */}
//         <div
//           className="absolute top-0 left-0 right-0 h-[3px] origin-left"
//           style={{
//             background: '#B85C38',
//             transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
//             transform: visible ? 'scaleX(1)' : 'scaleX(0)',
//           }}
//         />

//         <div
//           ref={ref as React.RefCallback<HTMLDivElement>}
//           className="relative z-10 max-w-4xl mx-auto text-center"
//         >
//           {/* Icône */}
//           <div
//             className="flex justify-center mb-6 transition-all duration-700"
//             style={{
//               transitionDelay: '80ms',
//               opacity: visible ? 1 : 0,
//               transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
//             }}
//           >
//             <div
//               className="p-4 rounded-2xl"
//               style={{
//                 background: 'rgba(255,255,255,0.08)',
//                 border: '2px solid rgba(200,168,75,0.4)',
//                 transform: 'rotate(3deg)',
//               }}
//             >
//               <Handshake
//                 size={40}
//                 style={{ color: '#C8A84B', transform: 'rotate(-3deg)' }}
//                 strokeWidth={1.5}
//               />
//             </div>
//           </div>

//           {/* Eyebrow */}
//           <p
//             className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 transition-all duration-700"
//             style={{
//               color: '#C8A84B',
//               transitionDelay: '150ms',
//               opacity: visible ? 1 : 0,
//               transform: visible ? 'translateY(0)' : 'translateY(14px)',
//             }}
//           >
//             Partenariats destinations
//           </p>

//           {/* Trait décoratif */}
//           <div
//             className="flex items-center justify-center gap-3 mb-6 transition-all duration-700"
//             style={{ transitionDelay: '200ms', opacity: visible ? 1 : 0 }}
//           >
//             <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
//             <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
//             <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
//           </div>

//           {/* Titre */}
//           <h2
//             className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase leading-tight mb-5 transition-all duration-700"
//             style={{
//               letterSpacing: '-0.01em',
//               transitionDelay: '250ms',
//               opacity: visible ? 1 : 0,
//               transform: visible ? 'translateY(0)' : 'translateY(20px)',
//             }}
//           >
//             Offices de Tourisme :<br />
//             <span style={{ color: '#C8A84B' }}>Faites la promotion de votre destination</span>
//           </h2>

//           {/* Description */}
//           <p
//             className="text-white/65 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-700"
//             style={{
//               transitionDelay: '330ms',
//               opacity: visible ? 1 : 0,
//               transform: visible ? 'translateY(0)' : 'translateY(16px)',
//             }}
//           >
//             Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité exceptionnelle
//             auprès des professionnels du tourisme et du grand public passionné de voyages.
//           </p>

//           {/* CTAs */}
//           <div
//             className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 transition-all duration-700"
//             style={{
//               transitionDelay: '420ms',
//               opacity: visible ? 1 : 0,
//               transform: visible ? 'translateY(0)' : 'translateY(14px)',
//             }}
//           >
//             <button
//               onClick={() => setIsModaleOpen(true)}
//               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
//               style={{ background: '#B85C38' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//             >
//               Contact Partenariats Destination
//               <ArrowRight size={15} />
//             </button>

//             <Link
//               href="/partenaires-annonceurs"
//               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 sm:px-8 py-4 rounded-full text-white transition-all border-2 active:scale-95"
//               style={{ borderColor: 'rgba(255,255,255,0.3)' }}
//               onMouseEnter={e => {
//                 (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)';
//                 (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
//               }}
//               onMouseLeave={e => {
//                 (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
//                 (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
//               }}
//             >
//               Découvrir nos offres
//             </Link>
//           </div>
//         </div>
//       </section>

//       <ModaleDestination isOpen={isModaleOpen} onClose={() => setIsModaleOpen(false)} />
//     </>
//   );
// };

// export default DestinationCTA;
















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