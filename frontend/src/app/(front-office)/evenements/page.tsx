// src/app/(front-office)/salons/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import ModaleCouverture from '@/components/shared/ModaleCouverture';
import AgendaSection from '@/components/salons/AgendaSection';
import PartnershipCTA from '@/components/salons/PartnershipCTA';
import ReportageGrid from '@/components/salons/ReportageGrid';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';

interface Salon {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  startDate?: string;   // ← nouveau
  endDate?: string;     // ← nouveau
  location?: string;    // ← nouveau
  city?: string;        // ← nouveau
  country?: string;     // ← nouveau
  category: {
    id: number;
    name: string;
  };
}

interface Interview {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
  };
}

const SalonsPage = () => {
  const [isCouvertureOpen, setIsCouvertureOpen] = useState(false);
  const [salons, setSalons]                     = useState<Salon[]>([]);
  const [interview, setInterview]               = useState<Interview | null>(null);
  const [newsletterEmail, setNewsletterEmail]   = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resSalons, resInterview] = await Promise.all([
          // ✅ Uniquement les articles de type SALON
          api.get('/mag/articles', {
            params: {
              type: 'SALON',
              pageSize: 10,
              page: 1,
              status: 'PUBLISHED',
              sortBy: 'createdAt:asc',   // Les prochains salons en premier
            },
          }),

          // Interview featured de type ARTICLE pour la sidebar
          api.get('/mag/articles', {
            params: {
              type: 'ARTICLE',
              categorySlug: 'interviews',
              featured: true,
              pageSize: 1,
              status: 'PUBLISHED',
            },
          }),
        ]);

        setSalons(resSalons.data.data ?? []);
        setInterview(resInterview.data.data?.[0] ?? null);
      } catch (error) {
        console.error('Erreur lors de la récupération des salons:', error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Transforme les salons en format Event pour AgendaSection
  const eventsForAgenda = salons.map((salon) => ({
    id:          salon.id.toString(),
    title:       salon.title,
    startDate:   salon.startDate ?? salon.createdAt,  // vrai champ startDate, fallback createdAt
    endDate:     salon.endDate,                        // ← nouveau
    location:    salon.location,                       // ← vrai champ location
    city:        salon.city,                           // ← nouveau
    country:     salon.country,                        // ← nouveau
    description: salon.excerpt ?? '',
    slug:        salon.slug,
  }));

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* ── COLONNE PRINCIPALE ────────────────────────────────────────────── */}
        <div className="lg:w-[72%] space-y-16">

          <header className="space-y-6">
            <h1 className="text-[#001A4D] text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight leading-tight">
              SALONS ET ÉVÉNEMENTS DU <br /> TOURISME MONDIAL
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-3xl leading-relaxed">
              WAXEHO et i Tourisme TV vous accompagnent dans la découverte des plus grands
              événements du tourisme mondial. Suivez nos reportages exclusifs depuis les salons
              IFTM, ITB, WTM et bien d&apos;autres.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#F39C12]" size={40} />
            </div>
          ) : (
            <AgendaSection events={eventsForAgenda} />
          )}

          <PartnershipCTA onOpenModale={() => setIsCouvertureOpen(true)} />
          <ReportageGrid />
        </div>

        {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
        <aside className="lg:w-[28%] space-y-10">

          {/* Publicité Skyscraper */}
          <div className="bg-[#E5E7EB] w-full flex items-center justify-center rounded-sm border border-gray-100 text-center">
            <AdvertisingBanner
              zoneSlug="skyscraper-salon-and-evenement"
              showDots={true}
              className=""
            />
          </div>

          {/* Interview exclusive */}
          {interview && (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden p-5 space-y-4">
              <h4 className="text-[#001A4D] font-serif font-bold text-sm uppercase">
                Interview Exclusive
              </h4>
              <Link
                href={`/actualites/${interview.slug}`}
                className="relative group cursor-pointer block"
              >
                <img
                  src={interview.coverImage || '/images/placeholder.jpg'}
                  alt={interview.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#F39C12] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={16} fill="white" />
                  </div>
                </div>
              </Link>
              <p className="text-[#001A4D] text-xs font-bold leading-snug line-clamp-2">
                {interview.title}
              </p>
              <p className="text-gray-400 text-[10px]">
                Par {interview.author?.name ?? 'Rédaction'}
              </p>
              <Link
                href={`/actualites/${interview.slug}`}
                className="w-full bg-[#F39C12] text-white py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-[#D68910] transition-colors"
              >
                <Play size={12} fill="white" /> Lire l&apos;interview
              </Link>
            </div>
          )}

          {/* Newsletter / Alertes Salons */}
          <div className="bg-[#001A4D] rounded-xl p-8 text-white shadow-xl">
            <h3 className="font-serif font-bold text-sm uppercase tracking-widest mb-4 leading-tight">
              RECEVOIR LES ALERTES SALONS
            </h3>
            <p className="text-[11px] text-gray-300 mb-6 leading-relaxed">
              Ne manquez aucun événement important du secteur touristique.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-300 text-xs font-medium">✓ Inscription réussie !</p>
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
                  className="w-full px-4 py-3 bg-white rounded-md text-gray-900 text-sm outline-none focus:ring-2 focus:ring-[#F39C12] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="w-full bg-[#F39C12] py-3 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#001A4D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Inscription...</span>
                    </>
                  ) : (
                    "S'abonner"
                  )}
                </button>
                {newsletterStatus === 'error' && (
                  <p className="text-red-300 text-[10px] text-center">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}
              </form>
            )}
          </div>

        </aside>
      </div>

      <ModaleCouverture
        isOpen={isCouvertureOpen}
        onClose={() => setIsCouvertureOpen(false)}
      />
    </main>
  );
};

export default SalonsPage;