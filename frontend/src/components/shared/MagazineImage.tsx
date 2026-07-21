// src/components/shared/MagazineImage.tsx
"use client";

import React, { useState } from 'react';

/**
 * Image de magazine avec fallback automatique à deux niveaux.
 *
 * Niveau 1 — src null / vide / URL cassée (403, CORS…) → FALLBACK_1
 * Niveau 2 — FALLBACK_1 absent lui aussi               → FALLBACK_2
 *
 * ── Comment choisir l'image de fallback ──────────────────────────────────────
 * Place dans ton dossier public/ l'une de ces images :
 *
 *   Option A — Logo 100% Afrique :
 *     /public/images/logo-100afrique.png  (ou .jpg, .webp)
 *     → Mettre FALLBACK_1 = '/images/logo-100afrique.png'
 *
 *   Option B — Image générique secteur tourisme :
 *     /public/images/magazine-placeholder.jpg
 *     → Image de paysage africain, carte du continent, ou visuel tourisme
 *     → Mettre FALLBACK_1 = '/images/magazine-placeholder.jpg'
 *
 *   Le FALLBACK_2 pointe vers le logo qui, lui, doit TOUJOURS exister.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 👇 Modifie ces deux chemins selon tes fichiers dans /public/images/
const FALLBACK_1 = '/images/magazine-placeholder.jpg'; // image tourisme ou logo
const FALLBACK_2 = '/logos/itourismenomade.png';      // dernier recours absolu

interface MagazineImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Permet de surcharger le fallback pour un usage spécifique */
  fallback?: string;
}

const MagazineImage: React.FC<MagazineImageProps> = ({
  src,
  alt,
  className = '',
  fallback,
}) => {
  const f1 = fallback ?? FALLBACK_1;
  const initialSrc = src && src.trim() !== '' ? src : f1;
  const [imgSrc, setImgSrc]    = useState<string>(initialSrc);
  const [errCount, setErrCount] = useState(0);

  const handleError = () => {
    setErrCount((n) => {
      const next = n + 1;
      if (next === 1) setImgSrc(f1);       // 1er échec → placeholder principal
      if (next === 2) setImgSrc(FALLBACK_2); // 2ème échec → logo (toujours là)
      return next;
    });
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default MagazineImage;
