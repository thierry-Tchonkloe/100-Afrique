"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, TrendingUp, MapPin, Briefcase, Film, Users, Star } from 'lucide-react';
import NewsletterButton from '@/components/shared/Newsletterbutton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

interface NavItem {
  href: string;
  label: string;
  megaMenu?: MegaMenuItem[];
}

// ─── Données nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    href: '/actualites',
    label: 'Actualités',
    megaMenu: [
      { label: 'Hôtellerie', href: '/actualites/hotellerie', icon: <Star size={16} />, description: 'Tendances hôtels & resorts' },
      { label: 'Transport', href: '/actualites/transport', icon: <TrendingUp size={16} />, description: 'Aviation, train, maritime' },
      { label: 'Restauration', href: '/actualites/restauration', icon: <Star size={16} />, description: 'Gastronomie africaine' },
    ],
  },
  { href: '/evenements', label: 'Événements' },
  { href: '/partenaires', label: 'Partenaires' },
  {
    href: '/destinations',
    label: 'Destinations',
    megaMenu: [
      { label: 'Afrique de l\'Ouest', href: '/destinations/ouest', icon: <MapPin size={16} />, description: 'Sénégal, Côte d\'Ivoire…' },
      { label: 'Afrique de l\'Est', href: '/destinations/est', icon: <MapPin size={16} />, description: 'Kenya, Tanzanie…' },
      { label: 'Afrique du Nord', href: '/destinations/nord', icon: <MapPin size={16} />, description: 'Maroc, Tunisie…' },
    ],
  },
  { href: '/videos', label: 'Vidéos' },
  { href: '/offres', label: 'Nos offres' },
  { href: '/contact', label: 'À propos & Contact' },
];

// ─── Composant MegaMenu ───────────────────────────────────────────────────────

function MegaMenuPanel({ items, visible }: { items: MegaMenuItem[]; visible: boolean }) {
  return (
    <div
      className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72
        bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
        transition-all duration-200 origin-top z-50
        ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
      `}
    >
      <div className="p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 px-4 py-3 rounded-xl group hover:bg-[#F0FAF5] transition-colors"
          >
            <span
              className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg shrink-0 text-white"
              style={{ background: '#1A5C43' }}
            >
              {item.icon}
            </span>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-[#1A5C43] transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Composant principal Header ───────────────────────────────────────────────

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const handleMenuEnter = (label: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <nav
      className={`
        w-full fixed top-0 left-0 z-50
        transition-all duration-300
        ${scrolled ? 'shadow-xl' : ''}
      `}
    >
      {/* Fond dégradé émeraude */}
      <div
        className="absolute inset-0"
        style={{
          background: scrolled
            ? 'linear-gradient(to right, #fff 0%, #fff 13%, #1A5C43 22%, #1A5C43 100%)'
            : 'linear-gradient(to right, #fff 0%, #fff 13%, #1A5C43 22%, #1A5C43 100%)',
        }}
      />

      {/* Barre d'accent terre cuite — 3px en haut */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: '#B85C38' }} />

      <div className="px-4 sm:px-6 lg:px-8 pt-[3px] pb-0 relative z-10">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── LOGO ── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/logos/itourismenomade.png"
                  alt="100% Afrique"
                  className="h-11 sm:h-14 object-contain"
                />
              </div>
            </Link>
            {/* Tagline animée */}
            <span
              className="hidden md:block ml-3 text-[11px] font-semibold tracking-wide animate-pulse"
              style={{ color: '#C8A84B' }}
            >
              La voix du tourisme en Afrique
            </span>
          </div>

          {/* ── NAV DESKTOP ── */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.megaMenu && handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wide
                    text-white transition-all duration-150
                    hover:bg-white/10
                    ${activeMenu === item.label ? 'bg-white/10' : ''}
                  `}
                >
                  {item.label}
                  {item.megaMenu && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${activeMenu === item.label ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {item.megaMenu && (
                  <MegaMenuPanel
                    items={item.megaMenu}
                    visible={activeMenu === item.label}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── ACTIONS DROITE ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Recherche extensible */}
            <div
              className={`
                hidden sm:flex items-center rounded-full overflow-hidden
                transition-all duration-300 bg-white/10 hover:bg-white/15
                ${isSearchOpen ? 'w-52 ring-2 ring-white/30' : 'w-9'}
              `}
            >
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
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
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher…"
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/60 outline-none pr-3"
                />
              )}
            </div>

            {/* Newsletter */}
            <div className="hidden sm:flex">
              <NewsletterButton />
            </div>

            {/* CTA Emploi — pill terre cuite avec shimmer */}
            <Link
              href="/emploi"
              className="
                relative overflow-hidden font-bold py-2 px-4 sm:px-5 rounded-full
                text-xs sm:text-sm uppercase tracking-widest text-white
                transition-all shadow-md hover:shadow-lg active:scale-95
              "
              style={{ background: '#B85C38' }}
            >
              <span className="relative z-10">EMPLOI</span>
              {/* Shimmer */}
              <span
                className="absolute inset-0 -translate-x-full hover:animate-[shimmer_0.6s_ease] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: 'none' }}
              />
            </Link>

            {/* Burger mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MENU MOBILE ── */}
      <div
        className={`
          fixed inset-0 z-40 xl:hidden transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />

      <div
        className={`
          fixed top-0 left-0 h-full w-[75vw] max-w-xs z-50 xl:hidden
          flex flex-col
          transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: '#1A5C43' }}
      >
        {/* En-tête drawer */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="bg-white px-2 py-1 rounded-lg">
            <img src="/logos/itourismenomade.png" alt="100% Afrique" className="h-9 object-contain" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Liens */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-semibold text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-wide"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA emploi mobile */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/emploi"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center font-bold py-3 rounded-full text-sm uppercase tracking-widest text-white"
            style={{ background: '#B85C38' }}
          >
            EMPLOI
          </Link>
        </div>
      </div>

      {/* Décalage du contenu sous le header fixe */}
      <style jsx global>{`
        body { padding-top: 75px; }
      `}</style>
    </nav>
  );
};

