"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface VideoArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  content: Array<{ type: string; url?: string }>;
  category: { id: number; name: string; slug: string };
}

// ─── Hook reveal ─────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Bouton Play ──────────────────────────────────────────────────────────────

function PlayButton({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const dim = size === 'lg' ? 80 : 44;
  const iconSize = size === 'lg' ? 32 : 18;
  return (
    <div
      className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
      style={{
        width: dim,
        height: dim,
        background: '#B85C38',
        boxShadow: '0 8px 32px rgba(184,92,56,0.4)',
      }}
    >
      <Play size={iconSize} fill="white" className="text-white ml-1" />
    </div>
  );
}

// ─── Carte vidéo principale ───────────────────────────────────────────────────

function MainVideoCard({ video }: { video: VideoArticle }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="lg:col-span-2 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)' }}
    >
      <Link
        href={`/videos/${video.slug}`}
        className="group relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16/10' }}
      >
        <img
          src={video.coverImage || '/images/placeholder.jpg'}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay layers */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 50%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)' }} />

        {/* Badge catégorie */}
        <span
          className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ background: '#B85C38' }}
        >
          {video.category?.name ?? 'Vidéo'}
        </span>

        {/* Play button centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-0 transition-opacity"
              style={{ background: 'rgba(184,92,56,0.4)', transform: 'scale(1.5)', animation: 'pulse 2s ease-in-out infinite' }}
            />
            <PlayButton size="lg" />
          </div>
        </div>

        {/* Info bas */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h3 className="text-white font-black text-xl md:text-2xl leading-snug line-clamp-2 mb-2 group-hover:text-[#C8A84B] transition-colors">
            {video.title}
          </h3>
          <p className="text-white/60 text-sm">
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Badge durée / type */}
        <span className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
          ▶ VIDÉO
        </span>
      </Link>
    </div>
  );
}

// ─── Carte vidéo secondaire ───────────────────────────────────────────────────

function SideVideoCard({ video, delay = 0 }: { video: VideoArticle; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(20px)' }}
    >
      <Link href={`/videos/${video.slug}`} className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-[#F0FAF5] transition-colors">
        {/* Miniature */}
        <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-900">
          <img
            src={video.coverImage || '/images/placeholder.jpg'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton size="sm" />
          </div>
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B85C38' }}>
            {video.category?.name}
          </span>
          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mt-0.5 group-hover:text-[#1A5C43] transition-colors leading-snug">
            {video.title}
          </h4>
          <p className="text-[11px] text-gray-400 mt-1.5">
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </Link>
    </div>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────

const VideoSection = () => {
  const [videos, setVideos] = useState<VideoArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headingRef, visible: headingVisible } = useReveal();

  useEffect(() => {
    api.get('/mag/articles', { params: { pageSize: 4, page: 1, status: 'PUBLISHED', type: 'VIDEO' } })
      .then((res) => setVideos(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4" style={{ background: '#F7F9F8' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#1A5C43' }} />
        <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 animate-pulse">Chargement des vidéos…</p>
      </div>
    );
  }
  if (!videos.length) return null;

  const main = videos[0];
  const sides = videos.slice(1, 4);

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: '#F7F9F8' }}>
      <div className="max-w-[1300px] mx-auto px-6">

        {/* Heading */}
        <div
          ref={headingRef}
          className="flex items-end justify-between mb-14 transition-all duration-700"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? 'none' : 'translateY(20px)' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#B85C38' }}>
              — Vidéothèque
            </p>
            <h2 className="text-3xl md:text-5xl font-black leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
              Vidéos &<br />
              <span style={{ color: '#1A5C43' }}>Reportages</span>
            </h2>
          </div>

          <Link
            href="/videos"
            className="hidden md:inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white transition-all hover:shadow-lg active:scale-95"
            style={{ background: '#1A5C43' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
          >
            Web TV <ArrowRight size={14} />
          </Link>
        </div>

        {/* Layout vidéo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <MainVideoCard video={main} />

          {/* Sidebar vidéos */}
          <div className="flex flex-col justify-between gap-2">
            {sides.map((video, i) => (
              <SideVideoCard key={video.id} video={video} delay={i * 80 + 100} />
            ))}
          </div>
        </div>

        {/* CTA mobile */}
        <div className="flex justify-center md:hidden">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white"
            style={{ background: '#1A5C43' }}
          >
            Accéder à la Web TV <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1.4); opacity: 0.3; }
          50% { transform: scale(1.7); opacity: 0.1; }
        }
      `}</style>
    </section>
  );
};

export default VideoSection;












// // src/components/home/VideoSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Play, ArrowRight, Loader2 } from 'lucide-react';
// import api from '@/lib/api';

// interface VideoArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   content: Array<{
//     type: string;
//     url?: string;
//     value?: string;
//   }>;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// }

// const VideoSection = () => {
//   const [videos, setVideos] = useState<VideoArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await api.get('/mag/articles', {
//           params: { pageSize: 3, page: 1, status: 'PUBLISHED', type: 'VIDEO' },
//         });
//         setVideos(res.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur VideoSection:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideos();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 bg-[#F8FAFC] flex flex-col items-center justify-center gap-4" style={{ color: '#001A4D' }}>
//         <Loader2 size={40} className="animate-spin" style={{ color: '#B85C38' }} />
//         <p className="animate-pulse text-sm font-bold uppercase tracking-widest">Chargement...</p>
//       </div>
//     );
//   }

//   if (videos.length === 0) return null;

//   const mainVideo  = videos[0];
//   const sideVideos = videos.slice(1, 3);

//   const getVideoUrl = (article: VideoArticle): string | null => {
//     const block = article.content?.find((b) => b.type === 'video');
//     return block?.url ?? null;
//   };

//   return (
//     <section className="py-16 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-6">

//         <h2
//           className="text-center text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12"
//           style={{ color: '#001A4D' }}
//         >
//           Vidéos et Reportages
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

//           {/* ── Vidéo principale ── */}
//           <Link
//             href={`/videos/${mainVideo.slug}`}
//             className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-black"
//           >
//             <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
//               <img
//                 src={mainVideo.coverImage || '/images/placeholder.jpg'}
//                 alt={mainVideo.title}
//                 className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

//               {/* Bouton play — terre cuite */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-24 h-24 rounded-full flex items-center justify-center border-4" style={{ background: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(4px)' }}>
//                   <div
//                     className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
//                     style={{ background: '#B85C38' }}
//                   >
//                     <Play size={32} fill="white" className="text-white ml-1" />
//                   </div>
//                 </div>
//               </div>

//               {/* Badge catégorie — terre cuite */}
//               <span
//                 className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider"
//                 style={{ background: '#B85C38' }}
//               >
//                 {mainVideo.category?.name ?? 'Vidéo'}
//               </span>

//               <div className="absolute bottom-0 left-0 p-8 w-full text-white">
//                 <h3 className="text-2xl font-bold mb-2 line-clamp-2">{mainVideo.title}</h3>
//                 <p className="text-sm uppercase tracking-widest" style={{ opacity: 0.7 }}>
//                   {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
//                     day: 'numeric', month: 'long', year: 'numeric',
//                   })}
//                 </p>
//               </div>
//             </div>
//           </Link>

//           {/* ── 2 Vidéos secondaires ── */}
//           <div className="flex flex-col gap-4">
//             {sideVideos.map((video) => (
//               <Link
//                 href={`/videos/${video.slug}`}
//                 key={video.id}
//                 className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   <img
//                     src={video.coverImage || '/images/placeholder.jpg'}
//                     alt={video.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/25">
//                     {/* Bouton play secondaire — terre cuite */}
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center"
//                       style={{ background: '#B85C38' }}
//                     >
//                       <Play size={16} fill="white" className="text-white ml-0.5" />
//                     </div>
//                   </div>
//                   {getVideoUrl(video) && (
//                     <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
//                       ▶ VIDÉO
//                     </span>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   {/* Titre hover — or doux */}
//                   <h4
//                     className="font-bold text-sm line-clamp-2 transition-colors"
//                     style={{ color: '#001A4D' }}
//                     onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                     onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
//                   >
//                     {video.title}
//                   </h4>
//                   <span className="text-xs text-gray-400 mt-1 block">
//                     {new Date(video.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric', month: 'short', year: 'numeric',
//                     })}
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-center">
//           {/* Bouton "Web TV" — bordure émeraude, hover émeraude clair */}
//           <Link
//             href="/videos"
//             className="group flex items-center gap-2 bg-white px-8 py-3 rounded-lg font-bold text-sm shadow-sm transition-all"
//             style={{ border: '1px solid #2A7F5F', color: '#1A5C43' }}
//             onMouseEnter={e => {
//               e.currentTarget.style.background = '#D4EDE5';
//             }}
//             onMouseLeave={e => {
//               e.currentTarget.style.background = '#ffffff';
//             }}
//           >
//             Accéder à la Web TV
//             <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default VideoSection;




















// // src/components/home/VideoSection.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Play, ArrowRight, Loader2 } from 'lucide-react';
// import api from '@/lib/api';

// interface VideoArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   content: Array<{
//     type: string;
//     url?: string;
//     value?: string;
//   }>;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// }

// const VideoSection = () => {
//   const [videos, setVideos] = useState<VideoArticle[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await api.get('/mag/articles', {
//           params: {
//             pageSize: 3,          // ✅ 1 principale + 2 secondaires
//             page: 1,
//             status: 'PUBLISHED',
//             type: 'VIDEO',
//           },
//         });
//         setVideos(res.data.data ?? []);
//       } catch (error) {
//         console.error('Erreur VideoSection:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVideos();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 text-[#001A4D]">
//         <Loader2 className="animate-spin text-it-orange" size={40} />
//         <p className="animate-pulse text-sm font-bold uppercase tracking-widest">Chargement...</p>
//       </div>
//     );
//   }

//   if (videos.length === 0) return null;

//   const mainVideo  = videos[0];
//   const sideVideos = videos.slice(1, 3); // ✅ 2 vidéos secondaires

//   const getVideoUrl = (article: VideoArticle): string | null => {
//     const block = article.content?.find((b) => b.type === 'video');
//     return block?.url ?? null;
//   };

//   return (
//     <section className="py-16 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-6">

//         <h2 className="text-center text-[#1A365D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
//           Vidéos et Reportages
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

//           {/* ── Vidéo principale ── */}
//           <Link
//             href={`/videos/${mainVideo.slug}`}
//             className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-black"
//           >
//             <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
//               <img
//                 src={mainVideo.coverImage || '/images/placeholder.jpg'}
//                 alt={mainVideo.title}
//                 className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50">
//                   <div className="w-16 h-16 bg-[#F39C12] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
//                     <Play size={32} fill="white" className="text-white ml-1" />
//                   </div>
//                 </div>
//               </div>

//               <span className="absolute top-4 left-4 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
//                 {mainVideo.category?.name ?? 'Vidéo'}
//               </span>

//               <div className="absolute bottom-0 left-0 p-8 w-full text-white">
//                 <h3 className="text-2xl font-bold mb-2 line-clamp-2">{mainVideo.title}</h3>
//                 <p className="text-sm opacity-70 uppercase tracking-widest">
//                   {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
//                     day: 'numeric', month: 'long', year: 'numeric',
//                   })}
//                 </p>
//               </div>
//             </div>
//           </Link>

//           {/* ── 2 Vidéos secondaires ── */}
//           <div className="flex flex-col gap-4">
//             {sideVideos.map((video) => (
//               <Link
//                 href={`/videos/${video.slug}`}
//                 key={video.id}
//                 className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   <img
//                     src={video.coverImage || '/images/placeholder.jpg'}
//                     alt={video.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/25">
//                     <div className="w-10 h-10 bg-[#F39C12] rounded-full flex items-center justify-center">
//                       <Play size={16} fill="white" className="text-white ml-0.5" />
//                     </div>
//                   </div>
//                   {getVideoUrl(video) && (
//                     <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
//                       ▶ VIDÉO
//                     </span>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <h4 className="font-bold text-[#1A365D] text-sm line-clamp-2 group-hover:text-[#F39C12] transition-colors">
//                     {video.title}
//                   </h4>
//                   <span className="text-xs text-gray-400 mt-1 block">
//                     {new Date(video.createdAt).toLocaleDateString('fr-FR', {
//                       day: 'numeric', month: 'short', year: 'numeric',
//                     })}
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-center">
//           <Link
//             href="/videos"
//             className="flex items-center gap-2 bg-white border border-gray-200 px-8 py-3 rounded-lg text-[#1A365D] font-bold text-sm shadow-sm hover:bg-gray-50 transition-all group"
//           >
//             Accéder à la Web TV
//             <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default VideoSection;