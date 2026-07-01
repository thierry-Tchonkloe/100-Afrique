// src/components/about/AboutCTASection.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { MissiveMark } from '@/components/icons/CustomIcons';

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

const AboutCTASection = () => {
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.1);

  return (
    <section
      className="relative py-16 sm:py-20 px-5 sm:px-6 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/about-cta-bg.jpg)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay sombre émeraude */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(13,43,26,0.88) 0%, rgba(26,92,67,0.78) 60%, rgba(13,27,16,0.90) 100%)' }}
        aria-hidden="true"
      />

      {/* Motif dot-grid or */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(200,168,75,0.12) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Blob lumière terracotta droite */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 100% 30%, rgba(184,92,56,0.20) 0%, transparent 65%)',
          opacity: sectionVisible ? 1 : 0,
          transitionDelay: '300ms',
        }}
        aria-hidden="true"
      />

      {/* Blob lumière or bas-gauche */}
      <div
        className="absolute bottom-0 left-0 w-1/3 h-2/3 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 0% 100%, rgba(200,168,75,0.15) 0%, transparent 70%)',
          opacity: sectionVisible ? 1 : 0,
          transitionDelay: '400ms',
        }}
        aria-hidden="true"
      />

      {/* Reflet supérieur */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
        aria-hidden="true"
      />

      <div
        ref={sectionRef as React.RefCallback<HTMLDivElement>}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 transition-all duration-700"
          style={{
            color: '#C8A84B',
            transitionDelay: '100ms',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Travaillons ensemble
        </p>

        {/* Trait décoratif */}
        <div
          className="flex items-center justify-center gap-3 mb-6 transition-all duration-700"
          style={{
            transitionDelay: '150ms',
            opacity: sectionVisible ? 1 : 0,
          }}
        >
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
        </div>

        {/* Titre */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase mb-4 transition-all duration-700 leading-tight"
          style={{
            letterSpacing: '-0.01em',
            transitionDelay: '200ms',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Construisons ensemble votre présence<br />
          <span style={{ color: '#C8A84B' }}>dans le tourisme africain</span>
        </h2>

        {/* Description */}
        <p
          className="text-white/65 text-sm max-w-xl mx-auto mb-9 transition-all duration-700"
          style={{
            transitionDelay: '300ms',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Vous avez un projet, une opportunité de partenariat ou une question ? Notre équipe est prête à vous accompagner.
        </p>

        {/* Boutons */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 transition-all duration-700"
          style={{
            transitionDelay: '400ms',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest text-white transition-all active:scale-95"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            <MissiveMark size={26} /> Nous contacter <ArrowRight size={15} />
          </Link>

          <Link
            href="/partenaires"
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(200,168,75,0.45)',
              color: '#C8A84B',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,168,75,0.15)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,168,75,0.8)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,168,75,0.45)';
            }}
          >
            Devenir partenaire
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutCTASection;













// // src/components/about/AboutCTASection.tsx
// "use client";

// import React, { useEffect, useState, useCallback } from 'react';
// import Link from 'next/link';
// import { ArrowRight, Mail } from 'lucide-react';

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

// // ─── Composant principal ──────────────────────────────────────────────────────

// const AboutCTASection = () => {
//   const { ref: sectionRef, visible: sectionVisible } = useReveal(0.1);

//   return (
//     <section className="py-16 sm:py-20 px-5 sm:px-6 overflow-hidden" style={{ background: '#1A5C43' }}>

//       {/* Motif grille doré — cohérent avec les autres heroes */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.03]"
//         style={{
//           backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
//           backgroundSize: '32px 32px',
//         }}
//       />

//       <div
//         ref={sectionRef as React.RefCallback<HTMLDivElement>}
//         className="relative max-w-4xl mx-auto text-center transition-all duration-700"
//         style={{
//           opacity: sectionVisible ? 1 : 0,
//           transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
//         }}
//       >
//         {/* Eyebrow */}
//         <p
//           className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 transition-all duration-700"
//           style={{
//             color: '#C8A84B',
//             transitionDelay: '100ms',
//             opacity: sectionVisible ? 1 : 0,
//             transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
//           }}
//         >
//           Travaillons ensemble
//         </p>

//         {/* Trait décoratif */}
//         <div
//           className="flex items-center justify-center gap-3 mb-6 transition-all duration-700"
//           style={{
//             transitionDelay: '150ms',
//             opacity: sectionVisible ? 1 : 0,
//           }}
//         >
//           <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
//           <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
//           <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.4)' }} />
//         </div>

//         {/* Titre */}
//         <h2
//           className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase mb-4 transition-all duration-700 leading-tight"
//           style={{
//             letterSpacing: '-0.01em',
//             transitionDelay: '200ms',
//             opacity: sectionVisible ? 1 : 0,
//             transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
//           }}
//         >
//           Construisons ensemble votre présence dans le tourisme africain
//         </h2>

//         {/* Description */}
//         <p
//           className="text-white/65 text-sm max-w-xl mx-auto mb-9 transition-all duration-700"
//           style={{
//             transitionDelay: '300ms',
//             opacity: sectionVisible ? 1 : 0,
//             transform: sectionVisible ? 'translateY(0)' : 'translateY(16px)',
//           }}
//         >
//           Vous avez un projet, une opportunité de partenariat ou une question ? Notre équipe est prête à vous accompagner.
//         </p>

//         {/* Boutons */}
//         <div
//           className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 transition-all duration-700"
//           style={{
//             transitionDelay: '400ms',
//             opacity: sectionVisible ? 1 : 0,
//             transform: sectionVisible ? 'translateY(0)' : 'translateY(14px)',
//           }}
//         >
//           <Link
//             href="/contact"
//             className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
//             style={{ background: '#B85C38' }}
//             onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
//             onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//           >
//             <Mail size={15} /> Nous contacter <ArrowRight size={15} />
//           </Link>
//           <Link
//             href="/partenaires"
//             className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest transition-all border-2 active:scale-95"
//             style={{ borderColor: '#C8A84B', color: '#C8A84B' }}
//             onMouseEnter={e => {
//               (e.currentTarget as HTMLAnchorElement).style.background = '#C8A84B';
//               (e.currentTarget as HTMLAnchorElement).style.color = '#1A5C43';
//             }}
//             onMouseLeave={e => {
//               (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
//               (e.currentTarget as HTMLAnchorElement).style.color = '#C8A84B';
//             }}
//           >
//             Devenir partenaire
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutCTASection;