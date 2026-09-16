// src/components/articles/detail/ArticleTags.tsx
"use client";
import React from 'react';
import { Tag } from 'lucide-react';

interface ArticleTagsProps {
  tags: { id: number; name: string; slug: string }[];
}

const ArticleTags = ({ tags }: ArticleTagsProps) => {
  if (!tags.length) return null;
  return (
    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
      <Tag size={16} className="text-gray-400" />
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-it-gold/10 hover:text-it-gold transition-colors cursor-default"
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
};

export default ArticleTags;