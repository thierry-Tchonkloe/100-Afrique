// src/app/(front-office)/secteurs/[slug]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getSecteurMeta, SECTEUR_META } from '@/components/secteurs/secteurMeta';
import { useSecteurMagazines } from '@/components/secteurs/useSecteurMagazines';
import SecteurHero from '@/components/secteurs/SecteurHero';
import SecteurMagazineGrid from '@/components/secteurs/SecteurMagazineGrid';
import NewsletterMiniCTA from '@/components/shared/NewsletterMiniCTA';

export default function SecteurPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = getSecteurMeta(slug);

  const {
    magazines, pagination, currentPage, query, draftQuery, loading, pageLoading,
    setDraftQuery, handleSearch, clearSearch, handlePageChange,
  } = useSecteurMagazines(slug);

  const otherSecteurs = Object.entries(SECTEUR_META).filter(([s]) => s !== slug);

  return (
    <main className="min-h-screen" style={{ background: '#F7F9F8' }}>

      <SecteurHero
        meta={meta}
        total={pagination?.total}
        draftQuery={draftQuery}
        onDraftChange={setDraftQuery}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {/* ── Navigation secteurs + retour ── */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          href="/actualites"
          className="flex items-center gap-1.5 text-[12px] font-bold transition-colors"
          style={{ color: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.color = '#1A5C43')}
        >
          <ArrowLeft size={13} /> Toutes les actualités
        </Link>

        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Autres :</span>
          {otherSecteurs.map(([s, m]) => (
            <Link
              key={s}
              href={`/secteurs/${s}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
              style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1A5C43';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#1A5C43';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {m.emoji} {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Grille magazines ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 pb-20">
        <SecteurMagazineGrid
          magazines={magazines}
          loading={loading}
          pageLoading={pageLoading}
          query={query}
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          total={pagination?.total ?? 0}
          onClearSearch={clearSearch}
          onPageChange={handlePageChange}
        />
      </section>

      <NewsletterMiniCTA prefix="Abonnez-vous pour suivre" highlight={meta.label} />
    </main>
  );
}