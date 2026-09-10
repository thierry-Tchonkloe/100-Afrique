// src/components/shared/header/MagazineMenuCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import MagazineImage from '@/components/shared/MagazineImage';
import type { HeaderMagazine } from './useHeaderMagazines';

const MagazineMenuCard = ({ magazine }: { magazine: HeaderMagazine }) => (
  <Link
    href={`/magazine/${magazine.slug}`}
    className="group/mag flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
  >
    <div className="relative w-full aspect-video overflow-hidden bg-gray-100 shrink-0">
      <MagazineImage
        src={magazine.coverImage}
        alt={magazine.title}
        className="w-full h-full object-cover group-hover/mag:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-2 left-2">
        <span
          className="text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none"
          style={{ backgroundColor: 'rgba(0,26,77,0.8)', backdropFilter: 'blur(4px)' }}
        >
          {magazine.source}
        </span>
      </div>
    </div>
    <div className="p-2.5 flex flex-col gap-1">
      <p className="font-bold text-[11px] leading-tight line-clamp-2" style={{ color: '#001A4D' }}>
        {magazine.title}
      </p>
      <div className="flex items-center gap-1 text-[9px] mt-0.5" style={{ color: '#9ca3af' }}>
        <Clock size={9} />
        {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </div>
      <span className="flex items-center gap-1 text-[9px] font-bold mt-1" style={{ color: '#C8A84B' }}>
        Lire <ExternalLink size={9} />
      </span>
    </div>
  </Link>
);

export default MagazineMenuCard;