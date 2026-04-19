// src/components/home/VideoSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface VideoArticle {
  id: number;
  title: string;
  slug: string;
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
    slug: string;
  };
}

const VideoSection = () => {
  const [videos, setVideos] = useState<VideoArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/mag/articles', {
          params: {
            pageSize: 3,          // ✅ 1 principale + 2 secondaires
            page: 1,
            status: 'PUBLISHED',
            type: 'VIDEO',
          },
        });
        setVideos(res.data.data ?? []);
      } catch (error) {
        console.error('Erreur VideoSection:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 text-[#001A4D]">
        <Loader2 className="animate-spin text-it-orange" size={40} />
        <p className="animate-pulse text-sm font-bold uppercase tracking-widest">Chargement...</p>
      </div>
    );
  }

  if (videos.length === 0) return null;

  const mainVideo  = videos[0];
  const sideVideos = videos.slice(1, 3); // ✅ 2 vidéos secondaires

  const getVideoUrl = (article: VideoArticle): string | null => {
    const block = article.content?.find((b) => b.type === 'video');
    return block?.url ?? null;
  };

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto px-6">

        <h2 className="text-center text-[#1A365D] text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest mb-12">
          Vidéos et Reportages
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* ── Vidéo principale ── */}
          <Link
            href={`/videos/${mainVideo.slug}`}
            className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-black"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
              <img
                src={mainVideo.coverImage || '/images/placeholder.jpg'}
                alt={mainVideo.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50">
                  <div className="w-16 h-16 bg-[#F39C12] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={32} fill="white" className="text-white ml-1" />
                  </div>
                </div>
              </div>

              <span className="absolute top-4 left-4 bg-[#F39C12] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                {mainVideo.category?.name ?? 'Vidéo'}
              </span>

              <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                <h3 className="text-2xl font-bold mb-2 line-clamp-2">{mainVideo.title}</h3>
                <p className="text-sm opacity-70 uppercase tracking-widest">
                  {new Date(mainVideo.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Link>

          {/* ── 2 Vidéos secondaires ── */}
          <div className="flex flex-col gap-4">
            {sideVideos.map((video) => (
              <Link
                href={`/videos/${video.slug}`}
                key={video.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.coverImage || '/images/placeholder.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="w-10 h-10 bg-[#F39C12] rounded-full flex items-center justify-center">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                  {getVideoUrl(video) && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      ▶ VIDÉO
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#1A365D] text-sm line-clamp-2 group-hover:text-[#F39C12] transition-colors">
                    {video.title}
                  </h4>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/videos"
            className="flex items-center gap-2 bg-white border border-gray-200 px-8 py-3 rounded-lg text-[#1A365D] font-bold text-sm shadow-sm hover:bg-gray-50 transition-all group"
          >
            Accéder à la Web TV
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;