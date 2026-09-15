// src/components/shared/backoffice/DestinationSelectOption.tsx
"use client";
import React from 'react';
import CustomSelect, { type SelectOption } from './CustomSelect';
import type { DestinationOption } from '@/services/Dashboard/destinationservice';

interface DestinationSelectProps {
  destinations: DestinationOption[];
  value: string;
  onChange: (v: string) => void;
}

const DestinationSelect = ({ destinations, value, onChange }: DestinationSelectProps) => {
  const options: SelectOption[] = [
    { value: '', label: 'Aucune destination' },
    ...destinations.map((d) => ({ value: String(d.id), label: d.name, sublabel: d.continent ?? undefined })),
  ];

  return (
    <CustomSelect
      placeholder="Aucune destination"
      options={options}
      value={value}
      onChange={onChange}
      renderOption={(opt) => (
        <span>
          <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
          {opt.sublabel && <span className="block text-xs text-slate-400">{opt.sublabel}</span>}
        </span>
      )}
      renderSelected={(opt) => <span className="text-sm font-medium text-slate-800">{opt.label}</span>}
    />
  );
};

export default DestinationSelect;