export default Header;












// // src/components/shared/Header.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Search, Menu, X } from 'lucide-react';
// import NewsletterButton from '@/components/shared/Newsletterbutton';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="w-full shadow-lg relative z-50">
//       {/* Fond : blanc à gauche (logo) → émeraude foncé à droite (nav) */}
//       <div
//         className="absolute inset-0"
//         style={{
//           background: 'linear-gradient(to right, white 0%, white 12%, #1A5C43 25%, #1A5C43 100%)'
//         }}
//       />

//       <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-10">
//         <div className="flex items-center justify-between">

//           {/* --- LOGOS (Gauche) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//             <Link href="/" className="flex items-center relative">
//               <div className="bg-white p-1 sm:p-2 rounded-sm">
//                 <img
//                   src="/logos/itourismenomade.png"
//                   alt="iTourisme Nomade"
//                   className="h-12 sm:h-16 md:h-20 object-contain"
//                 />
//               </div>
//               <div className="absolute -bottom-4 left-0 whitespace-nowrap">
//                 <p className="text-xs sm:text-sm font-semibold animate-pulse" style={{ color: '#C8A84B' }}>
//                   "La voix du tourisme en Afrique"
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* --- NAVIGATION PRINCIPALE (Desktop) --- */}
//           <div className="hidden xl:flex items-center gap-3 xl:gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider">
//             {[
//               { href: '/actualites',  label: 'Actualités' },
//               { href: '/evenements',  label: 'Événements' },
//               { href: '/partenaires', label: 'Partenaires' },
//               { href: '/destinations',label: 'Destinations' },
//               { href: '/videos',      label: 'Vidéos' },
//               { href: '/offres',      label: 'Nos offres' },
//               { href: '/contact',     label: 'À propos & Contact' },
//             ].map(({ href, label }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className="py-2 transition-colors"
//                 style={{ color: '#ffffff' }}
//                 onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                 onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
//               >
//                 {label}
//               </Link>
//             ))}
//           </div>

