// src/components/publicites/ui.tsx
"use client";
import React, { useEffect } from 'react';

export function Spinner({ sm }: { sm?: boolean }) {
  return (
    <svg className={`animate-spin ${sm ? 'w-4 h-4' : 'w-6 h-6'} text-orange-500`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium animate-fade-in-up ${
        type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      )}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function CircularProgress({ value }: { value: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#fed7aa" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#f97316" strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export function FillRateBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-orange-500' : value >= 50 ? 'bg-amber-400' : 'bg-gray-300';
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Taux de Remplissage</span>
        <span className="text-xs font-bold text-orange-500">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Toggle({ enabled, loading, onChange }: { enabled: boolean; loading?: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-60 ${
        enabled ? 'bg-orange-500' : 'bg-gray-200'
      }`}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center"><Spinner sm /></span>
      ) : (
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      )}
    </button>
  );
}

export function StatusBadge({ status }: { status: 'ACTIF' | 'FUTUR' | 'EXPIRE' }) {
  const map = {
    ACTIF: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    FUTUR: 'bg-blue-50 text-blue-600 border border-blue-200',
    EXPIRE: 'bg-gray-100 text-gray-500 border border-gray-200',
  };
  const dotMap = { ACTIF: 'bg-emerald-500', FUTUR: 'bg-blue-500', EXPIRE: 'bg-gray-400' };
  const labelMap = { ACTIF: 'Actif', FUTUR: 'Futur', EXPIRE: 'Expiré' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
      {labelMap[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: 'IMAGE_JPG' | 'HTML_JS' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        type === 'IMAGE_JPG'
          ? 'bg-blue-50 text-blue-600 border border-blue-200'
          : 'bg-purple-50 text-purple-600 border border-purple-200'
      }`}
    >
      {type === 'IMAGE_JPG' ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {type === 'IMAGE_JPG' ? 'Image JPG' : 'Code HTML/JS'}
    </span>
  );
}

export const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 placeholder:text-gray-400';
export const secondaryBtn = 'text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export function ModalActions({ onClose, onSave, saving, label }: { onClose: () => void; onSave: () => void; saving: boolean; label: string }) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
      <button onClick={onClose} className={secondaryBtn}>Annuler</button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
      >
        {saving && <Spinner sm />}
        {label}
      </button>
    </div>
  );
}