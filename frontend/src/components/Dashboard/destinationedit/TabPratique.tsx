// src/components/Dashboard/destinationedit/TabPratique.tsx
"use client";
import React from 'react';
import { Globe, Info, ChevronDown } from 'lucide-react';
import { DestinationForm, FUSEAUX, CLIMATS } from './useDestinationEditForm';

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

interface TabPratiqueProps {
  form: DestinationForm;
  onChange: (patch: Partial<DestinationForm>) => void;
}

const TabPratique = ({ form, onChange }: TabPratiqueProps) => (
  <div className="space-y-6 py-6">
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Globe size={15} className="text-orange-500" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Informations Pratiques Clés</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Langue(s) Officielle(s)</label>
            <input
              value={form.langue}
              onChange={(e) => onChange({ langue: e.target.value })}
              placeholder="Arabe, Français, Berbère"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
            <p className="text-xs text-gray-400">Séparez par des virgules</p>
          </div>
          <InputField label="Monnaie" value={form.monnaie} onChange={(v) => onChange({ monnaie: v })} placeholder="Franc CFA - XOF" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Fuseau Horaire" value={form.fuseauHoraire || 'UTC+0'} onChange={(v) => onChange({ fuseauHoraire: v })} options={['— Fuseau horaire —', ...FUSEAUX]} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Office de Tourisme Officiel</label>
            <div className="relative">
              <input
                type="url"
                value={form.officeTourisme}
                onChange={(e) => onChange({ officeTourisme: e.target.value })}
                placeholder="https://…"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
              <Globe size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Info size={15} className="text-orange-500" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Informations Complémentaires</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Climat Dominant" value={form.climatDominant || '— Climat —'} onChange={(v) => onChange({ climatDominant: v })} options={['— Climat —', ...CLIMATS]} />
          <InputField label="Population" value={form.population} onChange={(v) => onChange({ population: v })} placeholder="1 200 000 hab." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Code Téléphonique" value={form.codeTel} onChange={(v) => onChange({ codeTel: v })} placeholder="+221" />
          <InputField label="Meilleure Période" value={form.meillerePeriode} onChange={(v) => onChange({ meillerePeriode: v })} placeholder="Novembre à Avril" />
        </div>
      </div>
    </section>
  </div>
);

export default TabPratique;