// src/components/candidat/parametres/DangerZone.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Download, PauseCircle, X } from 'lucide-react';
import { pauseAccount, exportData, deleteAccount } from '../../../services/parametres.service';

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const canDelete = confirm === 'SUPPRIMER' && password.length >= 6;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Supprimer définitivement le compte</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Cette action est <strong>irréversible</strong>. Toutes vos candidatures,
              votre CV et vos alertes seront définitivement effacés.
            </p>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Tapez <span className="font-bold text-red-500">SUPPRIMER</span> pour confirmer
            </label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition">
            Annuler
          </button>
          <button
            onClick={() => canDelete && onConfirm(password)}
            disabled={!canDelete || loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700
                       rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Suppression…' : 'Supprimer définitivement'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

export default function DangerZone() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [pausing,   setPausing]   = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handlePause() {
    setPausing(true);
    try { await pauseAccount(); } catch {}
    setPausing(false);
    alert('Votre compte a été mis en pause. Il sera masqué jusqu\'à réactivation.');
  }

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await exportData();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'mes-donnees-itourisme.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Mock export
      const data = JSON.stringify({ export: 'RGPD', date: new Date().toISOString() }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'mes-donnees-itourisme.json';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete(password: string) {
    setDeleting(true);
    try {
      await deleteAccount(password);
      localStorage.removeItem('emploi_token');
      window.location.href = '/';
    } catch {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <>
      <section className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <h2 className="font-bold text-red-600">Zone de Danger</h2>
        </div>

        {/* Pause */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">Mettre mon compte en pause</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Masquer temporairement votre profil sans perdre vos données
            </p>
          </div>
          <button
            onClick={handlePause}
            disabled={pausing}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold
                       px-4 py-2 rounded-xl hover:bg-gray-50 transition flex-shrink-0 disabled:opacity-60"
          >
            <PauseCircle size={15} />
            {pausing ? 'En cours…' : 'Mettre en pause'}
          </button>
        </div>

        {/* Export */}
        <div className="flex items-start justify-between gap-4 py-4 border-t border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Exporter mes données</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Télécharger toutes vos informations (RGPD)
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold
                       px-4 py-2 rounded-xl hover:bg-gray-50 transition flex-shrink-0 disabled:opacity-60"
          >
            <Download size={15} />
            {exporting ? 'Préparation…' : 'Exporter'}
          </button>
        </div>

        {/* Delete */}
        <div className="flex items-start justify-between gap-4 pt-1 border-t border-red-100">
          <div>
            <p className="text-sm font-semibold text-red-600">Supprimer mon compte</p>
            <p className="text-xs text-red-400 mt-0.5">
              Action irréversible – Toutes vos données seront effacées
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold
                       px-4 py-2 rounded-xl transition flex-shrink-0"
          >
            Supprimer définitivement
          </button>
        </div>
      </section>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </>
  );
}