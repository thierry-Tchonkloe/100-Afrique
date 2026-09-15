// src/app/(back-office)/chatbot/page.tsx
"use client";

import { Save, Check, X } from 'lucide-react';
import { ProtectedRoute } from '@/components/Dashboard/ProtectedRoute';
import { useChatbotSettings } from '@/components/chatbot/useChatbotSettings';
import { useFAQManager } from '@/components/chatbot/useFAQManager';
import GeneralSettingsSection from '@/components/chatbot/GeneralSettingsSection';
import FAQSection from '@/components/chatbot/FAQSection';
import EscalationSection from '@/components/chatbot/EscalationSection';
import FAQModal from '@/components/chatbot/FAQModal';

export default function ChatbotSettingsPage() {
  const { settings, updateSettings, loading, saving, saved, error, setError, handleSave } = useChatbotSettings();
  const {
    faqs, saving: faqSaving, isModalOpen, editingFaq,
    openCreateModal, openEditModal, closeModal,
    handleSaveFAQ, handleDeleteFAQ, handleDuplicateFAQ,
  } = useFAQManager();

  if (loading) {
    return (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Chargement des paramètres...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-slate-50/50 py-10 px-4 font-['DM_Sans',sans-serif]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Paramétrage du Chatbot & de la FAQ</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <GeneralSettingsSection settings={settings} onChange={updateSettings} />

          <FAQSection
            faqs={faqs}
            saving={faqSaving}
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDuplicate={handleDuplicateFAQ}
            onDelete={handleDeleteFAQ}
          />

          <EscalationSection settings={settings} onChange={updateSettings} />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Enregistrement de la Configuration</p>
              <p className="text-[12px] text-slate-400">Sauvegardez tous les paramètres du chatbot</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[13px] font-bold text-white transition-all ${
                saved ? 'bg-emerald-500' : saving ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enregistrement...</>
              ) : saved ? (
                <><Check className="w-4 h-4" /> Enregistré !</>
              ) : (
                <><Save className="w-4 h-4" /> Enregistrer la Configuration du Chatbot</>
              )}
            </button>
          </div>
        </div>
      </div>

      <FAQModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveFAQ} editingFaq={editingFaq} />
    </ProtectedRoute>
  );
}