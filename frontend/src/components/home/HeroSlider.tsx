"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

const HeroSlider = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await api.get('/magazines/rss', {
          params: {
            pageSize: 5,
            page: 1,
          },
        });
        setMagazines(res.data?.data?.magazines ?? []);
      } catch (error) {
        console.error('Erreur HeroSlider magazines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  if (loading) {
    return (
      <div className="h-[550px] w-full bg-it-blue flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-it-orange" size={40} />
        <p className="animate-pulse">Chargement des magazines...</p>
      </div>
    );
  }

  if (magazines.length === 0) {
    return (
      <div className="h-[550px] w-full bg-it-blue flex items-center justify-center text-white">
        <p>Aucun magazine disponible pour le moment</p>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[550px] bg-it-blue">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-full"
      >
        {magazines.map((magazine) => (
          <SwiperSlide key={magazine.id}>
            <div className="relative w-full h-full">
              <img
                src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
                className="absolute inset-0 w-full h-full object-cover"
                alt={magazine.title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-it-blue/90 via-it-blue/40 to-transparent" />

              <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex flex-col justify-center items-start">
                <span className="bg-it-orange text-it-blue px-4 py-1 rounded-sm text-xs font-bold uppercase mb-4">
                  {magazine.source}
                </span>

                <h1 className="text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6 drop-shadow-lg">
                  {magazine.title}
                </h1>

                {magazine.excerpt && (
                  <p className="text-gray-200 text-lg max-w-2xl mb-8 line-clamp-2">
                    {magazine.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6">
                  <Link
                    href={`/magazine/${magazine.slug}`}
                    className="bg-white text-it-blue hover:bg-it-orange hover:text-white px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 group"
                  >
                    Lire l'actualité
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Clock size={16} />
                    <span>
                      Publié le{' '}
                      {new Date(magazine.publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 30px !important;
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        .hero-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-bullet-active {
          background: #FF9900 !important;
          width: 35px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;



















// // src/components/home/HeroSlider.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import { Clock, ArrowRight, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import api from '@/lib/api';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// interface Article {
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
// }

// const HeroSlider = () => {
//   const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       try {
//         // ✅ Endpoint correct : Articles featured (mis en avant)
//         const res = await api.get('/mag/articles', {
//           params: {
//             featured: true,
//             pageSize: 3,
//             status: 'PUBLISHED'
//           }
//         });
        
//         setFeaturedArticles(res.data.data);
//       } catch (error) {
//         console.error("Erreur Hero:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeatured();
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex flex-col items-center justify-center text-white gap-4">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="animate-pulse">Chargement de l&apos;actualité...</p>
//       </div>
//     );
//   }

//   if (featuredArticles.length === 0) {
//     return (
//       <div className="h-[550px] w-full bg-it-blue flex items-center justify-center text-white">
//         <p>Aucun article à la une pour le moment</p>
//       </div>
//     );
//   }

//   return (
//     <section className="relative w-full h-[550px] bg-it-blue">
//       <Swiper
//         modules={[Pagination, Autoplay, EffectFade]}
//         effect="fade"
//         pagination={{ 
//           clickable: true, 
//           bulletClass: 'hero-bullet', 
//           bulletActiveClass: 'hero-bullet-active' 
//         }}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         className="h-full"
//       >
//         {featuredArticles.map((article) => (
//           <SwiperSlide key={article.id}>
//             <div className="relative w-full h-full">
//               <img 
//                 src={article.coverImage} 
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt={article.title}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-it-blue/90 via-it-blue/40 to-transparent"></div>

//               <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8 flex flex-col justify-center items-start">
//                 <span className="bg-it-orange text-it-blue px-4 py-1 rounded-sm text-xs font-bold uppercase mb-4">
//                   À la une : {article.category.name}
//                 </span>
                
//                 <h1 className="text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight mb-6 drop-shadow-lg">
//                   {article.title}
//                 </h1>

//                 <p className="text-gray-200 text-lg max-w-2xl mb-8 line-clamp-2">
//                   {article.excerpt}
//                 </p>

//                 <div className="flex items-center gap-6">
//                   <Link 
//                     href={`/actualites/${article.slug}`}
//                     className="bg-white text-it-blue hover:bg-it-orange hover:text-white px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 group"
//                   >
//                     Lire l&apos;article 
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                   <div className="flex items-center gap-2 text-white/80 text-sm">
//                     <Clock size={16} />
//                     <span>Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <style jsx global>{`
//         .swiper-pagination {
//           bottom: 30px !important;
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//         }
//         .hero-bullet {
//           width: 12px;
//           height: 12px;
//           background: rgba(255, 255, 255, 0.4);
//           border-radius: 50%;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .hero-bullet-active {
//           background: #FF9900 !important;
//           width: 35px;
//           border-radius: 10px;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSlider;