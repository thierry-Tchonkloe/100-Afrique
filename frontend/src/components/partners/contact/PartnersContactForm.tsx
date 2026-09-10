// src/components/partners/contact/PartnersContactForm.tsx
"use client";
import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { usePartnersContactForm } from './usePartnersContactForm';

const inputClass =
  "w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-it-gold focus:bg-white/15 transition-all disabled:opacity-50";

const PartnersContactForm = () => {
  const { loading, submitted, error, setSubmitted, handleSubmit } = usePartnersContactForm();

  return (
    <div className="group w-full lg:w-2/3 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl group-hover:bg-white/15 transition-all duration-500" />
      <div className="relative z-10 p-8 md:p-12">
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
            <CheckCircle2 size={60} className="text-it-emerald animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Message Reçu !</h3>
            <p className="text-slate-300">Notre service régie vous contactera sous 24h ouvrées.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-it-gold font-bold text-sm uppercase underline hover:text-white transition-colors"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input name="lastname"  placeholder="Nom *"     required disabled={loading} className={inputClass} />
              <input name="firstname" placeholder="Prénom *"  required disabled={loading} className={inputClass} />
            </div>
            <input name="company" placeholder="Organisation / Agence *" required disabled={loading} className={inputClass} />
            <input name="email" type="email" placeholder="Email professionnel *" required disabled={loading} className={inputClass} />
            <div className="relative">
              <select
                name="service_type"
                required
                disabled={loading}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" className="text-slate-800">Sujet de votre demande *</option>
                <option value="display"  className="text-slate-800">Publicité Display</option>
                <option value="content"  className="text-slate-800">Contenus Sponsorisés</option>
                <option value="magazine" className="text-slate-800">Partenariat Magazine</option>
                <option value="event"    className="text-slate-800">Couverture Salons</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
            </div>
            <textarea
              name="message"
              placeholder="Votre projet en quelques mots..."
              rows={5}
              required
              disabled={loading}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-it-terracotta hover:bg-white hover:text-it-emerald-dark text-white font-bold py-5 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Traitement en cours...</>
              ) : (
                "Demander les tarifs et options"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PartnersContactForm;