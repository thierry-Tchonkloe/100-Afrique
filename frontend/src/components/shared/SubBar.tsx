// src/components/shared/SubBar.tsx
// ⚠️  Ce composant est désormais intégré directement dans Header.tsx
// (bouton "Rubriques" + drawer). Gardé ici comme stub pour ne pas casser
// les imports existants — ne rend rien.

const SubBar = () => null;
export default SubBar;







// // src/components/shared/SubBar.tsx
// "use client";

// import React, { useReducer, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { ChevronDown, Clock, ArrowRight, Menu, X, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
// import { megaMenuData } from '@/constants/navigation';
// import { getToken } from '@/lib/auth';
// import MagazineImage from '@/components/shared/MagazineImage';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
//   excerpt?: string | null;
// }

// // ─── Cache module-level ───────────────────────────────────────────────────────

// const magazinesCache: Record<string, Magazine[]> = {};

// // ─── State & Reducer ──────────────────────────────────────────────────────────

// interface State {
//   activeMenu:      string | null;
//   magazinesMap:    Record<string, Magazine[]>;
//   loadingMagSlug:  string | null;
// }

// type Action =
//   | { type: 'SET_MENU';        payload: string | null }
//   | { type: 'SET_LOADING_MAG'; payload: string | null }
//   | { type: 'SET_MAGAZINES';   slug: string; magazines: Magazine[] };

// const initialState: State = {
//   activeMenu:     null,
//   magazinesMap:   {},
//   loadingMagSlug: null,
// };

// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     case 'SET_MENU':
//       return { ...state, activeMenu: action.payload };
//     case 'SET_LOADING_MAG':
//       return { ...state, loadingMagSlug: action.payload };
//     case 'SET_MAGAZINES':
//       return {
//         ...state,
//         loadingMagSlug: null,
//         magazinesMap: { ...state.magazinesMap, [action.slug]: action.magazines },
//       };
//     default:
//       return state;
//   }
// }

// // ─── Magazine card — desktop mega-menu ───────────────────────────────────────
// // Ratio 16/9 : correspond au format réel des images RSS (paysage).
// // La card est horizontale sur desktop pour maximiser la surface d'image utile.

// function MagazineMenuCard({ magazine }: { magazine: Magazine }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="group/mag flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
//     >
//       {/* Image en ratio 16/9 — format paysage, correspond aux images RSS */}
//       <div className="relative w-full aspect-video overflow-hidden bg-gray-100 shrink-0">
//         <MagazineImage
//           src={magazine.coverImage}
//           alt={magazine.title}
//           className="w-full h-full object-cover group-hover/mag:scale-105 transition-transform duration-500"
//         />
//         {/* Badge source */}
//         <div className="absolute top-2 left-2">
//           <span className="bg-[#001A4D]/80 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none">
//             {magazine.source}
//           </span>
//         </div>
//       </div>

//       {/* Infos */}
//       <div className="p-2.5 flex flex-col gap-1">
//         <p className="font-bold text-[11px] text-[#001A4D] leading-tight line-clamp-2">
//           {magazine.title}
//         </p>
//         <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
//           <Clock size={9} />
//           {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
//             day: 'numeric', month: 'short', year: 'numeric',
//           })}
//         </div>
//         <span className="flex items-center gap-1 text-[9px] font-bold text-[#F39C12] mt-1">
//           Lire <ExternalLink size={9} />
//         </span>
//       </div>
//     </Link>
//   );
// }

// // ─── Magazine mini-card — mobile drawer ──────────────────────────────────────

// function MagazineMiniCardMobile({ magazine }: { magazine: Magazine }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
//     >
//       {/* Miniature carrée pour le drawer mobile */}
//       <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-100">
//         <MagazineImage
//           src={magazine.coverImage}
//           alt={magazine.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="flex-1 min-w-0">
//         <span className="inline-block bg-[#001A4D] text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-1">
//           {magazine.source}
//         </span>
//         <p className="font-bold text-[10.5px] text-[#001A4D] leading-tight line-clamp-2">
//           {magazine.title}
//         </p>
//       </div>
//     </Link>
//   );
// }

// // ─── Skeletons ───────────────────────────────────────────────────────────────

// function MagazineSkeleton() {
//   return (
//     <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
//       {/* Même ratio aspect-video que la card réelle */}
//       <div className="w-full aspect-video bg-gray-100 animate-pulse" />
//       <div className="p-2.5 space-y-1.5">
//         <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
//         <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
//       </div>
//     </div>
//   );
// }

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// function getAuthHeaders(): HeadersInit {
//   const token = getToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// // ─── Composant principal ─────────────────────────────────────────────────────

// const SubBar = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { activeMenu, magazinesMap, loadingMagSlug } = state;

//   const [isMobileDrawerOpen, setIsMobileDrawerOpen]       = useState(false);
//   const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

