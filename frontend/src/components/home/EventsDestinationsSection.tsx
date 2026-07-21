// src/components/home/EventsDestinationsSection.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { AgendaMark, RoutePlanet, LocaleMark } from '@/components/icons/CustomIcons';
import type { Salon, DestinationArticle } from '@/lib/server-data';

function useReveal(threshold = 0.1) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const ref = useCallback((node: HTMLDivElement | null) => {
    setEl(node);
  }, []);

  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

function DateRange({ startDate, endDate }: { startDate: string; endDate?: string }) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end || start.toDateString() === end.toDateString()) return <span>{fmt(start)}</span>;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return <span>{start.getDate()} – {fmt(end)}</span>;
  return <span>{fmt(start)} – {fmt(end)}</span>;
}

function SalonCard({ salon, delay = 0 }: { salon: Salon; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-600"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
    >
      <Link
        href={`/evenements/${salon.slug}`}
        className="group flex items-start gap-4 p-5 min-h-[128px] rounded-2xl border border-transparent hover:border-[#1A5C43]/15 hover:bg-[#F0FAF5] transition-all duration-200"
      >
        <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl text-white mt-0.5" style={{ background: '#1A5C43' }}>
          {salon.startDate && (
            <>
              <span className="text-lg font-black leading-none">
                {new Date(salon.startDate).getDate()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {new Date(salon.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
            </>
          )}
          {!salon.startDate && <AgendaMark size={40} />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[14px] leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1A5C43] transition-colors">
            {salon.title}
          </h4>

          <div className="flex flex-wrap gap-3 mt-2">
            {salon.startDate && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock size={11} className="text-[#C8A84B]" />
                <DateRange startDate={salon.startDate} endDate={salon.endDate} />
              </span>
            )}
            {(salon.city || salon.country) && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <LocaleMark size={11} className="text-[#B85C38]" />
                {[salon.city, salon.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {salon.excerpt && (
            <p className="text-[12px] text-gray-400 mt-2 leading-relaxed line-clamp-2">{salon.excerpt}</p>
          )}
        </div>

        <ArrowRight
          size={16}
          className="shrink-0 self-center text-gray-300 group-hover:text-[#1A5C43] group-hover:translate-x-1 transition-all"
        />
      </Link>
    </div>
  );
}

function DestinationCard({ dest, index = 0 }: { dest: DestinationArticle; index?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${index * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
    >
      <Link
        href={`/articles/${dest.slug}`}
        className="group relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: index === 0 ? '16/7' : '16/6' }}
      >
        <img
          src={dest.coverImage}
          alt={dest.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.8) 0%, rgba(10,35,20,0.2) 60%, transparent 100%)' }} />

        <div
          className="absolute top-1/2 -translate-y-1/2 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2"
          style={{ background: '#B85C38' }}
        >
          <ArrowRight size={16} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Destination</p>
          <h3 className="text-white font-black text-lg group-hover:text-[#C8A84B] transition-colors">{dest.title}</h3>
        </div>
      </Link>
    </div>
  );
}

interface EventsDestinationsSectionProps {
  salons: Salon[];
  destinations: DestinationArticle[];
}

const EventsDestinationsSection = ({ salons, destinations }: EventsDestinationsSectionProps) => {
  const { ref: headingRef, visible: headingVisible } = useReveal(0.2);

  return (
    <section className="py-12 md:py-18 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">

        <div
          ref={headingRef}
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#B85C38' }}>
              Agenda & Voyages
            </span>
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
            Événements & <span style={{ color: '#1A5C43' }}>Destinations</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#1A5C43' }}>
                  <AgendaMark size={26} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Salons & Événements</h3>
              </div>
              <Link href="/evenements" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
                onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
              >
                Tout l&apos;agenda →
              </Link>
            </div>

            {salons.length === 0
              ? <p className="text-gray-400 text-sm italic px-4">Aucun événement pour le moment.</p>
              : (
                <div className="flex flex-col gap-2">
                  {salons.map((salon, i) => <SalonCard key={salon.id} salon={salon} delay={i * 60} />)}
                </div>
              )
            }
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: '#B85C38' }}>
                  <RoutePlanet size={30} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Destinations Phares</h3>
              </div>
              <Link href="/destinations" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
                onMouseLeave={e => (e.currentTarget.style.color = '#B85C38')}
              >
                Explorer →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsDestinationsSection;
