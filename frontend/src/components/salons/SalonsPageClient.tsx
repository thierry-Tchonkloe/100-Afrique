// src/components/salons/SalonsPageClient.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import AgendaSection from '@/components/salons/AgendaSection';
import PartnershipCTA from '@/components/salons/PartnershipCTA';
import ReportageGrid from '@/components/salons/ReportageGrid';
import SalonsSidebar from '@/components/salons/SalonsSidebar';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import type { Salon, SalonInterview } from '@/lib/server-data';

interface SalonsPageClientProps {
  salons: Salon[];
  interview: SalonInterview | null;
}

// ─── Hook reveal générique ────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Composant principal ──────────────────────────────────────────────────────

const SalonsPageClient = ({ salons, interview }: SalonsPageClientProps) => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const { ref: partnerRef, visible: partnerVisible } = useReveal(0.1);
  const { ref: reportageRef, visible: reportageVisible } = useReveal(0.08);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const eventsForAgenda = salons.map((salon) => ({
    id:          salon.id.toString(),
    title:       salon.title,
    startDate:   salon.startDate ?? salon.createdAt,
    endDate:     salon.endDate,
    location:    salon.location,
    city:        salon.city,
    country:     salon.country,
    description: salon.excerpt ?? '',
    slug:        salon.slug,
  }));

  return (
    <main className="bg-white">

      {/* ── HERO HEADER ───────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '380px' }}>

        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-salons.jpg"
            alt="Salons du tourisme"
            className="w-full h-full object-cover object-center"
            style={{
              transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
              transform: heroVisible ? 'scale(1)' : 'scale(1.06)',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Overlay émeraude profond */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(13,43,26,0.75) 0%, rgba(13,43,26,0.96) 60%, rgba(13,43,26,0.70) 100%)',
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

        {/* Lumière ambiante coin bas-droit */}
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, #B85C38 0%, transparent 70%)' }}
        />
        {/* Lumière ambiante coin haut-gauche */}
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

        {/* Contenu centré */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">

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
            Tourisme mondial
          </p>

          {/* Trait décoratif */}
          <div
            className="flex items-center justify-center gap-3 mb-5"
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight"
            style={{
              letterSpacing: '-0.02em',
              transition: 'opacity 0.7s 0.35s, transform 0.7s 0.35s',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
            }}
          >
            Salons &amp; <span style={{ color: '#C8A84B' }}>Événements</span>
          </h1>

          {/* Sous-titre */}
          <p
            className="text-white/65 text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed"
            style={{
              transition: 'opacity 0.7s 0.5s, transform 0.7s 0.5s',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
            }}
          >
            100% Afrique vous accompagne dans la découverte des plus grands événements
            du tourisme mondial. Reportages exclusifs depuis IFTM, ITB, WTM et bien d&apos;autres.
          </p>

          {/* Pills */}
          <div
            className="flex flex-wrap justify-center gap-3 mt-8"
            style={{
              transition: 'opacity 0.7s 0.65s, transform 0.7s 0.65s',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
            }}
          >
            {['Agenda professionnel', 'Reportages exclusifs', 'Partenariats média'].map((label) => (
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

      {/* ── LEADERBOARD PUB ───────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <AdvertisingBanner zoneSlug="leaderboard-salons-top" showDots className="" />
      </div>

      {/* ── AGENDA + SIDEBAR (côte à côte) ────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-[72%]">
            <AgendaSection events={eventsForAgenda} />
          </div>
          <aside className="lg:w-[28%]">
            <SalonsSidebar interview={interview} />
          </aside>
        </div>
      </div>

      {/* ── PARTNERSHIP CTA — pleine largeur ─────────────────────────────────── */}
      <div
        ref={partnerRef}
        className="max-w-[1400px] mx-auto px-6 pb-20 transition-all duration-700"
        style={{
          opacity: partnerVisible ? 1 : 0,
          transform: partnerVisible ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        <PartnershipCTA onOpenModale={() => setIsCouvertureOpen(true)} />
      </div>

      {/* ── REPORTAGE GRID — pleine largeur ──────────────────────────────────── */}
      <div
        ref={reportageRef}
        className="max-w-[1400px] mx-auto px-6 pb-24 transition-all duration-700"
        style={{
          opacity: reportageVisible ? 1 : 0,
          transform: reportageVisible ? 'translateY(0)' : 'translateY(32px)',
        }}
      >
        <ReportageGrid />
      </div>

      <ModaleCouverture
        isOpen={isCouvertureOpen}
        onClose={() => setIsCouvertureOpen(false)}
      />
    </main>
  );
};

export default SalonsPageClient;