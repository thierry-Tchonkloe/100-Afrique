// src/components/shared/TopBar.tsx
"use client";

import React from "react";
import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopBarProps {
  zoneSlug?: string;
  showDots?: boolean;
  className?: string;
}

// ─── Composant principal : TopBar ─────────────────────────────────────────────

const TopBar = ({ zoneSlug = "top-banner-accueils", showDots = true, className = "" }: TopBarProps) => {
  return (
    <div className="w-full bg-it-gray-light flex items-center justify-between border-b border-gray-200">
      <AdvertisingBanner
        zoneSlug={zoneSlug}
        showDots={showDots}
        className={className}
        imageOnly // ← seule l'image est affichée ici, pas d'Annonceur/Titre/Description/CTA
      />
    </div>
  );
};

export default TopBar;











// // src/components/shared/TopBar.tsx
// "use client";

// import React, { useState, } from "react";
// import { AdvertisingBanner } from "@/components/AdvertisingBanner";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface TopBarProps {
//   zoneSlug?: string;
//   showDots?: boolean;
//   className?: string;
// }

// // ─── Composant principal : TopBar ─────────────────────────────────────────────

// const TopBar = ({ zoneSlug = "top-banner-accueils", showDots = true, className = "",}: TopBarProps) => {
//   return (
//     <div className="w-full bg-it-gray-light flex items-center justify-between border-b border-gray-200">
//       <AdvertisingBanner zoneSlug={zoneSlug} showDots={showDots} className={className} />
//     </div>
//   );
// };

// export default TopBar;