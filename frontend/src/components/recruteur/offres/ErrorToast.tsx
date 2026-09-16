'use client';
// src/components/recruteur/offres/ErrorToast.tsx
import { AlertCircle } from 'lucide-react';

export default function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                    bg-red-50 border border-red-200 text-red-700 text-sm font-medium
                    px-4 py-3 rounded-2xl shadow-lg">
      <AlertCircle size={16} className="flex-shrink-0" />
      {message}
      <button onClick={onClose} className="ml-2 text-red-400 hover:text-red-600 font-bold">×</button>
    </div>
  );
}
