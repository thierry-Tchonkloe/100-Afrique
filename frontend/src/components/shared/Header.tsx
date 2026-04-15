// // src/components/shared/Header.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Search } from 'lucide-react';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   return (
//     <nav className="w-full bg-[#001A4D] text-white px-20 py-3 flex items-center justify-between shadow-lg">
//       {/* --- LOGOS (Gauche) --- */}
//       <div className="flex items-center gap-2">
//         {/* <div className="bg-white p-1 rounded-sm"> */}
//           {/* Logo WAXEHO */}
//           {/* <img src="/logos/waxeho.png" alt="Waxeho" className="h-10 object-contain" />
//         </div>
//         <div className="h-8 w-[1px] bg-gray-500 mx-1"></div>
//         <div className="bg-white p-1 rounded-sm"> */}
//           {/* Logo iTourisme TV */}
//           {/* <img src="/logos/itourisme.png" alt="iTourisme TV" className="h-10 object-contain" />
//         </div> */}
//         <Link href="/" >
//         <div className="bg-white p-1 rounded-sm">
//           {/* Logo iTourisme Nomade */}
//           <img src="/logos/itourismenomade.png" alt="iTourisme Nomade" className="h-20 object-contain" />
//         </div>
//         </Link>
//       </div>

//       {/* --- NAVIGATION PRINCIPALE --- */}
//       <div className="hidden lg:flex items-center gap-5 text-[13px] font-medium uppercase tracking-wider">
//         <Link href="/actualites" className="hover:text-orange-400 transition-colors">Actualités</Link>
//         <Link href="/magazine" className="text-center leading-tight hover:text-orange-400 transition-colors">
//           Magazine<br/><span className="text-[11px]">WAXEHO</span>
//         </Link>
//         <Link href="/evenements" className="text-center leading-tight hover:text-orange-400 transition-colors">
//           Salons &<br/><span className="text-[11px]">Événements</span>
//         </Link>
//         <Link href="/partenaires" className="text-center leading-tight hover:text-orange-400 transition-colors">
//           Partenaires &<br/><span className="text-[11px]">Annonceurs</span>
//         </Link>
//         <Link href="/destinations" className="hover:text-orange-400 transition-colors">Destinations</Link>
//         <Link href="/videos" className="text-center leading-tight hover:text-orange-400 transition-colors">
//           Vidéos /<br/><span className="text-[11px]">Web TV</span>
//         </Link>
//         <Link href="/offres" className="hover:text-orange-400 transition-colors">Nos offres</Link>
//         <Link href="/magazines" className="hover:text-orange-400 transition-colors">magazines</Link>
//         <Link href="/contact" className="text-center leading-tight hover:text-orange-400 transition-colors">
//           À propos<br/><span className="text-[11px]">/ Contact</span>
//         </Link>
//       </div>

//       {/* --- ACTIONS (Droite) --- */}
//       <div className="flex items-center gap-4">
//         {/* Barre de recherche extensible */}
//         <div className={`flex items-center bg-white/10 rounded-full px-3 py-1 transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
//           <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
//             <Search size={20} className="text-white cursor-pointer" />
//           </button>
//           {isSearchOpen && (
//             <input 
//               type="text" 
//               placeholder="Rechercher..." 
//               className="bg-transparent border-none outline-none text-white text-sm ml-2 w-full"
//               autoFocus
//             />
//           )}
//         </div>

//         {/* Bouton EMPLOI */}
//         <Link 
//           href="/emploi" 
//           className="bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-2 px-8 rounded-lg text-sm transition-all shadow-md uppercase tracking-widest"
//         >
//           EMPLOI
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Header;




