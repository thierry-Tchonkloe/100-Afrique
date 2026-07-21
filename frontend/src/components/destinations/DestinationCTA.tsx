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
