// src/components/partners/PartnersHero.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PartnersHeroProps {
  onOpenOffers: () => void;
  data?: {
    title: string;
    description: string;
    imageUrl: string;
  };
}

const PartnersHero = ({ onOpenOffers, data }: PartnersHeroProps) => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const content = {
    title:    data?.title    || "Devenez partenaire du média référence du tourisme afro-européen",
    description: data?.description || "Augmentez votre visibilité auprès des professionnels, offices de tourisme et voyageurs passionnés.",
    imageUrl: data?.imageUrl || "/images/partners-hero.png",
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>

      {/* ── Image de fond ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.imageUrl}
          alt="Partenariat"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{
            transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
            transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
          }}
        />
        {/* Overlay émeraude profond — même recette que SalonsPageClient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(13,43,26,0.80) 0%, rgba(13,43,26,0.96) 60%, rgba(13,43,26,0.72) 100%)',
          }}
        />
        {/* Motif grille doré */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Accent barre haute */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left"
        style={{
          background: '#B85C38',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
          transform: heroVisible ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      {/* Lumières ambiantes */}
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-0 left-0 w-1/3 h-2/3 opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, #1A5C43 0%, transparent 70%)' }}
      />

      {/* Vague basse */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" fill="white">
          <path d="M0,30 C400,60 1040,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* ── Contenu centré ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-20 sm:py-24 md:py-32 text-center">

        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3"
          style={{
            color: '#C8A84B',
            transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Médias &amp; Visibilité
        </p>

        {/* Trait décoratif */}
        <div
          className="flex items-center justify-center gap-3 mb-5"
          style={{ transition: 'opacity 0.6s 0.3s', opacity: heroVisible ? 1 : 0 }}
        >
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
        </div>

        {/* Titre */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight mb-5"
          style={{
            letterSpacing: '-0.02em',
            transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
          }}
        >
          {content.title}
        </h1>

        {/* Description */}
        <p
          className="text-white/65 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8"
          style={{
            transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          {content.description}
        </p>

        {/* CTA + pills */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          <button
            onClick={onOpenOffers}
            className="font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full text-white transition-all active:scale-95 shadow-xl"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            Découvrir nos offres
          </button>

          {['Visibilité', 'Reportages', 'Événements'].map((label) => (
            <span
              key={label}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full hidden sm:inline-flex"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(200,168,75,0.35)',
                color: 'rgba(255,255,255,0.80)',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Pills mobile — ligne séparée sous le CTA */}
        <div
          className="flex sm:hidden flex-wrap justify-center gap-2 mt-4"
          style={{
            transition: 'opacity 0.7s 0.75s',
            opacity: heroVisible ? 1 : 0,
          }}
        >
          {['Visibilité', 'Reportages', 'Événements'].map((label) => (
            <span
              key={label}
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(200,168,75,0.35)',
                color: 'rgba(255,255,255,0.80)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersHero;











// // src/components/partners/PartnersHero.tsx
// "use client";

// import React from 'react';
// import Image from 'next/image';

// interface PartnersHeroProps {
//   onOpenOffers: () => void;
//   data?: {
//     title: string;
//     description: string;
//     imageUrl: string;
//   };
// }

// const PartnersHero = ({ onOpenOffers, data }: PartnersHeroProps) => {
//   const content = {
//     title: data?.title || "Devenez partenaire du média référence du tourisme afro-européen",
//     description: data?.description || "Augmentez votre visibilité auprès des professionnels, offices de tourisme et voyageurs passionnés.",
//     imageUrl: data?.imageUrl || "/images/partners-hero.png" // ✅ Chemin relatif depuis /public
//   };

//   return (
//     <section className="bg-[#1D3A8A] py-16 md:py-24 px-6 overflow-hidden">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
//           <div className="lg:w-1/2 space-y-8 text-white">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-[1.1] tracking-tight">
//               {content.title}
//             </h1>
            
//             <p className="text-blue-100/80 text-lg md:text-xl font-light leading-relaxed max-w-xl">
//               {content.description}
//             </p>

//             <div className="pt-4">
//               <button
//                 onClick={onOpenOffers}
//                 className="bg-[#F19300] hover:bg-[#d98400] text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/20"
//               >
//                 Découvrir nos offres
//               </button>
//             </div>
//           </div>

//           <div className="lg:w-1/2 relative">
//             <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
//               <div className="aspect-[4/3] relative bg-slate-200">
//                 {/* ✅ next/image avec chemins corrects */}
//                 <Image
//                   src={content.imageUrl}
//                   alt="Partenariat Waxeho"
//                   fill
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   className="object-cover"
//                   priority
//                   // ✅ Gestion d'erreur
//                   onError={(e) => {
//                     console.error("Erreur de chargement de l'image:", content.imageUrl);
//                   }}
//                 />
//               </div>
//             </div>
            
//             <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#F19300]/30 rounded-2xl z-0" />
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default PartnersHero;