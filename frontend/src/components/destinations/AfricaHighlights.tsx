// src/components/destinations/AfricaHighlights.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface Highlight {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category?: {
    name: string;
  };
}

const AfricaHighlights = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await api.get('/destinations/featured', {
          params: { limit: 6, region: 'AFRIQUE' },
        });
        setHighlights(response.data.data || response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erreur lors du chargement des coups de cœur:", error.message);
        }
        setHighlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 3));
  const handleNext = () => setCurrentIndex((prev) => Math.min(highlights.length - 3, prev + 3));

  const visibleHighlights = highlights.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + 3 < highlights.length;

  if (loading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-it-terracotta" size={40} />
        </div>
      </section>
    );
  }

  if (highlights.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-it-blue uppercase tracking-[0.15em]">
            Nos coups de cœur Afrique
          </h2>

          {highlights.length > 3 && (
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-it-emerald-dark hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-it-emerald-dark hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleHighlights.map((item) => (
            <div
              key={item.id}
              className="bg-[#F9F9F7] rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] group transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.category && (
                  <div className="absolute top-4 left-4 bg-it-terracotta text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    {item.category.name}
                  </div>
                )}
              </div>

              <div className="p-8 space-y-4">
                <h3 className="text-xl font-serif font-bold text-it-blue leading-snug group-hover:text-it-emerald-dark transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
                <Link
                  href={`/actualites/${item.slug}`}
                  className="inline-flex items-center gap-2 text-it-terracotta font-bold text-xs uppercase tracking-widest pt-2 group/link"
                >
                  Lire le dossier
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AfricaHighlights;















// // src/components/destinations/AfricaHighlights.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface Highlight {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   category?: {
//     name: string;
//   };
// }

// const AfricaHighlights = () => {
//   const [highlights, setHighlights] = useState<Highlight[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchHighlights = async () => {
//       try {
//         setLoading(true);
        
//         // ✅ Endpoint : Destinations coup de cœur Afrique
//         const response = await api.get('/destinations/featured', {
//           params: {
//             limit: 6,
//             region: 'AFRIQUE'
//             // OU utiliser /mag/articles avec categorySlug: 'destinations-afrique'
//           }
//         });
        
//         setHighlights(response.data.data || response.data);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error("Erreur lors du chargement des coups de cœur:", error.message);
//         }
//         // En cas d'erreur, afficher quand même quelque chose
//         setHighlights([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHighlights();
//   }, []);

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => Math.max(0, prev - 3));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => Math.min(highlights.length - 3, prev + 3));
//   };

//   const visibleHighlights = highlights.slice(currentIndex, currentIndex + 3);
//   const canGoPrevious = currentIndex > 0;
//   const canGoNext = currentIndex + 3 < highlights.length;

//   if (loading) {
//     return (
//       <section className="py-20 px-6 bg-white">
//         <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
//           <Loader2 className="animate-spin text-[#F19300]" size={40} />
//         </div>
//       </section>
//     );
//   }

//   if (highlights.length === 0) {
//     return null; // Ne rien afficher si pas de résultats
//   }

//   return (
//     <section className="py-20 px-6 bg-white">
//       <div className="max-w-7xl mx-auto">
        
//         {/* HEADER DE SECTION AVEC PAGINATION */}
//         <div className="flex justify-between items-center mb-12">
//           <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2D3E50] uppercase tracking-[0.15em]">
//             Nos coups de cœur Afrique
//           </h2>
          
//           {highlights.length > 3 && (
//             <div className="flex gap-3">
//               <button 
//                 onClick={handlePrevious}
//                 disabled={!canGoPrevious}
//                 className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-[#1D3A8A] hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button 
//                 onClick={handleNext}
//                 disabled={!canGoNext}
//                 className="p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-[#1D3A8A] hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* GRILLE DES DOSSIERS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {visibleHighlights.map((item) => (
//             <div 
//               key={item.id} 
//               className="bg-[#F9F9F7] rounded-2xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] group transition-all duration-300 hover:shadow-2xl"
//             >
//               {/* Image avec Tag */}
//               <div className="relative h-64 w-full">
//                 <Image
//                   src={item.coverImage}
//                   alt={item.title}
//                   fill
//                   className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 {item.category && (
//                   <div className="absolute top-4 left-4 bg-[#F19300] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
//                     {item.category.name}
//                   </div>
//                 )}
//               </div>

//               {/* Contenu */}
//               <div className="p-8 space-y-4">
//                 <h3 className="text-xl font-serif font-bold text-[#2D3E50] leading-snug group-hover:text-[#1D3A8A] transition-colors line-clamp-2">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
//                   {item.excerpt}
//                 </p>
                
//                 <Link 
//                   href={`/actualites/${item.slug}`}
//                   className="inline-flex items-center gap-2 text-[#F19300] font-bold text-xs uppercase tracking-widest pt-2 group/link"
//                 >
//                   Lire le dossier
//                   <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default AfricaHighlights;