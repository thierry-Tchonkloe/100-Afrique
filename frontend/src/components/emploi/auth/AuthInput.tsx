'use client';
// src/components/emploi/auth/AuthInput.tsx
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

export default function AuthInput({
  label, type = 'text', value, onChange, placeholder, error, required, rightElement,
}: AuthInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={clsx(
            'w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none transition',
            'focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A]',
            error ? 'border-red-400 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
