// src/components/magazine/EditorialCTA.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PenLine, Users, ArrowRight } from 'lucide-react';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import ModaleDestination from '@/components/shared/ModaleDestination';

const EditorialCTA = () => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 md:py-36 px-4 overflow-hidden"
        style={{
          /* Image fixe au scroll — l'effet parallax natif */
          backgroundImage: 'url(/images/editorial-bg.jpg)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay sombre pour lisibilité */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, rgba(13,27,16,0.82) 0%, rgba(13,43,26,0.72) 100%)' }}
          aria-hidden="true"
        />

        {/* Motif dot-grid */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(200,168,75,0.12) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />

        {/* Blob lumière haut-droite */}
        <div
          className="absolute top-0 right-0 w-96 h-96 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 10%, rgba(184,92,56,0.18) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        {/* Blob lumière bas-gauche */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 z-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 90%, rgba(26,92,67,0.25) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        {/* Contenu — z-10 pour flotter au-dessus du fond */}
        <div className="relative z-10 max-w-[1000px] mx-auto">

          {/* Heading centré */}
          <div
            className="text-center mb-14 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(28px)',
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: '#B85C38' }}
            >
              — Équipe éditoriale
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
            >
              Rejoignez notre<br />
              <span style={{ color: '#C8A84B' }}>Équipe Éditoriale</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Proposez un sujet, devenez rédacteur ou collaborez avec notre magazine.
              Notre équipe est à votre écoute.
            </p>
          </div>

          {/* Deux cartes CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Carte 1 — Contacter la rédaction (glassmorphism sur fond sombre) */}
            <div
              className="group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-700 delay-100 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
              }}
              onClick={() => setIsCouvertureOpen(true)}
            >
              {/* Reflet supérieur */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: '#1A5C43' }}
                >
                  <Users size={22} style={{ color: '#C8A84B' }} />
                </div>
                <h3 className="text-white font-black text-xl mb-2 leading-tight">
                  Contacter la rédaction
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Une question, un partenariat ou un sujet à suggérer ?
                  Notre équipe répond sous 48h.
                </p>
                <span
                  className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all duration-200"
                  style={{ color: '#C8A84B' }}
                >
                  Écrire à la rédaction <ArrowRight size={15} />
                </span>
              </div>
            </div>

            {/* Carte 2 — Proposer un article (fond blanc semi-opaque) */}
            <div
              className="group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-700 delay-200 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
              }}
              onClick={() => setIsDestinationOpen(true)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.97)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.92)';
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(26,92,67,0.10)' }}
              >
                <PenLine size={22} style={{ color: '#1A5C43' }} />
              </div>
              <h3 className="font-black text-xl mb-2 leading-tight" style={{ color: '#0D1A10' }}>
                Proposer un article
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Vous avez un sujet à traiter sur le tourisme africain ?
                Soumettez votre proposition éditoriale.
              </p>
              <span
                className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all duration-200"
                style={{ color: '#1A5C43' }}
              >
                Soumettre un sujet <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <ModaleCouverture isOpen={isCouvertureOpen} onClose={() => setIsCouvertureOpen(false)} />
      <ModaleDestination isOpen={isDestinationOpen} onClose={() => setIsDestinationOpen(false)} />
    </>
  );
};

export default EditorialCTA;
