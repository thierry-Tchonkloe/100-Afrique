// src/components/salons/hero/SalonsHero.tsx
"use client";
import React, { useEffect, useState } from 'react';

interface HeroPillProps {
  label: string;
  visible: boolean;
  delay?: number;
}

function HeroPill({ label, visible, delay = 0 }: HeroPillProps) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-700"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(200,168,75,0.3)',
        color: 'rgba(255,255,255,0.75)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(14px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {label}
    </span>
  );
}

interface SalonsHeroProps {
  onVisibleChange: (visible: boolean) => void;
}

const SalonsHero = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 480, background: '#0D2B1A' }}>

      {/* Image fond avec Ken Burns */}
      <div
        className="absolute inset-0 transition-transform ease-linear"
        style={{ transitionDuration: '12000ms', transform: heroVisible && imgLoaded ? 'scale(1.06)' : 'scale(1)' }}
      >
        <img
          src="/images/hero-salons.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 800ms ease' }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(false)}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(13,43,26,0.82) 0%, rgba(13,43,26,0.97) 55%, rgba(13,43,26,0.72) 100%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(13,43,26,0.6) 100%)' }} />

      {/* Pattern de points */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      {/* Lumières ambiantes */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 w-1/3 h-2/3 pointer-events-none opacity-12"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, #1A5C43 0%, transparent 70%)' }} />

      {/* Barre accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left"
        style={{
          background: 'linear-gradient(to right, #1A5C43, #C8A84B, #B85C38)',
          transition: 'transform 1s cubic-bezier(0.22,1,0.36,1) 0.1s',
          transform: heroVisible ? 'scaleX(1)' : 'scaleX(0)',
        }} />

      {/* Vague SVG basse */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-14 md:h-18" fill="white">
          <path d="M0,36 C360,72 1080,0 1440,36 L1440,72 L0,72 Z" />
        </svg>
      </div>

      {/* Contenu hero */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 text-center">

        <p className="text-[11px] font-black uppercase tracking-[0.35em] mb-4 transition-all duration-600"
          style={{ color: '#C8A84B', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(14px)', transitionDelay: '150ms' }}>
          Tourisme mondial
        </p>

        <div className="flex items-center justify-center gap-3 mb-6 transition-all duration-500"
          style={{ opacity: heroVisible ? 1 : 0, transitionDelay: '220ms' }}>
          <div className="h-px w-12" style={{ background: 'rgba(200,168,75,0.4)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-12" style={{ background: 'rgba(200,168,75,0.4)' }} />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase leading-none mb-6 transition-all duration-700"
          style={{ letterSpacing: '-0.03em', textShadow: '0 4px 24px rgba(0,0,0,0.3)', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(22px)', transitionDelay: '300ms' }}>
          Salons &amp;<br />
          <span style={{ color: '#C8A84B' }}>Événements</span>
        </h1>

        <p className="text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(18px)', transitionDelay: '420ms' }}>
          100% Afrique vous accompagne dans la découverte des plus grands événements
          du tourisme mondial. Reportages exclusifs depuis IFTM, ITB, WTM et bien d&apos;autres.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: 'Agenda professionnel', delay: 520 },
            { label: 'Reportages exclusifs',  delay: 600 },
            { label: 'Partenariats média',    delay: 680 },
          ].map(({ label, delay }) => (
            <HeroPill key={label} label={label} visible={heroVisible} delay={delay} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalonsHero;