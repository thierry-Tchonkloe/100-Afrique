// src/components/shared/Footer.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const SECTEURS = [
  { label: 'Hôtellerie',         slug: 'hotellerie'       },
  { label: 'Transport',          slug: 'transport'        },
  { label: 'Restauration',       slug: 'restauration'     },
  { label: "Voyages d'Affaires", slug: 'voyages-affaires' },
  { label: 'MICE & Événements',  slug: 'mice-evenements'  },
  { label: 'Divertissement',     slug: 'divertissement'   },
  { label: 'Tourisme Durable',   slug: 'tourisme-durable' },
];

const Footer = () => {
  return (
    <footer className="w-full pt-16 pb-8" style={{ backgroundColor: '#1A5C43', color: '#ffffff' }}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* --- ZONE PRINCIPALE (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Colonne 1 : À Propos & Réseaux */}
          <div className="space-y-6">
            <p className="text-sm leading-relaxed" style={{ color: '#D4EDE5' }}>
              Le média de référence dédié au tourisme international et africain.
              Une plateforme interactive pour les professionnels et passionnés du secteur.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <Icon
                  key={i}
                  size={20}
                  className="cursor-pointer transition-colors"
                  style={{ color: '#D4EDE5' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                />
              ))}
            </div>
          </div>

          {/* Colonne 2 : Plan du Site */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Plan du Site
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#D4EDE5' }}>
              {[
                { href: '/actualites',  label: 'Actualités du Tourisme'       },
                { href: '/evenements',  label: 'Salons & Événements'           },
                { href: '/partenaires', label: 'Partenaires & Annonceurs'      },
                { href: '/destinations',label: 'Destinations Afrique & Monde' },
                { href: '/videos',      label: 'Vidéos / Web TV'               },
                { href: '/offres',      label: 'Nos offres'                    },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors"
                    style={{ color: '#D4EDE5' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/emploi"
                  className="font-bold transition-colors"
                  style={{ color: '#C8A84B' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#C8A84B')}
                >
                  Espace EMPLOI
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Secteurs */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Secteurs
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#D4EDE5' }}>
              {SECTEURS.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/secteurs/${slug}`}
                    className="transition-colors"
                    style={{ color: '#D4EDE5' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4
              className="font-bold text-lg mb-6 uppercase tracking-wider"
              style={{ color: '#C8A84B' }}
            >
              Contact
            </h4>
            <ul className="space-y-4 text-sm mb-6" style={{ color: '#D4EDE5' }}>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0" style={{ color: '#C8A84B' }} />
                <span>Siège Social, Quartier International,<br />Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" style={{ color: '#C8A84B' }} />
                <span>+229 01 97 44 80 97</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" style={{ color: '#C8A84B' }} />
                <span>contact@100-afrique.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- BARRE DE COPYRIGHT --- */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#D4EDE5' }}
        >
          <p>© {new Date().getFullYear()} 100% Afrique. Tous droits réservés.</p>
          <div className="flex gap-6">
            {[
              { href: '/mentions-legales', label: 'Mentions Légales'              },
              { href: '/confidentialite',  label: 'Politique de Confidentialité' },
              { href: '/cookies',          label: 'Gestion des Cookies'           },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ color: '#D4EDE5' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#D4EDE5')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;













// // src/components/shared/Footer.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

// // ─── Mapping secteurs ────────────────────────────────────────────────────────
// // Chaque secteur a son slug correspondant à la page /secteurs/[slug]

// const SECTEURS = [
//   { label: 'Hôtellerie',          slug: 'hotellerie'    },
//   { label: 'Transport',           slug: 'transport'     },
//   { label: 'Restauration',        slug: 'restauration'  },
//   { label: "Voyages d'Affaires",  slug: 'voyages-affaires'       },
//   { label: 'MICE & Événements',   slug: 'mice-evenements'          },
//   { label: 'Divertissement',      slug: 'divertissement'},
//   { label: 'Tourisme Durable',    slug: 'tourisme-durable'       },
// ];

// const Footer = () => {
//   return (
//     <footer className="w-full bg-[#001A4D] text-white pt-16 pb-8">
//       <div className="max-w-[1400px] mx-auto px-6">
        
//         {/* --- ZONE PRINCIPALE (GRID) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
//           {/* Colonne 1 : À Propos & Logos */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               {/* Logos conditionnels à activer si nécessaire */}
//             </div>
//             <p className="text-gray-300 text-sm leading-relaxed">
//               Le média de référence dédié au tourisme international et africain. 
//               Une plateforme interactive pour les professionnels et passionnés du secteur.
//             </p>
//             <div className="flex gap-4">
//               <Facebook size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Twitter size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Linkedin size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Youtube size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Instagram size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//             </div>
//           </div>

//           {/* Colonne 2 : Navigation Rapide */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Plan du Site</h4>
//             <ul className="space-y-3 text-sm text-gray-300">
//               <li><Link href="/actualites"   className="hover:text-white transition-colors">Actualités du Tourisme</Link></li>
//               <li><Link href="/evenements"   className="hover:text-white transition-colors">Salons & Événements</Link></li>
//               <li><Link href="/partenaires"  className="hover:text-white transition-colors">Partenaires & Annonceurs</Link></li>
//               <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations Afrique & Monde</Link></li>
//               <li><Link href="/videos"       className="hover:text-white transition-colors">Vidéos / Web TV</Link></li>
//               <li><Link href="/offres"       className="hover:text-white transition-colors">Nos offres</Link></li>
//               <li><Link href="/emploi"       className="hover:text-white transition-colors font-bold text-orange-400">Espace EMPLOI</Link></li>
//             </ul>
//           </div>

//           {/* Colonne 3 : Catégories Métiers — chaque lien pointe vers /secteurs/[slug] */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Secteurs</h4>
//             <ul className="space-y-3 text-sm text-gray-300">
//               {SECTEURS.map(({ label, slug }) => (
//                 <li key={slug}>
//                   <Link
//                     href={`/secteurs/${slug}`}
//                     className="hover:text-white transition-colors"
//                   >
//                     {label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Colonne 4 : Contact & Newsletter */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Contact</h4>
//             <ul className="space-y-4 text-sm text-gray-300 mb-6">
//               <li className="flex items-start gap-3">
//                 <MapPin size={18} className="text-orange-400 shrink-0" />
//                 <span>Siège Social, Quartier International, <br/>Cotonou, Bénin</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone size={18} className="text-orange-400 shrink-0" />
//                 <span>+229 01 97 44 80 97</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail size={18} className="text-orange-400 shrink-0" />
//                 <span>contact@100-afrique.com</span>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* --- BARRE DE COPYRIGHT --- */}
//         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
//           <p>© {new Date().getFullYear()} 100% Afrique. Tous droits réservés.</p>
//           <div className="flex gap-6">
//             <Link href="/mentions-legales"  className="hover:text-white">Mentions Légales</Link>
//             <Link href="/confidentialite"   className="hover:text-white">Politique de Confidentialité</Link>
//             <Link href="/cookies"           className="hover:text-white">Gestion des Cookies</Link>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;


























// // src/components/shared/Footer.tsx
// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="w-full bg-[#001A4D] text-white pt-16 pb-8">
//       <div className="max-w-[1400px] mx-auto px-6">
        
//         {/* --- ZONE PRINCIPALE (GRID) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
//           {/* Colonne 1 : À Propos & Logos */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-2">
//               {/* <div className="bg-white p-1 rounded-sm"> */}
//                 {/* Logo WAXEHO */}
//                 {/* <img src="/logos/waxeho.png" alt="Waxeho" className="h-10 object-contain" />
//               </div>
//               <div className="h-8 w-[1px] bg-gray-500 mx-1"></div>
//               <div className="bg-white p-1 rounded-sm"> */}
//                 {/* Logo iTourisme TV */}
//                 {/* <img src="/logos/itourisme.png" alt="iTourisme TV" className="h-10 object-contain" />
//               </div> */}
//             </div>
//             <p className="text-gray-300 text-sm leading-relaxed">
//               Le média de référence dédié au tourisme international et africain. 
//               Une plateforme interactive pour les professionnels et passionnés du secteur.
//             </p>
//             <div className="flex gap-4">
//               <Facebook size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Twitter size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Linkedin size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Youtube size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//               <Instagram size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
//             </div>
//           </div>

//           {/* Colonne 2 : Navigation Rapide */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Plan du Site</h4>
//             <ul className="space-y-3 text-sm text-gray-300">
//               <li><Link href="/actualites" className="hover:text-white transition-colors">Actualités du Tourisme</Link></li>
//               <li><Link href="/evenements" className="hover:text-white transition-colors">Salons & Événements</Link></li>
//               <li><Link href="/partenaires" className="hover:text-white transition-colors">Partenaires & Annonceurs</Link></li>
//               <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations Afrique & Monde</Link></li>
//               <li><Link href="/videos" className="hover:text-white transition-colors">Vidéos / Web TV</Link></li>
//               <li><Link href="/offres" className="hover:text-white transition-colors">Nos offres</Link></li>
//               <li><Link href="/emploi" className="hover:text-white transition-colors font-bold text-orange-400">Espace EMPLOI</Link></li>
//             </ul>
//           </div>

//           {/* Colonne 3 : Catégories Métiers */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Secteurs</h4>
//             <ul className="space-y-3 text-sm text-gray-300">
//               <li><Link href="/secteurs/hotellerie" className="hover:text-white transition-colors">Hôtellerie</Link></li>
//               <li><Link href="/secteurs/transport" className="hover:text-white transition-colors">Transport</Link></li>
//               <li><Link href="/secteurs/restauration" className="hover:text-white transition-colors">Restauration</Link></li>
//               <li><Link href="/secteurs/voyages" className="hover:text-white transition-colors">Voyages d'Affaires</Link></li>
//               <li><Link href="/secteurs/mice" className="hover:text-white transition-colors">MICE & Événements</Link></li>
//               <li><Link href="/secteurs/divertissement" className="hover:text-white transition-colors">Divertissement</Link></li>
//               <li><Link href="/secteurs/durable" className="hover:text-white transition-colors">Tourisme Durable</Link></li>
//             </ul>
//           </div>

//           {/* Colonne 4 : Contact & Newsletter */}
//           <div>
//             <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Contact</h4>
//             <ul className="space-y-4 text-sm text-gray-300 mb-6">
//               <li className="flex items-start gap-3">
//                 <MapPin size={18} className="text-orange-400 shrink-0" />
//                 <span>Siège Social, Quartier International, <br/>Cotonou, Bénin</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone size={18} className="text-orange-400 shrink-0" />
//                 <span>+229 01 97 44 80 97</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail size={18} className="text-orange-400 shrink-0" />
//                 <span>contact@100-afrique.com</span>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* --- BARRE DE COPYRIGHT --- */}
//         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
//           <p>© {new Date().getFullYear()} 100% Afrique. Tous droits réservés.</p>
//           <div className="flex gap-6">
//             <Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link>
//             <Link href="/confidentialite" className="hover:text-white">Politique de Confidentialité</Link>
//             <Link href="/cookies" className="hover:text-white">Gestion des Cookies</Link>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;