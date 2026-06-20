// src/components/contact/ContactFormSection.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Loader2, FileText, Shield, Cookie } from 'lucide-react';
import api from '@/lib/api';

const LEGAL_LINKS = [
  { Icon: FileText, label: 'Mentions Légales',             href: '/mentions-legales' },
  { Icon: Shield,   label: 'Politique de Confidentialité', href: '/confidentialite'  },
  { Icon: Cookie,   label: 'Gestion des Cookies',          href: '/cookies'          },
];

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    type: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
    rgpd: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      setFormData({ type: '', firstname: '', lastname: '', email: '', phone: '', message: '', rgpd: false });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ══ FORMULAIRE ══ */}
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

          {/* ══ COORDONNÉES ══ */}
          <div
            className="flex flex-col gap-6"
            style={{
              transition: 'opacity 0.7s 0.25s, transform 0.7s 0.25s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            {/* Carte coordonnées */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row">

                <div className="relative md:w-2/5 h-52 md:h-auto shrink-0 overflow-hidden">
                  <img
                    src="/images/service-client.jpg"
                    alt="Notre équipe à votre service"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-white/20" />
                  <div
                    className="absolute bottom-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm"
                    style={{ background: 'rgba(26,44,74,0.85)' }}
                  >
                    Disponible 24h/7j
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="px-7 pt-6 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg uppercase tracking-wide" style={{ color: '#1A2B4A' }}>
                      Coordonnées Directes
                    </h3>
                  </div>

                  <div className="p-7 space-y-5 flex-1">
                    {[
                      { Icon: Mail,   label: 'Email',     value: 'contact@waxeho.com',  sub: null,             href: 'mailto:contact@waxeho.com' },
                      { Icon: Phone,  label: 'Téléphone', value: '+229 01 XX XX XX XX', sub: 'Lun-Ven 9h–18h', href: 'tel:+22901XXXXXXXX'         },
                      { Icon: MapPin, label: 'Adresse',   value: 'Cotonou, Bénin',      sub: null,             href: null                         },
                    ].map(({ Icon, label, value, sub, href }) => (
                      <div key={label} className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-lg shrink-0" style={{ background: '#EAF3EE' }}>
                          <Icon size={17} style={{ color: '#1A5C43' }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                          {href ? (
                            <a href={href} className="text-sm font-medium whitespace-pre-line leading-snug hover:underline" style={{ color: '#1A2B4A' }}>
                              {value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium whitespace-pre-line leading-snug" style={{ color: '#1A2B4A' }}>{value}</p>
                          )}
                          {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-7 pb-7">
                    <a
                      href="https://wa.me/22901XXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                      style={{ background: '#25D366' }}
                    >
                      <MessageCircle size={20} fill="white" />
                      Discuter sur WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Horaires */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: '#F8FAF9', borderColor: '#D1E8DC' }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: '#1A5C43' }}>
                Horaires d&apos;ouverture
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { days: 'Lundi – Vendredi', hours: '9h00 – 18h00'  },
                  { days: 'Samedi',           hours: '10h00 – 14h00' },
                  { days: 'Dimanche',         hours: 'Fermé'         },
                ].map(({ days, hours }) => (
                  <li key={days} className="flex justify-between items-center">
                    <span className="text-slate-600">{days}</span>
                    <span
                      className="font-semibold text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: hours === 'Fermé' ? '#FEE2E2' : '#EAF3EE',
                        color:      hours === 'Fermé' ? '#DC2626' : '#1A5C43',
                      }}
                    >
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Informations Légales ── */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: '#F8FAF9', borderColor: '#D1E8DC' }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: '#1A5C43' }}>
                Informations Légales
              </h3>
              <ul className="space-y-3">
                {LEGAL_LINKS.map(({ Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center gap-3 group transition-colors"
                      style={{ color: '#64748b' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1A5C43')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                    >
                      <div className="p-2 rounded-lg shrink-0 transition-colors" style={{ background: '#EAF3EE' }}>
                        <Icon size={14} style={{ color: '#1A5C43' }} />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </a>
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

export default ContactFormSection;