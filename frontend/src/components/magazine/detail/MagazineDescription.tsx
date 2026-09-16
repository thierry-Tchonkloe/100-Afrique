// src/components/magazine/detail/MagazineDescription.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Globe } from 'lucide-react';
import type { Magazine } from '@/services/Dashboard/magazineService';

interface MagazineDescriptionProps {
  magazine: Magazine;
  description: string;
  shortDesc: string;
  isLong: boolean;
}

const MagazineDescription = ({ magazine, description, shortDesc, isLong }: MagazineDescriptionProps) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-5" style={{ color: "#B85C38" }}>
        Description du magazine
      </p>

      <div className="text-[15px] leading-[1.85] text-gray-600 max-w-2xl">
        {showFull || !isLong ? description : shortDesc}
      </div>

      {isLong && (
        <button
          onClick={() => setShowFull((p) => !p)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
          style={{ color: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.color = "#1A5C43")}
        >
          {showFull ? "Réduire" : "Lire plus"}
          <ChevronDown size={15} className={`transition-transform ${showFull ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Info embed */}
      <div className="mt-10 p-5 rounded-2xl" style={{ background: "rgba(26,92,67,0.05)", border: "1px solid rgba(26,92,67,0.1)" }}>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-3" style={{ color: "#1A5C43" }}>Aperçu embarqué</p>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          L&apos;aperçu s&apos;ouvre dans une fenêtre modale. PDF, Issuu et FlipHTML5 sont supportés.
          Si la source bloque l&apos;intégration, un lien direct vous est proposé.
        </p>
        <a
          href={magazine.readOnlineUrl || magazine.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
          style={{ color: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.color = "#1A5C43")}
        >
          <Globe size={14} /> Ouvrir la source originale
        </a>
      </div>

      {/* Retour */}
      <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          <ArrowLeft size={13} /> Retour aux actualités
        </Link>
      </div>
    </div>
  );
};

export default MagazineDescription;