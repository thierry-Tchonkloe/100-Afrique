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
















// // src/components/shared/MagazineImage.tsx
// "use client";

// import React, { useState } from 'react';

// // Placeholder SVG aux couleurs du site (#001A4D / #F39C12).
// // Data URI embarquée : aucune requête réseau, ne peut jamais échouer.
// const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22533%22%20viewBox%3D%220%200%20400%20533%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23EEF2F8%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23DDE4EF%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22accent%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23001A4D%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23002970%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%3C%2Fdefs%3E%0A%0A%20%20%3C%21--%20Fond%20--%3E%0A%20%20%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22url%28%23bg%29%22%2F%3E%0A%0A%20%20%3C%21--%20Bande%20d%C3%A9co%20haut%20--%3E%0A%20%20%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22400%22%20height%3D%226%22%20fill%3D%22%23F39C12%22%2F%3E%0A%0A%20%20%3C%21--%20Zone%20centrale%20ic%C3%B4ne%20--%3E%0A%20%20%3Crect%20x%3D%22100%22%20y%3D%22140%22%20width%3D%22200%22%20height%3D%22160%22%20rx%3D%2216%22%20fill%3D%22url%28%23accent%29%22%20opacity%3D%220.12%22%2F%3E%0A%0A%20%20%3C%21--%20Ic%C3%B4ne%20journal%20stylis%C3%A9e%20--%3E%0A%20%20%3C%21--%20Corps%20du%20journal%20--%3E%0A%20%20%3Crect%20x%3D%22148%22%20y%3D%22168%22%20width%3D%22104%22%20height%3D%22104%22%20rx%3D%2210%22%20fill%3D%22url%28%23accent%29%22%20opacity%3D%220.25%22%2F%3E%0A%20%20%3C%21--%20Lignes%20de%20texte%20stylis%C3%A9es%20--%3E%0A%20%20%3Crect%20x%3D%22163%22%20y%3D%22188%22%20width%3D%2274%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.4%22%2F%3E%0A%20%20%3Crect%20x%3D%22163%22%20y%3D%22202%22%20width%3D%2256%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.25%22%2F%3E%0A%20%20%3Crect%20x%3D%22163%22%20y%3D%22215%22%20width%3D%2274%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.25%22%2F%3E%0A%20%20%3Crect%20x%3D%22163%22%20y%3D%22228%22%20width%3D%2240%22%20height%3D%225%22%20rx%3D%222.5%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.25%22%2F%3E%0A%20%20%3C%21--%20Accent%20orange%20petite%20ligne%20--%3E%0A%20%20%3Crect%20x%3D%22163%22%20y%3D%22244%22%20width%3D%2224%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23F39C12%22%20opacity%3D%220.7%22%2F%3E%0A%20%20%3C%21--%20Coin%20pli%C3%A9%20--%3E%0A%20%20%3Cpath%20d%3D%22M232%20168%20L252%20168%20L252%20188%20Z%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.15%22%2F%3E%0A%0A%20%20%3C%21--%20Texte%20placeholder%20bas%20--%3E%0A%20%20%3Crect%20x%3D%2260%22%20y%3D%22340%22%20width%3D%22280%22%20height%3D%228%22%20rx%3D%224%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.18%22%2F%3E%0A%20%20%3Crect%20x%3D%2280%22%20y%3D%22358%22%20width%3D%22240%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.12%22%2F%3E%0A%20%20%3Crect%20x%3D%22100%22%20y%3D%22374%22%20width%3D%22200%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.10%22%2F%3E%0A%0A%20%20%3C%21--%20S%C3%A9parateur%20--%3E%0A%20%20%3Crect%20x%3D%2260%22%20y%3D%22402%22%20width%3D%22280%22%20height%3D%221%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.08%22%2F%3E%0A%0A%20%20%3C%21--%20Tag%20source%20--%3E%0A%20%20%3Crect%20x%3D%2260%22%20y%3D%22418%22%20width%3D%2280%22%20height%3D%2222%22%20rx%3D%2211%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.12%22%2F%3E%0A%20%20%3Crect%20x%3D%2266%22%20y%3D%22424%22%20width%3D%2268%22%20height%3D%2210%22%20rx%3D%225%22%20fill%3D%22%23001A4D%22%20opacity%3D%220.2%22%2F%3E%0A%0A%20%20%3C%21--%20Point%20orange%20--%3E%0A%20%20%3Ccircle%20cx%3D%22340%22%20cy%3D%22429%22%20r%3D%225%22%20fill%3D%22%23F39C12%22%20opacity%3D%220.6%22%2F%3E%0A%3C%2Fsvg%3E";

