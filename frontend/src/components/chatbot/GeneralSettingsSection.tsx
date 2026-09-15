// src/components/chatbot/GeneralSettingsSection.tsx
"use client";
import React from 'react';
import { Star, ChevronRight, Info } from 'lucide-react';
import { SectionCard, SectionHeader } from './SectionCard';
import type { ChatbotSettings } from './types';

interface GeneralSettingsSectionProps {
  settings: ChatbotSettings;
  onChange: (patch: Partial<ChatbotSettings>) => void;
}

const GeneralSettingsSection = ({ settings, onChange }: GeneralSettingsSectionProps) => (
  <SectionCard>
    <SectionHeader
      icon={<Star className="w-4 h-4 text-orange-500" fill="currentColor" />}
      title="Statut et Configuration Générale"
      iconBg="bg-orange-50"
    />
    <div className="p-6">
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-4">Statut et Activation</label>
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div>
                <p className="text-[13px] font-bold text-slate-800">Chatbot Activé</p>
                <p className="text-[11px] text-slate-400">Active ou désactive le chatbot sur le site</p>
              </div>
              <button
                onClick={() => onChange({ isActive: !settings.isActive })}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${settings.isActive ? 'bg-orange-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform mx-1 ${settings.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-3">Message d&apos;Accueil</label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => onChange({ welcomeMessage: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-4 text-[13px] text-slate-700 bg-white min-h-[100px] focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[13px] font-bold text-slate-800">Règle de Langue</label>
          <div>
            <p className="text-[11px] text-slate-500 mb-2">Langue par Défaut</p>
            <div className="relative">
              <select
                value={settings.defaultLanguage}
                onChange={(e) => onChange({ defaultLanguage: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] appearance-none bg-white outline-none focus:border-orange-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-4">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              <span className="font-bold text-blue-800">Info : </span>
              La langue par défaut sera utilisée pour les réponses automatiques du chatbot.
            </p>
          </div>
        </div>
      </div>
    </div>
  </SectionCard>
);

export default GeneralSettingsSection;