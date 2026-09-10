// src/components/shared/header/MagazineMiniCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import MagazineImage from '@/components/shared/MagazineImage';
import type { HeaderMagazine } from './useHeaderMagazines';

const MagazineMiniCard = ({ magazine }: { magazine: HeaderMagazine }) => (
  <Link
    href={`/magazine/${magazine.slug}`}
    className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
  >
    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-100">
      <MagazineImage
        src={magazine.coverImage}
        alt={magazine.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <span
        className="inline-block text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-1"
        style={{ backgroundColor: '#001A4D' }}
      >
        {magazine.source}
      </span>
      <p className="font-bold text-[10.5px] leading-tight line-clamp-2" style={{ color: '#001A4D' }}>
        {magazine.title}
      </p>
    </div>
  </Link>
);

export default MagazineMiniCard;