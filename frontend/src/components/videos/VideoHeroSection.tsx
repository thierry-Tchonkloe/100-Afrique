// src/components/videos/VideoHeroSection.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Play, Calendar, Clock, Facebook, Twitter, Linkedin, ExternalLink,
} from 'lucide-react';
import {
  SocialFacette, SocialEnvol, SocialNoeud, SocialEcran, SocialObjectif,
  MissiveMark, RingMark, LocaleMark, WaveMark,
} from '@/components/icons/CustomIcons';
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

// ─── Réseaux de partage — icône + nom affiché en tooltip au survol ────────────

const SHARE_NETWORKS = [
  { id: 'facebook', bg: '#3B5998', Icon: SocialFacette, label: 'Facebook' },
  { id: 'twitter',  bg: '#000000', Icon: SocialEnvol,   label: 'Twitter'  },
  { id: 'linkedin', bg: '#0077B5', Icon: SocialNoeud,   label: 'LinkedIn' },
  { id: 'whatsapp', bg: '#25D366', Icon: WaveMark,      label: 'WhatsApp' },
];

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
            Videos &amp; <span style={{ color: '#1A5C43' }}>Web TV</span>
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
                {SHARE_NETWORKS.map(({ id, bg, Icon, label }) => (
                  <div key={id} className="relative group/social">
                    <button
                      onClick={() => handleShare(id)}
                      className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all hover:scale-110 active:scale-95"
                      style={{ background: bg }}
                      aria-label={`Partager sur ${label}`}
                    >
                      <Icon size={24} />
                    </button>
                    {/* Tooltip affiché au survol */}
                    <span
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap
                                 rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider
                                 opacity-0 scale-95 transition-all duration-200
                                 group-hover/social:opacity-100 group-hover/social:scale-100"
                      style={{ background: '#0D1A10', color: '#C8A84B' }}
                    >
                      {label}
                    </span>
                  </div>
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
