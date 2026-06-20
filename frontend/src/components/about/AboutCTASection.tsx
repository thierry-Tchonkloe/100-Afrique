// src/components/about/AboutCTASection.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

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

// ─── Composant principal ──────────────────────────────────────────────────────

const AboutCTASection = () => {
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.1);

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-6 overflow-hidden" style={{ background: '#1A5C43' }}>

      {/* Motif grille doré — cohérent avec les autres heroes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div
        ref={sectionRef as React.RefCallback<HTMLDivElement>}
        className="relative max-w-4xl mx-auto text-center transition-all duration-700"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
        }}
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
          Construisons ensemble votre présence dans le tourisme africain
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
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            <Mail size={15} /> Nous contacter <ArrowRight size={15} />
          </Link>
          <Link
            href="/partenaires"
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 sm:px-8 rounded-full text-sm uppercase tracking-widest transition-all border-2 active:scale-95"
            style={{ borderColor: '#C8A84B', color: '#C8A84B' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#C8A84B';
              (e.currentTarget as HTMLAnchorElement).style.color = '#1A5C43';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C8A84B';
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