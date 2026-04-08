// src/components/news/AdvancedSearch.tsx
'use client';
 
import { useState } from 'react';
import { Search, MapPin, Globe, Tag, X } from 'lucide-react';
import api from '@/lib/api';
 
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
  'Afrique de l\'Ouest',
  'Afrique de l\'Est',
  'Afrique Centrale',
  'Afrique Australe',
  'Afrique du Nord',
  'Europe',
  'Asie',
  'Amériques',
  'Monde'
];
 
const countries = [
  'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
  'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert',
  'Nigeria', 'Ghana', 'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon',
  'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda', 'Burundi',
  'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
  'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie',
  'France', 'Belgique', 'Suisse', 'Canada', 'USA'
];
 
const topics = [
  'Tourisme durable', 'Éco-tourisme', 'Tourisme d\'affaires', 'Tourisme religieux',
  'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
  'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
  'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
  'Investissements', 'Développement', 'Emploi', 'Formation'
];
 
export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    region: '',
    country: '',
    topic: ''
  });
 
  const handleSearch = () => {
    onSearch(filters);
    setIsOpen(false);
  };
 
  const handleReset = () => {
    setFilters({
      query: '',
      region: '',
      country: '',
      topic: ''
    });
    onSearch({
      query: '',
      region: '',
      country: '',
      topic: ''
    });
  };
 
  const hasActiveFilters = filters.query || filters.region || filters.country || filters.topic;
 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des actualités par mots-clés, régions, pays ou sujets..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center ${
              isOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">Filtres</span>
          </button>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Rechercher</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Réinitialiser les filtres"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
 
      {/* Filtres avancés */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Région */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Région
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Toutes les régions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
 
            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Pays
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Tous les pays</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
 
            {/* Sujet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Sujet
              </label>
              <select
                value={filters.topic}
                onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Tous les sujets</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
 
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Réinitialiser
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
 
      {/* Filtres actifs - Mobile Optimized */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
              <span className="hidden sm:inline">Mots-clés:</span>
              <span className="sm:hidden">🔍</span>
              {filters.query}
              <button
                onClick={() => setFilters({ ...filters, query: '' })}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.region && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm">
              <span className="hidden sm:inline">Région:</span>
              <span className="sm:hidden">📍</span>
              {filters.region}
              <button
                onClick={() => setFilters({ ...filters, region: '' })}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.country && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
              <span className="hidden sm:inline">Pays:</span>
              <span className="sm:hidden">🌍</span>
              {filters.country}
              <button
                onClick={() => setFilters({ ...filters, country: '' })}
                className="ml-1 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.topic && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm">
              <span className="hidden sm:inline">Sujet:</span>
              <span className="sm:hidden">🏷️</span>
              {filters.topic}
              <button
                onClick={() => setFilters({ ...filters, topic: '' })}
                className="ml-1 hover:text-orange-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}