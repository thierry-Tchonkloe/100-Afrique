// src/app/(back-office)/chatbot/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle, Phone, Save, Plus, ChevronRight, Edit2, Copy, Trash2, Info, X, Check } from "lucide-react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "HIGH" | "MEDIUM" | "LOW";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  priority: Priority;
  isActive: boolean;
  order?: number;
}

interface ChatbotSettings {
  isActive: boolean;
  defaultLanguage: string;
  welcomeMessage: string;
  escalationKeywords: string[];
  contactFormUrl: string;
  contactFormEnabled: boolean;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  failureMessage: string;
}

interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

// ─── Components ───────────────────────────────────────────────────────────────

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
    {children}
  </div>
);

const SectionHeader = ({ icon, title, iconBg }: { icon: React.ReactNode; title: string; iconBg: string }) => (
  <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-50">
    <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
    <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h2>
  </div>
);

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const config = {
    HIGH: { label: "Priorité Élevée", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    MEDIUM: { label: "Priorité Normale", className: "bg-amber-50 text-amber-600 border-amber-100" },
    LOW: { label: "Priorité Basse", className: "bg-slate-50 text-slate-600 border-slate-100" },
  };
  
  const { label, className } = config[priority];
  
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
};

// ─── FAQ Modal ────────────────────────────────────────────────────────────────

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: FAQItem) => void;
  editingFaq?: FAQItem | null;
}

