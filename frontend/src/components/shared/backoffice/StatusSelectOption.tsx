// src/components/shared/backoffice/StatusSelectOption.tsx
"use client";
import React from 'react';
import CustomSelect, { type SelectOption } from './CustomSelect';
import { STATUSES } from './statusOptions';

interface StatusSelectProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const statusOptions: SelectOption[] = STATUSES.map((s) => ({
  value: s.value, label: s.label, color: s.color, dot: s.dot,
}));

const StatusSelect = ({ value, onChange, error }: StatusSelectProps) => (
  <CustomSelect
    placeholder="Sélectionner un statut"
    options={statusOptions}
    value={value}
    onChange={onChange}
    error={error}
    renderOption={(opt) => (
      <>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />
        <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
      </>
    )}
    renderSelected={(opt) => (
      <span className="flex items-center gap-2 text-sm">
        <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
        <span className={`font-medium ${opt.color}`}>{opt.label}</span>
      </span>
    )}
  />
);

export default StatusSelect;