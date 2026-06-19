// src/components/salons/SalonsSidebar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import type { SalonInterview } from '@/lib/server-data';

interface SalonsSidebarProps {
  /** Interview pré-fetchée côté serveur — plus aucun fetch client ici. */
  interview: SalonInterview | null;
}

const SalonsSidebar = ({ interview }: SalonsSidebarProps) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  // Reveal progressif de la sidebar
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      await api.post('/newsletter/subscribe', {
        email: newsletterEmail,
        source: 'salons_page',
        type: 'alerts_salons',
      });
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 5000);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erreur newsletter:', error.response?.data);
      }
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 5000);
    }
  };

  return (
    <div
      ref={ref}
      className="flex flex-col gap-8 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      {/* ── Pub skyscraper ── */}
      <div className="rounded-2xl overflow-hidden border border-gray-100">
        <AdvertisingBanner
          zoneSlug="skyscraper-salon-and-evenement"
          showDots
          className=""
        />
      </div>

      {/* ── Interview exclusive ── */}
      {interview && (
        <div
          className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4 bg-white transition-all duration-700 delay-100"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: '#B85C38' }}
          >
            — Interview exclusive
          </p>
          <Link
            href={`/actualites/${interview.slug}`}
            className="group relative block overflow-hidden rounded-xl"
          >
            <img
              src={interview.coverImage || '/images/placeholder.jpg'}
              alt={interview.title}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(10,35,20,0.35)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: '#B85C38', boxShadow: '0 4px 16px rgba(184,92,56,0.4)' }}
              >
                <Play size={16} fill="white" className="text-white ml-0.5" />
              </div>
            </div>
          </Link>

          <h4 className="font-bold text-sm leading-snug text-gray-900 line-clamp-2">
            {interview.title}
          </h4>
          <p className="text-gray-400 text-[10px]">
            Par {interview.author?.name ?? 'Rédaction'}
          </p>

          <Link
            href={`/actualites/${interview.slug}`}
            className="flex items-center justify-center gap-2 w-full font-bold text-xs uppercase tracking-widest py-3 rounded-xl text-white transition-all"
            style={{ background: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
            onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
          >
            <Play size={12} fill="white" />
            Lire l&apos;interview
          </Link>
        </div>
      )}

      {/* ── Newsletter alertes salons ── */}
      <div
        className="rounded-2xl p-7 text-white relative overflow-hidden transition-all duration-700 delay-200"
        style={{
          background: '#0D2B1A',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        {/* Motif */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C8A84B 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
            style={{ color: '#C8A84B' }}
          >
            — Newsletter Pro
          </p>
          <h3 className="font-black text-base mb-2 leading-tight">
            Alertes Salons
          </h3>
          <p className="text-white/50 text-xs mb-6 leading-relaxed">
            Ne manquez aucun événement important du secteur touristique.
          </p>

          {newsletterStatus === 'success' ? (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(26,92,67,0.3)', border: '1px solid rgba(200,168,75,0.25)' }}
            >
              <p className="text-[#C8A84B] text-xs font-bold">✓ Inscription réussie !</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre email professionnel"
                required
                disabled={newsletterStatus === 'loading'}
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 text-sm outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="w-full flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest py-3 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                style={{ background: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
                onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
              >
                {newsletterStatus === 'loading' ? (
                  <><Loader2 size={14} className="animate-spin" /><span>Inscription…</span></>
                ) : (
                  "S'abonner"
                )}
              </button>
              {newsletterStatus === 'error' && (
                <p className="text-red-400 text-[10px] text-center">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonsSidebar;