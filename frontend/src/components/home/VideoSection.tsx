// src/components/home/VideoSection.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import type { VideoArticle } from '@/lib/server-data';

function formatDate(iso: string, monthStyle: 'long' | 'short' = 'long') {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: monthStyle, year: 'numeric' });
}

function PlayButton({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const dim = size === 'lg' ? 76 : 36;
  const iconSize = size === 'lg' ? 30 : 14;
  return (
    <div
      className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
      style={{ width: dim, height: dim, background: '#B85C38', boxShadow: '0 8px 32px rgba(184,92,56,0.4)' }}
    >
      <Play size={iconSize} fill="white" className="text-white ml-1" />
    </div>
  );
}

function MainVideoCard({ video, visible }: { video: VideoArticle; visible: boolean }) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/11',
        transition: 'opacity 0.7s, transform 0.7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <img
        src={video.coverImage || '/images/placeholder.jpg'}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.4) 50%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,20,0.3) 0%, transparent 60%)' }} />

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: '#B85C38' }}>
          {video.category?.name ?? 'Vidéo'}
        </span>
        <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/90" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          ▶ Vidéo
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-0 transition-opacity"
            style={{ background: 'rgba(184,92,56,0.4)', transform: 'scale(1.5)', animation: 'pulse 2s ease-in-out infinite' }}
          />
          <PlayButton size="lg" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
          {formatDate(video.createdAt)}
        </p>
        <h3 className="text-white font-black text-base md:text-lg leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors" style={{ letterSpacing: '-0.01em' }}>
          {video.title}
        </h3>
      </div>
    </Link>
  );
}

function SideVideoCard({ video, delay = 0, visible }: { video: VideoArticle; delay?: number; visible: boolean }) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group block relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '16/10',
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden bg-gray-900">
        <img
          src={video.coverImage || '/images/placeholder.jpg'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.95) 0%, rgba(10,35,20,0.3) 60%, transparent 100%)' }} />
      </div>

      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: 'rgba(42,127,95,0.9)' }}>
        {video.category?.name ?? 'Vidéo'}
      </span>

      <div className="absolute inset-0 flex items-center justify-center">
        <PlayButton size="sm" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-wider mb-1">
          {formatDate(video.createdAt, 'short')}
        </p>
        <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#C8A84B] transition-colors">
          {video.title}
        </h4>
      </div>
    </Link>
  );
}

interface VideoSectionProps {
  videos: VideoArticle[];
}

const VideoSection = ({ videos }: VideoSectionProps) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!videos.length) return null;

  const main = videos[0];
  const sides = videos.slice(1, 5);

  return (
    <section ref={sectionRef} className="py-12 md:py-18 overflow-hidden" style={{ background: '#F7F9F8' }}>
      <div className="max-w-[1300px] mx-auto px-6">

        <div
          className="flex items-end justify-between mb-10 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#B85C38' }}>
              — Vidéothèque
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-none" style={{ color: '#0D1A10', letterSpacing: '-0.03em' }}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MainVideoCard video={main} visible={visible} />

          <div className="grid grid-cols-2 gap-4">
            {sides.map((video, i) => (
              <SideVideoCard key={video.id} video={video} delay={i * 100 + 150} visible={visible} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center md:hidden">
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
