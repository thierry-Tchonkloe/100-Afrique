// src/app/(front-office)/offres/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ShoppingCart, Check } from "lucide-react";
import { OFFERS, Offer } from "@/constants/constants";

const Categories = [
  "TOUS",
  "Display (Bannières)",
  "Display (Packs)",
  "Offres Spéciales",
  "Contenu Sponsorisé",
  "Sponsoring thématique",
  "Packages 360°",
];
const Budgets = [
  "Tous les budgets",
  "Moins de 500 €",
  "500 € - 1 500 €",
  "1 500 € - 5 000 €",
  "Plus de 5 000 €",
];

export default function NosOffres() {
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
          {Categories.map((cat) => (
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
          {Budgets.map((b) => (
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
        {filteredOffers.map((offer) => {
          const isExpanded = !!expandedOffers[offer.id];
          return (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src="/images/placeholder-offre.jpg"
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge catégorie */}
                <div className="absolute top-3 left-3">
                  <span className="bg-it-emerald-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {offer.category.toUpperCase()}
                  </span>
                </div>

                {/* Badge tag spécial */}
                {offer.tag && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-it-terracotta text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                      {offer.tag}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-it-blue mb-2 leading-tight">
                  {offer.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {offer.description}
                </p>

                <div className="text-2xl font-bold text-it-blue mb-4 flex items-baseline gap-1">
                  <span className="text-sm font-medium self-start mt-1">
                    {offer.price >= 480 &&
                    !["500 € - 1 500 €", "Plus de 5 000 €"].includes(offer.budgetRange) &&
                    offer.price !== 1500
                      ? "Dès "
                      : ""}
                  </span>
                  {offer.price.toLocaleString()} €{" "}
                  {offer.unit && (
                    <span className="text-lg font-normal text-slate-600">
                      / {offer.unit}
                    </span>
                  )}
                </div>

                {/* Toggle détails */}
                <button
                  onClick={() => toggleDetails(offer.id)}
                  className="flex items-center text-it-emerald text-sm font-semibold hover:text-it-emerald-dark w-full justify-between py-2 border-t border-gray-100 mt-4"
                >
                  Voir les détails
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Détails déroulants */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-2 text-sm text-slate-600 list-inside list-disc pl-1">
                    {offer.details.map((detail, index) => (
                      <li key={index} className="leading-relaxed">
                        {detail.includes("(Page") || detail.includes("(Rapport") ? (
                          <>
                            {detail.split("(")[0]}
                            <span className="text-it-emerald cursor-pointer hover:underline">
                              ({detail.split("(")[1]}
                            </span>
                          </>
                        ) : (
                          detail
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bouton Ajouter au devis */}
              <button
                onClick={() => toggleAddToQuote(offer.id)}
                className={`w-full py-4 text-sm font-bold transition-colors cursor-pointer rounded-b-lg border-t ${
                  quoteItems.includes(offer.id)
                    ? "bg-it-emerald text-white border-it-emerald hover:bg-it-emerald-dark"
                    : "bg-it-emerald-dark text-white border-it-emerald hover:bg-it-emerald"
                }`}
              >
                {quoteItems.includes(offer.id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Ajouté au devis
                  </span>
                ) : (
                  "Ajouter au devis"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Panier flottant */}
      {quoteItems.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-full px-6 py-4 flex items-center gap-4 border border-it-emerald-light animate-bounce-in z-50">
          <div className="relative">
            <ShoppingCart className="text-it-emerald w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-it-terracotta text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {quoteItems.length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-it-blue">
              {quoteItems.length} format{quoteItems.length > 1 ? "s" : ""}{" "}
              sélectionné{quoteItems.length > 1 ? "s" : ""}
            </span>
            <span className="text-xs text-slate-500">Demande de devis en cours</span>
          </div>
          <button className="bg-it-emerald text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-it-emerald-dark transition-colors shadow-md">
            Finaliser mon devis
          </button>
        </div>
      )}
    </main>
  );
}
