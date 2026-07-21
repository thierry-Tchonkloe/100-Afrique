// src/components/news/NewsHero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { Magazine } from '@/lib/server-data';

// ─── Carte principale (grande) ────────────────────────────────────────────────

function MainCard({ magazine, visible }: { magazine: Magazine; visible: boolean }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="lg:col-span-2 group block relative overflow-hidden rounded-2xl"
      style={{
        transition: 'opacity 0.7s, transform 0.7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      <div className="relative h-[300px] sm:h-[380px] md:h-[460px] w-full overflow-hidden">
        <Image
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />
      </div>

      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span
          className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white"
          style={{ background: '#B85C38' }}
        >
          À la une
        </span>
        <span
          className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/90"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {magazine.source}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <p className="text-[#C8A84B] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
          <Clock size={11} />
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
        <h2
          className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-tight line-clamp-3 mb-4 group-hover:text-[#C8A84B] transition-colors"
          style={{ letterSpacing: '-0.02em' }}
        >
          {magazine.title}
        </h2>
        {magazine.excerpt && (
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5 max-w-xl hidden sm:block">
            {magazine.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest group-hover:text-white group-hover:gap-3 transition-all">
          Lire l&apos;article <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

// ─── Carte secondaire ─────────────────────────────────────────────────────────

function SideCard({
  magazine,
  delay = 0,
  visible,
}: {
  magazine: Magazine;
  delay?: number;
  visible: boolean;
}) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group flex-1 block relative overflow-hidden rounded-2xl min-h-[180px]"
      style={{
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }}
        />
      </div>

      <span
        className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
        style={{ background: 'rgba(42,127,95,0.9)' }}
      >
        {magazine.source}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1.5">
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short',
          })}
        </p>
        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
          {magazine.title}
        </h3>
      </div>
    </Link>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface NewsHeroProps {
  /** Magazines pré-fetchés côté serveur — plus aucun fetch client ici. */
  magazines: Magazine[];
}

const NewsHero = ({ magazines }: NewsHeroProps) => {
  const [visible, setVisible] = useState(false);

  // Les données arrivent déjà rendues côté serveur ;
  // il ne reste qu'à déclencher l'animation d'entrée au montage.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!magazines.length) {
    return (
      <section className="py-16 px-4" style={{ background: '#0D2B1A' }}>
        <div className="max-w-[1300px] mx-auto text-center">
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight">
            Actualités du Tourisme
          </h1>
          <p className="text-white/50 mt-4">Aucune actualité disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  const displayMags = [...magazines];
  while (displayMags.length < 3) displayMags.push(magazines[0]);
  const [main, ...sides] = displayMags;

  return (
    <section
      className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0D2B1A' }}
    >
      {/* Décorations fond */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute top-0 left-0 w-1/2 h-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at 0% 50%, #1A5C43 0%, transparent 70%)' }}
      />

      <div className="max-w-[1300px] mx-auto relative z-10">

        {/* Heading */}
        <div
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: '#C8A84B' }}
            >
              Tourisme africain & mondial
            </span>
            <div className="h-px w-10" style={{ background: '#C8A84B' }} />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Actualités
          </h1>
        </div>

        {/* Grid articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <MainCard magazine={main} visible={visible} />
          <div className="flex flex-row lg:flex-col gap-4 sm:gap-5">
            {sides.slice(0, 2).map((mag, i) => (
              <SideCard key={mag.id} magazine={mag} delay={i * 100 + 150} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
