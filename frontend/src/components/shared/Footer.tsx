// src/components/shared/Footer.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#001A4D] text-white pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* --- ZONE PRINCIPALE (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne 1 : À Propos & Logos */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* <div className="bg-white p-1 rounded-sm"> */}
                {/* Logo WAXEHO */}
                {/* <img src="/logos/waxeho.png" alt="Waxeho" className="h-10 object-contain" />
              </div>
              <div className="h-8 w-[1px] bg-gray-500 mx-1"></div>
              <div className="bg-white p-1 rounded-sm"> */}
                {/* Logo iTourisme TV */}
                {/* <img src="/logos/itourisme.png" alt="iTourisme TV" className="h-10 object-contain" />
              </div> */}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Le média de référence dédié au tourisme international et africain. 
              Une plateforme interactive pour les professionnels et passionnés du secteur.
            </p>
            <div className="flex gap-4">
              <Facebook size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
              <Linkedin size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
              <Youtube size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Colonne 2 : Navigation Rapide */}
          <div>
            <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Plan du Site</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/actualites" className="hover:text-white transition-colors">Actualités du Tourisme</Link></li>
              <li><Link href="/magazine" className="hover:text-white transition-colors">Magazine WAXEHO</Link></li>
              <li><Link href="/evenements" className="hover:text-white transition-colors">Salons & Événements</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations Afrique & Monde</Link></li>
              <li><Link href="/webtv" className="hover:text-white transition-colors">Vidéos / Web TV</Link></li>
              <li><Link href="/emploi" className="hover:text-white transition-colors font-bold text-orange-400">Espace EMPLOI</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Catégories Métiers */}
          <div>
            <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Secteurs</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/categories/hotellerie" className="hover:text-white transition-colors">Hôtellerie</Link></li>
              <li><Link href="/categories/transport" className="hover:text-white transition-colors">Transport & Mobilité</Link></li>
              <li><Link href="/categories/restauration" className="hover:text-white transition-colors">Restauration</Link></li>
              <li><Link href="/categories/mice" className="hover:text-white transition-colors">MICE & Événementiel</Link></li>
              <li><Link href="/categories/durable" className="hover:text-white transition-colors">Tourisme Durable</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Contact & Newsletter */}
          <div>
            <h4 className="text-orange-400 font-bold text-lg mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-400 shrink-0" />
                <span>Siège Social, Quartier International, <br/>Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>+229 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-400 shrink-0" />
                <span>contact@itourisme-nomade.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- BARRE DE COPYRIGHT --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} WAXEHO et iTourisme TV. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Politique de Confidentialité</Link>
            <Link href="/cookies" className="hover:text-white">Gestion des Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;