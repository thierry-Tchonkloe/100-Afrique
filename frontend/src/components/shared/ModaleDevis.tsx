// src/components/shared/ModaleDevis.tsx
"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, Video, MessageCircle, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface ModaleDevisProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiErrorData {
  message?: string;
}

const ModaleDevis = ({ isOpen, onClose }: ModaleDevisProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      format: formData.get('format'),
      theme: formData.get('theme'),
      location: formData.get('location'),
      duration: formData.get('duration'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      organization: formData.get('organization'),
      email: formData.get('email'),
      budget: formData.get('budget'),
      source: 'web_tv_partnership'
    };

    try {
      await api.post('/contacts/demande-devis', data);
      setStep('success');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorData>;
      console.error("Erreur envoi formulaire:", axiosError);

      setError(
        axiosError.response?.data?.message ||
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-it-emerald-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">

        <button onClick={handleClose} className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="overflow-y-auto p-6 md:p-10">
          {step === 'form' ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-it-terracotta/10 rounded-full flex items-center justify-center text-it-terracotta shrink-0">
                  <Video size={32} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-it-terracotta uppercase tracking-wide">
                    Demande de Devis
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Décrivez votre besoin pour une interview, un reportage ou un format sur mesure par i Tourisme TV.
                  </p>
                </div>
              </div>

              <div className="bg-it-gold-light border-l-4 border-it-terracotta p-3 mb-8 flex items-center gap-3">
                <span className="text-it-terracotta">★</span>
                <p className="text-[11px] font-bold text-it-gold-dark">
                  Accédez à une audience professionnelle et ciblée via notre plateforme vidéo.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    Quel type de format recherchez-vous ? <span className="text-red-500">*</span>
                  </label>
                  <select required name="format" className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_10px_center] bg-no-repeat">
                    <option value="">Sélectionnez un format</option>
                    <option value="interview">Interview</option>
                    <option value="reportage">Reportage</option>
                    <option value="mesure">Format sur mesure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    Thème ou Sujet de votre reportage <span className="text-red-500">*</span>
                  </label>
                  <input required name="theme" type="text" placeholder="Ex: Promotion du patrimoine culturel" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    Où le tournage doit-il avoir lieu ? <span className="text-red-500">*</span>
                  </label>
                  <input required name="location" type="text" placeholder="Ex: IFTM Paris, vos locaux, etc." className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                    Durée approximative souhaitée <span className="text-red-500">*</span>
                  </label>
                  <select required name="duration" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_10px_center] bg-no-repeat">
                    <option value="">Sélectionnez une durée</option>
                    <option value="1-3min">1 à 3 minutes</option>
                    <option value="3-5min">3 à 5 minutes</option>
                    <option value="plus">Plus de 5 minutes</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Prénom <span className="text-red-500">*</span></label>
                    <input required name="firstname" type="text" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Nom <span className="text-red-500">*</span></label>
                    <input required name="lastname" type="text" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Organisation <span className="text-red-500">*</span></label>
                  <input required name="organization" type="text" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Email Professionnel <span className="text-red-500">*</span></label>
                  <input required name="email" type="email" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Budget estimé (Optionnel)</label>
                  <textarea name="budget" rows={3} placeholder="Précisez votre budget ou vos contraintes..." className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:border-it-terracotta outline-none resize-none" />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-it-terracotta text-white font-bold py-3.5 rounded-md flex items-center justify-center gap-3 hover:bg-it-terracotta-dark transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={16} fill="white" />}
                  <span className="text-sm uppercase tracking-wider">Demander mon Devis Vidéo</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-[10px] text-gray-400 mb-2">Ou contactez-nous directement</p>
                  <a href="https://wa.me/votre_numero" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-it-terracotta text-xs font-bold hover:underline">
                    <MessageCircle size={18} />
                    Studio i Tourisme TV via WhatsApp
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3 text-gray-400">
                  <ShieldCheck size={28} className="shrink-0 opacity-40" />
                  <p className="text-[9px] leading-relaxed italic">
                    Vos données sont traitées conformément au RGPD pour le traitement de votre demande de devis.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="py-12 text-center space-y-6 animate-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle size={60} className="text-it-emerald" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-it-blue">Demande Envoyée !</h2>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                Merci ! Notre équipe étudie votre projet et vous contactera sous 48h.
              </p>
              <button onClick={handleClose} className="bg-it-emerald-dark text-white px-8 py-2 rounded-full font-bold transition-all text-sm uppercase tracking-widest hover:bg-it-terracotta">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleDevis;
