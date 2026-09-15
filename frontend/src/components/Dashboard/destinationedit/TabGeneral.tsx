// src/components/Dashboard/destinationedit/TabGeneral.tsx
"use client";
import React from 'react';
import { Edit3, Globe, FileText, Star, ChevronDown } from 'lucide-react';
import { Category, STATUS_API_TO_UI } from '@/services/Dashboard/articleservice';
import TagSelector from '@/components/shared/backoffice/TagSelector';
import RichTextToolbar from '@/components/shared/backoffice/RichTextToolbar';
import { DestinationForm, TYPES_ZONE, NIVEAUX_GEO, CONTINENTS, REGIONS } from './useDestinationEditForm';

function SelectField({ label, value, onChange, options, className = '' }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
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

interface TabGeneralProps {
  form: DestinationForm;
  onChange: (patch: Partial<DestinationForm>) => void;
  categorie: Category[];
}

const TabGeneral = ({ form, onChange, categorie }: TabGeneralProps) => {
  const regions = REGIONS[form.continent] ?? [];
  const isAfrica = form.continent === 'Afrique';

  return (
    <div className="space-y-8 py-6">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Edit3 size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Identification et Description</h3>
        </div>
        <div className="space-y-4">
          <InputField label="Nom de la Destination (H1)" value={form.title} onChange={(v) => onChange({ title: v })} />
          <InputField label="Slogan / Phrase d'Accroche" value={form.slogan} onChange={(v) => onChange({ slogan: v })} placeholder="Ex: Terre de Téranga, destination d'exception" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Type de Zone" value={form.typeZone} onChange={(v) => onChange({ typeZone: v })} options={TYPES_ZONE} />
            <SelectField label="Niveau Géographique" value={form.niveauGeographique} onChange={(v) => onChange({ niveauGeographique: v })} options={NIVEAUX_GEO} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Description Détaillée <span className="text-gray-400 font-normal">(Atouts B2B)</span>
            </label>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
              <RichTextToolbar />
              <textarea
                value={form.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Rédigez une présentation complète de la destination…"
                rows={7}
                className="w-full resize-none px-3.5 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Globe size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Relations Géographiques</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Continent"
            value={form.continent}
            onChange={(v) => onChange({ continent: v, regionAssociee: REGIONS[v]?.[0] ?? '' })}
            options={CONTINENTS}
          />
          <SelectField
            label="Région Associée"
            value={form.regionAssociee}
            onChange={(v) => onChange({ regionAssociee: v })}
            options={regions.length ? regions : [form.regionAssociee].filter(Boolean)}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          La « Région Associée » est utilisée par les filtres publics (ex: menu Destinations du header).
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileText size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Classification</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Statut</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => onChange({ status: e.target.value })}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
              >
                {Object.values(STATUS_API_TO_UI).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Catégorie</label>
            <div className="relative">
              <select
                value={form.categoryId ?? ''}
                onChange={(e) => onChange({ categoryId: Number(e.target.value) })}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
              >
                <option value="">Aucune catégorie</option>
                {categorie.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${form.featured ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
            <input
              type="checkbox"
              id="destination-featured"
              checked={form.featured}
              onChange={(e) => onChange({ featured: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-orange-500 cursor-pointer"
            />
            <label htmlFor="destination-featured" className="flex-1 cursor-pointer">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <Star size={14} className={form.featured ? 'text-amber-500 fill-amber-400' : 'text-gray-400'} />
                Mettre en avant — Coup de cœur Afrique
              </span>
              <span className="block text-xs text-gray-500 mt-1 leading-relaxed">
                Si activé, cette destination peut apparaître dans la section « Coups de cœur Afrique » de la page Destinations.
                {!isAfrica && (
                  <span className="block mt-1 font-semibold text-amber-600">
                    ⚠ Le continent actuel est « {form.continent || 'non défini'} » : seules les destinations avec le continent « Afrique » apparaissent dans cette section.
                  </span>
                )}
              </span>
            </label>
          </div>

          <TagSelector selectedIds={form.selectedTagIds} onChange={(ids) => onChange({ selectedTagIds: ids })} />
        </div>
      </section>
    </div>
  );
};

export default TabGeneral;