// src/app/(front-office)/evenements/[slug]/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Loader2, Tag } from 'lucide-react';

import { useEvenementDetail } from '@/components/evenements/detail/useEvenementDetail';
import EvenementHero from '@/components/evenements/detail/EvenementHero';
import EvenementStats from '@/components/evenements/detail/EvenementStats';
import EventPracticalInfo from '@/components/evenements/detail/EventPracticalInfo';
import EventContentBlock from '@/components/evenements/detail/EventContentBlock';
import RelatedEvenements from '@/components/evenements/detail/RelatedEvenements';
import EvenementsMiniCTA from '@/components/evenements/detail/EvenementsMiniCTA';
import ReadingProgress from '@/components/shared/ReadingProgress';
import EventDestinationCard from '@/components/evenements/detail/EventDestinationCard';

const EvenementDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { evenement, related, loading, notFound, heroVisible, readingTime, parsedBlocks, durationDays } =
    useEvenementDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0D2B1A' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#C8A84B' }} />
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold animate-pulse">Chargement de l&apos;événement…</p>
      </div>
    );
  }

  if (notFound || !evenement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: '#0D2B1A' }}>
        <p className="text-[120px] font-black leading-none" style={{ color: 'rgba(255,255,255,0.04)' }}>404</p>
        <h1 className="text-2xl font-black text-white">Événement introuvable</h1>
        <p className="text-white/40 text-sm text-center max-w-xs">Cet événement n&apos;existe pas ou a été supprimé.</p>
        <Link
          href="/evenements"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
        >
          <ArrowLeft size={14} /> Retour aux événements
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <ReadingProgress />

      <EvenementHero evenement={evenement} heroVisible={heroVisible} readingTime={readingTime} />

      <EvenementStats evenement={evenement} durationDays={durationDays} visible={heroVisible} />

      <div className="max-w-3xl mx-auto px-5 md:px-8 pb-16">

        {evenement.excerpt && (
          <div className="relative pl-6 mb-12" style={{ borderLeft: '3px solid #C8A84B' }}>
            <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed italic">{evenement.excerpt}</p>
          </div>
        )}

        <EventPracticalInfo evenement={evenement} />

        {parsedBlocks.map((block, i) => <EventContentBlock key={i} block={block} index={i} />)}

        {evenement.tags && evenement.tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <Tag size={13} className="text-gray-300 mr-1" />
            {evenement.tags.map(tag => (
              <span
                key={tag.id}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-default hover:scale-105 transition-transform"
                style={{ background: 'rgba(26,92,67,0.07)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.12)' }}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {evenement.destination && <EventDestinationCard destination={evenement.destination} />}

        <div className="mt-14 pt-8 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={14} /> Retour
          </button>
          <Link
            href="/evenements"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            <Calendar size={13} /> Tous les salons
          </Link>
        </div>
      </div>

      <RelatedEvenements events={related} />

      <EvenementsMiniCTA />
    </main>
  );
};

export default EvenementDetailPage;