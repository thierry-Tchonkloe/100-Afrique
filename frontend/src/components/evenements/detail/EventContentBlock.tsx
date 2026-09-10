// src/components/evenements/detail/EventContentBlock.tsx
"use client";
import React from 'react';
import { useReveal } from '@/hooks/useReveal';
import type { ContentBlock } from '@/components/shared/ContentBlockRenderer';

interface EventContentBlockProps {
  block: ContentBlock;
  index: number;
}

const EventContentBlock = ({ block, index }: EventContentBlockProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05);
  const anim = {
    transition: `opacity 0.6s ${index * 25}ms, transform 0.6s ${index * 25}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(14px)',
  };

  switch (block.type) {
    case 'heading':
      return (
        <div ref={ref} style={anim}>
          <h2 className="text-2xl md:text-3xl font-black mt-12 mb-5 leading-snug" style={{ color: '#0D1A10', letterSpacing: '-0.02em' }}>
            {block.value}
          </h2>
        </div>
      );
    case 'text':
      return (
        <div ref={ref} style={anim}>
          <p className="text-gray-700 text-base md:text-lg leading-[1.85] mb-6 whitespace-pre-line">{block.value}</p>
        </div>
      );
    case 'image':
      return (
        <div ref={ref} style={anim} className="my-10 rounded-2xl overflow-hidden shadow-lg">
          <img src={block.url} alt="Illustration" className="w-full h-auto object-cover" />
        </div>
      );
    case 'video':
      return (
        <div ref={ref} style={anim} className="my-10 aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={block.url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    default:
      return null;
  }
};

export default EventContentBlock;