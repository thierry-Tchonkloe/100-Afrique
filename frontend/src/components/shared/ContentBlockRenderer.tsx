// src/components/shared/ContentBlockRenderer.tsx
"use client";
import React from 'react';

export interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'video';
  value?: string;
  url?: string;
}

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
  /** Exclut les blocs vidéo (ex: VideoDetailPage, qui a déjà un player dédié) */
  excludeVideo?: boolean;
  className?: string;
}

const ContentBlockRenderer = ({ blocks, excludeVideo = false, className = '' }: ContentBlockRendererProps) => {
  const filtered = excludeVideo ? blocks.filter((b) => b.type !== 'video') : blocks;
  if (excludeVideo && filtered.length === 0) return null;

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {filtered.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="text-2xl md:text-3xl font-bold text-it-blue mt-10 mb-4 leading-snug">
                {block.value}
              </h2>
            );
          case 'text':
            return (
              <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
                {block.value}
              </p>
            );
          case 'image':
            return (
              <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-md">
                <img src={block.url} alt="Illustration" className="w-full h-auto object-cover" />
              </div>
            );
          case 'video':
            return (
              <div key={index} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-md">
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
      })}
    </div>
  );
};

export default ContentBlockRenderer;