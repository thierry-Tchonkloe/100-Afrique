// src/app/(back-office)/langues/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import api from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
  isDefault: boolean;
  articles?: { done: number; total: number }; // ✅ CORRECTION: Optionnel
  destinations?: { done: number; total: number }; // ✅ CORRECTION: Optionnel
  videos?: { done: number; total: number }; // ✅ CORRECTION: Optionnel
  createdAt: string;
  updatedAt: string;
}

interface LanguageSettings {
  defaultLanguage: string;
  translationStrategy: "manual" | "api";
  syncMetadata: boolean;
  autoPublish: boolean;
  untranslatedRedirect: "default" | "home" | "404";
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
      errors?: { field: string; message: string }[];
    };
    status?: number;
  };
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// ✅ CORRECTION: Gérer les cas où les propriétés sont undefined
function getPercent(lang: Language): number {
  const articlesDone = lang.articles?.done || 0;
  const articlesTotal = lang.articles?.total || 0;
  const destinationsDone = lang.destinations?.done || 0;
  const destinationsTotal = lang.destinations?.total || 0;
  const videosDone = lang.videos?.done || 0;
  const videosTotal = lang.videos?.total || 0;

  const done = articlesDone + destinationsDone + videosDone;
  const total = articlesTotal + destinationsTotal + videosTotal;
  
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function progressColor(pct: number): string {
  if (pct === 100) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-400";
  return "bg-orange-400";
}

// ── Flag SVGs ─────────────────────────────────────────────────────────────────

const FlagFR = () => (
  <svg viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="10" height="20" fill="#002395" />
    <rect x="10" width="10" height="20" fill="#FFFFFF" />
    <rect x="20" width="10" height="20" fill="#ED2939" />
  </svg>
);

const FlagEN = () => (
  <svg viewBox="0 0 60 30" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const FlagES = () => (
  <svg viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
);

const FlagDE = () => (
  <svg viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="30" height="20" fill="#000" />
    <rect y="6.67" width="30" height="6.67" fill="#D00" />
    <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
  </svg>
);

const FlagIT = () => (
  <svg viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="10" height="20" fill="#009246" />
    <rect x="10" width="10" height="20" fill="#FFFFFF" />
    <rect x="20" width="10" height="20" fill="#CE2B37" />
  </svg>
);

const FlagPT = () => (
  <svg viewBox="0 0 30 20" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="30" height="20" fill="#006600" />
    <rect x="12" width="18" height="20" fill="#FF0000" />
  </svg>
);

const flagMap: Record<string, React.ReactNode> = {
  FR: <FlagFR />,
  EN: <FlagEN />,
  ES: <FlagES />,
  DE: <FlagDE />,
  IT: <FlagIT />,
  PT: <FlagPT />,
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconLoader = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSave = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle = ({ checked, onChange, disabled }: ToggleProps) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
      checked ? "bg-orange-500" : "bg-gray-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// ── Language Card ─────────────────────────────────────────────────────────────

interface LangCardProps {
  lang: Language;
  onToggle: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const LangCard = ({ lang, onToggle, onDelete, disabled }: LangCardProps) => {
  const pct = getPercent(lang);
  const barColor = progressColor(pct);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {flagMap[lang.code] || <div className="w-5 h-4 bg-gray-200 rounded-sm" />}
          <div>
            <p className="text-sm font-semibold text-gray-800">{lang.name}</p>
            <p className="text-xs text-gray-400 font-medium">{lang.code}</p>
          </div>
          {lang.isDefault && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">
              Par défaut
            </span>
          )}
        </div>
        <Toggle checked={lang.enabled} onChange={onToggle} disabled={disabled || lang.isDefault} />
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Contenu traduit</span>
          <span
            className={`text-xs font-bold ${
              pct === 100 ? "text-emerald-600" : "text-amber-500"
            }`}
          >
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats - ✅ CORRECTION: Gérer les cas undefined */}
      <div className="text-xs text-gray-500 space-y-0.5">
        <p>
          Articles :{" "}
          <span className="text-gray-700 font-medium">
            {lang.articles?.done || 0}/{lang.articles?.total || 0}
          </span>
        </p>
        <p>
          Destinations :{" "}
          <span className="text-gray-700 font-medium">
            {lang.destinations?.done || 0}/{lang.destinations?.total || 0}
          </span>
        </p>
        <p>
          Vidéos :{" "}
          <span className="text-gray-700 font-medium">
            {lang.videos?.done || 0}/{lang.videos?.total || 0}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg py-2 px-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <IconSettings />
          Paramètres
        </button>
        <button
          onClick={onDelete}
          disabled={disabled || lang.isDefault}
          className="p-2 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Supprimer la langue"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
};

// ── Add Language Modal ────────────────────────────────────────────────────────

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { code: string; name: string; nativeName: string }) => void;
}

