// src/components/destinations/AfricaHighlights.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';
import type { Highlight } from '@/lib/server-data';

interface AfricaHighlightsProps {
  /** Highlights pré-fetchés côté serveur — plus aucun fetch client ici. */
  highlights: Highlight[];
}

// ─── Hook reveal ──────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

// ─── Carte highlight ──────────────────────────────────────────────────────────

function HighlightCard({ item, delay = 0 }: { item: Highlight; delay?: number }) {
  const { ref, visible } = useReveal(0.06);

  return (
    <div
      ref={ref as React.RefCallback<HTMLDivElement>}
      className="group transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      <Link
        href={`/actualites/${item.slug}`}
        className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
        style={{ background: '#F8FAF9' }}
      >
        {/* Image */}
        <div className="relative h-52 sm:h-60 overflow-hidden">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,43,26,0.5) 0%, transparent 60%)' }}
          />
          {item.category && (
            <span
              className="absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
              style={{ background: 'rgba(184,92,56,0.88)' }}
            >
              {item.category.name}
            </span>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 sm:p-7 space-y-3">
          <h3
            className="font-bold text-base sm:text-lg leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#1A5C43]"
            style={{ color: '#0D1A10', letterSpacing: '-0.01em' }}
          >
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
          <div className="pt-2 border-t border-gray-100">
            <span
              className="inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-colors group-hover:gap-3"
              style={{ color: '#B85C38' }}
            >
              Lire le dossier
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const AfricaHighlights = ({ highlights }: AfricaHighlightsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.08);

  if (!highlights.length) return null;

  const handlePrevious = () => setCurrentIndex((p) => Math.max(0, p - 3));
  const handleNext     = () => setCurrentIndex((p) => Math.min(highlights.length - 3, p + 3));
  const canGoPrevious  = currentIndex > 0;
  const canGoNext      = currentIndex + 3 < highlights.length;
  const visibleItems   = highlights.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-6 bg-white">
      <div
        ref={sectionRef as React.RefCallback<HTMLDivElement>}
        className="max-w-7xl mx-auto"
      >
        {/* ── Heading ── */}
        <div
          className="flex items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-gray-100 mb-8 sm:mb-10 transition-all duration-700"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'none' : 'translateY(20px)',
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#B85C38' }}
            >
              <Heart size={15} fill="white" className="text-white" />
            </div>
            <div>
              <p
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5"
                style={{ color: '#B85C38' }}
              >
                — Sélection éditoriale
              </p>
              <h2
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
              >
                Coups de cœur <span style={{ color: '#1A5C43' }}>Afrique</span>
              </h2>
            </div>
          </div>

          {/* Contrôles navigation */}
          {highlights.length > 3 && (
            <div
              className="flex gap-2 shrink-0 transition-all duration-700"
              style={{ transitionDelay: '150ms', opacity: sectionVisible ? 1 : 0 }}
            >
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canGoPrevious ? '#1A5C43' : 'white',
                  color: canGoPrevious ? 'white' : '#9CA3AF',
                  borderColor: canGoPrevious ? '#1A5C43' : '#E5E7EB',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canGoNext ? '#1A5C43' : 'white',
                  color: canGoNext ? 'white' : '#9CA3AF',
                  borderColor: canGoNext ? '#1A5C43' : '#E5E7EB',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Grille — données SSR, pas de spinner ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {visibleItems.map((item, i) => (
            <HighlightCard key={item.id} item={item} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AfricaHighlights;
