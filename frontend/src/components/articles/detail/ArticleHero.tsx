// src/components/articles/detail/ArticleHero.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Article } from './useArticleDetail';

const ArticleHero = ({ article }: { article: Article }) => {
  const router = useRouter();
  return (
    <div className="relative w-full h-[420px] md:h-[560px]">
      <Image
        src={article.coverImage || '/images/placeholder.jpg'}
        alt={article.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-it-blue/85 via-it-blue/30 to-transparent" />

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
        >
          <ArrowLeft size={15} />
          Retour
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-5xl mx-auto w-full">
        <span className="inline-block bg-it-terracotta text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          {article.category.name}
        </span>
        <h1 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl">
          {article.title}
        </h1>
      </div>
    </div>
  );
};

export default ArticleHero;