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

// ─── Hook reveal ─────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // Déjà visible dans le viewport ?
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Compteur animé ───────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', duration = 1600, visible }: {
  target: number; suffix?: string; duration?: number; visible: boolean;
}) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return <>{count.toLocaleString('fr-FR')}{suffix}</>;
}

// ─── Pill décoratif ───────────────────────────────────────────────────────────

function HeroPill({ label, visible, delay = 0 }: { label: string; visible: boolean; delay?: number }) {
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

// ─── Composant principal ──────────────────────────────────────────────────────

const SalonsPageClient = ({ salons, interview }: SalonsPageClientProps) => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [heroVisible, setHeroVisible]           = useState(false);
  const [imgLoaded, setImgLoaded]               = useState(false);

  const { ref: statsRef,    visible: statsVisible    } = useReveal(0.2);
  const { ref: agendaRef,   visible: agendaVisible   } = useReveal(0.05);
  const { ref: partnerRef,  visible: partnerVisible  } = useReveal(0.1);
  const { ref: reportRef,   visible: reportVisible   } = useReveal(0.08);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const eventsForAgenda = salons.map((s) => ({
    id:          s.id.toString(),
    title:       s.title,
    startDate:   s.startDate ?? s.createdAt,
    endDate:     s.endDate,
    location:    s.location,
    city:        s.city,
    country:     s.country,
    description: s.excerpt ?? '',
    slug:        s.slug,
  }));

  const totalEvents = salons.length;

  return (
    <main style={{ background: '#fff' }}>

      {/* ══════════════════════════════════════════════════════════
          HERO IMMERSIF
      ══════════════════════════════════════════════════════════ */}
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

        {/* Barre accent — se déploie de gauche à droite */}
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

          {/* Eyebrow + trait */}
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

          {/* Titre */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase leading-none mb-6 transition-all duration-700"
            style={{ letterSpacing: '-0.03em', textShadow: '0 4px 24px rgba(0,0,0,0.3)', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(22px)', transitionDelay: '300ms' }}>
            Salons &amp;<br />
            <span style={{ color: '#C8A84B' }}>Événements</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-700"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(18px)', transitionDelay: '420ms' }}>
            100% Afrique vous accompagne dans la découverte des plus grands événements
            du tourisme mondial. Reportages exclusifs depuis IFTM, ITB, WTM et bien d&apos;autres.
          </p>

          {/* Pills */}
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

      {/* ══════════════════════════════════════════════════════════
          STATS RAPIDES (si salons disponibles)
      ══════════════════════════════════════════════════════════ */}
      {totalEvents > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 -mt-2 mb-10">
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-3 overflow-hidden rounded-2xl"
            style={{ background: 'rgba(26,92,67,0.06)', border: '1px solid rgba(26,92,67,0.1)' }}
          >
            {[
              { label: 'Événements', value: totalEvents, suffix: '+', delay: 0 },
              { label: 'Pays couverts', value: [...new Set(salons.map(s => s.country).filter(Boolean))].length || 12, suffix: '', delay: 100 },
              { label: 'Partenaires', value: 38, suffix: '', delay: 200 },
            ].map(({ label, value, suffix, delay }) => (
              <div key={label}
                className="flex flex-col items-center justify-center py-6 px-4 text-center transition-all duration-700"
                style={{ transitionDelay: `${delay}ms`, opacity: statsVisible ? 1 : 0, transform: statsVisible ? 'none' : 'translateY(16px)' }}>
                <p className="text-2xl md:text-3xl font-black" style={{ color: '#1A5C43' }}>
                  <AnimatedCounter target={value} suffix={suffix} visible={statsVisible} />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LEADERBOARD PUB
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-6 mb-10">
        <div className="rounded-2xl overflow-hidden">
          <AdvertisingBanner zoneSlug="leaderboard-salons-top" showDots className="" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          AGENDA + SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={agendaRef}
        className="max-w-[1300px] mx-auto px-6 pb-16 transition-all duration-700"
        style={{ opacity: agendaVisible ? 1 : 0, transform: agendaVisible ? 'none' : 'translateY(32px)' }}
      >
        {/* Heading section */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#B85C38' }}>— Agenda</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
            Prochains <span style={{ color: '#1A5C43' }}>Salons</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <div className="lg:w-[72%]">
            <AgendaSection events={eventsForAgenda} />
          </div>
          <aside className="lg:w-[28%]">
            <SalonsSidebar interview={interview} />
          </aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARTNERSHIP CTA
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={partnerRef}
        className="max-w-[1300px] mx-auto px-6 pb-20 transition-all duration-700"
        style={{ opacity: partnerVisible ? 1 : 0, transform: partnerVisible ? 'none' : 'translateY(32px)' }}
      >
        <PartnershipCTA onOpenModale={() => setIsCouvertureOpen(true)} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          REPORTAGE GRID
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={reportRef}
        className="max-w-[1300px] mx-auto px-6 pb-24 transition-all duration-700"
        style={{ opacity: reportVisible ? 1 : 0, transform: reportVisible ? 'none' : 'translateY(32px)' }}
      >
        {/* Heading section */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#B85C38' }}>— Sur le terrain</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
            Nos <span style={{ color: '#1A5C43' }}>Reportages</span>
          </h2>
        </div>
        <ReportageGrid />
      </div>

      <ModaleCouverture isOpen={isCouvertureOpen} onClose={() => setIsCouvertureOpen(false)} />
    </main>
  );
};

export default SalonsPageClient;