const AddLanguageModal = ({ isOpen, onClose, onAdd }: AddLanguageModalProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");

  const handleSubmit = () => {
    if (!code.trim() || !name.trim() || !nativeName.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    onAdd({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      nativeName: nativeName.trim(),
    });

    // Reset
    setCode("");
    setName("");
    setNativeName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Ajouter une Nouvelle Langue</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Code ISO (2 lettres) *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 uppercase"
              placeholder="Ex: DE"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nom (en français) *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="Ex: Allemand"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nom Natif *</label>
            <input
              type="text"
              value={nativeName}
              onChange={(e) => setNativeName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500"
              placeholder="Ex: Deutsch"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component (reste inchangé) ──────────────────────────────────────────

export default function InternationalisationPage() {
  // ... (reste du code identique à votre version actuelle)
  
  // ── States ──────────────────────────────────────────────────────────────────
  const [languages, setLanguages] = useState<Language[]>([]);
  const [settings, setSettings] = useState<LanguageSettings>({
    defaultLanguage: "FR",
    translationStrategy: "manual",
    syncMetadata: true,
    autoPublish: false,
    untranslatedRedirect: "default",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch Data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchLanguages();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<ApiResponse<Language[]>>("/admin/languages");
      setLanguages(response.data.data || []);
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur récupération langues:", error);
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get<ApiResponse<LanguageSettings>>("/admin/languages/settings");
      if (response.data.data) {
        setSettings(response.data.data);
      }
    } catch (err) {
      console.error("Erreur récupération paramètres:", err);
    }
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAddLanguage = async (data: { code: string; name: string; nativeName: string }) => {
    try {
      setSaving(true);
      setError("");

      const response = await api.post<ApiResponse<Language>>("/admin/languages", {
        code: data.code,
        name: data.name,
        nativeName: data.nativeName,
        enabled: false,
      });

      if (response.data.data) {
        setLanguages([...languages, response.data.data]);
      }
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur ajout langue:", error);
      alert(error.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLanguage = async (id: number, currentEnabled: boolean) => {
    try {
      setSaving(true);
      setError("");

      const response = await api.patch<ApiResponse<Language>>(`/admin/languages/${id}/toggle`, {
        enabled: !currentEnabled,
      });

      if (response.data.data) {
        setLanguages(languages.map((l) => (l.id === id ? response.data.data! : l)));
      }
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur toggle langue:", error);
      alert(error.response?.data?.message || "Erreur lors de l'activation/désactivation");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette langue ?")) return;

    try {
      setSaving(true);
      setError("");

      await api.delete<ApiResponse<null>>(`/admin/languages/${id}`);
      setLanguages(languages.filter((l) => l.id !== id));
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur suppression langue:", error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError("");

      await api.put<ApiResponse<LanguageSettings>>("/admin/languages/settings", settings);
      alert("Paramètres enregistrés avec succès !");
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur sauvegarde paramètres:", error);
      alert(error.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (code: string) => {
    try {
      setSaving(true);
      setError("");

      await api.patch<ApiResponse<null>>("/admin/languages/default", {
        defaultLanguage: code,
      });

      setSettings({ ...settings, defaultLanguage: code });
      
      // Mettre à jour les langues pour refléter le nouveau défaut
      setLanguages(
        languages.map((l) => ({
          ...l,
          isDefault: l.code === code,
        }))
      );
    } catch (err) {
      const error = err as ApiError;
      console.error("Erreur changement langue par défaut:", error);
      alert(error.response?.data?.message || "Erreur lors du changement");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <IconLoader />
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const defaultLang = languages.find((l) => l.isDefault);

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ── Page Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Gestion des Langues{" "}
                <span className="text-gray-400 font-normal">(Internationalisation)</span>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Configurez les langues disponibles sur le Front-Office et suivez la progression des
                traductions.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {saving ? <IconLoader /> : <IconPlus />}
              Ajouter une Nouvelle Langue
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                <IconX />
              </button>
            </div>
          )}

          {/* ── Default Language ── */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Langue Par Défaut
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {defaultLang && (flagMap[defaultLang.code] || <div className="w-5 h-4 bg-gray-200 rounded-sm" />)}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {defaultLang?.name || "Aucune langue par défaut"}
                  </p>
                  <p className="text-xs text-gray-400">Langue principale du site</p>
                </div>
              </div>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => handleSetDefault(e.target.value)}
                disabled={saving}
                className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer disabled:opacity-50"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.code}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ── Active Languages ── */}
          <section>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Langues Actives du Site
            </h2>
            {languages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <p className="text-gray-400 text-sm">
                  Aucune langue configurée. Ajoutez-en une ci-dessus.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((lang) => (
                  <LangCard
                    key={lang.id}
                    lang={lang}
                    onToggle={() => handleToggleLanguage(lang.id, lang.enabled)}
                    onDelete={() => handleDeleteLanguage(lang.id)}
                    disabled={saving}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Workflow & Sync ── */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-5">
              Workflow et Synchronisation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stratégie */}
              <div>
                <h3 className="text-xs font-bold text-gray-600 mb-3">Stratégie de Traduction</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="strategy"
                      value="manual"
                      checked={settings.translationStrategy === "manual"}
                      onChange={() =>
                        setSettings({ ...settings, translationStrategy: "manual" })
                      }
                      className="mt-0.5 accent-orange-500 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                        Traduction Manuelle
                      </p>
                      <p className="text-xs text-gray-400 leading-snug">
                        Duplique le contenu FR pour traduction par un rédacteur
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="strategy"
                      value="api"
                      checked={settings.translationStrategy === "api"}
                      onChange={() => setSettings({ ...settings, translationStrategy: "api" })}
                      className="mt-0.5 accent-orange-500 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                        API de Traduction
                      </p>
                      <p className="text-xs text-gray-400 leading-snug">
                        Intégration future avec DeepL ou Google Translate
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Synchronisation */}
              <div>
                <h3 className="text-xs font-bold text-gray-600 mb-3">Synchronisation</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={settings.syncMetadata}
                      onChange={() =>
                        setSettings({ ...settings, syncMetadata: !settings.syncMetadata })
                      }
                      className="mt-0.5 accent-orange-500 cursor-pointer rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                        Synchroniser les métadonnées
                      </p>
                      <p className="text-xs text-gray-400 leading-snug">
                        Maintenir la cohérence des tags et catégories
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={settings.autoPublish}
                      onChange={() =>
                        setSettings({ ...settings, autoPublish: !settings.autoPublish })
                      }
                      className="mt-0.5 accent-orange-500 cursor-pointer rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                        Auto-publication
                      </p>
                      <p className="text-xs text-gray-400 leading-snug">
                        Publier automatiquement les traductions validées
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Redirection */}
              <div>
                <h3 className="text-xs font-bold text-gray-600 mb-3">Redirection</h3>
                <p className="text-xs text-gray-500 mb-2">Contenu non traduit</p>
                <select
                  value={settings.untranslatedRedirect}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      untranslatedRedirect: e.target.value as "default" | "home" | "404",
                    })
                  }
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                >
                  <option value="default">Afficher la version par défaut (FR)</option>
                  <option value="home">Rediriger vers la page d&apos;accueil</option>
                  <option value="404">Afficher une page 404</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Save Button ── */}
          <div className="flex justify-end pb-4">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? <IconLoader /> : <IconSave />}
              {saving ? "Enregistrement..." : "Enregistrer les Paramètres"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Language Modal ── */}
      <AddLanguageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLanguage}
      />
    </ProtectedRoute>
  );
}