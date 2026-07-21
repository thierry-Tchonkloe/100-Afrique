// src/components/partners/PartnersContact.tsx
"use client";

import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { WaveMark } from '@/components/icons/CustomIcons';
import { MissiveMark, RingMark } from '@/components/icons/CustomIcons';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

const PartnersContact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => { payload[key] = value.toString(); });
    try {
      await api.post('/contacts/partners', payload);
      setSubmitted(true);
      formElement.reset();
      setTimeout(() => setSubmitted(false), 10000);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const msg = axiosError.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-it-gold focus:bg-white/15 transition-all disabled:opacity-50";

  return (
    <section
      id="contact-form"
      className="relative py-28 px-6 overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80')",
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Orbs décoratifs — gold + emerald */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-it-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-it-emerald/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center uppercase mb-4">
          Prêt à lancer votre campagne ?
        </h2>
        <p className="text-center text-slate-300 text-sm mb-16 tracking-wide">
          Notre équipe régie vous répond sous 24h ouvrées
        </p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Formulaire */}
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

          {/* Contact direct */}
          <div className="group w-full lg:w-1/3 relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl group-hover:bg-white/15 transition-all duration-500" />
            <div className="relative z-10 p-8 md:p-10 space-y-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Contact Direct</h3>
                <div className="space-y-6">
                  <a href="tel:+33774454001" className="flex items-center gap-4 group/link">
                    <div className="p-4 bg-white/10 rounded-full group-hover/link:bg-it-gold/20 transition-colors">
                      <RingMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
                    </div>
                    <span className="font-semibold text-white group-hover/link:text-it-gold transition-colors">
                      +33 774 454 001
                    </span>
                  </a>
                  <a href="mailto:regie@waxeho.com" className="flex items-center gap-4 group/link">
                    <div className="p-4 bg-white/10 rounded-full group-hover/link:bg-it-gold/20 transition-colors">
                      <MissiveMark size={26} className="shrink-0" style={{ color: '#C8A84B' }} />
                    </div>
                    <span className="font-semibold text-white group-hover/link:text-it-gold transition-colors">
                      regie@waxeho.com
                    </span>
                  </a>
                </div>
              </div>
              
              <a  href="https://wa.me/33774454001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-5 rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all duration-300 active:scale-95"
              >
                <WaveMark size={24} />
                WhatsApp Business
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PartnersContact;
