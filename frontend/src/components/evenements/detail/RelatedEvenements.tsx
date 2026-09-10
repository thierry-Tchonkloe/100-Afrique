// src/components/evenements/detail/RelatedEvenements.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import type { RelatedEvenement } from './useEvenementDetail';

function RelatedCard({ event, delay = 0 }: { event: RelatedEvenement; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
    >
      <Link href={`/evenements/${event.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 bg-gray-100">
          <img
            src={event.coverImage || '/images/placeholder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.6) 0%, transparent 60%)' }} />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: '#B85C38' }}>
            {event.category.name}
          </span>
        </div>
        <h3
          className="font-bold text-[14px] leading-snug line-clamp-2 mb-2 transition-colors"
          style={{ color: '#0D1A10' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
          onMouseLeave={e => (e.currentTarget.style.color = '#0D1A10')}
        >
          {event.title}
        </h3>
        <p className="text-gray-400 text-[12px] line-clamp-2 mb-3 leading-relaxed">{event.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
          {event.location && <><MapPin size={10} style={{ color: '#C8A84B' }} /><span>{event.location}</span><span>·</span></>}
          <span>{new Date(event.startDate ?? event.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </Link>
    </div>
  );
}

function RelatedHeading() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className="flex items-end justify-between mb-12 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#B85C38' }}>— À ne pas manquer</p>
        <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
          Événements <span style={{ color: '#1A5C43' }}>similaires</span>
        </h2>
      </div>
      <Link
        href="/evenements"
        className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
        style={{ background: '#1A5C43' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
        onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
      >
        Voir tout <ArrowRight size={13} />
      </Link>
    </div>
  );
}

const RelatedEvenements = ({ events }: { events: RelatedEvenement[] }) => {
  if (!events.length) return null;
  return (
    <section className="py-20 md:py-28 px-4" style={{ background: '#F7F9F8' }}>
      <div className="max-w-[1100px] mx-auto">
        <RelatedHeading />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e, i) => <RelatedCard key={e.id} event={e} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
};

export default RelatedEvenements;