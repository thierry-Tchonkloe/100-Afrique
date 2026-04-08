// src/components/shared/ModaleCouverture.tsx
"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ModaleCouvertureProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiErrorResponse {
  message?: string;
}

const ModaleCouverture = ({ isOpen, onClose }: ModaleCouvertureProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const payload = {
      subject: "Demande de Couverture Dédiée - Salon",
      type: formData.get('partnershipType'),
      eventName: formData.get('eventName'),
      sender: {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        company: formData.get('company') || 'Non renseigné', // ✅ Valeur par défaut
      },
      message: formData.get('details') || '', // ✅ Valeur par défaut
      source: "Magazine Waxeho - Modal Couverture"
    };

    try {
      await api.post('/contacts/editorial', payload);
      setStep('success');
      
      // Réinitialiser le formulaire après 4 secondes et fermeture
      setTimeout(() => {
        setStep('form');
        onClose();
      }, 4000);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      console.error("Erreur API:", axiosError);
      console.error("Détails:", axiosError.response?.data); // ✅ Logger les détails
      
      setError(
        axiosError.response?.data?.message || 
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-it-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-it-orange p-6 md:p-10 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase leading-tight mb-2 pr-10">
            Demandez une couverture dédiée
          </h2>
          <p className="text-sm opacity-90 font-medium">
            Boostez votre visibilité lors des salons et événements majeurs du tourisme.
          </p>
        </div>

        <div className="overflow-y-auto p-6 md:p-10">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-green-500 p-1.5 rounded-full">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <p className="text-xs text-green-800 font-medium">
                  Notre équipe éditoriale vous répondra sous 24h ouvrées.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nature du Partenariat */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Nature du Partenariat <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required 
                    name="partnershipType" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-it-orange/20 focus:border-it-orange outline-none transition-all cursor-pointer"
                  >
                    <option value="">Sélectionnez le type</option>
                    <option value="presse">Couverture Presse (Article dédié)</option>
                    <option value="video">Reportage Vidéo & Interview</option>
                    <option value="social">Campagne Réseaux Sociaux</option>
                    <option value="global">Partenariat Global 360°</option>
                  </select>
                </div>

                {/* Nom de l'Événement */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Nom de l&apos;Événement <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    name="eventName" 
                    type="text" 
                    placeholder="Ex: IFTM Top Resa, FITUR..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none" 
                  />
                </div>

                {/* Prénom */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    name="firstname" 
                    type="text" 
                    placeholder="Jean"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none" 
                  />
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    name="lastname" 
                    type="text" 
                    placeholder="Dupont"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none" 
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Email Professionnel <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    name="email" 
                    type="email" 
                    placeholder="votre@entreprise.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none" 
                  />
                </div>

                {/* Société / Organisation */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Société / Organisation
                  </label>
                  <input 
                    name="company" 
                    type="text" 
                    placeholder="Nom de votre structure (optionnel)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none" 
                  />
                </div>

                {/* Détails */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-it-blue uppercase tracking-wider">
                    Détails (Optionnel)
                  </label>
                  <textarea 
                    name="details" 
                    rows={3} 
                    placeholder="Parlez-nous de vos objectifs..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-it-orange outline-none resize-none" 
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-it-orange text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#d98400] transition-all shadow-xl shadow-it-orange/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-xs uppercase tracking-[0.15em]">Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span className="text-xs uppercase tracking-[0.15em]">Envoyer ma demande</span>
                  </>
                )}
              </button>

              <div className="pt-6 border-t border-gray-100 flex gap-4 text-gray-400">
                <ShieldCheck size={32} className="shrink-0 opacity-40 text-it-blue" />
                <p className="text-[10px] leading-relaxed">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Vos informations professionnelles sont exclusivement utilisées pour traiter votre demande de partenariat média.
                </p>
              </div>
            </form>
          ) : (
            /* Écran de Succès */
            <div className="py-16 text-center space-y-6 animate-in zoom-in-90 duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-it-blue">C&apos;est envoyé !</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                Votre demande de couverture dédiée a bien été reçue. Un membre de notre rédaction vous contactera très prochainement.
              </p>
              <button 
                onClick={onClose} 
                className="bg-it-blue text-white px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Retour au magazine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleCouverture;