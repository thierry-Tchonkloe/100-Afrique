// src/components/home/HeroSlider.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import MagazineImage from '@/components/shared/MagazineImage';
import type { Magazine } from '@/lib/server-data';

const AVATAR_URLS = [
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
];

// ─── Carte image + label en dessous (colonne latérale) ───────────────────────

function ImageWithLabel({ magazine }: { magazine: Magazine }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <Link
        href={`/magazine/${magazine.slug}`}
        className="group relative block overflow-hidden rounded-2xl flex-1 min-h-0"
      >
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <Link
        href={`/magazine/${magazine.slug}`}
        className="rounded-2xl px-4 py-3 shrink-0 transition-colors"
        style={{ background: '#0D3525' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#1A5C43')}
        onMouseLeave={e => (e.currentTarget.style.background = '#0D3525')}
      >
        <span className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-2">
          {magazine.title}
        </span>
      </Link>
    </div>
  );
}

// ─── Carte image avec overlay titre (colonnes intermédiaires) ─────────────────

function ImageWithOverlay({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group relative block overflow-hidden rounded-2xl h-full"
    >
      <MagazineImage
        src={magazine.coverImage}
        alt={magazine.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-b-2xl px-4 py-4"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
      >
        <span className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-3">
          {magazine.title}
        </span>
      </div>
    </Link>
  );
}

// ─── Carrousel mobile ─────────────────────────────────────────────────────────

function MobileCarousel({ magazines }: { magazines: Magazine[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? magazines.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === magazines.length - 1 ? 0 : c + 1));

  // Auto-avance toutes les 4s
  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magazines.length]);

  if (!magazines.length) return null;
  const mag = magazines[current];

  return (
    <div className="relative mt-6 sm:hidden">
      {/* Carte principale */}
      <Link
        href={`/magazine/${mag.slug}`}
        className="relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: '4/3' }}
      >
        <MagazineImage
          src={mag.coverImage}
          alt={mag.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-2xl px-5 py-5"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)' }}
        >
          <span className="text-white font-bold text-base leading-snug line-clamp-3">
            {mag.title}
          </span>
        </div>
      </Link>

      {/* Contrôles */}
      <button
        onClick={prev}
        aria-label="Magazine précédent"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
        style={{ background: 'rgba(13,53,37,0.75)' }}
        onTouchStart={e => { e.preventDefault(); prev(); }}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Magazine suivant"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
        style={{ background: 'rgba(13,53,37,0.75)' }}
        onTouchStart={e => { e.preventDefault(); next(); }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Indicateurs de position */}
      <div className="flex justify-center gap-1.5 mt-3">
        {magazines.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Aller au magazine ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? '#1A5C43' : '#D1D5DB',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface HeroSliderProps {
  magazines: Magazine[];
}

const HeroSlider = ({ magazines }: HeroSliderProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!magazines.length) return null;

  const colLeft     = magazines[0];
  const colLeftMid  = magazines[1] ?? magazines[0];
  const colCenter   = magazines[2] ?? magazines[0];
  const colRightMid = magazines[3] ?? magazines[0];
  const colRight    = magazines[4] ?? magazines[0];

  return (
    <section className="w-full bg-white pt-8 pb-12 md:pt-14 md:pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">

        {/* ── Avatars + tagline ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6"
          style={{
            transition: 'opacity 0.6s 0.05s, transform 0.6s 0.05s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <div className="flex items-center -space-x-3">
            {AVATAR_URLS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover"
                style={{ zIndex: AVATAR_URLS.length - i }}
              />
            ))}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: '#1A5C43', zIndex: 0 }}
            >
              +
            </div>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Plus de 45 000 professionnels du tourisme
          </span>
        </div>

        {/* ── Bloc texte central ── */}
        <div
          className="text-center mb-6 md:mb-0 md:-mb-12"
          style={{
            transition: 'opacity 0.7s 0.15s, transform 0.7s 0.15s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
          }}
        >
          <h1
            className="font-bold leading-[1.05] mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto"
            style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
          >
            L&apos;Afrique qui voyage, investit et innove
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6 sm:mb-7 leading-relaxed max-w-sm sm:max-w-xl mx-auto px-4 sm:px-0">
            Une veille stratégique dédiée aux professionnels du tourisme, de l&apos;hôtellerie, du transport et de la mobilité.
          </p>
          <Link
            href="/actualites"
            className="group inline-flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95 text-white whitespace-nowrap"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#9C4B2D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            Lire l&apos;actualité
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Grille desktop 5 colonnes ── */}
        <div
          className="hidden md:grid grid-cols-5 gap-4 items-end"
          style={{ height: 480 }}
        >
          {/* Col 1 — pleine hauteur + label */}
          <div
            className="h-full"
            style={{
              transition: 'opacity 0.65s 0.2s, transform 0.65s 0.2s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <ImageWithLabel magazine={colLeft} />
          </div>

          {/* Col 2 — 80% hauteur */}
          <div
            style={{
              height: '80%',
              transition: 'opacity 0.65s 0.3s, transform 0.65s 0.3s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <ImageWithOverlay magazine={colLeftMid} />
          </div>

          {/* Col 3 — 50% hauteur, image seule */}
          <div
            style={{
              height: '50%',
              transition: 'opacity 0.65s 0.4s, transform 0.65s 0.4s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <Link
              href={`/magazine/${colCenter.slug}`}
              className="group relative block overflow-hidden rounded-2xl h-full"
            >
              <MagazineImage
                src={colCenter.coverImage}
                alt={colCenter.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Col 4 — 80% hauteur */}
          <div
            style={{
              height: '80%',
              transition: 'opacity 0.65s 0.3s, transform 0.65s 0.3s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <ImageWithOverlay magazine={colRightMid} />
          </div>

          {/* Col 5 — pleine hauteur + label */}
          <div
            className="h-full"
            style={{
              transition: 'opacity 0.65s 0.2s, transform 0.65s 0.2s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <ImageWithLabel magazine={colRight} />
          </div>
        </div>

        {/* ── Carrousel mobile (< md) ── */}
        <div
          style={{
            transition: 'opacity 0.65s 0.2s, transform 0.65s 0.2s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <MobileCarousel magazines={magazines} />
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;
