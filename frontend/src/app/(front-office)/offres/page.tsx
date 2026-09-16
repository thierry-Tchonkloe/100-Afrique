// src/app/(front-office)/offres/page.tsx
"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { useOfferFilters, CATEGORIES, BUDGETS } from '@/components/offres/useOfferFilters';
import OfferCard from '@/components/offres/OfferCard';
import FloatingQuoteCart from '@/components/offres/FloatingQuoteCart';

export default function NosOffres() {
  const {
    activeCat, setActiveCat,
    activeBudget, setActiveBudget,
    search, setSearch,
    filteredOffers,
    quoteItems, toggleAddToQuote,
    expandedOffers, toggleDetails,
  } = useOfferFilters();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-it-blue mb-2">
          Choisissez vos formats 2026
        </h1>
        <p className="text-slate-500">
          Ajoutez au devis, et recevez une proposition sous 24h ouvrées.
        </p>
      </div>

      {/* Navigation Catégories */}
      <div className="flex justify-center mb-8 border-b border-gray-200 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 whitespace-nowrap px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeCat === cat
                  ? "text-it-emerald-dark border-b-2 border-it-emerald-dark"
                  : "text-slate-500 hover:text-it-emerald"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres Recherche & Budget */}
      <div className="max-w-4xl mx-auto mb-10 space-y-6 px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un format..."
            className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-it-emerald/30 outline-none text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBudget(b)}
              className={`px-5 py-2 rounded-full border cursor-pointer text-sm transition-all ${
                activeBudget === b
                  ? "bg-it-emerald-dark border-it-emerald text-white shadow-md font-medium"
                  : "bg-white border-gray-300 text-slate-600 hover:border-it-emerald hover:text-it-emerald"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {filteredOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isExpanded={!!expandedOffers[offer.id]}
            isInQuote={quoteItems.includes(offer.id)}
            onToggleDetails={toggleDetails}
            onToggleQuote={toggleAddToQuote}
          />
        ))}
      </div>

      <FloatingQuoteCart count={quoteItems.length} />
    </main>
  );
}