"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, Clock, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
}

const NewsSection = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await api.get('/magazines/rss', {
          params: { pageSize: 6, page: 1 },
        });
        setMagazines(res.data?.data?.magazines ?? []);
      } catch (error) {
        console.error('Erreur NewsSection magazines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-it-orange" size={40} />
        <p className="text-it-blue font-medium text-sm uppercase tracking-widest">
          Chargement des magazines...
        </p>
      </div>
    );
  }

  if (magazines.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1300px] mx-auto px-6">
        <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
          Dernières Nouveautés
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {magazines.map((magazine) => (
            <Link
              href={`/magazine/${magazine.slug}`}
              key={magazine.id}
              className="group flex flex-col"
            >
              {/* Cover portrait */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-gray-100">
                <img
                  src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
                  alt={magazine.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {magazine.source}
                </span>
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#1A365D] leading-snug mb-3 group-hover:text-[#E67E22] transition-colors line-clamp-2">
                  {magazine.title}
                </h3>

                {magazine.excerpt && (
                  <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
                    {magazine.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
                  <Clock size={12} />
                  <span>
                    {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center text-[#E67E22] font-bold text-[11px] uppercase tracking-[0.15em] mt-auto">
                  Lire l'actualité
                  <ExternalLink size={12} className="ml-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/actualites"
            className="bg-[#001A4D] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E67E22] transition-colors shadow-sm"
          >
            Voir toutes les actualités
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

























// // src/components/home/NewsSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { ChevronRight, Loader2 } from 'lucide-react';
// import api from '@/lib/api';

// interface NewsArticle {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
//   author: {
//     id: number;
//     name: string;
//   };
// }

// const NewsSection = () => {
//   const [news, setNews] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const res = await api.get('/mag/articles', {
//           params: {
//             pageSize: 6,
//             page: 1,
//             status: 'PUBLISHED',
//             type: 'ARTICLE',   // ✅ uniquement les articles (pas les vidéos, salons, etc.)
//           },
//         });
//         setNews(res.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur NewsSection:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="text-it-blue font-medium text-sm uppercase tracking-widest">
//           Chargement des nouveautés...
//         </p>
//       </div>
//     );
//   }

//   if (news.length === 0) return null;

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-[1300px] mx-auto px-6">
//         <h2 className="text-center text-[#001A4D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
//           Dernières Nouveautés
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
//           {news.map((article) => (
//             <Link
//               href={`/actualites/${article.slug}`}
//               key={article.id}
//               className="group flex flex-col"
//             >
//               <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-6">
//                 <img
//                   src={article.coverImage || '/images/placeholder.jpg'}
//                   alt={article.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <span className="absolute top-3 left-3 bg-[#E67E22] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
//                   {article.category?.name || 'Actualité'}
//                 </span>
//               </div>

//               <div className="flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold text-[#1A365D] leading-snug mb-3 group-hover:text-[#E67E22] transition-colors line-clamp-2">
//                   {article.title}
//                 </h3>

//                 <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mb-4">
//                   {article.excerpt}
//                 </p>

//                 <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-4">
//                   <span>
//                     {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </span>
//                   <span>•</span>
//                   <span>Par {article.author?.name || 'Rédaction'}</span>
//                 </div>

//                 <div className="flex items-center text-[#E67E22] font-bold text-[11px] uppercase tracking-[0.15em] mt-auto">
//                   Lire l&apos;article
//                   <ChevronRight
//                     size={14}
//                     className="ml-1 group-hover:translate-x-1 transition-transform"
//                   />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="mt-16 flex justify-center">
//           <Link
//             href="/actualites"
//             className="bg-[#001A4D] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E67E22] transition-colors shadow-sm"
//           >
//             Voir toutes les actualités
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsSection;