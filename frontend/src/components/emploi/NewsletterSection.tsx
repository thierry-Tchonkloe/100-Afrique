// src/components/emploi/NewsletterSection.tsx

"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
        
        {/* En-tête de la section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e293b] mb-6">
            Soyez prêt pour le mouvement
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            L&apos;écosystème iTourisme Emploi finalise ses connexions. Laissez-nous votre email pour 
            être informé en priorité de l&apos;ouverture des accès et recevoir nos conseils carrière exclusifs.
          </p>
        </div>

        {/* Carte de Formulaire */}
        <div className="w-full max-w-md bg-[#f8fafc] rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Input Email */}
            <div className="relative">
              <input 
                type="email" 
                placeholder="Votre Email"
                className="w-full px-5 py-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#eb5e14]/20 focus:border-[#eb5e14] transition-all"
                required
              />
            </div>

            {/* Select Customisé */}
            <div className="relative">
              <select 
                className="w-full appearance-none px-5 py-4 rounded-lg border border-slate-200 bg-white text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#eb5e14]/20 focus:border-[#eb5e14] transition-all cursor-pointer"
                defaultValue=""
                required
              >
                <option value="" disabled>Vous êtes :</option>
                <option value="candidate">Un Candidat</option>
                <option value="recruiter">Un Recruteur</option>
                <option value="partner">Un Partenaire</option>
              </select>
              {/* Icône de flèche pour le select */}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>

            {/* Bouton d'action principal */}
            <button 
              type="submit"
              className="w-full mt-2 bg-[#eb5e14] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#d45210] active:scale-[0.98] transition-all duration-200"
            >
              M&apos;inscrire à la liste prioritaire
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;



