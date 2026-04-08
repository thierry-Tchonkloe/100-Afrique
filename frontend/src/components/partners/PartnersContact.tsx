// src/components/partners/PartnersContact.tsx
"use client";

import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

interface FormData {
  lastname: string;
  firstname: string;
  company: string;
  email: string;
  service_type: string;
  message: string;
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
    
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });

    try {
      // ✅ Endpoint pour les demandes de partenariat
      await api.post('/contacts/partners', payload);
      
      setSubmitted(true);
      formElement.reset();
      
      // Retour automatique après 10 secondes
      setTimeout(() => {
        setSubmitted(false);
      }, 10000);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
      
      setError(errorMessage);
      
      // Effacer l'erreur après 5 secondes
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-it-blue text-center uppercase tracking-[0.2em] mb-16">
          Prêt à lancer votre campagne ?
        </h2>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-2/3 bg-slate-50 p-8 md:p-12 rounded-2xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <CheckCircle2 size={60} className="text-green-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-it-blue">Message Reçu !</h3>
                <p className="text-gray-600">Notre service régie vous contactera sous 24h ouvrées.</p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="text-it-orange font-bold text-sm uppercase underline hover:text-it-blue transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-in fade-in">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    name="lastname" 
                    placeholder="Nom *" 
                    required 
                    disabled={loading}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                  <input 
                    name="firstname" 
                    placeholder="Prénom *" 
                    required 
                    disabled={loading}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                </div>

                <input 
                  name="company" 
                  placeholder="Organisation / Agence *" 
                  required 
                  disabled={loading}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                />
                
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email professionnel *" 
                  required 
                  disabled={loading}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                />

                <div className="relative">
                  <select 
                    name="service_type" 
                    required 
                    disabled={loading}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Sujet de votre demande *</option>
                    <option value="display">Publicité Display</option>
                    <option value="content">Contenus Sponsorisés</option>
                    <option value="magazine">Partenariat Magazine</option>
                    <option value="event">Couverture Salons</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-3 text-slate-400">
                    ▼
                  </div>
                </div>

                <textarea 
                  name="message" 
                  placeholder="Votre projet en quelques mots..." 
                  rows={5} 
                  required 
                  disabled={loading}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:border-it-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-it-orange hover:bg-it-blue text-white font-bold py-5 rounded-xl text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Traitement en cours...
                    </>
                  ) : (
                    "Demander les tarifs et options"
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="w-full lg:w-1/3 space-y-10">
            <h3 className="text-2xl font-serif font-bold text-it-blue">Contact Direct</h3>
            <div className="space-y-6">
              <a href="tel:+33123456789" className="flex items-center gap-4 group">
                <div className="p-4 bg-slate-50 rounded-full group-hover:bg-it-orange/10 transition-colors">
                  <Phone size={24} className="text-it-orange" />
                </div>
                <span className="font-bold text-it-blue">+33 1 23 45 67 89</span>
              </a>
              <a href="mailto:regie@waxeho.com" className="flex items-center gap-4 group">
                <div className="p-4 bg-slate-50 rounded-full group-hover:bg-it-orange/10 transition-colors">
                  <Mail size={24} className="text-it-orange" />
                </div>
                <span className="font-bold text-it-blue">regie@waxeho.com</span>
              </a>
            </div>

            <a 
              href="https://wa.me/33123456789" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-5 rounded-xl shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
            >
              <MessageCircle size={24} fill="white" />
              WhatsApp Business
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersContact;