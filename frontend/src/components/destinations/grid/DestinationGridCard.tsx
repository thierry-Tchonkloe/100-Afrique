// src/components/destinations/grid/DestinationGridCard.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { LocaleMark } from '@/components/icons/CustomIcons';
import { useReveal } from '@/hooks/useReveal';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import type { GridDestination } from './useDestinationsList';

interface DestinationGridCardProps {
  dest: GridDestination;
  delay?: number;
}

const DestinationGridCard = ({ dest, delay = 0 }: DestinationGridCardProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;

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
        href={`/destinations/${dest.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '4/3' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={dest.coverImage || '/images/placeholder-dest.jpg'}
            alt={dest.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.45) 50%, rgba(0,0,0,0.05) 100%)' }}
          />
        </div>

        {/* Badge continent */}
        {dest.continent && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
            style={{ background: 'rgba(26,92,67,0.88)' }}
          >
            <LocaleMark size={12} />
            <span className="hidden sm:inline">{dest.continent}</span>
          </span>
        )}

        {/* Overlay hover émeraude */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white mb-1 uppercase tracking-wide">
            {dest.name}
          </h3>
          {dest.description && (
            <p className="hidden sm:block text-white/75 text-[11px] leading-relaxed line-clamp-2 mb-2">
              {dest.description}
            </p>
          )}
          <div className="border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#C8A84B' }}>
              <FileText size={9} />
              {dest.articleCount ?? 0} articles &amp; vidéos
            </span>
          </div>
        </div>

        {/* État par défaut */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <h3 className="font-bold text-base sm:text-lg leading-tight text-white uppercase tracking-wide mb-1">
            {dest.name}
          </h3>
          <p className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            {dest.articleCount ?? 0} articles &amp; vidéos
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DestinationGridCard;