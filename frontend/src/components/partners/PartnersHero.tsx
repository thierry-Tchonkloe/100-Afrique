// src/components/partners/PartnersHero.tsx
"use client";

import React from 'react';
import Image from 'next/image';

interface PartnersHeroProps {
  onOpenOffers: () => void;
  data?: {
    title: string;
    description: string;
    imageUrl: string;
  };
}

const PartnersHero = ({ onOpenOffers, data }: PartnersHeroProps) => {
  const content = {
    title: data?.title || "Devenez partenaire du média référence du tourisme afro-européen",
    description: data?.description || "Augmentez votre visibilité auprès des professionnels, offices de tourisme et voyageurs passionnés.",
    imageUrl: data?.imageUrl || "/images/partners-hero.png",
  };

  return (
    <section className="bg-it-emerald-dark py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          <div className="lg:w-1/2 space-y-8 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-[1.1] tracking-tight">
              {content.title}
            </h1>
            <p className="text-white/75 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              {content.description}
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenOffers}
                className="bg-it-terracotta hover:bg-it-terracotta-dark text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/20"
              >
                Découvrir nos offres
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/3] relative bg-slate-200">
                <Image
                  src={content.imageUrl}
                  alt="Partenariat Waxeho"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                  onError={() => console.error("Erreur de chargement de l'image:", content.imageUrl)}
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-it-gold/30 rounded-2xl z-0" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default PartnersHero;












// // src/components/partners/PartnersHero.tsx
// "use client";

// import React from 'react';
// import Image from 'next/image';

// interface PartnersHeroProps {
//   onOpenOffers: () => void;
//   data?: {
//     title: string;
//     description: string;
//     imageUrl: string;
//   };
// }

// const PartnersHero = ({ onOpenOffers, data }: PartnersHeroProps) => {
//   const content = {
//     title: data?.title || "Devenez partenaire du média référence du tourisme afro-européen",
//     description: data?.description || "Augmentez votre visibilité auprès des professionnels, offices de tourisme et voyageurs passionnés.",
//     imageUrl: data?.imageUrl || "/images/partners-hero.png" // ✅ Chemin relatif depuis /public
//   };

//   return (
//     <section className="bg-[#1D3A8A] py-16 md:py-24 px-6 overflow-hidden">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
//           <div className="lg:w-1/2 space-y-8 text-white">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase leading-[1.1] tracking-tight">
//               {content.title}
//             </h1>
            
//             <p className="text-blue-100/80 text-lg md:text-xl font-light leading-relaxed max-w-xl">
//               {content.description}
//             </p>

//             <div className="pt-4">
//               <button
//                 onClick={onOpenOffers}
//                 className="bg-[#F19300] hover:bg-[#d98400] text-white font-bold px-10 py-5 rounded-lg text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/20"
//               >
//                 Découvrir nos offres
//               </button>
//             </div>
//           </div>

//           <div className="lg:w-1/2 relative">
//             <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
//               <div className="aspect-[4/3] relative bg-slate-200">
//                 {/* ✅ next/image avec chemins corrects */}
//                 <Image
//                   src={content.imageUrl}
//                   alt="Partenariat Waxeho"
//                   fill
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   className="object-cover"
//                   priority
//                   // ✅ Gestion d'erreur
//                   onError={(e) => {
//                     console.error("Erreur de chargement de l'image:", content.imageUrl);
//                   }}
//                 />
//               </div>
//             </div>
            
//             <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#F19300]/30 rounded-2xl z-0" />
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default PartnersHero;