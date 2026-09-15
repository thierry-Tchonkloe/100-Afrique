// src/components/shared/backoffice/ConfirmModal.tsx
"use client";
import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const ConfirmModal = ({ title, message, confirmLabel = 'Supprimer', onConfirm, onCancel }: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <div className="text-sm text-gray-500 mb-6">{message}</div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;