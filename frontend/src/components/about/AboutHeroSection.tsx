// src/components/about/AboutHeroSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BRAND_LINKS = [
  {
    name: 'WAXEHO',
    url: 'https://waxeho.com',
    logo: '/images/logo-waxeho.jpg',
    label: 'Découvrir WAXEHO',
  },
  {
    name: 'iTourisme TV',
    url: 'https://i-tourisme-tv.vercel.app',
    logo: '/images/logo-itourisme-tv.jpeg',
    label: 'Découvrir iTourisme TV',
  },
];

const AboutHeroSection = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '520px' }}>

      {/* ── Image de fond ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-about.jpg"
          alt="Équipe iTourisme"
          className="w-full h-full object-cover object-center"
          style={{
            transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
            transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(26,92,67,0.95) 0%, rgba(26,92,67,0.80) 60%, rgba(200,168,75,0.30) 100%)',
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

      {/* Filigrane logos */}
      <div
        className="absolute inset-0 z-[4] flex pointer-events-none mix-blend-multiply opacity-30 md:opacity-35"
        aria-hidden="true"
        style={{
          transition: 'opacity 1.2s 0.6s',
          opacity: heroVisible ? undefined : 0,
        }}
      >
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <img src="/images/logo-waxeho.jpg" alt="" className="w-full h-full object-contain" style={{ maxHeight: '100%' }} />
        </div>
        <div className="self-stretch w-px my-8" style={{ background: 'rgba(255,255,255,0.35)' }} />
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <img src="/images/logo-itourisme-tv.jpeg" alt="" className="w-full h-full object-contain" style={{ maxHeight: '100%' }} />
        </div>
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

      {/* Vague décorative bas */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20" fill="white">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* ── Contenu centré ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-28 md:py-36 flex flex-col items-center text-center gap-5">

        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em]"
          style={{
            color: '#C8A84B',
            transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Qui sommes-nous ?
        </p>

        {/* Trait décoratif */}
        <div
          className="flex items-center justify-center gap-3"
          style={{
            transition: 'opacity 0.6s 0.3s',
            opacity: heroVisible ? 1 : 0,
          }}
        >
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
        </div>

        {/* Titre */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-tight max-w-3xl"
          style={{
            letterSpacing: '-0.02em',
            transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
          }}
        >
          A propos de <span style={{ color: '#C8A84B' }}>Waxeho</span> et iTourisme TV
        </h1>

        {/* Description */}
        <p
          className="text-white/75 text-base md:text-lg font-light max-w-2xl leading-relaxed"
          style={{
            transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          Le média de référence du tourisme afro-européen — informer, valoriser et connecter les acteurs du secteur depuis l&apos;Afrique et vers le monde.
        </p>

        {/* ── Boutons logo ── */}
        <div
          className="flex flex-wrap justify-center gap-5 pt-2"
          style={{
            transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          {BRAND_LINKS.map((brand) => (
            <a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={brand.label}
              className="group relative flex flex-col items-center gap-2.5 rounded-xl p-3 pb-3.5 transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(200,168,75,0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                minWidth: '148px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.16)';
                e.currentTarget.style.borderColor = 'rgba(200,168,75,0.75)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,168,75,0.18), 0 8px 24px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(200,168,75,0.35)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Logo */}
              <div
                className="w-28 h-14 sm:w-32 sm:h-16 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.92)' }}
              >
                <img
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  className="w-full h-full object-contain p-1.5"
                />
              </div>

              {/* Libellé */}
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: '#C8A84B' }}
              >
                {brand.name}
              </span>

              {/* Flèche discrète au hover */}
              <span
                className="absolute top-2 right-2.5 text-[10px] opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                style={{ color: '#C8A84B' }}
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            transition: 'opacity 0.7s 0.8s, transform 0.7s 0.8s',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-bold py-3 px-7 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg active:scale-95"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            Nous contacter <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;












// // src/components/about/AboutHeroSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';

// const BRAND_LINKS = [
//   { name: 'WAXEHO',        url: 'https://waxeho.com' },
//   { name: 'iTourisme TV',  url: 'https://i-tourisme-tv.vercel.app' },
// ];

// const AboutHeroSection = () => {
//   const [heroVisible, setHeroVisible] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setHeroVisible(true), 80);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <section className="relative w-full overflow-hidden" style={{ minHeight: '520px' }}>

//       {/* ── Image de fond ── */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src="/images/hero-about.jpg"
//           alt="Équipe iTourisme"
//           className="w-full h-full object-cover object-center"
//           style={{
//             transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
//             transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
//           }}
//           onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
//         />
//         <div
//           className="absolute inset-0"
//           style={{
//             background:
//               'linear-gradient(135deg, rgba(26,92,67,0.95) 0%, rgba(26,92,67,0.80) 60%, rgba(200,168,75,0.30) 100%)',
//           }}
//         />
//         {/* Motif grille doré */}
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
//             backgroundSize: '32px 32px',
//           }}
//         />
//       </div>

//       {/* Filigrane logos */}
//       <div
//         className="absolute inset-0 z-[4] flex pointer-events-none mix-blend-multiply opacity-30 md:opacity-35"
//         aria-hidden="true"
//         style={{
//           transition: 'opacity 1.2s 0.6s',
//           opacity: heroVisible ? undefined : 0,
//         }}
//       >
//         <div className="flex-1 flex items-center justify-center p-6 md:p-12">
//           <img src="/images/logo-waxeho.jpg" alt="" className="w-full h-full object-contain" style={{ maxHeight: '100%' }} />
//         </div>
//         <div className="self-stretch w-px my-8" style={{ background: 'rgba(255,255,255,0.35)' }} />
//         <div className="flex-1 flex items-center justify-center p-6 md:p-12">
//           <img src="/images/logo-itourisme-tv.jpeg" alt="" className="w-full h-full object-contain" style={{ maxHeight: '100%' }} />
//         </div>
//       </div>

//       {/* Accent barre haute — scaleX depuis la gauche */}
//       <div
//         className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left"
//         style={{
//           background: '#B85C38',
//           transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
//           transform: heroVisible ? 'scaleX(1)' : 'scaleX(0)',
//         }}
//       />

//       {/* Lumière ambiante coin bas-droit */}
//       <div
//         className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }}
//       />
//       {/* Lumière ambiante coin haut-gauche */}
//       <div
//         className="absolute top-0 left-0 w-1/3 h-2/3 opacity-15 pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 0% 0%, #1A5C43 0%, transparent 70%)' }}
//       />

//       {/* Vague décorative bas */}
//       <div className="absolute bottom-0 left-0 right-0 z-10">
//         <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20" fill="white">
//           <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
//         </svg>
//       </div>

//       {/* ── Contenu centré ── */}
//       <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-28 md:py-36 flex flex-col items-center text-center gap-5">

//         {/* Eyebrow */}
//         <p
//           className="text-[11px] font-bold uppercase tracking-[0.35em]"
//           style={{
//             color: '#C8A84B',
//             transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
//             opacity: heroVisible ? 1 : 0,
//             transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
//           }}
//         >
//           Qui sommes-nous ?
//         </p>

//         {/* Trait décoratif */}
//         <div
//           className="flex items-center justify-center gap-3"
//           style={{
//             transition: 'opacity 0.6s 0.3s',
//             opacity: heroVisible ? 1 : 0,
//           }}
//         >
//           <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
//           <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
//           <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
//         </div>

//         {/* Titre */}
//         <h1
//           className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-tight max-w-3xl"
//           style={{
//             letterSpacing: '-0.02em',
//             transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
//             opacity: heroVisible ? 1 : 0,
//             transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
//           }}
//         >
//           À propos de <span style={{ color: '#C8A84B' }}>Waxeho</span> et iTourisme TV
//         </h1>

//         {/* Description */}
//         <p
//           className="text-white/75 text-base md:text-lg font-light max-w-2xl leading-relaxed"
//           style={{
//             transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
//             opacity: heroVisible ? 1 : 0,
//             transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
//           }}
//         >
//           Le média de référence du tourisme afro-européen — informer, valoriser et connecter les acteurs du secteur depuis l&apos;Afrique et vers le monde.
//         </p>

//         {/* Pills identité — boutons vers les sites */}
//         <div
//           className="flex flex-wrap justify-center gap-4 pt-2"
//           style={{
//             transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
//             opacity: heroVisible ? 1 : 0,
//             transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
//           }}
//         >
//           {BRAND_LINKS.map((brand) => (
//             <a
//               key={brand.name}
//               href={brand.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="min-w-[140px] sm:min-w-[160px] border-2 font-serif font-bold text-lg sm:text-xl py-3 px-6 sm:px-7 rounded-lg text-center transition-transform duration-300 hover:scale-105 active:scale-95"
//               style={{ borderColor: '#C8A84B', color: '#C8A84B', background: 'rgba(200,168,75,0.08)' }}
//               onMouseEnter={(e) => {
//                 const el = e.currentTarget as HTMLAnchorElement;
//                 el.style.background = '#C8A84B';
//                 el.style.color = '#1A5C43';
//               }}
//               onMouseLeave={(e) => {
//                 const el = e.currentTarget as HTMLAnchorElement;
//                 el.style.background = 'rgba(200,168,75,0.08)';
//                 el.style.color = '#C8A84B';
//               }}
//             >
//               {brand.name}
//             </a>
//           ))}
//         </div>

//         {/* CTA */}
//         <div
//           style={{
//             transition: 'opacity 0.7s 0.8s, transform 0.7s 0.8s',
//             opacity: heroVisible ? 1 : 0,
//             transform: heroVisible ? 'translateY(0)' : 'translateY(12px)',
//           }}
//         >
//           <Link
//             href="/contact"
//             className="inline-flex items-center gap-2 font-bold py-3 px-7 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg active:scale-95"
//             style={{ background: '#B85C38' }}
//             onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
//             onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//           >
//             Nous contacter <ArrowRight size={15} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutHeroSection;