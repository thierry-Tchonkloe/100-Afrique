// src/components/contact/ContactHeroSection.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';

const ContactHeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Déclenche immédiatement car c'est le premier élément de la page
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>

      {/* ── Fond image illustrative ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-contact.jpg"
          alt="Contact"
          className="w-full h-full object-cover object-center"
          style={{
            transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
            transform: visible ? 'scale(1)' : 'scale(1.06)',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Overlay émeraude */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 92, 67, 0.6) 0%, rgba(26, 92, 67, 0.96) 60%, rgba(26,92,67,0.60) 100%)',
          }}
        />
        {/* Particules lumineuses décoratives */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Accent haut */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left"
        style={{
          background: '#B85C38',
          transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      {/* Lumière ambiante coin bas-droit */}
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }}
      />

      {/* Vague basse */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14" fill="white">
          <path d="M0,35 C400,70 1040,0 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* ── Contenu ── */}
      <div
        ref={ref}
        className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-28 text-center"
      >
        {/* Eyebrow */}
        <p
          className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3"
          style={{
            color: '#C8A84B',
            transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          Nous sommes à votre écoute
        </p>

        {/* Trait décoratif */}
        <div
          className="flex items-center justify-center gap-3 mb-5"
          style={{
            transition: 'opacity 0.6s 0.3s',
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8A84B' }} />
          <div className="h-px w-10" style={{ background: 'rgba(200,168,75,0.5)' }} />
        </div>

        {/* Titre */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase tracking-tight leading-tight"
          style={{
            transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(22px)',
          }}
        >
          Contactez-<span style={{ color: '#C8A84B' }}>nous</span>
        </h1>

        {/* Sous-titre */}
        <p
          className="text-white/70 text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed"
          style={{
            transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(18px)',
          }}
        >
          Vous avez un besoin en partenariat, publicité ou support ?{' '}
          L&apos;équipe iTourisme est prête à vous accompagner.
        </p>

        {/* Pills stats rapides */}
        <div
          className="flex flex-wrap justify-center gap-3 mt-8"
          style={{
            transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          {[
            { label: 'Réponse sous 24h' },
            { label: 'Disponible 24h/7j' },
            { label: 'Cotonou, Bénin' },
          ].map(({ label }) => (
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

export default ContactHeroSection;