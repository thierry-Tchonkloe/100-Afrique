// src/components/partners/PartnerLogos.tsx
"use client";

import React from 'react';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

interface PartnerLogosProps {
  partners?: Partner[];
}

const PartnerLogos = ({ partners }: PartnerLogosProps) => {
  const defaultPartners: Partner[] = [
    { id: '1', name: "MINISTÈRE TOURISME", logoUrl: "" },
    { id: '2', name: "OFFICE DE TOURISME", logoUrl: "" },
    { id: '3', name: "AIR AFRIQUE", logoUrl: "" },
    { id: '4', name: "HOTELS GROUP", logoUrl: "" },
    { id: '5', name: "TRAVEL AGENCY", logoUrl: "" },
    { id: '6', name: "TOURISM BOARD", logoUrl: "" },
  ];

  const data = partners || defaultPartners;

  // Duplicate items to create a seamless infinite loop
  const loopItems = [...data, ...data, ...data];

  return (
    <section className="py-20 bg-slate-50/50 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.2em] mb-16">
          Ils nous font confiance
        </h2>
      </div>

      {/* Marquee wrapper – full bleed so items scroll edge-to-edge */}
      <div className="relative w-full">
        {/* Left & right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none" />

        <div
          className="flex gap-6 w-max"
          style={{
            animation: 'marquee 28s linear infinite',
          }}
        >
          {loopItems.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="group flex items-center justify-center px-8 py-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#F19300]/40 transition-all duration-300 min-w-[180px] min-h-[100px] shrink-0"
            >
              {partner.logoUrl ? (
                <div className="relative w-28 h-10 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest group-hover:text-it-emerald-dark transition-colors leading-relaxed">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe injection */}
      <style jsx global>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
};

export default PartnerLogos;
















// // src/components/partners/PartnerLogos.tsx
// "use client";

// import React from 'react';
// import Image from 'next/image';

// interface Partner {
//   id: string;
//   name: string;
//   logoUrl: string;
// }

// interface PartnerLogosProps {
//   partners?: Partner[];
// }

// const PartnerLogos = ({ partners }: PartnerLogosProps) => {
//   // Données par défaut conformes à la capture (Placeholders textuels)
//   const defaultPartners: Partner[] = [
//     { id: '1', name: "MINISTÈRE TOURISME", logoUrl: "" },
//     { id: '2', name: "OFFICE DE TOURISME", logoUrl: "" },
//     { id: '3', name: "AIR AFRIQUE", logoUrl: "" },
//     { id: '4', name: "HOTELS GROUP", logoUrl: "" },
//     { id: '5', name: "TRAVEL AGENCY", logoUrl: "" },
//     { id: '6', name: "TOURISM BOARD", logoUrl: "" },
//   ];

//   const data = partners || defaultPartners;

//   return (
//     <section className="py-20 bg-slate-50/50 px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Titre de la section */}
//         <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3E50] text-center uppercase tracking-[0.2em] mb-16">
//           Ils nous font confiance
//         </h2>

//         {/* Grille des logos */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//           {data.map((partner) => (
//             <div 
//               key={partner.id}
//               className="group flex items-center justify-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#F19300]/30 transition-all duration-300 min-h-[120px]"
//             >
//               {partner.logoUrl ? (
//                 <div className="relative w-full h-12 grayscale group-hover:grayscale-0 transition-all duration-500">
//                   <Image
//                     src={partner.logoUrl}
//                     alt={partner.name}
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//               ) : (
//                 /* Rendu texte si le logo n'est pas encore disponible (comme sur ta capture) */
//                 <span className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest group-hover:text-[#1D3A8A] transition-colors">
//                   {partner.name}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PartnerLogos;


