// src/components/chatbot/EscalationSection.tsx
"use client";
import React from 'react';
import { Phone } from 'lucide-react';
import { SectionCard, SectionHeader } from './SectionCard';
import type { ChatbotSettings } from './types';

interface EscalationSectionProps {
  settings: ChatbotSettings;
  onChange: (patch: Partial<ChatbotSettings>) => void;
}

const EscalationSection = ({ settings, onChange }: EscalationSectionProps) => (
  <SectionCard>
    <SectionHeader
      icon={<Phone className="w-4 h-4 text-orange-600" />}
      title="Règles d'Escalade et de Contact Humain"
      iconBg="bg-orange-50"
    />
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-[13px] font-bold text-slate-800 mb-2">Mots-clés de Transfert</label>
        <p className="text-[11px] text-slate-400 mb-2">Mots-clés Déclencheurs</p>
        <input
          value={settings.escalationKeywords.join(', ')}
          onChange={(e) => onChange({ escalationKeywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-orange-500"
          placeholder="parler à un humain, devis, urgence, contact, aide, assistance"
        />
        <p className="text-[11px] text-slate-400 mt-2">Séparez les mots-clés par des virgules</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <p className="text-[12px] font-bold text-slate-800 uppercase">Canaux de Redirection</p>
          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-bold text-slate-700">Option 1 : Formulaire de Contact</p>
            <div>
              <p className="text-[11px] text-slate-400 mb-2">URL du Formulaire</p>
              <input
                value={settings.contactFormUrl}
                onChange={(e) => onChange({ contactFormUrl: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-orange-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.contactFormEnabled}
                onChange={(e) => onChange({ contactFormEnabled: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="text-[12px] text-slate-600">Activer la redirection vers le formulaire</span>
            </label>
          </div>
        </div>

        <div className="pt-8">
          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-4">
            <p className="text-[13px] font-bold text-slate-700">Option 2 : Contact WhatsApp</p>
            <div>
              <p className="text-[11px] text-slate-400 mb-2">Numéro WhatsApp Business</p>
              <input
                value={settings.whatsappNumber}
                onChange={(e) => onChange({ whatsappNumber: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-orange-500"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.whatsappEnabled}
                onChange={(e) => onChange({ whatsappEnabled: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="text-[12px] text-slate-600">Activer la redirection WhatsApp</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase">Message d&apos;Échec</label>
        <p className="text-[11px] text-slate-400 mb-2">Message affiché en cas d&apos;échec</p>
        <textarea
          value={settings.failureMessage}
          onChange={(e) => onChange({ failureMessage: e.target.value })}
          className="w-full border border-slate-200 rounded-xl p-4 text-[13px] text-slate-700 min-h-[80px] outline-none focus:border-orange-500"
        />
      </div>
    </div>
  </SectionCard>
);

export default EscalationSection;