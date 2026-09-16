// src/components/offres/OfferCard.tsx
"use client";
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { Offer } from '@/constants/constants';

interface OfferCardProps {
  offer: Offer;
  isExpanded: boolean;
  isInQuote: boolean;
  onToggleDetails: (id: number) => void;
  onToggleQuote: (id: number) => void;
}

const OfferCard = ({ offer, isExpanded, isInQuote, onToggleDetails, onToggleQuote }: OfferCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden group">

    {/* Image */}
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      <img
        src="/images/placeholder-offre.jpg"
        alt={offer.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute top-3 left-3">
        <span className="bg-it-emerald-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
          {offer.category.toUpperCase()}
        </span>
      </div>

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
        onClick={() => onToggleDetails(offer.id)}
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
      onClick={() => onToggleQuote(offer.id)}
      className={`w-full py-4 text-sm font-bold transition-colors cursor-pointer rounded-b-lg border-t ${
        isInQuote
          ? "bg-it-emerald text-white border-it-emerald hover:bg-it-emerald-dark"
          : "bg-it-emerald-dark text-white border-it-emerald hover:bg-it-emerald"
      }`}
    >
      {isInQuote ? (
        <span className="flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> Ajouté au devis
        </span>
      ) : (
        "Ajouter au devis"
      )}
    </button>
  </div>
);

export default OfferCard;