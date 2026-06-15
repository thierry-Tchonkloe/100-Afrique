'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Globe, Tag, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface SearchFilters {
  query: string;
  region: string;
  country: string;
  topic: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

const regions = [
  "Afrique de l'Ouest", "Afrique de l'Est", "Afrique Centrale",
  "Afrique Australe", "Afrique du Nord", "Europe", "Asie", "Amériques", "Monde",
];

const countries = [
  'Sénégal', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
  'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert', 'Nigeria', 'Ghana',
  'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon', 'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda',
  'Burundi', 'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
  'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie', 'France', 'Belgique',
  'Suisse', 'Canada', 'USA',
];

const topics = [
  'Tourisme durable', 'Éco-tourisme', "Tourisme d'affaires", 'Tourisme religieux',
  'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
  'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
  'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
  'Investissements', 'Développement', 'Emploi', 'Formation',
];

const EMPTY: SearchFilters = { query: '', region: '', country: '', topic: '' };

// ─── Select stylisé ───────────────────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon: React.ReactNode;
}) {
  const isActive = !!value;
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: isActive ? '#1A5C43' : '#9CA3AF' }}>
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none font-medium transition-all"
        style={{
          border: `1.5px solid ${isActive ? '#1A5C43' : '#E5E7EB'}`,
          background: isActive ? 'rgba(26,92,67,0.05)' : '#fff',
          color: isActive ? '#1A5C43' : '#374151',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  );
}

// ─── Chip filtre actif ────────────────────────────────────────────────────────

