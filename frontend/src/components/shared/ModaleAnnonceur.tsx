// src/components/shared/ModaleAnnonceur.tsx
"use client";

import React, { useState } from 'react';
import { X, Download, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios'; // Import du type AxiosError

const ModaleAnnonceur = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      interest: formData.get('interest'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      await api.post('/contacts/annonceurs', payload);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 4000);
    } catch (error: unknown) {
      // Correction de l'erreur 'any' avec un check d'instance ou type unknown
      const axiosError = error as AxiosError;
      console.error("Erreur API:", axiosError);
      setErrorMessage("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-it-blue/80 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-10 animate-in zoom-in-95 duration-300">
        
        {/* Bouton Fermer */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-it-orange transition-colors"
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            {/* En-tête */}
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide text-it-blue md:text-3xl">
                Demandez notre Kit Média 2026
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 text-left max-w-md">
                  Recevez nos offres publicitaires détaillées et nos tarifs pour booster votre visibilité.
                </p>
                <div className="text-right text-xs leading-tight text-gray-500">
                  Atteignez plus de <span className="font-bold text-it-orange">50 000</span> <br />
                  <span className="font-bold text-it-orange">professionnels</span> du tourisme
                </div>
              </div>
            </div>

            {/* WhatsApp Business */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <a 
                href="https://wa.me/229XXXXXXXX" 
                target="_blank" 
                className="flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
                rel="noreferrer"
              >
                <MessageCircle size={18} fill="#25D366" className="text-white" />
                WhatsApp Business
              </a>
              <div className="flex w-full items-center gap-4 py-2 text-xs text-gray-400">
                <div className="h-px flex-1 bg-gray-200"></div>
                Ou contactez-nous via
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            </div>

            {/* Formulaire */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Intérêt principal */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Votre intérêt principal ? <span className="text-red-500">*</span>
                </label>
                <select 
                  required
                  name="interest"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange transition-all"
                >
                  <option value="">Sélectionnez votre intérêt</option>
                  <option value="publicite">Publicité digitale</option>
                  <option value="partenariat">Partenariat Magazine</option>
                  <option value="webtv">Web TV / Reportage</option>
                  <option value="evenement">Événementiel</option>
                </select>
              </div>

              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Prénom *</label>
                  <input required name="firstName" type="text" placeholder="Ex: Jean" className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Nom *</label>
                  <input required name="lastName" type="text" placeholder="Ex: Dupont" className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange" />
                </div>
              </div>

              {/* Société */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Société / Organisation *</label>
                <input required name="company" type="text" placeholder="Nom de votre structure" className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange" />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Email Professionnel *</label>
                <input required name="email" type="email" placeholder="votre.email@entreprise.com" className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange" />
              </div>

              {/* Téléphone */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Téléphone (pour un rappel rapide) *</label>
                <input required name="phone" type="tel" placeholder="+229 XX XX XX XX" className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange" />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Décrivez brièvement votre besoin (Optionnel)</label>
                <textarea name="message" rows={3} placeholder="Dites-nous en plus sur vos objectifs..." className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-it-orange focus:ring-1 focus:ring-it-orange resize-none"></textarea>
              </div>

              {/* Bouton Submit */}
              <button 
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-it-orange py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#d98400] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Download size={18} strokeWidth={3} />
                    Recevoir le Kit Média
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* ÉTAT DE SUCCÈS */
          <div className="py-12 text-center animate-in zoom-in-90 duration-500">
            <div className="flex justify-center mb-6">
              <CheckCircle2 size={80} className="text-[#25D366]" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-it-blue mb-4 uppercase">C&apos;est envoyé !</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Merci pour votre intérêt. Nous venons de vous envoyer notre Kit Média 2026 par email. Notre équipe commerciale vous recontactera très bientôt.
            </p>
            <button 
              onClick={onClose}
              className="bg-it-blue text-white px-8 py-3 rounded-full font-bold hover:bg-it-orange transition-colors"
            >
              RETOUR AU SITE
            </button>
          </div>
        )}

        {/* Footer / Mentions */}
        {!isSuccess && (
          <div className="mt-6 text-[10px] leading-relaxed text-gray-500 text-center">
            En soumettant ce formulaire, vous acceptez notre <span className="cursor-pointer text-it-orange hover:underline font-bold">Politique de Confidentialité</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModaleAnnonceur;