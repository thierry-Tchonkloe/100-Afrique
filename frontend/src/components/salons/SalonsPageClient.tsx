// src/components/salons/SalonsPageClient.tsx
'use client';

import React, { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import AgendaSection from '@/components/salons/AgendaSection';
import PartnershipCTA from '@/components/salons/PartnershipCTA';
import ReportageGrid from '@/components/salons/ReportageGrid';
import SalonsSidebar from '@/components/salons/SalonsSidebar';
import SalonsHero from '@/components/salons/hero/SalonsHero';
import SalonsStatsBar from '@/components/salons/hero/SalonsStatsBar';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import type { Salon, SalonInterview } from '@/lib/server-data';

interface SalonsPageClientProps {
  salons: Salon[];
  interview: SalonInterview | null;
}

const SalonsPageClient = ({ salons, interview }: SalonsPageClientProps) => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);

  const { ref: agendaRef,  visible: agendaVisible  } = useReveal<HTMLDivElement>(0.05);
  const { ref: partnerRef, visible: partnerVisible } = useReveal<HTMLDivElement>(0.1);
  const { ref: reportRef,  visible: reportVisible  } = useReveal<HTMLDivElement>(0.08);

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

  return (
    <main style={{ background: '#fff' }}>

      <SalonsHero />

      <SalonsStatsBar salons={salons} />

      {/* Leaderboard pub */}
      <div className="max-w-[1300px] mx-auto px-6 mb-10">
        <div className="rounded-2xl overflow-hidden">
          <AdvertisingBanner zoneSlug="leaderboard-salons-top" showDots className="" />
        </div>
      </div>

      {/* Agenda + Sidebar */}
      <div
        ref={agendaRef}
        className="max-w-[1300px] mx-auto px-6 pb-16 transition-all duration-700"
        style={{ opacity: agendaVisible ? 1 : 0, transform: agendaVisible ? 'none' : 'translateY(32px)' }}
      >
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

      {/* Partnership CTA */}
      <div
        ref={partnerRef}
        className="max-w-[1300px] mx-auto px-6 pb-20 transition-all duration-700"
        style={{ opacity: partnerVisible ? 1 : 0, transform: partnerVisible ? 'none' : 'translateY(32px)' }}
      >
        <PartnershipCTA onOpenModale={() => setIsCouvertureOpen(true)} />
      </div>

      {/* Reportage grid */}
      <div
        ref={reportRef}
        className="max-w-[1300px] mx-auto px-6 pb-24 transition-all duration-700"
        style={{ opacity: reportVisible ? 1 : 0, transform: reportVisible ? 'none' : 'translateY(32px)' }}
      >
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