//           {/* --- ACTIONS (Droite) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">

//             {/* Barre de recherche extensible (Desktop) */}
//             <div className="hidden sm:flex items-center rounded-full px-3 py-1 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
//               <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
//                 <Search size={18} className="text-white cursor-pointer" />
//               </button>
//               {isSearchOpen && (
//                 <input
//                   type="text"
//                   placeholder="Rechercher..."
//                   className="bg-transparent border-none outline-none text-white text-sm ml-2 w-32 sm:w-48"
//                   autoFocus
//                 />
//               )}
//             </div>

//             {/* Bouton Newsletter (Desktop) */}
//             <div className="hidden sm:flex">
//               <NewsletterButton />
//             </div>

//             {/* Bouton EMPLOI — terre cuite */}
//             <Link
//               href="/emploi"
//               className="font-bold py-2 px-3 sm:px-6 rounded-lg text-xs sm:text-sm transition-all shadow-md uppercase tracking-widest"
//               style={{ background: '#B85C38', color: '#ffffff' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//             >
//               EMPLOI
//             </Link>

//             {/* Menu Mobile */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="xl:hidden p-2 text-white"
//             >
//               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MENU MOBILE --- */}
//       {isMobileMenuOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />

//           <div
//             className="fixed top-0 left-0 h-full w-[40%] max-w-xs shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
//             style={{ background: '#1A5C43' }}
//           >
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="bg-white p-1 rounded-sm">
//                   <img
//                     src="/logos/itourismenomade.png"
//                     alt="iTourisme Nomade"
//                     className="h-10 object-contain"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 text-white transition-colors"
//                   onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                   onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Navigation Mobile */}
//               <div className="space-y-1">
//                 {[
//                   { href: '/actualites',   label: 'Actualités' },
//                   { href: '/evenements',   label: 'Événements' },
//                   { href: '/partenaires',  label: 'Partenaires' },
//                   { href: '/destinations', label: 'Destinations' },
//                   { href: '/videos',       label: 'Vidéos' },
//                   { href: '/offres',       label: 'Nos offres' },
//                   { href: '/contact',      label: 'À propos & Contact' },
//                 ].map(({ href, label }) => (
//                   <Link
//                     key={href}
//                     href={href}
//                     className="block py-3 px-2 rounded transition-colors text-white"
//                     style={{}}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
//                       e.currentTarget.style.color = '#C8A84B';
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.background = 'transparent';
//                       e.currentTarget.style.color = '#ffffff';
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ))}

//                 <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
//                   <Link
//                     href="/emploi"
//                     className="block w-full font-bold py-3 px-4 rounded-lg text-sm text-center transition-all shadow-md uppercase tracking-widest text-white"
//                     style={{ background: '#B85C38' }}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//                     onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//                   >
//                     EMPLOI
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;




















// // src/components/shared/Header.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Search, Menu, X } from 'lucide-react';
// import NewsletterButton from '@/components/shared/Newsletterbutton';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="w-full shadow-lg relative z-50">
//       <div 
//         className="absolute inset-0" 
//         style={{
//           background: 'linear-gradient(to right, white 0%, white 12%, #001A4D 25%, #001A4D 100%)'
//         }}
//       ></div>
//       <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-10">
//         <div className="flex items-center justify-between">
          