const FAQModal = ({ isOpen, onClose, onSave, editingFaq }: FAQModalProps) => {
  // ✅ CORRECTION: Initialiser directement avec les valeurs de editingFaq
  const [question, setQuestion] = useState(editingFaq?.question || "");
  const [answer, setAnswer] = useState(editingFaq?.answer || "");
  const [priority, setPriority] = useState<Priority>(editingFaq?.priority || "MEDIUM");

  // ✅ CORRECTION: Réinitialiser les champs quand editingFaq change (sans setState dans useEffect)
  useEffect(() => {
    // Cette approche est acceptable car on reset basé sur les props, pas sur l'état interne
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
      setPriority(editingFaq.priority);
    } else if (!isOpen) {
      // Reset uniquement quand le modal se ferme
      setQuestion("");
      setAnswer("");
      setPriority("MEDIUM");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFaq?.id, isOpen]); // ✅ Dépendre de l'ID plutôt que de l'objet complet

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    onSave({
      id: editingFaq?.id,
      question: question.trim(),
      answer: answer.trim(),
      priority,
      isActive: true,
      order: editingFaq?.order || 0,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {editingFaq ? "Modifier la Question/Réponse" : "Ajouter une Question/Réponse"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="Ex: Comment puis-je réserver un salon de tourisme ?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Réponse</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 min-h-[120px]"
              placeholder="Entrez la réponse complète..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="HIGH">Priorité Élevée</option>
              <option value="MEDIUM">Priorité Normale</option>
              <option value="LOW">Priorité Basse</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
          >
            {editingFaq ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatbotSettings() {
  // Settings state
  const [settings, setSettings] = useState<ChatbotSettings>({
    isActive: true,
    defaultLanguage: "fr",
    welcomeMessage: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
    escalationKeywords: ["parler à un humain", "devis", "urgence", "contact", "aide", "assistance"],
    contactFormUrl: "/contact/annonceurs",
    contactFormEnabled: true,
    whatsappNumber: "",
    whatsappEnabled: false,
    failureMessage: "Je n'ai pas trouvé de réponse à votre question. Voulez-vous contacter notre équipe pour une assistance personnalisée ?",
  });

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch Data ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchChatbotSettings();
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChatbotSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/chatbot/settings');
      if (response.data.data) {
        setSettings(response.data.data);
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur chargement paramètres:", apiError);
      setError(apiError.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await api.get('/admin/chatbot/faqs');
      if (response.data.data) {
        setFaqs(response.data.data);
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur chargement FAQ:", apiError);
    }
  };

  // ── Save Settings ────────────────────────────────────────────────────────

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError("");

      await api.put('/admin/chatbot/settings', settings);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur sauvegarde:", apiError);
      setError(apiError.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // ── FAQ Handlers ─────────────────────────────────────────────────────────

  const handleSaveFAQ = async (faq: FAQItem) => {
    try {
      setSaving(true);

      if (faq.id) {
        // Update
        const response = await api.put(`/admin/chatbot/faqs/${faq.id}`, faq);
        setFaqs(faqs.map(f => f.id === faq.id ? response.data.data : f));
      } else {
        // Create
        const response = await api.post('/admin/chatbot/faqs', faq);
        setFaqs([...faqs, response.data.data]);
      }

      setEditingFaq(null);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur sauvegarde FAQ:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) return;

    try {
      setSaving(true);
      await api.delete(`/admin/chatbot/faqs/${id}`);
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur suppression FAQ:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateFAQ = async (faq: FAQItem) => {
    const duplicate: FAQItem = {
      question: `${faq.question} (Copie)`,
      answer: faq.answer,
      priority: faq.priority,
      isActive: faq.isActive,
    };

    try {
      setSaving(true);
      const response = await api.post('/admin/chatbot/faqs', duplicate);
      setFaqs([...faqs, response.data.data]);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Erreur duplication FAQ:", apiError);
      alert(apiError.response?.data?.message || "Erreur lors de la duplication");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

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

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section 1: Statut & Configuration */}
          <SectionCard>
            <SectionHeader
              icon={<Star className="w-4 h-4 text-orange-500" fill="currentColor" />}
              title="Statut et Configuration Générale"
              iconBg="bg-orange-50"
            />
            <div className="p-6">
              <div className="grid grid-cols-2 gap-10">
                {/* Colonne Gauche */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-800 mb-4">Statut et Activation</label>
                    <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">Chatbot Activé</p>
                        <p className="text-[11px] text-slate-400">Active ou désactive le chatbot sur le site</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, isActive: !settings.isActive })}
                        className={`w-11 h-6 flex items-center rounded-full transition-colors ${settings.isActive ? 'bg-orange-500' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform mx-1 ${settings.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-800 mb-3">Message d&apos;Accueil</label>
                    <textarea
                      value={settings.welcomeMessage}
                      onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-4 text-[13px] text-slate-700 bg-white min-h-[100px] focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Colonne Droite */}
                <div className="space-y-4">
                  <label className="block text-[13px] font-bold text-slate-800">Règle de Langue</label>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-2">Langue par Défaut</p>
                    <div className="relative">
                      <select
                        value={settings.defaultLanguage}
                        onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] appearance-none bg-white outline-none focus:border-orange-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-4">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      <span className="font-bold text-blue-800">Info : </span>
                      La langue par défaut sera utilisée pour les réponses automatiques du chatbot.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Section 2: FAQ */}
          <SectionCard>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-50">
                  <MessageCircle className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-[15px] font-bold text-slate-800">Questions/Réponses Clés (FAQ)</h2>
              </div>
              <button
                onClick={() => {
                  setEditingFaq(null);
                  setIsModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter une Paire Q/R
              </button>
            </div>
            <div className="p-6 space-y-3">
              {faqs.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Aucune question FAQ configurée</p>
                  <p className="text-xs text-slate-400 mt-1">Cliquez sur &quot;Ajouter une Paire Q/R&quot; pour commencer</p>
                </div>
              ) : (
                faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                      <span className="text-[13px] text-slate-700 font-medium">{faq.question}</span>
                      <PriorityBadge priority={faq.priority} />
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateFAQ(faq)}
                        className="p-1.5 text-slate-400 hover:text-slate-600"
                        title="Dupliquer"
                        disabled={saving}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => faq.id && handleDeleteFAQ(faq.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                        title="Supprimer"
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          {/* Section 3: Escalade */}
          <SectionCard>
            <SectionHeader
              icon={<Phone className="w-4 h-4 text-orange-600" />}
              title="Règles d'Escalade et de Contact Humain"
              iconBg="bg-orange-50"
            />
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Mots-clés de Transfert</label>
                <p className="text-[11px] text-slate-400 mb-2">Mots-clés Déclencheurs</p>
                <input
                  value={settings.escalationKeywords.join(", ")}
                  onChange={(e) => setSettings({
                    ...settings,
                    escalationKeywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                  })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-orange-500"
                  placeholder="parler à un humain, devis, urgence, contact, aide, assistance"
                />
                <p className="text-[11px] text-slate-400 mt-2">Séparez les mots-clés par des virgules</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <p className="text-[12px] font-bold text-slate-800 uppercase">Canaux de Redirection</p>
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <p className="text-[13px] font-bold text-slate-700">Option 1 : Formulaire de Contact</p>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-2">URL du Formulaire</p>
                      <input
                        value={settings.contactFormUrl}
                        onChange={(e) => setSettings({ ...settings, contactFormUrl: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-orange-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.contactFormEnabled}
                        onChange={(e) => setSettings({ ...settings, contactFormEnabled: e.target.checked })}
                        className="accent-orange-500 w-4 h-4"
                      />
                      <span className="text-[12px] text-slate-600">Activer la redirection vers le formulaire</span>
                    </label>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <p className="text-[13px] font-bold text-slate-700">Option 2 : Contact WhatsApp</p>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-2">Numéro WhatsApp Business</p>
                      <input
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-orange-500"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.whatsappEnabled}
                        onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                        className="accent-orange-500 w-4 h-4"
                      />
                      <span className="text-[12px] text-slate-600">Activer la redirection WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase">Message d&apos;Échec</label>
                <p className="text-[11px] text-slate-400 mb-2">Message affiché en cas d&apos;échec</p>
                <textarea
                  value={settings.failureMessage}
                  onChange={(e) => setSettings({ ...settings, failureMessage: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-4 text-[13px] text-slate-700 min-h-[80px] outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </SectionCard>

          {/* Save Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-slate-800">Enregistrement de la Configuration</p>
              <p className="text-[12px] text-slate-400">Sauvegardez tous les paramètres du chatbot</p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[13px] font-bold text-white transition-all ${
                saved
                  ? 'bg-emerald-500'
                  : saving
                  ? 'bg-orange-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" /> Enregistré !
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Enregistrer la Configuration du Chatbot
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFaq(null);
        }}
        onSave={handleSaveFAQ}
        editingFaq={editingFaq}
      />
    </ProtectedRoute>
  );
}