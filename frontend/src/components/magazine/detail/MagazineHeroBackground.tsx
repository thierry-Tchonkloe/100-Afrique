// src/components/magazine/detail/MagazineHeroBackground.tsx
"use client";
import React, { useState } from 'react';

interface MagazineHeroBackgroundProps {
  src?: string | null;
  active: boolean;
}

const FALLBACK = "/images/magazine-placeholder.jpg";

const MagazineHeroBackground = ({ src, active }: MagazineHeroBackgroundProps) => {
  const resolved = src?.trim() || FALLBACK;
  const [bgSrc, setBgSrc] = useState(resolved);

  return (
    <>
      <img src={bgSrc} alt="" aria-hidden className="sr-only" onError={() => setBgSrc(FALLBACK)} />
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform ease-linear"
        style={{
          backgroundImage: `url(${bgSrc})`,
          transitionDuration: "10000ms",
          transform: active ? "scale(1.06)" : "scale(1)",
        }}
      />
    </>
  );
};

export default MagazineHeroBackground;