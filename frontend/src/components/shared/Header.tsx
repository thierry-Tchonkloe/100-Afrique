// src/components/shared/Header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="w-full bg-[#001A4D] text-white px-20 py-3 flex items-center justify-between shadow-lg">
      {/* --- LOGOS (Gauche) --- */}
      <div className="flex items-center gap-2">
        {/* <div className="bg-white p-1 rounded-sm"> */}
          {/* Logo WAXEHO */}
          {/* <img src="/logos/waxeho.png" alt="Waxeho" className="h-10 object-contain" />
        </div>
        <div className="h-8 w-[1px] bg-gray-500 mx-1"></div>
        <div className="bg-white p-1 rounded-sm"> */}
          {/* Logo iTourisme TV */}
          {/* <img src="/logos/itourisme.png" alt="iTourisme TV" className="h-10 object-contain" />
        </div> */}
        <Link href="/" >
        <div className="bg-white p-1 rounded-sm">
          {/* Logo iTourisme Nomade */}
          <img src="/logos/itourismenomade.png" alt="iTourisme Nomade" className="h-20 object-contain" />
        </div>
        </Link>
      </div>

      {/* --- NAVIGATION PRINCIPALE --- */}
      <div className="hidden lg:flex items-center gap-5 text-[13px] font-medium uppercase tracking-wider">
        <Link href="/actualites" className="hover:text-orange-400 transition-colors">Actualités</Link>
        <Link href="/magazine" className="text-center leading-tight hover:text-orange-400 transition-colors">
          Magazine<br/><span className="text-[11px]">WAXEHO</span>
        </Link>
        <Link href="/evenements" className="text-center leading-tight hover:text-orange-400 transition-colors">
          Salons &<br/><span className="text-[11px]">Événements</span>
        </Link>
        <Link href="/partenaires" className="text-center leading-tight hover:text-orange-400 transition-colors">
          Partenaires &<br/><span className="text-[11px]">Annonceurs</span>
        </Link>
        <Link href="/destinations" className="hover:text-orange-400 transition-colors">Destinations</Link>
        <Link href="/videos" className="text-center leading-tight hover:text-orange-400 transition-colors">
          Vidéos /<br/><span className="text-[11px]">Web TV</span>
        </Link>
        <Link href="/offres" className="hover:text-orange-400 transition-colors">Nos offres</Link>
        <Link href="/magazines" className="hover:text-orange-400 transition-colors">magazines</Link>
        <Link href="/contact" className="text-center leading-tight hover:text-orange-400 transition-colors">
          À propos<br/><span className="text-[11px]">/ Contact</span>
        </Link>
      </div>

      {/* --- ACTIONS (Droite) --- */}
      <div className="flex items-center gap-4">
        {/* Barre de recherche extensible */}
        <div className={`flex items-center bg-white/10 rounded-full px-3 py-1 transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} className="text-white cursor-pointer" />
          </button>
          {isSearchOpen && (
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none text-white text-sm ml-2 w-full"
              autoFocus
            />
          )}
        </div>

        {/* Bouton EMPLOI */}
        <Link 
          href="/emploi" 
          className="bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-2 px-8 rounded-lg text-sm transition-all shadow-md uppercase tracking-widest"
        >
          EMPLOI
        </Link>
      </div>
    </nav>
  );
};

export default Header;