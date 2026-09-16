// src/components/offres/useOfferFilters.ts
"use client";
import { useMemo, useState } from 'react';
import { OFFERS, type Offer } from '@/constants/constants';

export const CATEGORIES = [
  "TOUS",
  "Display (Bannières)",
  "Display (Packs)",
  "Offres Spéciales",
  "Contenu Sponsorisé",
  "Sponsoring thématique",
  "Packages 360°",
];

export const BUDGETS = [
  "Tous les budgets",
  "Moins de 500 €",
  "500 € - 1 500 €",
  "1 500 € - 5 000 €",
  "Plus de 5 000 €",
];

export function useOfferFilters() {
  const [activeCat, setActiveCat]       = useState("TOUS");
  const [activeBudget, setActiveBudget] = useState("Tous les budgets");
  const [search, setSearch]             = useState("");
  const [quoteItems, setQuoteItems]     = useState<number[]>([]);
  const [expandedOffers, setExpandedOffers] = useState<Record<number, boolean>>({});

  const filteredOffers = useMemo(() => {
    return OFFERS.filter((offer) => {
      const matchCat    = activeCat === "TOUS" || offer.category === activeCat;
      const matchBudget = activeBudget === "Tous les budgets" || offer.budgetRange === activeBudget;
      const matchSearch = offer.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchBudget && matchSearch;
    });
  }, [activeCat, activeBudget, search]);

  const toggleAddToQuote = (id: number) => {
    setQuoteItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDetails = (id: number) => {
    setExpandedOffers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    activeCat, setActiveCat,
    activeBudget, setActiveBudget,
    search, setSearch,
    filteredOffers,
    quoteItems, toggleAddToQuote,
    expandedOffers, toggleDetails,
  };
}

export type { Offer };