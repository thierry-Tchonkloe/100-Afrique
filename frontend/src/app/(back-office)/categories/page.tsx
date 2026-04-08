// src/app/(back-office)/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type?: string;
  order?: number;
  color?: string;
  _count?: {
    articles: number;
  };
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

// ✅ CORRECTION: Définir un type d'erreur personnalisé
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconEdit({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function IconEye({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconTrash({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );
}

function IconMerge({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  );
}

function IconLock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconLoader({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CategoryTagsManager() {
  // States (identiques)
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");

  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editTagName, setEditTagName] = useState("");

  const [maxTags, setMaxTags] = useState("5");
  const [tagsEnabled, setTagsEnabled] = useState(true);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [categoryError, setCategoryError] = useState<string>("");
  const [tagError, setTagError] = useState<string>("");

  // ── Fetch initial data ───────────────────────────────────────────────────

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchSettings();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError("");
      const response = await api.get('/admin/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur récupération catégories:", err);
      setCategoryError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors du chargement des catégories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      setTagError("");
      const response = await api.get('/admin/tags');
      setTags(response.data.data || []);
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur récupération tags:", err);
      setTagError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors du chargement des tags"
      );
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings/taxonomy');
      const settings = response.data.data;
      setMaxTags(String(settings?.maxTags || 5));
      setTagsEnabled(settings?.tagsEnabled !== false);
    } catch (error) {
      console.error("Erreur récupération paramètres:", error);
      // Utiliser les valeurs par défaut
    }
  };

  // ── Category handlers ────────────────────────────────────────────────────

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    
    const slug = newCatSlug.trim() || newCatName.toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");

    try {
      setSubmitting(true);
      setCategoryError("");
      
      const response = await api.post('/admin/categories', {
        name: newCatName.trim(),
        slug,
        description: newCatDescription.trim() || undefined,
        type: 'MAGAZINE',
        order: categories.length,
      });

      setCategories((prev) => [...prev, response.data.data]);
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDescription("");
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur création catégorie:", err);
      setCategoryError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la création"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editCatName.trim()) return;

    try {
      setSubmitting(true);
      setCategoryError("");

      const response = await api.put(`/admin/categories/${id}`, {
        name: editCatName.trim(),
        slug: editCatSlug.trim(),
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? response.data.data : c))
      );
      setEditingCatId(null);
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur modification catégorie:", err);
      setCategoryError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la modification"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;

    try {
      setSubmitting(true);
      setCategoryError("");

      await api.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur suppression catégorie:", err);
      setCategoryError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Tag handlers ─────────────────────────────────────────────────────────

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    const name = newTagName.startsWith("#") ? newTagName.trim() : `#${newTagName.trim()}`;
    const slug = name.replace("#", "").toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");

    try {
      setSubmitting(true);
      setTagError("");

      const response = await api.post('/admin/tags', {
        name,
        slug,
      });

      setTags((prev) => [...prev, response.data.data]);
      setNewTagName("");
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur création tag:", err);
      setTagError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la création"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!editTagName.trim()) return;

    try {
      setSubmitting(true);
      setTagError("");

      const response = await api.put(`/admin/tags/${id}`, {
        name: editTagName.trim(),
      });

      setTags((prev) =>
        prev.map((t) => (t.id === id ? response.data.data : t))
      );
      setEditingTagId(null);
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur modification tag:", err);
      setTagError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la modification"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) return;

    try {
      setSubmitting(true);
      setTagError("");

      await api.delete(`/admin/tags/${id}`);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur suppression tag:", err);
      setTagError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la suppression"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSubmitting(true);

      await api.put('/admin/settings/taxonomy', {
        maxTags: parseInt(maxTags),
        tagsEnabled,
      });

      alert("Paramètres enregistrés avec succès !");
    } catch (error) {
      const err = error as ApiError;
      console.error("Erreur sauvegarde paramètres:", err);
      alert(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message ||
        "Erreur lors de la sauvegarde"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // ── Shared styles ────────────────────────────────────────────────────────

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder-gray-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  const btnOrange =
    "inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const iconBtn =
    "p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Catégories et des Tags
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organisez la taxonomie de votre site pour une meilleure navigation et un SEO optimisé
          </p>
        </div>

        {/* ── Top row: Categories + Tags ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* ── Categories panel ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Catégories (Taxonomie Principale)
            </h2>

            {/* Error message */}
            {categoryError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
                {categoryError}
              </div>
            )}

            {/* Add form */}
            <div className="space-y-2 mb-5">
              <input
                className={inputCls}
                placeholder="Nom de la nouvelle catégorie *"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                disabled={submitting}
              />
              <input
                className={inputCls}
                placeholder="Slug (ex: tourisme-afrique)"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                disabled={submitting}
              />
              <textarea
                className={inputCls}
                placeholder="Description (optionnel)"
                value={newCatDescription}
                onChange={(e) => setNewCatDescription(e.target.value)}
                rows={2}
                disabled={submitting}
              />
              <button 
                className={btnOrange} 
                onClick={handleAddCategory}
                disabled={submitting || !newCatName.trim()}
              >
                {submitting ? <IconLoader /> : <IconPlus />}
                {submitting ? "Ajout..." : "Ajouter Catégorie"}
              </button>
            </div>

            {/* List */}
            {loadingCategories ? (
              <div className="flex justify-center py-10">
                <IconLoader className="text-orange-500" />
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Folder icon */}
                      <span className="text-orange-500 shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      </span>

                      {editingCatId === cat.id ? (
                        <div className="space-y-1 flex-1">
                          <input
                            autoFocus
                            className="text-sm border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-full"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateCategory(cat.id);
                              if (e.key === "Escape") setEditingCatId(null);
                            }}
                            placeholder="Nom"
                            disabled={submitting}
                          />
                          <input
                            className="text-xs border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-full"
                            value={editCatSlug}
                            onChange={(e) => setEditCatSlug(e.target.value)}
                            placeholder="Slug"
                            disabled={submitting}
                          />
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {cat.slug} ({cat._count?.articles || 0} articles)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 shrink-0 ml-2">
                      {editingCatId === cat.id ? (
                        <>
                          <button
                            className={`${iconBtn} text-green-600 hover:bg-green-100`}
                            title="Enregistrer"
                            onClick={() => handleUpdateCategory(cat.id)}
                            disabled={submitting}
                          >
                            {submitting ? <IconLoader /> : (
                              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            className={`${iconBtn} text-gray-500 hover:bg-gray-100`}
                            title="Annuler"
                            onClick={() => setEditingCatId(null)}
                            disabled={submitting}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`${iconBtn} text-gray-400 hover:text-orange-600 hover:bg-orange-100`}
                            title="Modifier"
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditCatName(cat.name);
                              setEditCatSlug(cat.slug);
                            }}
                            disabled={submitting}
                          >
                            <IconEdit />
                          </button>
                          <button
                            className={`${iconBtn} text-gray-400 hover:text-blue-600 hover:bg-blue-100`}
                            title="Voir sur le site"
                            onClick={() => window.open(`/categories/${cat.slug}`, '_blank')}
                          >
                            <IconEye />
                          </button>
                          <button
                            className={`${iconBtn} text-gray-400 hover:text-red-600 hover:bg-red-100`}
                            title="Supprimer"
                            onClick={() => handleDeleteCategory(cat.id)}
                            disabled={submitting}
                          >
                            <IconTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {categories.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-6">
                    Aucune catégorie. Ajoutez-en une ci-dessus.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Tags panel ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Tags et Mots-clés Secondaires
            </h2>

            {/* Error message */}
            {tagError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
                {tagError}
              </div>
            )}

            {/* Add form */}
            <div className="space-y-2 mb-4">
              <input
                className={inputCls}
                placeholder="Nom du nouveau tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                disabled={submitting}
              />
              <button 
                className={btnOrange} 
                onClick={handleAddTag}
                disabled={submitting || !newTagName.trim()}
              >
                {submitting ? <IconLoader /> : <IconPlus />}
                {submitting ? "Ajout..." : "Ajouter Tag"}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
              <input
                className={`${inputCls} pl-9`}
                placeholder="Rechercher un tag..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            </div>

            {/* Tag list */}
            {loadingTags ? (
              <div className="flex justify-center py-10">
                <IconLoader className="text-orange-500" />
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {editingTagId === tag.id ? (
                        <input
                          autoFocus
                          className="text-sm border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-40"
                          value={editTagName}
                          onChange={(e) => setEditTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateTag(tag.id);
                            if (e.key === "Escape") setEditingTagId(null);
                          }}
                          disabled={submitting}
                        />
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shrink-0 bg-blue-500">
                          {tag.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">({tag._count?.articles || 0} utilisations)</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 shrink-0 ml-2">
                      {editingTagId === tag.id ? (
                        <>
                          <button
                            className={`${iconBtn} text-green-600 hover:bg-green-100`}
                            onClick={() => handleUpdateTag(tag.id)}
                            disabled={submitting}
                          >
                            {submitting ? <IconLoader /> : (
                              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            className={`${iconBtn} text-gray-500 hover:bg-gray-100`}
                            onClick={() => setEditingTagId(null)}
                            disabled={submitting}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`${iconBtn} text-gray-400 hover:text-orange-600 hover:bg-orange-100`}
                            title="Modifier"
                            onClick={() => {
                              setEditingTagId(tag.id);
                              setEditTagName(tag.name);
                            }}
                            disabled={submitting}
                          >
                            <IconEdit />
                          </button>
                          <button
                            className={`${iconBtn} text-gray-400 hover:text-red-600 hover:bg-red-100`}
                            title="Supprimer"
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={submitting}
                          >
                            <IconTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {filteredTags.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">
                    {tagSearch ? "Aucun tag trouvé." : "Aucun tag. Ajoutez-en un ci-dessus."}
                  </p>
                )}
              </div>
            )}

            {/* Fusionner Tags button */}
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 active:bg-black text-white text-sm font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50"
              disabled={tags.length < 2}
              title={tags.length < 2 ? "Nécessite au moins 2 tags" : "Fusionner des tags"}
            >
              <IconMerge />
              Fusionner Tags
            </button>
          </div>
        </div>

        {/* ── Additional settings ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-5">
            Paramètres Additionnels
          </h2>

          <div className="flex flex-wrap gap-10 items-start">
            {/* Max tags select */}
            <div className="flex-1 min-w-50 max-w-xs">
              <label className="block text-sm text-gray-600 mb-1.5">
                Nombre maximum de Tags affichés en front-office
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-400 bg-white cursor-pointer"
                  value={maxTags}
                  onChange={(e) => setMaxTags(e.target.value)}
                >
                  {[3, 5, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}
                    </option>
                  ))}
                </select>
                {/* chevron */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Tags status */}
            <div>
              <p className="text-sm text-gray-600 mb-1.5">Statut des Tags</p>
              <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${tagsEnabled ? "border-blue-500" : "border-gray-300"}`}
                    onClick={() => setTagsEnabled(true)}
                  >
                    {tagsEnabled && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Activés</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${!tagsEnabled ? "border-blue-500" : "border-gray-300"}`}
                    onClick={() => setTagsEnabled(false)}
                  >
                    {!tagsEnabled && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Désactivés</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="mt-6">
            <button 
              className={btnOrange}
              onClick={handleSaveSettings}
              disabled={submitting}
            >
              {submitting ? <IconLoader /> : <IconLock />}
              {submitting ? "Enregistrement..." : "Enregistrer les Paramètres"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}