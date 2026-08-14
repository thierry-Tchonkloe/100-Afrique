'use client';
// src/components/recruteur/vitrine/VitrineToast.tsx
import { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function VitrineToast({
  message, type, onDone,
}: {
  message: string;
  type: 'success' | 'error';
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, type === 'error' ? 5000 : 2500);
    return () => clearTimeout(t);
  }, [onDone, type]);

  return (
    <div
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-white text-sm font-medium',
        'px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 max-w-md',
        type === 'success' ? 'bg-gray-900' : 'bg-red-600',
      )}
    >
      {type === 'success'
        ? <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
        : <AlertCircle size={16} className="text-white flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
