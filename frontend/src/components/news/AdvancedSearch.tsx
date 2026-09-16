// src/components/news/AdvancedSearch.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Globe, Tag, X, SlidersHorizontal } from 'lucide-react';
import FilterSelect from './search/FilterSelect';
import SearchChip from './search/SearchChip';
import { EMPTY_FILTERS, REGIONS, COUNTRIES, TOPICS, type SearchFilters } from './search/searchConstants';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<SearchFilters>(EMPTY_FILTERS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) setDraft(filters); }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasActive = Object.values(filters).some(Boolean);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const applyFilters = (f: SearchFilters) => {
    setFilters(f);
    onSearch(f);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setDraft(EMPTY_FILTERS);
    onSearch(EMPTY_FILTERS);
    setIsOpen(false);
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const updated = { ...filters, [key]: '' };
    setFilters(updated);
    onSearch(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* ── Barre principale ── */}
      <div className="flex gap-2 p-3 sm:p-4">

        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une actualité…"
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(filters); }}
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl text-sm outline-none font-medium transition-all"
            style={{ border: '1.5px solid #E5E7EB', color: '#111' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#1A5C43')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
          />
          {filters.query && (
            <button
              onClick={() => { setFilters((f) => ({ ...f, query: '' })); onSearch({ ...filters, query: '' }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shrink-0"
          style={isOpen || hasActive
            ? { background: '#1A5C43', color: '#fff', border: '1.5px solid #1A5C43' }
            : { background: '#fff', color: '#374151', border: '1.5px solid #E5E7EB' }}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filtres</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: '#C8A84B', color: '#fff' }}>
              {activeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => applyFilters(filters)}
          disabled={loading}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 shrink-0"
          style={{ background: '#1A5C43' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Search size={15} />
          }
          <span className="hidden sm:inline">Rechercher</span>
        </button>

        {hasActive && (
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl text-gray-500 hover:text-[#B85C38] hover:bg-red-50 transition-colors"
            title="Réinitialiser"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Chips filtres actifs ── */}
      {hasActive && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {filters.query && <SearchChip label={`"${filters.query}"`} icon={<Search size={10} />} onRemove={() => removeFilter('query')} />}
          {filters.region && <SearchChip label={filters.region} icon={<MapPin size={10} />} onRemove={() => removeFilter('region')} />}
          {filters.country && <SearchChip label={filters.country} icon={<Globe size={10} />} onRemove={() => removeFilter('country')} />}
          {filters.topic && <SearchChip label={filters.topic} icon={<Tag size={10} />} onRemove={() => removeFilter('topic')} />}
        </div>
      )}

      {/* ── Panneau filtres avancés ── */}
      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-4" style={{ background: '#FAFAFA' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <FilterSelect
              value={draft.region}
              onChange={(v) => setDraft((d) => ({ ...d, region: v }))}
              options={REGIONS}
              placeholder="Toutes les régions"
              icon={<MapPin size={13} />}
            />
            <FilterSelect
              value={draft.country}
              onChange={(v) => setDraft((d) => ({ ...d, country: v }))}
              options={COUNTRIES}
              placeholder="Tous les pays"
              icon={<Globe size={13} />}
            />
            <FilterSelect
              value={draft.topic}
              onChange={(v) => setDraft((d) => ({ ...d, topic: v }))}
              options={TOPICS}
              placeholder="Tous les sujets"
              icon={<Tag size={13} />}
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-500 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Tout réinitialiser
            </button>
            <button
              onClick={() => applyFilters({ ...draft, query: filters.query })}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
              style={{ background: '#1A5C43' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
            >
              <Search size={13} />
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}