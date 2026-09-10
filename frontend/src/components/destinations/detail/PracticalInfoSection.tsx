// src/components/destinations/detail/PracticalInfoSection.tsx
"use client";
import React from 'react';
import { FileText, MapPin, Coins, Languages, Clock, Thermometer, Calendar, Globe } from 'lucide-react';
import type { Destination } from './useDestinationDetail';

const InfoBadge = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
    <div className="p-2 bg-it-gold/10 rounded-xl shrink-0">
      <Icon size={18} className="text-it-gold" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">{label}</p>
      <p className="text-it-blue font-bold text-sm">{value}</p>
    </div>
  </div>
);

const PracticalInfoSection = ({ destination }: { destination: Destination }) => (
  <section className="bg-gradient-to-r from-it-emerald-dark to-it-blue py-12">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText size={18} className="text-it-gold" />
        <h2 className="text-white font-bold text-sm uppercase tracking-[0.2em]">Infos pratiques</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {destination.capital    && <InfoBadge icon={MapPin}      label="Capitale"          value={destination.capital}    />}
        {destination.currency   && <InfoBadge icon={Coins}       label="Monnaie"           value={destination.currency}   />}
        {destination.language   && <InfoBadge icon={Languages}   label="Langue"            value={destination.language}   />}
        {destination.timezone   && <InfoBadge icon={Clock}       label="Fuseau horaire"    value={destination.timezone}   />}
        {destination.climate    && <InfoBadge icon={Thermometer} label="Climat"            value={destination.climate}    />}
        {destination.bestPeriod && <InfoBadge icon={Calendar}    label="Meilleure période" value={destination.bestPeriod} />}
      </div>
      {destination.visaRequired !== undefined && (
        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              destination.visaRequired
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-it-emerald/20 text-it-emerald-light border border-it-emerald/30'
            }`}
          >
            <Globe size={14} />
            {destination.visaRequired ? 'Visa requis' : 'Sans visa requis'}
          </span>
        </div>
      )}
    </div>
  </section>
);

export default PracticalInfoSection;