// src/components/categories/TaxonomySettingsPanel.tsx
"use client";
import React from 'react';
import { IconLock, IconLoader, btnOrange } from './icons/CategoryIcons';

interface TaxonomySettingsPanelProps {
  maxTags: string; setMaxTags: (v: string) => void;
  tagsEnabled: boolean; setTagsEnabled: (v: boolean) => void;
  submitting: boolean;
  onSave: () => void;
}

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const TaxonomySettingsPanel = ({ maxTags, setMaxTags, tagsEnabled, setTagsEnabled, submitting, onSave }: TaxonomySettingsPanelProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h2 className="text-base font-semibold text-gray-800 mb-5">Paramètres Additionnels</h2>

    <div className="flex flex-wrap gap-10 items-start">
      <div className="flex-1 min-w-50 max-w-xs">
        <label className="block text-sm text-gray-600 mb-1.5">
          Nombre maximum de Tags affichés en front-office
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-400 bg-white cursor-pointer"
            value={maxTags}
            onChange={(e) => setMaxTags(e.target.value)}
          >
            {[3, 5, 8, 10, 15, 20].map((n) => (
              <option key={n} value={String(n)}>{n}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <ChevronIcon />
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1.5">Statut des Tags</p>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${tagsEnabled ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => setTagsEnabled(true)}
            >
              {tagsEnabled && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
            <span className="text-sm text-gray-700">Activés</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${!tagsEnabled ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => setTagsEnabled(false)}
            >
              {!tagsEnabled && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
            <span className="text-sm text-gray-700">Désactivés</span>
          </label>
        </div>
      </div>
    </div>

    <div className="mt-6">
      <button className={btnOrange} onClick={onSave} disabled={submitting}>
        {submitting ? <IconLoader /> : <IconLock />}
        {submitting ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
      </button>
    </div>
  </div>
);

export default TaxonomySettingsPanel;