//   const abortMagazines = useRef<AbortController | null>(null);

//   // ── Fetch magazines par catégorie ─────────────────────────────────────────
//   useEffect(() => {
//     abortMagazines.current?.abort();
//     if (!activeMenu) return;

//     const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
//     if (!menuCategory) return;
//     const { slug } = menuCategory;

//     // Déjà en cache → on ne refetch pas
//     if (magazinesMap[slug] !== undefined || magazinesCache[slug] !== undefined) return;

//     const controller = new AbortController();
//     abortMagazines.current = controller;

//     queueMicrotask(() => {
//       if (controller.signal.aborted) return;
//       dispatch({ type: 'SET_LOADING_MAG', payload: slug });
//     });

//     fetch(
//       `${BASE_URL}/magazines/rss?category=${slug}&pageSize=3&page=1`,
//       { headers: getAuthHeaders(), signal: controller.signal }
//     )
//       .then((r) => r.json())
//       .then((json) => {
//         const data: Magazine[] = json?.data?.magazines ?? [];
//         magazinesCache[slug] = data;
//         dispatch({ type: 'SET_MAGAZINES', slug, magazines: data });
//       })
//       .catch((err) => {
//         if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
//           dispatch({ type: 'SET_MAGAZINES', slug, magazines: [] });
//         }
//       });

//     return () => controller.abort();
//   }, [activeMenu]);

//   // ── Valeurs dérivées ──────────────────────────────────────────────────────
//   const activeSlug = activeMenu
//     ? megaMenuData[activeMenu as keyof typeof megaMenuData]?.slug ?? null
//     : null;

//   const categoryMagazines = activeSlug
//     ? (magazinesMap[activeSlug] ?? magazinesCache[activeSlug] ?? [])
//     : [];
//   const loadingMags = activeSlug !== null && loadingMagSlug === activeSlug;

//   const closeMobile = () => {
//     setIsMobileDrawerOpen(false);
//     setMobileExpandedCategory(null);
//   };

//   // ─── JSX ──────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── DESKTOP SubBar (lg+) ──────────────────────────────────────────── */}
//       <div
//         className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40 hidden lg:block"
//         onMouseLeave={() => dispatch({ type: 'SET_MENU', payload: null })}
//       >
//         <div className="max-w-[1400px] mx-auto px-4">
//           <ul className="flex items-center justify-center gap-6 py-3">
//             {Object.keys(megaMenuData).map((category) => (
//               <li
//                 key={category}
//                 onMouseEnter={() => dispatch({ type: 'SET_MENU', payload: category })}
//                 className="group cursor-pointer py-1"
//               >
//                 <div
//                   className={`flex items-center gap-1.5 font-bold text-[10.5px] tracking-wider transition-colors ${
//                     activeMenu === category ? 'text-blue-700' : 'text-[#001A4D]'
//                   }`}
//                 >
//                   {category}
//                   <ChevronDown
//                     size={14}
//                     className={`transition-transform duration-200 ${activeMenu === category ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ── Panel mega-menu ─────────────────────────────────────────────── */}
//         {activeMenu && megaMenuData[activeMenu as keyof typeof megaMenuData] && (
//           <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
//             <div className="max-w-[1400px] mx-auto p-8">
//               <div className="flex gap-10">

//                 {/* Colonnes de liens de navigation */}
//                 {megaMenuData[activeMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
//                   <div key={idx} className="w-1/5">
//                     <h3 className="text-[#F39C12] font-extrabold text-[13px] mb-5 uppercase tracking-tight">
//                       {col.title}
//                     </h3>
//                     <ul className="space-y-3">
//                       {col.links.map((link) => (
//                         <li key={link}>
//                           <a
//                             href="#"
//                             className="text-gray-500 hover:text-[#001A4D] text-[12.5px] transition-colors leading-tight block"
//                           >
//                             {link}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}

//                 {/* Actualités récentes de la catégorie */}
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between mb-5">
//                     <h3 className="text-[#F39C12] font-extrabold text-[13px] uppercase flex items-center gap-2">
//                       <BookOpen size={14} />
//                       Actualités Récentes — {activeMenu}
//                     </h3>
//                     <Link
//                       href={activeSlug ? `/secteurs/${activeSlug}` : '/actualites'}
//                       className="text-[10.5px] font-bold text-[#001A4D] hover:text-[#F39C12] flex items-center gap-1 transition-colors"
//                     >
//                       Voir tous <ChevronRight size={12} />
//                     </Link>
//                   </div>

