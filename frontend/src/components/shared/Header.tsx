// src/components/shared/Header.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

import { NAV_ITEMS } from './header/navItems';
import { useHeaderMagazines } from './header/useHeaderMagazines';
import MegaMenuPanel from './header/MegaMenuPanel';
import RubriquesDrawer from './header/RubriquesDrawer';

const Header = () => {
  // Header state
  const [isSearchOpen,  setIsSearchOpen]  = useState(false);
  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null);
  const [scrolled,      setScrolled]      = useState(false);
  const [searchValue,   setSearchValue]   = useState('');
  const searchRef   = useRef<HTMLInputElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rubriques drawer state
  const [isRubriquesOpen,  setIsRubriquesOpen]  = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { fetchMagazines, getMagazinesFor, isLoading } = useHeaderMagazines();

  // ── Scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  // ── Helpers ──
  const handleNavEnter = (label: string) => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setActiveNavMenu(label);
  };
  const handleNavLeave = () => {
    navTimerRef.current = setTimeout(() => setActiveNavMenu(null), 150);
  };

  const closeDrawer = () => {
    setIsRubriquesOpen(false);
    setExpandedCategory(null);
  };

  const toggleCategory = (category: string) => {
    const next = expandedCategory === category ? null : category;
    setExpandedCategory(next);
    if (next) fetchMagazines(next);
  };

  // ── Render ──
  return (
    <>
      <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: '#B85C38' }} />

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #fff 0%, #fff 13%, #1A5C43 22%, #1A5C43 100%)' }}
        />

        <div className="px-4 sm:px-6 lg:px-8 pt-[3px] pb-0 relative z-10">
          <div className="flex my-2 items-center justify-between h-[72px]">

            {/* ── LOGO ── */}
            <div className="flex flex-col ml-8 items-center shrink-0">
              <Link href="/" className="flex -ml-13 items-center group">
                <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src="/logos/itourismenomade.png"
                    alt="100% Afrique"
                    className="h-11 sm:h-14 object-contain"
                  />
                </div>
              </Link>
              <span className="hidden md:block text-[10px] font-semibold animate-pulse" style={{ color: '#C8A84B' }}>
                La voix du tourisme en Afrique
              </span>
            </div>

            {/* ── NAV DESKTOP ── */}
            <div className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.megaMenu && handleNavEnter(item.label)}
                  onMouseLeave={handleNavLeave}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wide
                      text-white transition-all duration-150 hover:bg-white/10
                      ${activeNavMenu === item.label ? 'bg-white/10' : ''}
                    `}
                  >
                    {item.label}
                    {item.megaMenu && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeNavMenu === item.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                  {item.megaMenu && (
                    <MegaMenuPanel items={item.megaMenu} visible={activeNavMenu === item.label} />
                  )}
                </div>
              ))}
            </div>

            {/* ── ACTIONS DROITE ── */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Recherche */}
              <div
                className={`
                  hidden sm:flex items-center rounded-full overflow-hidden
                  transition-all duration-300 bg-white/10 hover:bg-white/15
                  ${isSearchOpen ? 'w-52 ring-2 ring-white/30' : 'w-9'}
                `}
              >
                <button
                  onClick={() => setIsSearchOpen(v => !v)}
                  className="flex items-center justify-center w-9 h-9 shrink-0"
                >
                  {isSearchOpen
                    ? <X size={16} className="text-white" />
                    : <Search size={16} className="text-white" />
                  }
                </button>
                {isSearchOpen && (
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Rechercher…"
                    className="flex-1 bg-transparent text-white text-sm placeholder-white/60 outline-none pr-3"
                  />
                )}
              </div>

              {/* ── BOUTON RUBRIQUES ── */}
              <button
                onClick={() => setIsRubriquesOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                aria-label="Explorer les rubriques"
              >
                <Menu size={15} />
                <span className="hidden sm:inline">Rubriques</span>
              </button>

              {/* CTA Emploi */}
              <Link
                href="/emploi"
                className="relative overflow-hidden font-bold py-2 px-4 sm:px-5 rounded-full text-xs sm:text-sm uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                style={{ backgroundColor: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8A3E22')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B85C38')}
              >
                EMPLOI
              </Link>

              {/* Burger mobile */}
              <button
                onClick={() => setIsRubriquesOpen(!isRubriquesOpen)}
                className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label={isRubriquesOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {isRubriquesOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      <RubriquesDrawer
        isOpen={isRubriquesOpen}
        expandedCategory={expandedCategory}
        onClose={closeDrawer}
        onToggleCategory={toggleCategory}
        getMagazinesFor={getMagazinesFor}
        isLoadingMagazines={isLoading}
      />

      <style jsx global>{`
        body { padding-top: 75px; }
      `}</style>
    </>
  );
};

export default Header;