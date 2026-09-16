// src/components/contact/form/ContactForm.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useContactForm } from './useContactForm';

const ContactForm = () => {
  const { formData, status, handleChange, handleSubmit } = useContactForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      style={{
        transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
      }}
    >
      <div className="px-8 py-5" style={{ background: '#1A5C43' }}>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">
          Formulaire de Contact
        </h2>
        <p className="text-white/60 text-xs mt-1">Notre équipe vous répond sous 24h ouvrées.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5">

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1A2B4A' }}>
            Type de Demande *
          </label>
          <div className="relative">
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none appearance-none transition-colors cursor-pointer focus:border-[#C8A84B]"
              style={{ color: '#1A2B4A' }}
            >
              <option value="">Sélectionnez un sujet</option>
              <option value="partenariat">Partenariat</option>
              <option value="publicite">Publicité / Kit Média</option>
              <option value="technique">Support Technique</option>
              <option value="autre">Autre demande</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'firstname', label: 'Prénom', value: formData.firstname },
            { name: 'lastname',  label: 'Nom',    value: formData.lastname  },
          ].map(({ name, label, value }) => (
            <div key={name}>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1A2B4A' }}>
                {label} *
              </label>
              <input
                name={name}
                required
                type="text"
                value={value}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#C8A84B]"
                style={{ color: '#1A2B4A' }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1A2B4A' }}>
              Adresse e-mail *
            </label>
            <input
              name="email"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#C8A84B]"
              style={{ color: '#1A2B4A' }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1A2B4A' }}>
              Numéro de téléphone
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#C8A84B]"
              style={{ color: '#1A2B4A' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#1A2B4A' }}>
            Message *
          </label>
          <textarea
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Décrivez votre demande en quelques lignes…"
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none resize-none transition-colors focus:border-[#C8A84B]"
            style={{ color: '#1A2B4A' }}
          />
        </div>

        <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <input
            name="rgpd"
            required
            type="checkbox"
            id="rgpd_contact"
            checked={formData.rgpd}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 shrink-0"
            style={{ accentColor: '#C8A84B' }}
          />
          <label htmlFor="rgpd_contact" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer">
            J&apos;accepte que mes données soient traitées conformément à la{' '}
            <span className="underline italic font-medium" style={{ color: '#B85C38' }}>
              Politique de Confidentialité
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-[0.98] text-white disabled:opacity-60"
          style={{ background: '#B85C38' }}
        >
          {status === 'loading'
            ? <><Loader2 className="animate-spin" size={18} /> Envoi en cours…</>
            : 'Envoyer la demande'}
        </button>

        {status === 'success' && (
          <p className="text-[#1A5C43] text-xs font-bold text-center">✓ Message envoyé avec succès !</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-xs font-bold text-center">Une erreur est survenue. Veuillez réessayer.</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;