//           {/* --- LOGOS (Gauche) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//             <Link href="/" className="flex items-center relative">
//               <div className="bg-white p-1 sm:p-2 rounded-sm">
//                 <img 
//                   src="/logos/itourismenomade.png" 
//                   alt="iTourisme Nomade" 
//                   className="h-12 sm:h-16 md:h-20 object-contain" 
//                 />
//               </div>
//               <div className="absolute -bottom-4 left-0 whitespace-nowrap">
//                 <p className="text-xs sm:text-sm text-orange-400 font-semibold animate-pulse">
//                   "La voix du tourisme en Afrique"
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* --- NAVIGATION PRINCIPALE (Desktop) --- */}
//           <div className="hidden xl:flex items-center gap-3 xl:gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider">
//             <Link href="/actualites" className="text-white hover:text-orange-400 transition-colors py-2">Actualités</Link>
//             {/* <Link href="/magazine" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               Magazine<br/><span className="text-[10px]">WAXEHO</span>
//             </Link> */}
//             <Link href="/evenements" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Salons &<br/><span className="text-[10px]">Événements</span> */}
//               Événements
//             </Link>
//             <Link href="/partenaires" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Partenaires &<br/><span className="text-[10px]">Annonceurs</span> */}
//               Partenaires
//             </Link>
//             <Link href="/destinations" className="text-white hover:text-orange-400 transition-colors py-2">Destinations</Link>
//             <Link href="/videos" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Vidéos /<br/><span className="text-[10px]">Web TV</span> */}
//               Vidéos
//             </Link>
//             <Link href="/offres" className="text-white hover:text-orange-400 transition-colors py-2">Nos offres</Link>
//             <Link href="/contact" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               À propos & Contact
//             </Link>
//           </div>

//           {/* --- ACTIONS (Droite) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
//             {/* Barre de recherche extensible (Desktop) */}
//             <div className="hidden sm:flex items-center bg-white/10 rounded-full px-3 py-1 transition-all duration-300">
//               <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
//                 <Search size={18} className="text-white cursor-pointer" />
//               </button>
//               {isSearchOpen && (
//                 <input 
//                   type="text" 
//                   placeholder="Rechercher..." 
//                   className="bg-transparent border-none outline-none text-white text-sm ml-2 w-32 sm:w-48"
//                   autoFocus
//                 />
//               )}
//             </div>

//             {/* Bouton Newsletter (Desktop) */}
//             <div className="hidden sm:flex">
//               <NewsletterButton />
//             </div>

//             {/* Bouton EMPLOI */}
//             <Link 
//               href="/emploi" 
//               className="bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-2 px-3 sm:px-6 rounded-lg text-xs sm:text-sm transition-all shadow-md uppercase tracking-widest"
//             >
//               EMPLOI
//             </Link>

//             {/* Menu Mobile */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="xl:hidden p-2 text-white"
//             >
//               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MENU MOBILE --- */}
//       {isMobileMenuOpen && (
//         <>
//           <div 
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
          
//           <div className="fixed top-0 left-0 h-full w-[40%] max-w-xs bg-[#001A4D] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="bg-white p-1 rounded-sm">
//                     <img 
//                       src="/logos/itourismenomade.png" 
//                       alt="iTourisme Nomade" 
//                       className="h-10 object-contain" 
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 text-white hover:text-orange-400 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Recherche Mobile */}
//               <div className="hidden flex xl:flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
//                 <Search size={18} className="text-white mr-2" />
//                 <input 
//                   type="text" 
//                   placeholder="Rechercher..." 
//                   className="bg-transparent border-none outline-none text-white text-sm flex-1"
//                 />
//               </div>

//               {/* Newsletter Mobile */}
//               <div className="hidden xl:flex mb-6">
//                 <NewsletterButton />
//               </div>

//               {/* Navigation Mobile */}
//               <div className="space-y-1">
//                 <Link href="/actualites" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Actualités</Link>
//                 {/* <Link href="/magazine" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Magazine WAXEHO</Link> */}
//                 <Link href="/evenements" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Événements</Link>
//                 <Link href="/partenaires" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Partenaires</Link>
//                 <Link href="/destinations" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Destinations</Link>
//                 <Link href="/videos" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vidéos</Link>
//                 <Link href="/offres" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Nos offres</Link>
//                 <Link href="/contact" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>À propos & Contact</Link>
                
//                 <div className="pt-4 border-t border-gray-700">
//                   <Link href="/emploi" className="block w-full bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-3 px-4 rounded-lg text-sm text-center transition-all shadow-md uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
//                     EMPLOI
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;