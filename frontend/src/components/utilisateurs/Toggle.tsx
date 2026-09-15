// src/components/utilisateurs/Toggle.tsx
"use client";
import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle = ({ enabled, onChange, disabled }: ToggleProps) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? 'bg-orange-500' : 'bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);

export default Toggle;