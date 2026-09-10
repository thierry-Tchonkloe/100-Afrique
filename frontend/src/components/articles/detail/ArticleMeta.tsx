// src/components/articles/detail/ArticleMeta.tsx
"use client";
import React from 'react';
import { User, Calendar, Clock, Eye } from 'lucide-react';
import type { Article } from './useArticleDetail';

const ArticleMeta = ({ article, readingTime }: { article: Article; readingTime: number }) => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 border-b border-gray-100 pb-8 mb-10">
    <div className="flex items-center gap-2">
      <User size={15} className="text-it-gold" />
      <span>Par <strong className="text-it-blue">{article.author.name}</strong></span>
    </div>
    <div className="flex items-center gap-2">
      <Calendar size={15} className="text-it-gold" />
      <span>
        {new Date(article.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Clock size={15} className="text-it-gold" />
      <span>{readingTime} min de lecture</span>
    </div>
    {article.views > 0 && (
      <div className="flex items-center gap-2">
        <Eye size={15} className="text-it-gold" />
        <span>{article.views.toLocaleString('fr-FR')} lectures</span>
      </div>
    )}
  </div>
);

export default ArticleMeta;