// src/components/shared/Header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import NewsletterButton from '@/components/shared/Newsletterbutton';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full shadow-lg relative z-50">
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to right, white 0%, white 12%, #001A4D 25%, #001A4D 100%)'
        }}
      ></div>
      <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        <div className="flex items-center justify-between">
          
          {/* --- LOGOS (Gauche) --- */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center relative">
              <div className="bg-white p-1 sm:p-2 rounded-sm">
                <img 
                  src="/logos/itourismenomade.png" 
                  alt="iTourisme Nomade" 
                  className="h-12 sm:h-16 md:h-20 object-contain" 
                />
              </div>
              <div className="absolute -bottom-4 left-0 whitespace-nowrap">
                <p className="text-xs sm:text-sm text-orange-400 font-semibold animate-pulse">
                  "La voix du tourisme en Afrique"
                </p>
              </div>
            </Link>
          </div>

          {/* --- NAVIGATION PRINCIPALE (Desktop) --- */}
          <div className="hidden xl:flex items-center gap-3 xl:gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider">
            <Link href="/actualites" className="text-white hover:text-orange-400 transition-colors py-2">Actualités</Link>
            <Link href="/magazine" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
              Magazine<br/><span className="text-[10px]">WAXEHO</span>
            </Link>
            <Link href="/evenements" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
              Salons &<br/><span className="text-[10px]">Événements</span>
            </Link>
            <Link href="/partenaires" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
              Partenaires &<br/><span className="text-[10px]">Annonceurs</span>
            </Link>
            <Link href="/destinations" className="text-white hover:text-orange-400 transition-colors py-2">Destinations</Link>
            <Link href="/videos" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
              Vidéos /<br/><span className="text-[10px]">Web TV</span>
            </Link>
            <Link href="/offres" className="text-white hover:text-orange-400 transition-colors py-2">Nos offres</Link>
            <Link href="/contact" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
              À propos<br/><span className="text-[10px]">/ Contact</span>
            </Link>
          </div>

          {/* --- ACTIONS (Droite) --- */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Barre de recherche extensible (Desktop) */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-full px-3 py-1 transition-all duration-300">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search size={18} className="text-white cursor-pointer" />
              </button>
              {isSearchOpen && (
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="bg-transparent border-none outline-none text-white text-sm ml-2 w-32 sm:w-48"
                  autoFocus
                />
              )}
            </div>

            {/* Bouton Newsletter (Desktop) */}
            <div className="hidden sm:flex">
              <NewsletterButton />
            </div>

            {/* Bouton EMPLOI */}
            <Link 
              href="/emploi" 
              className="bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-2 px-3 sm:px-6 rounded-lg text-xs sm:text-sm transition-all shadow-md uppercase tracking-widest"
            >
              EMPLOI
            </Link>

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE --- */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="fixed top-0 left-0 h-full w-[40%] max-w-xs bg-[#001A4D] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-white p-1 rounded-sm">
                    <img 
                      src="/logos/itourismenomade.png" 
                      alt="iTourisme Nomade" 
                      className="h-10 object-contain" 
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-orange-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Recherche Mobile */}
              <div className="hidden flex xl:flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
                <Search size={18} className="text-white mr-2" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="bg-transparent border-none outline-none text-white text-sm flex-1"
                />
              </div>

              {/* Newsletter Mobile */}
              <div className="hidden xl:flex mb-6">
                <NewsletterButton />
              </div>

              {/* Navigation Mobile */}
              <div className="space-y-1">
                <Link href="/actualites" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Actualités</Link>
                <Link href="/magazine" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Magazine WAXEHO</Link>
                <Link href="/evenements" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Salons & Événements</Link>
                <Link href="/partenaires" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Partenaires & Annonceurs</Link>
                <Link href="/destinations" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Destinations</Link>
                <Link href="/videos" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vidéos / Web TV</Link>
                <Link href="/offres" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Nos offres</Link>
                <Link href="/contact" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>À propos / Contact</Link>
                
                <div className="pt-4 border-t border-gray-700">
                  <Link href="/emploi" className="block w-full bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-3 px-4 rounded-lg text-sm text-center transition-all shadow-md uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                    EMPLOI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;