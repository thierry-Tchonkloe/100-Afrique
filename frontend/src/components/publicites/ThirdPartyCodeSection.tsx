// src/components/publicites/ThirdPartyCodeSection.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/backoffice/apiFetch';
import { Spinner } from './ui';
import { fmtDate } from './types';
import type { ThirdPartyCode } from './types';

interface ThirdPartyCodeSectionProps {
  thirdParty: ThirdPartyCode | null;
  onSaved: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const ThirdPartyCodeSection = ({ thirdParty, onSaved, onToast }: ThirdPartyCodeSectionProps) => {
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (thirdParty?.code) setCode(thirdParty.code);
  }, [thirdParty]);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch('/admin/advertising/third-party', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
      });
      onToast('Codes tiers enregistrés', 'success');
      onSaved();
    } catch (e) {
      onToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Codes Tiers et Intégration</h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700">Codes de suivi et publicité externes</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Collez ici vos codes Google Ad Manager, codes de vérification ou autres scripts tiers.
          </p>
          {thirdParty?.updatedAt && (
            <p className="text-xs text-gray-400 mt-1">Dernière mise à jour : {fmtDate(thirdParty.updatedAt)}</p>
          )}
        </div>
        <div className="relative">
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700 px-4 pt-8 pb-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 leading-relaxed placeholder:text-gray-600"
            placeholder="<!-- Collez vos codes HTML/JavaScript ici -->"
            spellCheck={false}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-60"
          >
            {saving ? <Spinner sm /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
              </svg>
            )}
            Enregistrer les Codes Tiers
          </button>
        </div>
      </div>
    </section>
  );
};

export default ThirdPartyCodeSection;