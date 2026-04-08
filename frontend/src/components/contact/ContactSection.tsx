// src/components/contact/ContactSection.tsx
"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, FileText, Shield, Cookie, Loader2 } from 'lucide-react';
import api from '@/lib/api'; // Assurez-vous que ce chemin est correct

const ContactSection = () => {
  // État pour gérer le formulaire
  const [formData, setFormData] = useState({
    type: '',
    firstname: '',
    lastname: '',
    email: '',
    message: '',
    rgpd: false
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Gestion des changements d'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Envoi des données à l'API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Remplacez '/contact' par votre endpoint réel
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ type: '', firstname: '', lastname: '', email: '', message: '', rgpd: false });
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setStatus('error');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1D3A8A] uppercase tracking-tight mb-4">
          CONTACTEZ-NOUS : UNE QUESTION ? UN PROJET ?
        </h2>
        <p className="text-gray-600 font-medium">
          Notre équipe est à votre écoute pour répondre à toutes vos demandes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* FORMULAIRE DE CONTACT */}
        <div className="bg-[#F8F9FA] rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[#2D3E50] mb-6">
            Formulaire de Contact
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Type de Demande *
              </label>
              <select 
                name="type"
                required 
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-[#F19300] outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="partenariat">Partenariat</option>
                <option value="publicite">Publicité / Kit Média</option>
                <option value="technique">Support Technique</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Prénom *</label>
                <input 
                  name="firstname"
                  required 
                  type="text" 
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-[#F19300] outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nom *</label>
                <input 
                  name="lastname"
                  required 
                  type="text" 
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-[#F19300] outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email *</label>
              <input 
                name="email"
                required 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-[#F19300] outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Message *</label>
              <textarea 
                name="message"
                required 
                rows={5} 
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:border-[#F19300] outline-none resize-none" 
              />
            </div>

            <div className="flex items-start gap-3">
              <input 
                name="rgpd"
                required 
                type="checkbox" 
                id="rgpd_contact" 
                checked={formData.rgpd}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#F19300] focus:ring-[#F19300]" 
              />
              <label htmlFor="rgpd_contact" className="text-[11px] text-gray-500 leading-snug cursor-pointer">
                J&apos;accepte que mes données soient traitées conformément à la <span className="text-[#F19300] underline italic">Politique de Confidentialité</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-[#F19300] hover:bg-[#d98400] text-white font-bold py-4 rounded-md shadow-md transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : "ENVOYER LE MESSAGE"}
            </button>

            {/* Messages de retour API */}
            {status === 'success' && <p className="text-green-600 text-xs font-bold text-center">Message envoyé avec succès !</p>}
            {status === 'error' && <p className="text-red-600 text-xs font-bold text-center">Une erreur est survenue lors de l&apos;envoi.</p>}
          </form>
        </div>

        {/* COORDONNÉES ET INFOS LÉGALES */}
        <div className="space-y-8">
          <div className="bg-[#0A2540] rounded-xl p-10 text-white shadow-xl">
            <h3 className="text-xl font-serif font-bold mb-8">Coordonnées Directes</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <Mail className="text-[#F19300] shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Email Général</p>
                  <p className="text-gray-300 text-sm">contact@waxeho.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-[#F19300] shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Téléphone</p>
                  <p className="text-gray-300 text-sm">+33 1 23 45 67 89</p>
                  <p className="text-[10px] text-gray-400 mt-1">Lun-Ven: 9h-18h (CET)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-[#F19300] shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">Adresse</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    123 Avenue des Champs-Élysées<br />75008 Paris, France
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-10 bg-[#22C55E] hover:bg-[#1ca84d] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20">
              <MessageCircle size={22} fill="white" />
              <span className="text-sm uppercase tracking-wider">Discuter avec notre équipe</span>
            </button>
          </div>

          <div className="bg-[#F8F9FA] rounded-xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#2D3E50] mb-6">Informations Légales</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-gray-600 hover:text-[#F19300] transition-colors cursor-pointer group">
                <FileText size={20} className="text-gray-400 group-hover:text-[#F19300]" />
                <span className="text-sm font-medium">Mentions Légales</span>
              </li>
              <li className="flex items-center gap-4 text-gray-600 hover:text-[#F19300] transition-colors cursor-pointer group">
                <Shield size={20} className="text-gray-400 group-hover:text-[#F19300]" />
                <span className="text-sm font-medium">Politique de Confidentialité</span>
              </li>
              <li className="flex items-center gap-4 text-gray-600 hover:text-[#F19300] transition-colors cursor-pointer group">
                <Cookie size={20} className="text-gray-400 group-hover:text-[#F19300]" />
                <span className="text-sm font-medium">Gestion des Cookies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;