// interface MagazineImageProps {
//   src?: string | null;
//   alt: string;
//   className?: string;
//   /** URL de fallback personnalisée (par défaut : /images/magazine-placeholder.jpg) */
//   fallback?: string;
// }

// /**
//  * Image de magazine avec fallback à deux niveaux.
//  *
//  * Cas couverts :
//  *   1. src null / undefined / "" → placeholder SVG immédiatement (0 requête)
//  *   2. URL présente mais non chargeable (403, CORS, DNS fail) → onError → fallback fichier
//  *   3. Fichier fallback absent lui aussi → SVG embarqué (toujours disponible)
//  */
// const MagazineImage: React.FC<MagazineImageProps> = ({
//   src,
//   alt,
//   className = '',
//   fallback = '/images/magazine-placeholder.jpg',
// }) => {
//   const initialSrc = src && src.trim() !== '' ? src : PLACEHOLDER_SVG;
//   const [imgSrc, setImgSrc]   = useState<string>(initialSrc);
//   const [errCount, setErrCount] = useState(0);

//   const handleError = () => {
//     setErrCount((n) => {
//       const next = n + 1;
//       if (next === 1 && imgSrc !== fallback)      setImgSrc(fallback);
//       else if (next >= 2)                         setImgSrc(PLACEHOLDER_SVG);
//       return next;
//     });
//   };

//   return (
//     <img
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       onError={handleError}
//       loading="lazy"
//     />
//   );
// };

// export default MagazineImage;














// // src/components/shared/MagazineImage.tsx
// "use client";

// import React, { useState } from 'react';

// // Placeholder SVG embarqué — fonctionne même si /images/magazine-placeholder.jpg
// // est absent, et ne génère aucune requête HTTP supplémentaire.
// const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23EFF2F7'/%3E%3Crect x='40' y='40' width='320' height='4' rx='2' fill='%23CBD5E1'/%3E%3Crect x='40' y='56' width='240' height='4' rx='2' fill='%23CBD5E1'/%3E%3Crect x='40' y='80' width='320' height='180' rx='8' fill='%23D1D9E6'/%3E%3Ccircle cx='200' cy='170' r='36' fill='%23B8C4D4'/%3E%3Cpath d='M183 170 L200 148 L217 170 Z' fill='%23EFF2F7'/%3E%3Crect x='40' y='280' width='320' height='8' rx='4' fill='%23CBD5E1'/%3E%3Crect x='40' y='300' width='260' height='8' rx='4' fill='%23CBD5E1'/%3E%3Crect x='40' y='320' width='200' height='8' rx='4' fill='%23CBD5E1'/%3E%3Crect x='40' y='360' width='320' height='6' rx='3' fill='%23D1D9E6'/%3E%3Crect x='40' y='378' width='280' height='6' rx='3' fill='%23D1D9E6'/%3E%3Crect x='40' y='396' width='300' height='6' rx='3' fill='%23D1D9E6'/%3E%3Crect x='40' y='440' width='100' height='32' rx='16' fill='%23001A4D' opacity='0.15'/%3E%3C/svg%3E`;

// interface MagazineImageProps {
//   src?: string | null;
//   alt: string;
//   className?: string;
//   /** Ratio du conteneur — à passer si tu veux que le wrapper soit géré ici */
//   aspectRatio?: string;
//   /** URL de fallback personnalisée (par défaut : placeholder SVG embarqué) */
//   fallback?: string;
// }

// /**
//  * Image de magazine avec fallback automatique.
//  *
//  * Cas couverts :
//  *   1. src null / undefined / string vide → placeholder immédiat
//  *   2. URL présente mais image non chargeable (403, CORS, timeout) → onError → placeholder
//  *   3. Placeholder lui-même qui échouerait → data URI SVG embarqué (jamais bloqué)
//  */
// const MagazineImage: React.FC<MagazineImageProps> = ({
//   src,
//   alt,
//   className = '',
//   fallback = '/images/magazine-placeholder.jpg',
// }) => {
//   // Normalise src : null / undefined / '' → utilise directement le fallback
//   const initialSrc = src && src.trim() !== '' ? src : fallback;
//   const [imgSrc, setImgSrc] = useState<string>(initialSrc);
//   const [failed, setFailed] = useState(false);

//   const handleError = () => {
//     if (!failed) {
//       setFailed(true);
//       // Si le fallback personnalisé échoue lui aussi → SVG embarqué (toujours disponible)
//       setImgSrc(imgSrc === fallback ? PLACEHOLDER_SVG : fallback);
//     } else {
//       // Dernier recours absolu : SVG embarqué
//       setImgSrc(PLACEHOLDER_SVG);
//     }
//   };

//   return (
//     <img
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       onError={handleError}
//       loading="lazy"
//     />
//   );
// };

// export default MagazineImage;