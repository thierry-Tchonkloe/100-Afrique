'use client';
// src/components/emploi/conseils/ConseilsHero.tsx
import { Search, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/data/mockArticles';

export default function ConseilsHero({
  searchInput, setSearchInput, activeCategory, setActiveCategory, loading,
}: {
  searchInput: string; setSearchInput: (v: string) => void;
  activeCategory: string; setActiveCategory: (v: string) => void;
  loading: boolean;
}) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E2A3A] leading-tight mb-4">
          Boostez votre trajectoire professionnelle.
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-8">
          Analyses, guides et témoignages pour réussir dans l&apos;industrie du tourisme.
        </p>

        <div className="relative max-w-xl mx-auto">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un article... (ex: entretien, salaire, CV)"
            className="w-full border border-gray-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A]
                       shadow-sm transition"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#E8622A]
                          rounded-xl flex items-center justify-center">
            {loading
              ? <Loader2 size={14} className="text-white animate-spin" />
              : <Search size={15} className="text-white" />}
          </div>
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-300
                         hover:text-gray-500 text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all
                    ${isActive
                      ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
