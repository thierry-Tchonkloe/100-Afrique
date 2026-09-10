// src/components/salons/reportages/ReportageCard.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, FileText, Image as ImageIcon, Play } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { getCategoryStyle, getContentType, type Reportage } from './reportageUtils';

function renderTypeIcon(type: string) {
  if (type === 'video')     return <Play size={10} className="fill-current" />;
  if (type === 'interview') return <ImageIcon size={10} />;
  return <FileText size={10} />;
}

interface ReportageCardProps {
  item: Reportage;
  delay?: number;
}

const ReportageCard = ({ item, delay = 0 }: ReportageCardProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.06);
  const [hovered, setHovered] = useState(false);
  const isTouch = useIsTouchDevice();
  const overlayVisible = isTouch || hovered;
  const contentType = getContentType(item);

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
        href={`/actualites/${item.slug}`}
        className="group block relative overflow-hidden rounded-2xl active:scale-[0.98] transition-transform duration-150"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0">
          <img
            src={item.coverImage || '/images/magazine-placeholder.jpg'}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,35,20,0.97) 0%, rgba(10,35,20,0.55) 45%, rgba(0,0,0,0.08) 100%)' }}
          />
        </div>

        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-10"
          style={getCategoryStyle(item.category.name)}
        >
          {renderTypeIcon(contentType)}
          <span className="hidden sm:inline">{item.category.name}</span>
        </span>

        <div
          className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(26,92,67,0.97) 0%, rgba(26,92,67,0.60) 55%, transparent 100%)',
            opacity: overlayVisible ? 1 : 0,
          }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-1.5 sm:mb-2">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="hidden sm:block text-white/75 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2 mb-2 sm:mb-3">
              {item.excerpt}
            </p>
          )}
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire le reportage <ExternalLink size={8} />
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transition-opacity duration-300 z-10"
          style={{ opacity: overlayVisible ? 0 : 1 }}
        >
          <p className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-1.5" style={{ color: '#C8A84B' }}>
            <Clock size={8} />
            {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <h3 className="font-bold text-[12px] sm:text-[13px] leading-snug line-clamp-2 text-white mb-2 sm:mb-3">{item.title}</h3>
          <div className="border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold" style={{ color: '#B85C38' }}>
              Lire le reportage <ExternalLink size={8} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportageCard;