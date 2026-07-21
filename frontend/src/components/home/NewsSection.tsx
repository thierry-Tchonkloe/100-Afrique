// src/components/home/NewsSection.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import MagazineImage from '@/components/shared/MagazineImage';
import type { Magazine } from '@/lib/server-data';

function formatDate(iso: string, monthStyle: 'long' | 'short' = 'long') {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: monthStyle, year: 'numeric' });
}

function FeaturedCard({ magazine, visible }: { magazine: Magazine; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/11',
        transition: 'opacity 0.7s, transform 0.7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <MagazineImage
        src={magazine.coverImage}
        alt={magazine.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: '#B85C38' }}>
          À la une
        </span>
        <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/90" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {magazine.source}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <Clock size={10} />
          {formatDate(magazine.publishedAt)}
        </p>
        <h3 className="text-white font-black text-base md:text-lg leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors" style={{ letterSpacing: '-0.01em' }}>
          {magazine.title}
        </h3>
      </div>
    </Link>
  );
}

function SecondaryCard({ magazine, delay = 0, visible }: { magazine: Magazine; delay?: number; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/10',
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }} />
      </div>

      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: 'rgba(42,127,95,0.9)' }}>
        {magazine.source}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1">
          {formatDate(magazine.publishedAt, 'short')}
        </p>
        <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
          {magazine.title}
        </h4>
      </div>
    </Link>
  );
}

interface NewsSectionProps {
  magazines: Magazine[];
}

const NewsSection = ({ magazines }: NewsSectionProps) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!magazines.length) return null;

  const featured = magazines[0];
  const secondary = magazines.slice(1, 5);

  return (
    <section ref={sectionRef} className="py-12 md:py-18 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6">

        <div
          className="flex items-end justify-between mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#B85C38' }}>
              — Actualités
            </p>
            <h2 className="text-3xl  md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
              Dernières<br />
              <span style={{ color: '#1A5C43' }}>Nouveautés</span>
            </h2>
          </div>

          <Link
            href="/actualites"
            className="hidden md:inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:shadow-lg active:scale-95 text-white"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeaturedCard magazine={featured} visible={visible} />

          <div className="grid grid-cols-2 gap-4">
            {secondary.map((mag, i) => (
              <SecondaryCard key={mag.id} magazine={mag} delay={i * 100 + 150} visible={visible} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all"
            style={{ background: '#1A5C43' }}
          >
            Voir toutes les actualités <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
