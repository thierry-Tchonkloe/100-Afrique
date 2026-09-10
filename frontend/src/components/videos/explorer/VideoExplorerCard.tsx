// src/components/videos/explorer/VideoExplorerCard.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, Play } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import type { VideoItem } from './useVideoExplorer';

const VideoExplorerCard = ({ video, delay = 0 }: { video: VideoItem; delay?: number }) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;
  const hasVideoBlock = video.content?.some((b) => b.type === 'video');

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <Link
        href={`/videos/${video.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0">
          <img
            src={video.coverImage || '/images/placeholder.jpg'}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)' }}
          />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300"
          style={{ opacity: overlayVisible ? 0 : 0.9 }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'rgba(184,92,56,0.85)', backdropFilter: 'blur(4px)' }}
          >
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
          style={{ background: 'rgba(184,92,56,0.88)' }}
        >
          <Play size={9} className="fill-current" />
          <span className="hidden sm:inline">{video.category?.name ?? 'Vidéo'}</span>
        </span>

        {hasVideoBlock && (
          <span
            className="absolute top-3 right-3 text-white text-[8px] font-black px-2 py-0.5 rounded z-10 uppercase tracking-wider"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            ▶ VIDEO
          </span>
        )}

        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-1.5">
            {video.title}
          </h3>
          {video.excerpt && (
            <p className="hidden sm:block text-white/75 text-[10px] leading-relaxed line-clamp-2 mb-2">
              {video.excerpt}
            </p>
          )}
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Regarder la vidéo <ExternalLink size={8} />
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-1.5" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(video.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-2">{video.title}</h3>
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Regarder la vidéo <ExternalLink size={8} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoExplorerCard;