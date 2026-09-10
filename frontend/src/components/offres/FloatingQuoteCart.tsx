// src/components/offres/FloatingQuoteCart.tsx
"use client";
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingQuoteCartProps {
  count: number;
}

const FloatingQuoteCart = ({ count }: FloatingQuoteCartProps) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white shadow-2xl rounded-full px-6 py-4 flex items-center gap-4 border border-it-emerald-light animate-bounce-in z-50">
      <div className="relative">
        <ShoppingCart className="text-it-emerald w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-it-terracotta text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
          {count}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-it-blue">
          {count} format{count > 1 ? "s" : ""}{" "}
          sélectionné{count > 1 ? "s" : ""}
        </span>
        <span className="text-xs text-slate-500">Demande de devis en cours</span>
      </div>
      <button className="bg-it-emerald text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-it-emerald-dark transition-colors shadow-md">
        Finaliser mon devis
      </button>
    </div>
  );
};

export default FloatingQuoteCart;