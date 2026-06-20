// src/components/videos/VideoHeroSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  Play, Calendar, Clock, Facebook, Twitter, Linkedin, MessageCircle, Loader2, ExternalLink,
} from 'lucide-react';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface VideoData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  sourceUrl?: string | null;
  content: Array<{ type: string; url?: string; value?: string }>;
  category: { id: number; name: string };
}

const toEmbedUrl = (raw: string): string => {
  if (!raw) return "";
  if (raw.includes("/embed/") || raw.includes("player.vimeo")) return raw;
  const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytWatch = raw.match(/[?&]v=([^?&]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const vimeo = raw.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return raw;
};

const getExternalLink = (url: string): string => {
  if (url.includes('youtube.com/embed/'))
    return url.replace('youtube.com/embed/', 'youtube.com/watch?v=');
  if (url.includes('player.vimeo.com/video/'))
    return url.replace('player.vimeo.com/video/', 'vimeo.com/');
  return url;
};

const VideoHeroSection = () => {
  const [mainVideo, setMainVideo] = useState<VideoData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [playing, setPlaying]     = useState(false);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await api.get('/mag/articles', {
          params: { type: 'VIDEO', featured: true, pageSize: 1, page: 1, status: 'PUBLISHED' },
        });
        let data: VideoData[] = response.data.data ?? [];
        if (data.length === 0) {
          const fallback = await api.get('/mag/articles', {
            params: { type: 'VIDEO', pageSize: 1, page: 1, status: 'PUBLISHED' },
          });
          data = fallback.data.data ?? [];
        }
        setMainVideo(data[0] ?? null);
      } catch (error) {
        if (error instanceof AxiosError)
          console.error('Erreur chargement vidéo hero:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestVideo();
  }, []);

  const getRawVideoUrl = (): string | null => {
    if (!mainVideo?.content) return mainVideo?.sourceUrl ?? null;
    const block = mainVideo.content.find((b) => b.type === 'video');
    return block?.url ?? block?.value ?? mainVideo.sourceUrl ?? null;
  };

  const handleShare = (platform: string) => {
    const url  = window.location.href;
    const text = mainVideo?.title ?? 'Regardez cette vidéo sur WAXEHO';
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-it-terracotta mx-auto" size={40} />
          <p className="text-gray-500 text-sm">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (!mainVideo) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-white">
        <p className="text-gray-500">Aucune vidéo disponible pour le moment.</p>
      </div>
    );
  }

  const rawUrl   = getRawVideoUrl();
  const embedUrl = rawUrl ? toEmbedUrl(rawUrl) : null;

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-it-blue text-center uppercase tracking-tight mb-10 leading-tight">
          Vidéos et Web TV : Reportages, Interviews,{' '}
          <br className="hidden md:block" /> Émissions
        </h1>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Zone vidéo */}
          <div className="space-y-0">
            {playing && embedUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`${embedUrl}?autoplay=1`}
                    title={mainVideo.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex justify-center pb-2">
                  <a
                    href={getExternalLink(embedUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-it-terracotta transition-colors duration-200 py-1"
                  >
                    <ExternalLink size={14} />
                    Regarder directement sur la plateforme
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="relative aspect-video bg-[#0F172A] cursor-pointer group"
                onClick={() => embedUrl && setPlaying(true)}
              >
                <img
                  src={mainVideo.coverImage || '/images/placeholder.jpg'}
                  alt={mainVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {embedUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-it-terracotta rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      <Play size={34} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 text-sm font-light tracking-wide">
                      Vidéo non disponible en lecture directe
                    </span>
                  </div>
                )}

                <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-xs tracking-widest uppercase">
                  {embedUrl ? 'Cliquer pour lancer la vidéo' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="p-6 md:p-10 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-it-terracotta text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                {mainVideo.category.name}
              </span>
              <span className="bg-it-emerald-light text-it-emerald-dark text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                Vidéo
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-it-blue leading-tight">
              {mainVideo.title}
            </h2>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-it-gold" />
                <span>
                  {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              {rawUrl && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-it-gold" />
                  <a
                    href={rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-it-terracotta transition-colors"
                  >
                    Voir sur YouTube
                  </a>
                </div>
              )}
            </div>

            {mainVideo.excerpt && (
              <p className="text-gray-600 leading-relaxed max-w-5xl">{mainVideo.excerpt}</p>
            )}

            {/* Partage social */}
            <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Partager :
              </span>
              <div className="flex gap-3">
                {[
                  { id: 'facebook', bg: '#3B5998', Icon: Facebook      },
                  { id: 'twitter',  bg: '#000000', Icon: Twitter       },
                  { id: 'linkedin', bg: '#0077B5', Icon: Linkedin      },
                  { id: 'whatsapp', bg: '#25D366', Icon: MessageCircle },
                ].map(({ id, bg, Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleShare(id)}
                    style={{ backgroundColor: bg }}
                    className="p-2 text-white rounded-full hover:opacity-80 transition-opacity"
                    aria-label={`Partager sur ${id}`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoHeroSection;



















// // src/components/videos/VideoHeroSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import {
//   Play, Calendar, Clock, Facebook, Twitter, Linkedin, MessageCircle, Loader2, ExternalLink,
// } from 'lucide-react';
// import { AxiosError } from 'axios';
// import api from '@/lib/api';

// interface VideoData {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   sourceUrl?: string | null;
//   content: Array<{
//     type: string;
//     url?: string;
//     value?: string;
//   }>;
//   category: {
//     id: number;
//     name: string;
//   };
// }

// // ── Convertit n'importe quelle URL YouTube/Vimeo en URL embed ─────────────────
// const toEmbedUrl = (raw: string): string => {
//   if (!raw) return "";
//   if (raw.includes("/embed/") || raw.includes("player.vimeo")) return raw;
//   const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
//   if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
//   const ytWatch = raw.match(/[?&]v=([^?&]+)/);
//   if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
//   const vimeo = raw.match(/vimeo\.com\/(\d+)/);
//   if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
//   return raw;
// };

// // ── Reconstruit le lien externe depuis l'URL embed ────────────────────────────
// const getExternalLink = (url: string): string => {
//   if (url.includes('youtube.com/embed/')) {
//     return url.replace('youtube.com/embed/', 'youtube.com/watch?v=');
//   }
//   if (url.includes('player.vimeo.com/video/')) {
//     return url.replace('player.vimeo.com/video/', 'vimeo.com/');
//   }
//   return url;
// };

// const VideoHeroSection = () => {
//   const [mainVideo, setMainVideo] = useState<VideoData | null>(null);
//   const [loading, setLoading]     = useState(true);
//   const [playing, setPlaying]     = useState(false);

//   useEffect(() => {
//     const fetchLatestVideo = async () => {
//       try {
//         const response = await api.get('/mag/articles', {
//           params: {
//             type: 'VIDEO',
//             featured: true,
//             pageSize: 1,
//             page: 1,
//             status: 'PUBLISHED',
//           },
//         });

//         let data: VideoData[] = response.data.data ?? [];

//         if (data.length === 0) {
//           const fallback = await api.get('/mag/articles', {
//             params: {
//               type: 'VIDEO',
//               pageSize: 1,
//               page: 1,
//               status: 'PUBLISHED',
//             },
//           });
//           data = fallback.data.data ?? [];
//         }

//         setMainVideo(data[0] ?? null);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error('Erreur chargement vidéo hero:', error.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLatestVideo();
//   }, []);

//   // Extrait l'URL brute depuis les blocs de contenu ou sourceUrl
//   const getRawVideoUrl = (): string | null => {
//     if (!mainVideo?.content) return mainVideo?.sourceUrl ?? null;
//     const block = mainVideo.content.find((b) => b.type === 'video');
//     return block?.url ?? block?.value ?? mainVideo.sourceUrl ?? null;
//   };

//   // Partage social
//   const handleShare = (platform: string) => {
//     const url  = window.location.href;
//     const text = mainVideo?.title ?? 'Regardez cette vidéo sur WAXEHO';
//     const shareUrls: Record<string, string> = {
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//       twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
//       linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
//       whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
//     };
//     if (shareUrls[platform]) {
//       window.open(shareUrls[platform], '_blank', 'width=600,height=400');
//     }
//   };

//   // ── États de chargement / vide ─────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="h-[600px] flex items-center justify-center bg-white">
//         <div className="text-center space-y-4">
//           <Loader2 className="animate-spin text-[#F19300] mx-auto" size={40} />
//           <p className="text-gray-500 text-sm">Chargement de la vidéo...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!mainVideo) {
//     return (
//       <div className="h-[400px] flex items-center justify-center bg-white">
//         <p className="text-gray-500">Aucune vidéo disponible pour le moment.</p>
//       </div>
//     );
//   }

//   const rawUrl   = getRawVideoUrl();
//   const embedUrl = rawUrl ? toEmbedUrl(rawUrl) : null;

//   return (
//     <section className="bg-white py-12 px-6">
//       <div className="max-w-6xl mx-auto">

//         {/* Titre de section */}
//         <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#163066] text-center uppercase tracking-tight mb-10 leading-tight">
//           Vidéos et Web TV : Reportages, Interviews,{' '}
//           <br className="hidden md:block" /> Émissions
//         </h1>

//         {/* Player card */}
//         <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">

//           {/* ── Zone vidéo : thumbnail → iframe au clic ── */}
//           <div className="space-y-0">
//             {playing && embedUrl ? (
//               /* ── Lecteur intégré après clic ── */
//               <div className="space-y-3">
//                 <div className="relative aspect-video bg-black">
//                   <iframe
//                     src={`${embedUrl}?autoplay=1`}
//                     title={mainVideo.title}
//                     className="absolute inset-0 w-full h-full"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   />
//                 </div>
//                 <div className="flex justify-center pb-2">
//                   <a
//                     href={getExternalLink(embedUrl)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F19300] transition-colors duration-200 py-1"
//                   >
//                     <ExternalLink size={14} />
//                     Regarder directement sur la plateforme
//                   </a>
//                 </div>
//               </div>
//             ) : (
//               /* ── Thumbnail + bouton play ── */
//               <div
//                 className="relative aspect-video bg-[#0F172A] cursor-pointer group"
//                 onClick={() => embedUrl && setPlaying(true)}
//               >
//                 <img
//                   src={mainVideo.coverImage || '/images/placeholder.jpg'}
//                   alt={mainVideo.title}
//                   className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//                 {embedUrl ? (
//                   /* Bouton play si vidéo disponible */
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-20 h-20 bg-[#F19300] rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
//                       <Play size={34} fill="white" className="text-white ml-1" />
//                     </div>
//                   </div>
//                 ) : (
//                   /* Message si pas d'URL disponible */
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-white/60 text-sm font-light tracking-wide">
//                       Vidéo non disponible en lecture directe
//                     </span>
//                   </div>
//                 )}

//                 <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-xs tracking-widest uppercase">
//                   {embedUrl ? 'Cliquer pour lancer la vidéo' : ''}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Infos */}
//           <div className="p-6 md:p-10 space-y-4">
//             <div className="flex items-center gap-3 flex-wrap">
//               <span className="bg-[#F19300] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
//                 {mainVideo.category.name}
//               </span>
//               <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
//                 Vidéo
//               </span>
//             </div>

//             <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#163066] leading-tight">
//               {mainVideo.title}
//             </h2>

//             {/* Méta-données */}
//             <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-[#F19300]" />
//                 <span>
//                   {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
//                     day: 'numeric', month: 'long', year: 'numeric',
//                   })}
//                 </span>
//               </div>
//               {rawUrl && (
//                 <div className="flex items-center gap-2">
//                   <Clock size={16} className="text-[#F19300]" />
//                   <a
//                     href={rawUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline hover:text-[#F19300] transition-colors"
//                   >
//                     Voir sur YouTube
//                   </a>
//                 </div>
//               )}
//             </div>

//             {mainVideo.excerpt && (
//               <p className="text-gray-600 leading-relaxed max-w-5xl">{mainVideo.excerpt}</p>
//             )}

//             {/* Partage social */}
//             <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
//               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//                 Partager :
//               </span>
//               <div className="flex gap-3">
//                 {[
//                   { id: 'facebook', bg: '#3B5998', Icon: Facebook },
//                   { id: 'twitter',  bg: '#000000', Icon: Twitter  },
//                   { id: 'linkedin', bg: '#0077B5', Icon: Linkedin },
//                   { id: 'whatsapp', bg: '#25D366', Icon: MessageCircle },
//                 ].map(({ id, bg, Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => handleShare(id)}
//                     style={{ backgroundColor: bg }}
//                     className="p-2 text-white rounded-full hover:opacity-80 transition-opacity"
//                     aria-label={`Partager sur ${id}`}
//                   >
//                     <Icon size={18} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default VideoHeroSection;