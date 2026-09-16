// src/components/videos/detail/RelatedVideos.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import type { RelatedVideo } from './useVideoDetail';

const RelatedCard = ({ video }: { video: RelatedVideo }) => {
  const hasVideo = video.content?.some((b) => b.type === 'video');

  return (
    <Link href={`/videos/${video.slug}`} className="group flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
        <img
          src={video.coverImage || '/images/placeholder.jpg'}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-it-terracotta rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-it-terracotta text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide">
          {video.category.name}
        </span>
      </div>
      <h3 className="text-base font-bold text-it-blue leading-snug mb-2 group-hover:text-it-gold transition-colors line-clamp-2">
        {video.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{video.excerpt}</p>
      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto">
        <span>Par {video.author.name}</span>
        <span>•</span>
        <span>
          {new Date(video.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>
      </div>
    </Link>
  );
};

const RelatedVideos = ({ videos }: { videos: RelatedVideo[] }) => {
  if (!videos.length) return null;
  return (
    <section className="bg-it-gray-light py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-it-blue uppercase tracking-wide">
              Vidéos similaires
            </h2>
            <div className="w-12 h-1 bg-it-gold mt-2 rounded-full" />
          </div>
          <Link
            href="/videos"
            className="text-sm font-bold text-it-blue hover:text-it-gold transition-colors flex items-center gap-1"
          >
            Voir tout
            <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((v) => <RelatedCard key={v.id} video={v} />)}
        </div>
      </div>
    </section>
  );
};

export default RelatedVideos;