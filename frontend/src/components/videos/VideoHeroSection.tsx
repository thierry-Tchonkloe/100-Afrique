// src/components/videos/VideoHeroSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  Play, Calendar, Clock, Facebook, Twitter, Linkedin, MessageCircle, Loader2,
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
  content: Array<{
    type: string;
    url?: string;
    value?: string;
  }>;
  category: {
    id: number;
    name: string;
  };
}

const VideoHeroSection = () => {
  const [mainVideo, setMainVideo] = useState<VideoData | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        // 1ère tentative : vidéo featured de type VIDEO
        const response = await api.get('/mag/articles', {
          params: {
            type: 'VIDEO',       // ✅ uniquement les articles VIDEO
            featured: true,
            pageSize: 1,
            page: 1,
            status: 'PUBLISHED',
          },
        });

        let data: VideoData[] = response.data.data ?? [];

        // Fallback : si aucune vidéo featured, on prend la dernière vidéo publiée
        if (data.length === 0) {
          const fallback = await api.get('/mag/articles', {
            params: {
              type: 'VIDEO',
              pageSize: 1,
              page: 1,
              status: 'PUBLISHED',
            },
          });
          data = fallback.data.data ?? [];
        }

        setMainVideo(data[0] ?? null);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Erreur chargement vidéo hero:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  // Extrait l'URL de la vidéo depuis les blocs de contenu
  const getVideoUrl = (): string | null => {
    if (!mainVideo?.content) return null;
    const block = mainVideo.content.find((b) => b.type === 'video');
    return block?.url ?? null;
  };

  // Partage social
  const handleShare = (platform: string) => {
    const url  = window.location.href;
    const text = mainVideo?.title ?? 'Regardez cette vidéo sur WAXEHO';

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // ── États de chargement / vide ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-[#F19300] mx-auto" size={40} />
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

  const videoUrl = getVideoUrl();

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Titre de section */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#163066] text-center uppercase tracking-tight mb-10 leading-tight">
          Vidéos et Web TV : Reportages, Interviews,{' '}
          <br className="hidden md:block" /> Émissions
        </h1>

        {/* Player card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Zone vidéo */}
          <div className="relative aspect-video bg-[#0F172A] flex items-center justify-center group">
            {videoUrl ? (
              /* ── Lecteur intégré si URL disponible ── */
              <iframe
                src={videoUrl}
                title={mainVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* ── Thumbnail + bouton play si pas d'URL ── */
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${mainVideo.coverImage})` }}
                />
                <div className="relative z-10 w-20 h-20 bg-[#F19300] rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 cursor-pointer">
                  <Play size={32} fill="white" className="text-white ml-1" />
                </div>
                <span className="absolute bottom-6 text-white/60 text-sm font-light tracking-wide z-10">
                  Vidéo non disponible en lecture directe
                </span>
              </>
            )}
          </div>

          {/* Infos */}
          <div className="p-6 md:p-10 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-[#F19300] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                {mainVideo.category.name}
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                Vidéo
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#163066] leading-tight">
              {mainVideo.title}
            </h2>

            {/* Méta-données */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#F19300]" />
                <span>
                  {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              {videoUrl && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#F19300]" />
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#F19300] transition-colors"
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
                  { id: 'facebook', bg: '#3B5998', Icon: Facebook },
                  { id: 'twitter',  bg: '#000000', Icon: Twitter  },
                  { id: 'linkedin', bg: '#0077B5', Icon: Linkedin },
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