//                   {loadingMags ? (
//                     <div className="grid grid-cols-3 gap-4">
//                       {[1, 2, 3].map((i) => <MagazineSkeleton key={i} />)}
//                     </div>
//                   ) : categoryMagazines.length > 0 ? (
//                     <div className="grid grid-cols-3 gap-4">
//                       {categoryMagazines.slice(0, 3).map((mag) => (
//                         <MagazineMenuCard key={mag.id} magazine={mag} />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center py-10 text-center">
//                       <BookOpen size={32} className="text-gray-300 mb-3" />
//                       <p className="text-gray-400 text-sm italic">
//                         Aucune actualité disponible dans cette catégorie.
//                       </p>
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── MOBILE — trigger bar (< lg) ───────────────────────────────────── */}
//       <div className="lg:hidden w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40">
//         <div className="px-4 py-2 flex items-center justify-between">
//           <p className="text-[11px] font-bold text-[#001A4D] uppercase tracking-wider">Rubriques</p>
//           <button
//             onClick={() => setIsMobileDrawerOpen(true)}
//             className="flex items-center gap-1.5 bg-[#001A4D] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
//           >
//             <Menu size={14} />
//             Explorer
//           </button>
//         </div>
//       </div>

//       {/* ── MOBILE — drawer ───────────────────────────────────────────────── */}
//       {isMobileDrawerOpen && (
//         <>
//           <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={closeMobile} />

//           <div className="fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden">

//             {/* Header drawer */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#001A4D] shrink-0">
//               <p className="text-white font-bold text-sm uppercase tracking-widest">Rubriques</p>
//               <button onClick={closeMobile} className="text-white p-1">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Liste scrollable */}
//             <div className="overflow-y-auto flex-1">
//               {Object.entries(megaMenuData).map(([category, data]) => {
//                 const isExpanded = mobileExpandedCategory === category;
//                 const slug       = data.slug;
//                 const magazines  = magazinesMap[slug] ?? magazinesCache[slug] ?? [];
//                 const isLoadingM = loadingMagSlug === slug;

//                 return (
//                   <div key={category} className="border-b border-gray-100">

//                     {/* Ligne catégorie */}
//                     <button
//                       className="w-full flex items-center justify-between px-4 py-3.5 text-left"
//                       onClick={() => {
//                         const next = isExpanded ? null : category;
//                         setMobileExpandedCategory(next);
//                         if (next) dispatch({ type: 'SET_MENU', payload: next });
//                       }}
//                     >
//                       <span className="font-bold text-[12px] text-[#001A4D] uppercase tracking-wider">
//                         {category}
//                       </span>
//                       <ChevronRight
//                         size={16}
//                         className={`text-[#001A4D] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
//                       />
//                     </button>

//                     {/* Panneau expandé */}
//                     {isExpanded && (
//                       <div className="bg-gray-50 px-4 pb-5 pt-1">

//                         {/* Colonnes de liens */}
//                         {data.columns.map((col, idx) => (
//                           <div key={idx} className="mb-4">
//                             <p className="text-[#F39C12] font-extrabold text-[10px] uppercase tracking-tight mb-2">
//                               {col.title}
//                             </p>
//                             <ul className="space-y-2">
//                               {col.links.map((link) => (
//                                 <li key={link}>
//                                   <a
//                                     href="#"
//                                     className="flex items-center gap-1.5 text-gray-600 text-[12px] py-0.5"
//                                     onClick={closeMobile}
//                                   >
//                                     <ArrowRight size={10} className="text-[#F39C12] shrink-0" />
//                                     {link}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}

//                         <div className="border-t border-gray-200 my-3" />

//                         {/* En-tête actualités + lien "Voir tous" */}
//                         <div className="flex items-center justify-between mb-3">
//                           <p className="text-[#F39C12] font-extrabold text-[10px] uppercase tracking-tight flex items-center gap-1">
//                             <BookOpen size={10} />
//                             Actualités Récentes
//                           </p>
//                           <Link
//                             href={`/secteurs/${slug}`}
//                             className="text-[9px] font-bold text-[#001A4D] flex items-center gap-0.5"
//                             onClick={closeMobile}
//                           >
//                             Voir tous <ChevronRight size={10} />
//                           </Link>
//                         </div>

//                         {/* Contenu */}
//                         {isLoadingM ? (
//                           <div className="space-y-2">
//                             {[1, 2, 3].map((i) => (
//                               <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100">
//                                 <div className="w-12 h-12 rounded-md bg-gray-100 animate-pulse shrink-0" />
//                                 <div className="flex-1 space-y-1.5 py-1">
//                                   <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
//                                   <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : magazines.length === 0 ? (
//                           <p className="text-gray-400 text-[11px] italic">
//                             Aucune actualité disponible dans cette catégorie.
//                           </p>
//                         ) : (
//                           <div className="space-y-2">
//                             {magazines.slice(0, 4).map((mag) => (
//                               <div key={mag.id} onClick={closeMobile}>
//                                 <MagazineMiniCardMobile magazine={mag} />
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SubBar;
