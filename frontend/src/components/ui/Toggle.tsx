// src/components/ui/Toggle.tsx
// Composant Toggle réutilisable — design correct garanti
'use client';

interface ToggleProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, disabled = false, size = 'md' }: ToggleProps) {
  const track = size === 'sm'
    ? 'w-10 h-5'
    : 'w-12 h-6';
  const thumb = size === 'sm'
    ? 'w-4 h-4 top-0.5 left-0.5'
    : 'w-5 h-5 top-0.5 left-0.5';
  const translate = size === 'sm'
    ? (checked ? 'translate-x-5' : 'translate-x-0')
    : (checked ? 'translate-x-6' : 'translate-x-0');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={[
        'relative inline-flex flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
        track,
        checked ? 'bg-[#E8622A]' : 'bg-gray-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'absolute rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
          thumb,
          translate,
        ].join(' ')}
      />
    </button>
  );
}