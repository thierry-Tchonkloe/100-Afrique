// src/components/emploi/conseils/ArticleCard.tsx
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { CATEGORY_BADGE, type Article } from '@/data/mockArticles';

export default function ArticleCard({ article, size = 'normal' }: { article: Article; size?: 'normal' | 'compact' }) {
  const badge = CATEGORY_BADGE[article.category] ?? 'bg-gray-600';
  return (
    <Link
      href={`/emploi/conseils/${article.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden
                 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
    >
      <div className={`relative overflow-hidden flex-shrink-0 ${size === 'compact' ? 'h-44' : 'h-52'}`}>
        <img
          src={article.coverUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-full ${badge}`}>
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
          <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min</span>
          <span>{article.date}</span>
        </div>
        <h3 className={`font-bold text-[#1E2A3A] leading-snug group-hover:text-[#E8622A]
                        transition-colors ${size === 'compact' ? 'text-sm' : 'text-[15px]'}`}>
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-gray-50">
          <img src={article.author.avatar} alt={article.author.name}
               className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-700 leading-tight">{article.author.name}</p>
            <p className="text-[10px] text-gray-400">{article.author.role}</p>
          </div>
          <ArrowRight size={14}
            className="ml-auto text-gray-200 group-hover:text-[#E8622A]
                       group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
