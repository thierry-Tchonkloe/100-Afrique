// src/components/home/ContactCTASection.tsx
"use client";

import React, { useState } from 'react';
import { 
  MessageCircle, 
  FileText, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube 
} from 'lucide-react';
import ModaleAnnonceur from '@/components/shared/ModaleAnnonceur';

const ContactCTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration des réseaux sociaux (Liens à mettre à jour)
  const socialLinks = [
    { icon: <Facebook size={20} />, color: 'bg-[#1877F2]', link: '#', name: 'Facebook' },
    { icon: <Twitter size={20} />, color: 'bg-[#1DA1F2]', link: '#', name: 'Twitter' },
    { icon: <Linkedin size={20} />, color: 'bg-[#0A66C2]', link: '#', name: 'LinkedIn' },
    { icon: <Instagram size={20} />, color: 'bg-[#E4405F]', link: '#', name: 'Instagram' },
    { icon: <Youtube size={20} />, color: 'bg-[#FF0000]', link: '#', name: 'YouTube' },
  ];

  return (
    <section className="py-20 bg-[#0A2357]"> {/* Fond bleu nuit identique à la capture */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* 1. Titre et Introduction style Serif */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider">
              DEVENIR PARTENAIRE / NOUS CONTACTER
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Rejoignez notre réseau de partenaires et bénéficiez d&apos;une visibilité
              unique auprès des professionnels du tourisme africain et international.
            </p>
          </div>

          {/* 2. Boutons d'Action Rectangulaires */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F39C12] text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-[#D68910] transition-all active:scale-95"
            >
              Demander le Kit Média
            </button>

            <a 
              href="https://wa.me/229XXXXXXXX" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1DB954] text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-[#179443] transition-all active:scale-95"
            >
              <MessageCircle size={18} />
              Contact WhatsApp
            </a>
          </div>

          {/* 3. Réseaux Sociaux */}
          <div className="pt-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">
              Suivez-nous sur les réseaux
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.link}
                  title={social.name}
                  className={`${social.color} text-white p-4 rounded-full hover:scale-110 hover:rotate-6 transition-all shadow-md active:scale-90`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ModaleAnnonceur 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default ContactCTASection;