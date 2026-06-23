// src/components/videos/VideoHeroSection.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Play, Calendar, Clock, Facebook, Twitter, Linkedin, MessageCircle, ExternalLink,
} from 'lucide-react';
import type { VideoArticle } from '@/lib/server-data';

interface VideoHeroSectionProps {
  /** Vidéo featured pré-fetchée côté serveur — plus aucun fetch client ici. */
  featuredVideo: VideoArticle | null;
}

// ─── Utilitaires URL ──────────────────────────────────────────────────────────

const toEmbedUrl = (raw: string): string => {
  if (!raw) return '';
  if (raw.includes('/embed/') || raw.includes('player.vimeo')) return raw;
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

// ─── Hook reveal ──────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);

  return { ref, visible };
}

// ─── Composant principal ──────────────────────────────────────────────────────

const VideoHeroSection = ({ featuredVideo }: VideoHeroSectionProps) => {
  const [playing, setPlaying] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);
  const { ref: cardRef, visible: cardVisible } = useReveal(0.05);

  // Les données arrivent pré-rendues — on déclenche juste l'animation d'entrée.
  useEffect(() => {
    const t = setTimeout(() => setHeadingVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!featuredVideo) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-white">
        <p className="text-gray-400 text-sm">Aucune vidéo disponible pour le moment.</p>
      </div>
    );
  }

  const getRawVideoUrl = (): string | null => {
    if (!featuredVideo.content) return featuredVideo.sourceUrl ?? null;
    const block = featuredVideo.content.find((b) => b.type === 'video');
    return block?.url ?? block?.value ?? featuredVideo.sourceUrl ?? null;
  };

  const rawUrl   = getRawVideoUrl();
  const embedUrl = rawUrl ? toEmbedUrl(rawUrl) : null;

  const handleShare = (platform: string) => {
    const url  = window.location.href;
    const text = featuredVideo.title;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <section className="bg-white py-10 sm:py-12 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Heading — fade+slide au montage ── */}
        <div
          className="text-center mb-8 sm:mb-10 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: '#B85C38' }}
          >
            — Contenus exclusifs
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight"
            style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
          >
            Vidéos &amp; <span style={{ color: '#1A5C43' }}>Web TV</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Reportages, Interviews &amp; Émissions</p>
        </div>

        {/* ── Carte vidéo — reveal à l'intersection ── */}
        <div
          ref={cardRef as React.RefCallback<HTMLDivElement>}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-700"
          style={{
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(32px)',
          }}
        >
          {/* Zone vidéo */}
          {playing && embedUrl ? (
            <div>
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`${embedUrl}?autoplay=1`}
                  title={featuredVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-center pb-2 pt-1">
                <a
                  href={getExternalLink(embedUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#B85C38] transition-colors py-1"
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
              {/* Thumbnail avec Ken Burns */}
              <img
                src={featuredVideo.coverImage || '/images/placeholder.jpg'}
                alt={featuredVideo.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10,35,20,0.92) 0%, rgba(10,35,20,0.3) 55%, transparent 100%)',
                }}
              />

              {/* Badge catégorie */}
              <span
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                style={{ background: 'rgba(184,92,56,0.9)' }}
              >
                <Play size={10} className="fill-current" />
                {featuredVideo.category.name}
              </span>

              {/* Bouton play */}
              {embedUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Halo pulsant */}
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background: 'rgba(184,92,56,0.4)',
                        transform: 'scale(1.5)',
                        animation: 'pulse-play 2s ease-in-out infinite',
                      }}
                    />
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: '#B85C38' }}
                    >
                      <Play size={28} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/60 text-sm tracking-wide">
                    Vidéo non disponible en lecture directe
                  </span>
                </div>
              )}

              {/* Titre superposé */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <p
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#C8A84B' }}
                >
                  <Calendar size={10} />
                  {new Date(featuredVideo.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <h2
                  className="text-white font-black text-base sm:text-xl md:text-2xl leading-snug line-clamp-2"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {featuredVideo.title}
                </h2>
                {embedUrl && (
                  <p className="text-white/50 text-xs mt-3 uppercase tracking-widest">
                    Cliquer pour lancer la vidéo
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Infos sous la vidéo ── */}
          <div className="p-5 sm:p-6 md:p-10 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: '#B85C38' }}
              >
                {featuredVideo.category.name}
              </span>
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(26,92,67,0.1)', color: '#1A5C43' }}
              >
                Vidéo
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl md:text-3xl font-black leading-tight"
              style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
            >
              {featuredVideo.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={15} style={{ color: '#C8A84B' }} />
                <span>
                  {new Date(featuredVideo.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              {rawUrl && (
                <div className="flex items-center gap-2">
                  <Clock size={15} style={{ color: '#C8A84B' }} />
                  <a
                    href={rawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#B85C38] transition-colors"
                  >
                    Voir sur YouTube
                  </a>
                </div>
              )}
            </div>

            {featuredVideo.excerpt && (
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-5xl">
                {featuredVideo.excerpt}
              </p>
            )}

            {/* Partage social */}
            <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                Partager :
              </span>
              <div className="flex gap-2 sm:gap-3">
                {[
                  { id: 'facebook', bg: '#3B5998', Icon: Facebook },
                  { id: 'twitter',  bg: '#000000', Icon: Twitter  },
                  { id: 'linkedin', bg: '#0077B5', Icon: Linkedin },
                  { id: 'whatsapp', bg: '#25D366', Icon: MessageCircle },
                ].map(({ id, bg, Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleShare(id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all hover:scale-110 active:scale-95"
                    style={{ background: bg }}
                    aria-label={`Partager sur ${id}`}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-play {
          0%, 100% { transform: scale(1.4); opacity: 0.3; }
          50%       { transform: scale(1.7); opacity: 0.1; }
        }
      `}</style>
    </section>
  );
};

export default VideoHeroSection;












// // src/components/videos/VideoHeroSection.tsx
// "use client";

// import React, { useEffect, useState, useCallback } from 'react';
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
//   content: Array<{ type: string; url?: string; value?: string }>;
//   category: { id: number; name: string };
// }

// const toEmbedUrl = (raw: string): string => {
//   if (!raw) return '';
//   if (raw.includes('/embed/') || raw.includes('player.vimeo')) return raw;
//   const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
//   if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
//   const ytWatch = raw.match(/[?&]v=([^?&]+)/);
//   if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
//   const vimeo = raw.match(/vimeo\.com\/(\d+)/);
//   if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
//   return raw;
// };

// const getExternalLink = (url: string): string => {
//   if (url.includes('youtube.com/embed/')) return url.replace('youtube.com/embed/', 'youtube.com/watch?v=');
//   if (url.includes('player.vimeo.com/video/')) return url.replace('player.vimeo.com/video/', 'vimeo.com/');
//   return url;
// };

// // ─── Hook reveal ──────────────────────────────────────────────────────────────

// function useReveal(threshold = 0.08) {
//   const [el, setEl] = useState<HTMLElement | null>(null);
//   const [visible, setVisible] = useState(false);
//   const ref = useCallback((node: HTMLElement | null) => setEl(node), []);

//   useEffect(() => {
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(true); return; }
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [el, threshold]);

//   return { ref, visible };
// }

// // ─── Composant ────────────────────────────────────────────────────────────────

// const VideoHeroSection = () => {
//   const [mainVideo, setMainVideo] = useState<VideoData | null>(null);
//   const [loading, setLoading]     = useState(true);
//   const [playing, setPlaying]     = useState(false);

//   const { ref: headingRef, visible: headingVisible } = useReveal(0.1);
//   const { ref: cardRef,    visible: cardVisible    } = useReveal(0.05);

//   useEffect(() => {
//     const fetchLatestVideo = async () => {
//       try {
//         const response = await api.get('/mag/articles', {
//           params: { type: 'VIDEO', featured: true, pageSize: 1, page: 1, status: 'PUBLISHED' },
//         });
//         let data: VideoData[] = response.data.data ?? [];
//         if (data.length === 0) {
//           const fallback = await api.get('/mag/articles', {
//             params: { type: 'VIDEO', pageSize: 1, page: 1, status: 'PUBLISHED' },
//           });
//           data = fallback.data.data ?? [];
//         }
//         setMainVideo(data[0] ?? null);
//       } catch (error) {
//         if (error instanceof AxiosError) console.error('Erreur chargement vidéo hero:', error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLatestVideo();
//   }, []);

//   const getRawVideoUrl = (): string | null => {
//     if (!mainVideo?.content) return mainVideo?.sourceUrl ?? null;
//     const block = mainVideo.content.find((b) => b.type === 'video');
//     return block?.url ?? block?.value ?? mainVideo.sourceUrl ?? null;
//   };

//   const handleShare = (platform: string) => {
//     const url  = window.location.href;
//     const text = mainVideo?.title ?? 'Regardez cette vidéo sur WAXEHO';
//     const shareUrls: Record<string, string> = {
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//       twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
//       linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
//       whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
//     };
//     if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=400');
//   };

//   if (loading) {
//     return (
//       <div className="py-12 px-5 sm:px-6">
//         <div className="max-w-6xl mx-auto">
//           {/* Heading skeleton */}
//           <div className="h-10 bg-gray-200 animate-pulse rounded-xl w-2/3 mx-auto mb-10" />
//           {/* Card skeleton */}
//           <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
//             <div className="aspect-video bg-gray-200 animate-pulse" />
//             <div className="p-6 md:p-10 space-y-4">
//               <div className="flex gap-2">
//                 <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
//                 <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
//               </div>
//               <div className="h-8 bg-gray-200 animate-pulse rounded-xl w-3/4" />
//               <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
//               <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
//             </div>
//           </div>
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
//     <section className="bg-white py-10 sm:py-12 px-5 sm:px-6">
//       <div className="max-w-6xl mx-auto">

//         {/* Heading */}
//         <div
//           ref={headingRef as React.RefCallback<HTMLDivElement>}
//           className="text-center mb-8 sm:mb-10 transition-all duration-700"
//           style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'translateY(0)' : 'translateY(24px)' }}
//         >
//           {/* Eyebrow */}
//           <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#B85C38' }}>
//             — Contenus exclusifs
//           </p>
//           <h1
//             className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight"
//             style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}
//           >
//             Vidéos &amp; <span style={{ color: '#1A5C43' }}>Web TV</span>
//           </h1>
//           <p className="text-gray-400 text-sm mt-2">Reportages, Interviews &amp; Émissions</p>
//         </div>

//         {/* Carte vidéo */}
//         <div
//           ref={cardRef as React.RefCallback<HTMLDivElement>}
//           className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-700"
//           style={{ opacity: cardVisible ? 1 : 0, transform: cardVisible ? 'translateY(0)' : 'translateY(32px)' }}
//         >
//           {/* Zone vidéo */}
//           {playing && embedUrl ? (
//             <div>
//               <div className="relative aspect-video bg-black">
//                 <iframe
//                   src={`${embedUrl}?autoplay=1`}
//                   title={mainVideo.title}
//                   className="absolute inset-0 w-full h-full"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               </div>
//               <div className="flex justify-center pb-2 pt-1">
//                 <a
//                   href={getExternalLink(embedUrl)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#B85C38] transition-colors py-1"
//                 >
//                   <ExternalLink size={14} />
//                   Regarder directement sur la plateforme
//                 </a>
//               </div>
//             </div>
//           ) : (
//             <div
//               className="relative aspect-video bg-[#0F172A] cursor-pointer group"
//               onClick={() => embedUrl && setPlaying(true)}
//             >
//               <img
//                 src={mainVideo.coverImage || '/images/placeholder.jpg'}
//                 alt={mainVideo.title}
//                 className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
//               />
//               <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

//               {/* Badge catégorie */}
//               <span
//                 className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
//                 style={{ background: 'rgba(184,92,56,0.9)' }}
//               >
//                 <Play size={10} className="fill-current" />
//                 {mainVideo.category.name}
//               </span>

//               {embedUrl ? (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div
//                     className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110"
//                     style={{ background: '#B85C38' }}
//                   >
//                     <Play size={28} fill="white" className="text-white ml-1" />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-white/60 text-sm font-light tracking-wide">Vidéo non disponible en lecture directe</span>
//                 </div>
//               )}

//               {/* Titre superposé sur l'image */}
//               <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
//                 <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#C8A84B' }}>
//                   <Calendar size={10} />
//                   {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
//                 </p>
//                 <h2 className="text-white font-bold text-base sm:text-xl md:text-2xl leading-snug line-clamp-2" style={{ letterSpacing: '-0.01em' }}>
//                   {mainVideo.title}
//                 </h2>
//                 {embedUrl && (
//                   <p className="text-white/50 text-xs mt-3 uppercase tracking-widest">
//                     Cliquer pour lancer la vidéo
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Infos */}
//           <div className="p-5 sm:p-6 md:p-10 space-y-4">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span
//                 className="text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
//                 style={{ background: '#B85C38' }}
//               >
//                 {mainVideo.category.name}
//               </span>
//               <span
//                 className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
//                 style={{ background: 'rgba(26,92,67,0.1)', color: '#1A5C43' }}
//               >
//                 Vidéo
//               </span>
//             </div>

//             <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#0D1A10', letterSpacing: '-0.01em' }}>
//               {mainVideo.title}
//             </h3>

//             <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
//               <div className="flex items-center gap-2">
//                 <Calendar size={15} style={{ color: '#C8A84B' }} />
//                 <span>{new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
//               </div>
//               {rawUrl && (
//                 <div className="flex items-center gap-2">
//                   <Clock size={15} style={{ color: '#C8A84B' }} />
//                   <a href={rawUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#B85C38] transition-colors">
//                     Voir sur YouTube
//                   </a>
//                 </div>
//               )}
//             </div>

//             {mainVideo.excerpt && (
//               <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-5xl">{mainVideo.excerpt}</p>
//             )}

//             {/* Partage social */}
//             <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
//               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Partager :</span>
//               <div className="flex gap-2 sm:gap-3">
//                 {[
//                   { id: 'facebook', bg: '#3B5998', Icon: Facebook      },
//                   { id: 'twitter',  bg: '#000000', Icon: Twitter       },
//                   { id: 'linkedin', bg: '#0077B5', Icon: Linkedin      },
//                   { id: 'whatsapp', bg: '#25D366', Icon: MessageCircle },
//                 ].map(({ id, bg, Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => handleShare(id)}
//                     style={{ backgroundColor: bg }}
//                     className="w-8 h-8 sm:p-2 text-white rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
//                     aria-label={`Partager sur ${id}`}
//                   >
//                     <Icon size={15} />
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