function Chip({ label, icon, onRemove }: { label: string; icon: React.ReactNode; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
      style={{ background: 'rgba(26,92,67,0.08)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.15)' }}
    >
      <span className="opacity-70">{icon}</span>
      <span className="max-w-[120px] truncate">{label}</span>
      <button onClick={onRemove} className="ml-0.5 hover:text-[#B85C38] transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(EMPTY);
  const [draft, setDraft] = useState<SearchFilters>(EMPTY);
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
    setFilters(EMPTY);
    setDraft(EMPTY);
    onSearch(EMPTY);
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

        {/* Champ texte */}
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

        {/* Filtres avancés toggle */}
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

        {/* Bouton rechercher */}
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

        {/* Reset */}
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
          {filters.query && <Chip label={`"${filters.query}"`} icon={<Search size={10} />} onRemove={() => removeFilter('query')} />}
          {filters.region && <Chip label={filters.region} icon={<MapPin size={10} />} onRemove={() => removeFilter('region')} />}
          {filters.country && <Chip label={filters.country} icon={<Globe size={10} />} onRemove={() => removeFilter('country')} />}
          {filters.topic && <Chip label={filters.topic} icon={<Tag size={10} />} onRemove={() => removeFilter('topic')} />}
        </div>
      )}

      {/* ── Panneau filtres avancés ── */}
      {isOpen && (
        <div
          className="border-t border-gray-100 px-4 pb-4 pt-4"
          style={{ background: '#FAFAFA' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <FilterSelect
              value={draft.region}
              onChange={(v) => setDraft((d) => ({ ...d, region: v }))}
              options={regions}
              placeholder="Toutes les régions"
              icon={<MapPin size={13} />}
            />
            <FilterSelect
              value={draft.country}
              onChange={(v) => setDraft((d) => ({ ...d, country: v }))}
              options={countries}
              placeholder="Tous les pays"
              icon={<Globe size={13} />}
            />
            <FilterSelect
              value={draft.topic}
              onChange={(v) => setDraft((d) => ({ ...d, topic: v }))}
              options={topics}
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














// // src/components/news/AdvancedSearch.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Search, MapPin, Globe, Tag, X, SlidersHorizontal } from 'lucide-react';

// interface SearchFilters {
//   query: string;
//   region: string;
//   country: string;
//   topic: string;
// }

// interface AdvancedSearchProps {
//   onSearch: (filters: SearchFilters) => void;
//   loading?: boolean;
// }

// const regions = [
//   "Afrique de l'Ouest", "Afrique de l'Est", "Afrique Centrale",
//   "Afrique Australe", "Afrique du Nord", "Europe", "Asie", "Amériques", "Monde",
// ];

// const countries = [
//   'Sénégal', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
//   'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert', 'Nigeria', 'Ghana',
//   'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon', 'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda',
//   'Burundi', 'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
//   'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie', 'France', 'Belgique',
//   'Suisse', 'Canada', 'USA',
// ];

// const topics = [
//   'Tourisme durable', 'Éco-tourisme', "Tourisme d'affaires", 'Tourisme religieux',
//   'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
//   'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
//   'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
//   'Investissements', 'Développement', 'Emploi', 'Formation',
// ];

// const EMPTY: SearchFilters = { query: '', region: '', country: '', topic: '' };

// export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
//   const [isOpen, setIsOpen]   = useState(false);
//   const [filters, setFilters] = useState<SearchFilters>(EMPTY);
//   const [draft, setDraft]     = useState<SearchFilters>(EMPTY);
//   const inputRef              = useRef<HTMLInputElement>(null);

//   useEffect(() => { if (isOpen) setDraft(filters); }, [isOpen]);

//   const hasActive = Object.values(filters).some(Boolean);

//   const applyFilters = (f: SearchFilters) => {
//     setFilters(f);
//     onSearch(f);
//     setIsOpen(false);
//   };

//   const handleReset = () => {
//     setFilters(EMPTY);
//     setDraft(EMPTY);
//     onSearch(EMPTY);
//     setIsOpen(false);
//   };

//   const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') applyFilters({ ...filters, query: filters.query });
//   };

//   const removeFilter = (key: keyof SearchFilters) => {
//     const updated = { ...filters, [key]: '' };
//     setFilters(updated);
//     onSearch(updated);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">

//       {/* Barre principale */}
//       <div className="flex flex-col sm:flex-row gap-3">

//         {/* Champ texte */}
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Rechercher par mots-clés, région, pays ou sujet…"
//             value={filters.query}
//             onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
//             onKeyDown={handleQueryKeyDown}
//             className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base outline-none transition"
//             style={{ '--tw-ring-color': '#2A7F5F' } as React.CSSProperties}
//             onFocus={e => (e.currentTarget.style.borderColor = '#2A7F5F')}
//             onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
//           />
//           {filters.query && (
//             <button
//               onClick={() => { setFilters((f) => ({ ...f, query: '' })); onSearch({ ...filters, query: '' }); }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X size={14} />
//             </button>
//           )}
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex gap-2 shrink-0">

//           {/* Filtres avancés — émeraude foncé quand actif */}
//           <button
//             onClick={() => setIsOpen((o) => !o)}
//             className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors"
//             style={isOpen || hasActive
//               ? { background: '#1A5C43', color: '#ffffff', borderColor: '#1A5C43' }
//               : { background: '#ffffff', color: '#374151', borderColor: '#d1d5db' }}
//             onMouseEnter={e => {
//               if (!isOpen && !hasActive) e.currentTarget.style.background = '#F0F2F5';
//             }}
//             onMouseLeave={e => {
//               if (!isOpen && !hasActive) e.currentTarget.style.background = '#ffffff';
//             }}
//           >
//             <SlidersHorizontal size={16} />
//             <span className="hidden sm:inline">Filtres</span>
//             {hasActive && (
//               <span
//                 className="text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
//                 style={{ background: '#C8A84B' }}
//               >
//                 {Object.values(filters).filter(Boolean).length}
//               </span>
//             )}
//           </button>

//           {/* Bouton Rechercher — émeraude foncé → terre cuite au hover */}
//           <button
//             onClick={() => applyFilters(filters)}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 sm:px-6 py-2.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-sm"
//             style={{ background: '#1A5C43' }}
//             onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
//             onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
//           >
//             {loading
//               ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               : <Search size={16} />
//             }
//             <span className="hidden sm:inline">Rechercher</span>
//           </button>

//           {/* Reset global */}
//           {hasActive && (
//             <button
//               onClick={handleReset}
//               className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
//             >
//               <X size={16} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Panneau filtres avancés */}
//       {isOpen && (
//         <div className="border-t border-gray-100 pt-5 space-y-5 animate-in fade-in slide-in-from-top-1 duration-150">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//             {/* Région */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <MapPin size={13} /> Région
//               </label>
//               <select
//                 value={draft.region}
//                 onChange={(e) => setDraft((d) => ({ ...d, region: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white transition"
//                 onFocus={e => (e.currentTarget.style.borderColor = '#2A7F5F')}
//                 onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
//               >
//                 <option value="">Toutes les régions</option>
//                 {regions.map((r) => <option key={r} value={r}>{r}</option>)}
//               </select>
//             </div>

//             {/* Pays */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <Globe size={13} /> Pays
//               </label>
//               <select
//                 value={draft.country}
//                 onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white transition"
//                 onFocus={e => (e.currentTarget.style.borderColor = '#2A7F5F')}
//                 onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
//               >
//                 <option value="">Tous les pays</option>
//                 {countries.map((c) => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>

//             {/* Sujet */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <Tag size={13} /> Sujet
//               </label>
//               <select
//                 value={draft.topic}
//                 onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white transition"
//                 onFocus={e => (e.currentTarget.style.borderColor = '#2A7F5F')}
//                 onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
//               >
//                 <option value="">Tous les sujets</option>
//                 {topics.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Actions du panneau */}
//           <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2 border-t border-gray-100">
//             <button
//               onClick={handleReset}
//               className="px-4 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//             >
//               Tout réinitialiser
//             </button>
//             <button
//               onClick={() => applyFilters({ ...draft, query: filters.query })}
//               disabled={loading}
//               className="flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
//               style={{ background: '#1A5C43' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#B85C38')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#1A5C43')}
//             >
//               {loading
//                 ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 : <Search size={14} />
//               }
//               Appliquer les filtres
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Filtres actifs (chips) */}
//       {hasActive && (
//         <div className="flex flex-wrap gap-2 pt-1">
//           {filters.query && (
//             <Chip label={`"${filters.query}"`} icon="🔍" onRemove={() => removeFilter('query')} />
//           )}
//           {filters.region && (
//             <Chip label={filters.region} icon="📍" onRemove={() => removeFilter('region')} />
//           )}
//           {filters.country && (
//             <Chip label={filters.country} icon="🌍" onRemove={() => removeFilter('country')} />
//           )}
//           {filters.topic && (
//             <Chip label={filters.topic} icon="🏷️" onRemove={() => removeFilter('topic')} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function Chip({ label, icon, onRemove }: { label: string; icon: string; onRemove: () => void }) {
//   return (
//     <span
//       className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
//       style={{ background: 'rgba(26,92,67,0.1)', color: '#1A5C43' }}
//     >
//       <span>{icon}</span>
//       <span className="max-w-[140px] truncate">{label}</span>
//       <button
//         onClick={onRemove}
//         className="ml-0.5 transition-colors hover:text-red-500"
//       >
//         <X size={12} />
//       </button>
//     </span>
//   );
// }





















// // src/components/news/AdvancedSearch.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Search, MapPin, Globe, Tag, X, SlidersHorizontal } from 'lucide-react';

// interface SearchFilters {
//   query: string;
//   region: string;
//   country: string;
//   topic: string;
// }

// interface AdvancedSearchProps {
//   onSearch: (filters: SearchFilters) => void;
//   loading?: boolean;
// }

// const regions = [
//   "Afrique de l'Ouest", "Afrique de l'Est", "Afrique Centrale",
//   "Afrique Australe", "Afrique du Nord", "Europe", "Asie", "Amériques", "Monde",
// ];

// const countries = [
//   'Sénégal', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
//   'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert', 'Nigeria', 'Ghana',
//   'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon', 'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda',
//   'Burundi', 'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
//   'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie', 'France', 'Belgique',
//   'Suisse', 'Canada', 'USA',
// ];

// const topics = [
//   'Tourisme durable', 'Éco-tourisme', "Tourisme d'affaires", 'Tourisme religieux',
//   'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
//   'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
//   'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
//   'Investissements', 'Développement', 'Emploi', 'Formation',
// ];

// const EMPTY: SearchFilters = { query: '', region: '', country: '', topic: '' };

// export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
//   const [isOpen, setIsOpen]     = useState(false);
//   const [filters, setFilters]   = useState<SearchFilters>(EMPTY);
//   const [draft, setDraft]       = useState<SearchFilters>(EMPTY);   // valeurs en cours d'édition
//   const inputRef                = useRef<HTMLInputElement>(null);

//   // Synchronise le draft avec les filtres actifs quand le panneau s'ouvre
//   useEffect(() => {
//     if (isOpen) setDraft(filters);
//   }, [isOpen]);

//   const hasActive = Object.values(filters).some(Boolean);
//   const hasDraft  = Object.values(draft).some(Boolean);

//   const applyFilters = (f: SearchFilters) => {
//     setFilters(f);
//     onSearch(f);
//     setIsOpen(false);
//   };

//   const handleReset = () => {
//     setFilters(EMPTY);
//     setDraft(EMPTY);
//     onSearch(EMPTY);
//     setIsOpen(false);
//   };

//   const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') applyFilters({ ...filters, query: filters.query });
//   };

//   const removeFilter = (key: keyof SearchFilters) => {
//     const updated = { ...filters, [key]: '' };
//     setFilters(updated);
//     onSearch(updated);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">

//       {/* ── Barre principale ─────────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row gap-3">

//         {/* Champ texte */}
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Rechercher par mots-clés, région, pays ou sujet…"
//             value={filters.query}
//             onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
//             onKeyDown={handleQueryKeyDown}
//             className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base outline-none transition"
//           />
//           {filters.query && (
//             <button
//               onClick={() => { setFilters((f) => ({ ...f, query: '' })); onSearch({ ...filters, query: '' }); }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               aria-label="Effacer la recherche"
//             >
//               <X size={14} />
//             </button>
//           )}
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex gap-2 shrink-0">
//           {/* Filtres avancés */}
//           <button
//             onClick={() => setIsOpen((o) => !o)}
//             className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
//               isOpen || hasActive
//                 ? 'bg-[#001A4D] text-white border-[#001A4D]'
//                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <SlidersHorizontal size={16} />
//             <span className="hidden sm:inline">Filtres</span>
//             {hasActive && (
//               <span className="bg-[#F39C12] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                 {Object.values(filters).filter(Boolean).length}
//               </span>
//             )}
//           </button>

//           {/* Rechercher */}
//           <button
//             onClick={() => applyFilters(filters)}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#001A4D] text-white rounded-lg hover:bg-[#F39C12] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-sm"
//           >
//             {loading
//               ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               : <Search size={16} />
//             }
//             <span className="hidden sm:inline">Rechercher</span>
//           </button>

//           {/* Reset global */}
//           {hasActive && (
//             <button
//               onClick={handleReset}
//               className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
//               aria-label="Réinitialiser tous les filtres"
//             >
//               <X size={16} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Panneau filtres avancés ──────────────────────────────────────── */}
//       {isOpen && (
//         <div className="border-t border-gray-100 pt-5 space-y-5 animate-in fade-in slide-in-from-top-1 duration-150">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//             {/* Région */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <MapPin size={13} /> Région
//               </label>
//               <select
//                 value={draft.region}
//                 onChange={(e) => setDraft((d) => ({ ...d, region: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm outline-none bg-white transition"
//               >
//                 <option value="">Toutes les régions</option>
//                 {regions.map((r) => <option key={r} value={r}>{r}</option>)}
//               </select>
//             </div>

//             {/* Pays */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <Globe size={13} /> Pays
//               </label>
//               <select
//                 value={draft.country}
//                 onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm outline-none bg-white transition"
//               >
//                 <option value="">Tous les pays</option>
//                 {countries.map((c) => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>

//             {/* Sujet */}
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 <Tag size={13} /> Sujet
//               </label>
//               <select
//                 value={draft.topic}
//                 onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
//                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm outline-none bg-white transition"
//               >
//                 <option value="">Tous les sujets</option>
//                 {topics.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Actions du panneau */}
//           <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2 border-t border-gray-100">
//             <button
//               onClick={handleReset}
//               className="px-4 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//             >
//               Tout réinitialiser
//             </button>
//             <button
//               onClick={() => applyFilters({ ...draft, query: filters.query })}
//               disabled={loading}
//               className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#001A4D] text-white text-sm font-bold rounded-lg hover:bg-[#F39C12] disabled:opacity-50 transition-colors"
//             >
//               {loading
//                 ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 : <Search size={14} />
//               }
//               Appliquer les filtres
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ── Filtres actifs (chips) ───────────────────────────────────────── */}
//       {hasActive && (
//         <div className="flex flex-wrap gap-2 pt-1">
//           {filters.query && (
//             <Chip label={`"${filters.query}"`} icon="🔍" onRemove={() => removeFilter('query')} />
//           )}
//           {filters.region && (
//             <Chip label={filters.region} icon="📍" onRemove={() => removeFilter('region')} />
//           )}
//           {filters.country && (
//             <Chip label={filters.country} icon="🌍" onRemove={() => removeFilter('country')} />
//           )}
//           {filters.topic && (
//             <Chip label={filters.topic} icon="🏷️" onRemove={() => removeFilter('topic')} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Chip interne ──────────────────────────────────────────────────────────────
// function Chip({ label, icon, onRemove }: { label: string; icon: string; onRemove: () => void }) {
//   return (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#001A4D]/10 text-[#001A4D] rounded-full text-xs font-semibold">
//       <span>{icon}</span>
//       <span className="max-w-[140px] truncate">{label}</span>
//       <button onClick={onRemove} className="ml-0.5 hover:text-red-500 transition-colors" aria-label="Retirer ce filtre">
//         <X size={12} />
//       </button>
//     </span>
//   );
// }




























// // src/components/news/AdvancedSearch.tsx
// 'use client';
 
// import { useState } from 'react';
// import { Search, MapPin, Globe, Tag, X } from 'lucide-react';
// import api from '@/lib/api';
 
// interface SearchFilters {
//   query: string;
//   region: string;
//   country: string;
//   topic: string;
// }
 
// interface AdvancedSearchProps {
//   onSearch: (filters: SearchFilters) => void;
//   loading?: boolean;
// }
 
// const regions = [
//   'Afrique de l\'Ouest',
//   'Afrique de l\'Est',
//   'Afrique Centrale',
//   'Afrique Australe',
//   'Afrique du Nord',
//   'Europe',
//   'Asie',
//   'Amériques',
//   'Monde'
// ];
 
// const countries = [
//   'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
//   'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert',
//   'Nigeria', 'Ghana', 'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon',
//   'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda', 'Burundi',
//   'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
//   'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie',
//   'France', 'Belgique', 'Suisse', 'Canada', 'USA'
// ];
 
// const topics = [
//   'Tourisme durable', 'Éco-tourisme', 'Tourisme d\'affaires', 'Tourisme religieux',
//   'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
//   'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
//   'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
//   'Investissements', 'Développement', 'Emploi', 'Formation'
// ];
 
// export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [filters, setFilters] = useState<SearchFilters>({
//     query: '',
//     region: '',
//     country: '',
//     topic: ''
//   });
 
//   const handleSearch = () => {
//     onSearch(filters);
//     setIsOpen(false);
//   };
 
//   const handleReset = () => {
//     setFilters({
//       query: '',
//       region: '',
//       country: '',
//       topic: ''
//     });
//     onSearch({
//       query: '',
//       region: '',
//       country: '',
//       topic: ''
//     });
//   };
 
//   const hasActiveFilters = filters.query || filters.region || filters.country || filters.topic;
 
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//       {/* Barre de recherche principale */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Rechercher des actualités par mots-clés, régions, pays ou sujets..."
//             value={filters.query}
//             onChange={(e) => setFilters({ ...filters, query: e.target.value })}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
//           />
//         </div>
        
//         <div className="flex gap-2">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center ${
//               isOpen
//                 ? 'bg-blue-600 text-white border-blue-600'
//                 : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             <Globe className="w-5 h-5" />
//             <span className="hidden sm:inline ml-2">Filtres</span>
//           </button>
          
//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//           >
//             {loading ? (
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             ) : (
//               <Search className="w-4 h-4" />
//             )}
//             <span className="hidden sm:inline">Rechercher</span>
//           </button>
          
//           {hasActiveFilters && (
//             <button
//               onClick={handleReset}
//               className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//               title="Réinitialiser les filtres"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>
 
//       {/* Filtres avancés */}
//       {isOpen && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Région */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 inline mr-1" />
//                 Région
//               </label>
//               <select
//                 value={filters.region}
//                 onChange={(e) => setFilters({ ...filters, region: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//               >
//                 <option value="">Toutes les régions</option>
//                 {regions.map((region) => (
//                   <option key={region} value={region}>
//                     {region}
//                   </option>
//                 ))}
//               </select>
//             </div>
 
//             {/* Pays */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Globe className="w-4 h-4 inline mr-1" />
//                 Pays
//               </label>
//               <select
//                 value={filters.country}
//                 onChange={(e) => setFilters({ ...filters, country: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//               >
//                 <option value="">Tous les pays</option>
//                 {countries.map((country) => (
//                   <option key={country} value={country}>
//                     {country}
//                   </option>
//                 ))}
//               </select>
//             </div>
 
//             {/* Sujet */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Tag className="w-4 h-4 inline mr-1" />
//                 Sujet
//               </label>
//               <select
//                 value={filters.topic}
//                 onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//               >
//                 <option value="">Tous les sujets</option>
//                 {topics.map((topic) => (
//                   <option key={topic} value={topic}>
//                     {topic}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
 
//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
//             <button
//               onClick={handleReset}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//             >
//               Réinitialiser
//             </button>
//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
//             >
//               {loading ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <Search className="w-4 h-4" />
//               )}
//               Appliquer les filtres
//             </button>
//           </div>
//         </div>
//       )}
 
//       {/* Filtres actifs - Mobile Optimized */}
//       {hasActiveFilters && (
//         <div className="mt-4 flex flex-wrap gap-2">
//           {filters.query && (
//             <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
//               <span className="hidden sm:inline">Mots-clés:</span>
//               <span className="sm:hidden">🔍</span>
//               {filters.query}
//               <button
//                 onClick={() => setFilters({ ...filters, query: '' })}
//                 className="ml-1 hover:text-blue-900"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.region && (
//             <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
//               <span className="hidden sm:inline">Région:</span>
//               <span className="sm:hidden">📍</span>
//               {filters.region}
//               <button
//                 onClick={() => setFilters({ ...filters, region: '' })}
//                 className="ml-1 hover:text-green-900"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.country && (
//             <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
//               <span className="hidden sm:inline">Pays:</span>
//               <span className="sm:hidden">🌍</span>
//               {filters.country}
//               <button
//                 onClick={() => setFilters({ ...filters, country: '' })}
//                 className="ml-1 hover:text-purple-900"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filters.topic && (
//             <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm">
//               <span className="hidden sm:inline">Sujet:</span>
//               <span className="sm:hidden">🏷️</span>
//               {filters.topic}
//               <button
//                 onClick={() => setFilters({ ...filters, topic: '' })}
//                 className="ml-1 hover:text-orange-900"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }