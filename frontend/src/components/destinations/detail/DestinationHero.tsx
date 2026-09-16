// src/components/destinations/detail/DestinationHero.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';
import type { Destination } from './useDestinationDetail';

const StatPill = ({ value, label }: { value: string | number; label: string }) => (
  <div className="text-center">
    <p className="text-3xl md:text-4xl font-black text-white">{value}</p>
    <p className="text-[11px] text-white/70 uppercase tracking-widest font-medium mt-1">{label}</p>
  </div>
);

const DestinationHero = ({ destination }: { destination: Destination }) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[500px] md:h-[620px]">
      <Image
        src={destination.coverImage || '/images/placeholder-dest.jpg'}
        alt={destination.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-it-blue/95 via-it-blue/40 to-transparent" />

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={15} />
          Retour
        </button>
      </div>

      {destination.continent && (
        <div className="absolute top-6 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-bold">
            <Compass size={14} />
            {destination.continent}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-0.5 bg-it-gold" />
          <span className="text-it-gold text-xs font-bold uppercase tracking-[0.25em]">Destination</span>
        </div>
        <h1 className="text-white text-4xl md:text-6xl font-black leading-none drop-shadow-lg max-w-4xl mb-5 uppercase tracking-tight">
          {destination.name}
        </h1>
        {destination.description && (
          <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed line-clamp-2">
            {destination.description}
          </p>
        )}
        {destination.articleCount !== undefined && destination.articleCount > 0 && (
          <div className="mt-8 flex items-center gap-8">
            <StatPill value={destination.articleCount} label="Articles & Vidéos" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationHero;