// src/components/contact/ContactSection.tsx
"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, FileText, Shield, Cookie, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    type: '', firstname: '', lastname: '', email: '', message: '', rgpd: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ type: '', firstname: '', lastname: '', email: '', message: '', rgpd: false });
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus('error');
    }
  };

  return (
    <section className="py-20 px-6 bg-it-emerald-dark overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── En-tête ── */}
        <div className="text-center mb-14">
          <p className="text-it-gold text-xs font-bold uppercase tracking-[0.3em] mb-3">
            Nous sommes à votre écoute
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white uppercase tracking-tight mb-4">
            Une question ? Un projet ?
          </h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto">
            Notre équipe vous répond sous 24h ouvrées.
          </p>
        </div>

        {/* ── Corps : Formulaire | Coordonnées ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ══ FORMULAIRE ══ */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Bandeau titre formulaire */}
            <div className="bg-it-emerald px-8 py-5">
              <h3 className="text-white font-serif font-bold text-lg uppercase tracking-wide">
                Formulaire de Contact
              </h3>
            </div>

            <div className="p-8 md:p-10 space-y-5">
              {/* Type de demande */}
              <div>
                <label className="block text-[11px] font-bold text-it-blue uppercase tracking-widest mb-2">
                  Type de Demande *
                </label>
                <div className="relative">
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-it-gold rounded-xl px-4 py-3.5 text-sm text-it-blue outline-none appearance-none transition-colors cursor-pointer"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="publicite">Publicité / Kit Média</option>
                    <option value="technique">Support Technique</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                </div>
              </div>

              {/* Prénom / Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'firstname', label: 'Prénom', value: formData.firstname },
                  { name: 'lastname',  label: 'Nom',    value: formData.lastname  },
                ].map(({ name, label, value }) => (
                  <div key={name}>
                    <label className="block text-[11px] font-bold text-it-blue uppercase tracking-widest mb-2">
                      {label} *
                    </label>
                    <input
                      name={name}
                      required
                      type="text"
                      value={value}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-it-gold rounded-xl px-4 py-3.5 text-sm text-it-blue outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-it-blue uppercase tracking-widest mb-2">
                  Email *
                </label>
                <input
                  name="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-it-gold rounded-xl px-4 py-3.5 text-sm text-it-blue outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold text-it-blue uppercase tracking-widest mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-it-gold rounded-xl px-4 py-3.5 text-sm text-it-blue outline-none resize-none transition-colors"
                />
              </div>

              {/* RGPD */}
              <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <input
                  name="rgpd"
                  required
                  type="checkbox"
                  id="rgpd_contact"
                  checked={formData.rgpd}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-it-gold focus:ring-it-gold accent-it-gold shrink-0"
                />
                <label htmlFor="rgpd_contact" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer">
                  J&apos;accepte que mes données soient traitées conformément à la{' '}
                  <span className="text-it-terracotta underline italic font-medium">
                    Politique de Confidentialité
                  </span>
                </label>
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                onClick={handleSubmit as any}
                className="w-full bg-it-terracotta hover:bg-it-terracotta-dark disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {status === 'loading'
                  ? <><Loader2 className="animate-spin" size={18} /> Envoi en cours...</>
                  : 'Envoyer le message'}
              </button>

              {status === 'success' && (
                <p className="text-it-emerald text-xs font-bold text-center">
                  ✓ Message envoyé avec succès !
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-xs font-bold text-center">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </div>
          </div>

          {/* ══ COORDONNÉES ══ */}
          <div className="flex flex-col gap-6 h-full">

            {/* Carte coordonnées : split photo | infos */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row flex-1">

              {/* Photo service client */}
              <div className="relative md:w-2/5 h-56 md:h-auto shrink-0 overflow-hidden">
                <img
                  src="/images/service-client.jpg"
                  alt="Notre équipe à votre service"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                {/* Overlay dégradé latéral (desktop) + bas (mobile) */}
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-white/20" />
                {/* Badge flottant */}
                <div className="absolute bottom-4 left-4 bg-it-emerald-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Disponible 24h/7j
                </div>
              </div>

              {/* Infos de contact */}
              <div className="flex-1 p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-it-blue mb-6">
                    Coordonnées Directes
                  </h3>
                  <div className="space-y-5">
                    {[
                      { Icon: Mail,   label: "Email",      value: "contact@waxeho.com",                                sub: null              },
                      { Icon: Phone,  label: "Téléphone",  value: "+33 1 23 45 67 89",                                sub: "Lun-Ven 9h–18h"  },
                      { Icon: MapPin, label: "Adresse",    value: "123 Av. des Champs-Élysées\n75008 Paris, France",  sub: null              },
                    ].map(({ Icon, label, value, sub }) => (
                      <div key={label} className="flex gap-3 items-start">
                        <div className="p-2 bg-it-emerald-light rounded-lg shrink-0">
                          <Icon size={16} className="text-it-emerald-dark" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-it-blue whitespace-pre-line leading-snug">
                            {value}
                          </p>
                          {sub && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/33123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1db954] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-[0_8px_20px_rgba(37,211,102,0.35)] active:scale-95"
                >
                  <MessageCircle size={20} fill="white" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>

            {/* Infos légales */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
              <h3 className="text-sm font-serif font-bold text-white mb-4 uppercase tracking-wide">
                Informations Légales
              </h3>
              <ul className="space-y-3">
                {[
                  { Icon: FileText, label: "Mentions Légales"             },
                  { Icon: Shield,   label: "Politique de Confidentialité" },
                  { Icon: Cookie,   label: "Gestion des Cookies"          },
                ].map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-white/60 hover:text-it-gold transition-colors cursor-pointer group"
                  >
                    <Icon size={16} className="shrink-0 group-hover:text-it-gold transition-colors" />
                    <span className="text-sm font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
