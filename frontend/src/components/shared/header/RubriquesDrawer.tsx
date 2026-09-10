// src/components/shared/header/RubriquesDrawer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { X, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import { megaMenuData } from '@/constants/navigation';
import { NAV_ITEMS } from './navItems';
import MagazineMiniCard from './MagazineMiniCard';
import type { HeaderMagazine } from './useHeaderMagazines';

interface RubriquesDrawerProps {
  isOpen: boolean;
  expandedCategory: string | null;
  onClose: () => void;
  onToggleCategory: (category: string) => void;
  getMagazinesFor: (slug: string) => HeaderMagazine[];
  isLoadingMagazines: (slug: string) => boolean;
}

const RubriquesDrawer = ({
  isOpen, expandedCategory, onClose, onToggleCategory, getMagazinesFor, isLoadingMagazines,
}: RubriquesDrawerProps) => {
  return (
    <>
      {/* ── OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* ── PANEL ── */}
      <div
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '75vw', maxWidth: '420px', backgroundColor: '#ffffff' }}
      >
        {/* Header drawer */}
        <div
          className="flex items-center justify-between p-5 shrink-0"
          style={{ backgroundColor: '#1A5C43', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="bg-white px-2 py-1 rounded-lg">
            <img src="/logos/itourismenomade.png" alt="100% Afrique" className="h-9 object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C8A84B' }}>
              Rubriques
            </span>
            <button onClick={onClose} className="p-1 text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav links (mobile only) */}
        <div className="xl:hidden border-b" style={{ borderColor: '#e5e7eb' }}>
          <div className="p-3 grid grid-cols-2 gap-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide transition-colors"
                style={{ color: '#001A4D' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4EDE5')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="overflow-y-auto flex-1">
          {Object.entries(megaMenuData).map(([category, data]) => {
            const isExpanded = expandedCategory === category;
            const { slug } = data;
            const magazines = getMagazinesFor(slug);
            const isLoadingM = isLoadingMagazines(slug);

            return (
              <div key={category} style={{ borderBottom: '1px solid #f3f4f6' }}>

                {/* Ligne catégorie */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => onToggleCategory(category)}
                >
                  <span className="font-bold text-[12px] uppercase tracking-wider" style={{ color: '#001A4D' }}>
                    {category}
                  </span>
                  <ChevronRight
                    size={16}
                    style={{ color: '#1A5C43', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Panneau expandé */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1" style={{ backgroundColor: '#f8fafc' }}>

                    {/* Colonnes de liens */}
                    {data.columns.map((col, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="font-extrabold text-[10px] uppercase tracking-tight mb-2" style={{ color: '#C8A84B' }}>
                          {col.title}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link}>
                              <a
                                href="#"
                                className="flex items-center gap-1.5 text-[12px] py-0.5 transition-colors"
                                style={{ color: '#4b5563' }}
                                onClick={onClose}
                                onMouseEnter={e => (e.currentTarget.style.color = '#001A4D')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                              >
                                <ArrowRight size={10} style={{ color: '#C8A84B', flexShrink: 0 }} />
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

                    {/* Actualités récentes */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-extrabold text-[10px] uppercase tracking-tight flex items-center gap-1" style={{ color: '#C8A84B' }}>
                        <BookOpen size={10} />
                        Actualités Récentes
                      </p>
                      <Link
                        href={`/secteurs/${slug}`}
                        className="text-[9px] font-bold flex items-center gap-0.5 transition-colors"
                        style={{ color: '#001A4D' }}
                        onClick={onClose}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
                      >
                        Voir tous <ArrowRight size={10} />
                      </Link>
                    </div>

                    {isLoadingM ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100">
                            <div className="w-12 h-12 rounded-md bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5 py-1">
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : magazines.length === 0 ? (
                      <p className="text-[11px] italic" style={{ color: '#9ca3af' }}>
                        Aucune actualité disponible dans cette catégorie.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {magazines.slice(0, 4).map(mag => (
                          <div key={mag.id} onClick={onClose}>
                            <MagazineMiniCard magazine={mag} />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA emploi bas du drawer */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid #e5e7eb' }}>
          <Link
            href="/emploi"
            onClick={onClose}
            className="block w-full text-center font-bold py-3 rounded-full text-sm uppercase tracking-widest text-white transition-colors"
            style={{ backgroundColor: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8A3E22')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B85C38')}
          >
            Espace EMPLOI
          </Link>
        </div>
      </div>
    </>
  );
};

export default RubriquesDrawer;