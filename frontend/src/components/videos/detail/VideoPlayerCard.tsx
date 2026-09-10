// src/components/videos/detail/VideoPlayerCard.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Play } from 'lucide-react';

interface VideoPlayerCardProps {
  sourceUrl: string | null;
  coverImage: string;
  title: string;
}

const getExternalLink = (url: string) => {
  if (url.includes('youtube.com/embed/'))
    return url.replace('youtube.com/embed/', 'youtube.com/watch?v=');
  if (url.includes('player.vimeo.com/video/'))
    return url.replace('player.vimeo.com/video/', 'vimeo.com/');
  return url;
};

const VideoPlayerCard = ({ sourceUrl, coverImage, title }: VideoPlayerCardProps) => {
  const [playing, setPlaying] = useState(false);

  if (!sourceUrl) {
    return (
      <div className="relative aspect-video bg-it-blue rounded-2xl overflow-hidden flex items-center justify-center">
        <Image src={coverImage || '/images/placeholder.jpg'} alt={title} fill className="object-cover opacity-50" />
        <p className="relative z-10 text-white/60 text-sm">Aucune vidéo disponible</p>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src={`${sourceUrl}?autoplay=1`}
            className="w-full h-full"
            title={title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <div className="flex justify-center">
          <a
            href={getExternalLink(sourceUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-it-gold transition-colors duration-200 py-1"
          >
            <ExternalLink size={14} />
            Regarder directement sur la plateforme
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video bg-it-blue rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
      onClick={() => setPlaying(true)}
    >
      <Image
        src={coverImage || '/images/placeholder.jpg'}
        alt={title}
        fill
        className="object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-it-terracotta rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
          <Play size={34} fill="white" className="text-white ml-1" />
        </div>
      </div>
      <p className="absolute bottom-5 left-0 right-0 text-center text-white/70 text-xs tracking-widest uppercase">
        Cliquer pour lancer la vidéo
      </p>
    </div>
  );
};

export default VideoPlayerCard;