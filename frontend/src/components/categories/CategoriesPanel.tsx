// src/components/categories/CategoriesPanel.tsx
"use client";
import React from 'react';
import { IconEdit, IconEye, IconTrash, IconPlus, IconLoader, inputCls, btnOrange, iconBtn } from './icons/CategoryIcons';
import type { Category } from './useCategoriesManager';

interface CategoriesPanelProps {
  categories: Category[];
  loading: boolean;
  submitting: boolean;
  error: string;
  newName: string; setNewName: (v: string) => void;
  newSlug: string; setNewSlug: (v: string) => void;
  newDescription: string; setNewDescription: (v: string) => void;
  editingId: number | null;
  editName: string; setEditName: (v: string) => void;
  editSlug: string; setEditSlug: (v: string) => void;
  onAdd: () => void;
  onStartEdit: (cat: Category) => void;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
}

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const CategoriesPanel = ({
  categories, loading, submitting, error,
  newName, setNewName, newSlug, setNewSlug, newDescription, setNewDescription,
  editingId, editName, setEditName, editSlug, setEditSlug,
  onAdd, onStartEdit, onUpdate, onDelete, onCancelEdit,
}: CategoriesPanelProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h2 className="text-base font-semibold text-gray-800 mb-4">Catégories (Taxonomie Principale)</h2>

    {error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">{error}</div>
    )}

    <div className="space-y-2 mb-5">
      <input
        className={inputCls}
        placeholder="Nom de la nouvelle catégorie *"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        disabled={submitting}
      />
      <input
        className={inputCls}
        placeholder="Slug (ex: tourisme-afrique)"
        value={newSlug}
        onChange={(e) => setNewSlug(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        disabled={submitting}
      />
      <textarea
        className={inputCls}
        placeholder="Description (optionnel)"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        rows={2}
        disabled={submitting}
      />
      <button className={btnOrange} onClick={onAdd} disabled={submitting || !newName.trim()}>
        {submitting ? <IconLoader /> : <IconPlus />}
        {submitting ? 'Ajout...' : 'Ajouter Catégorie'}
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center py-10"><IconLoader className="text-orange-500" /></div>
    ) : (
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-colors group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-orange-500 shrink-0"><FolderIcon /></span>
              {editingId === cat.id ? (
                <div className="space-y-1 flex-1">
                  <input
                    autoFocus
                    className="text-sm border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onUpdate(cat.id); if (e.key === 'Escape') onCancelEdit(); }}
                    placeholder="Nom"
                    disabled={submitting}
                  />
                  <input
                    className="text-xs border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-full"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
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

            <div className="flex items-center gap-0.5 shrink-0 ml-2">
              {editingId === cat.id ? (
                <>
                  <button className={`${iconBtn} text-green-600 hover:bg-green-100`} title="Enregistrer" onClick={() => onUpdate(cat.id)} disabled={submitting}>
                    {submitting ? <IconLoader /> : <CheckIcon />}
                  </button>
                  <button className={`${iconBtn} text-gray-500 hover:bg-gray-100`} title="Annuler" onClick={onCancelEdit} disabled={submitting}>
                    <XIcon />
                  </button>
                </>
              ) : (
                <>
                  <button className={`${iconBtn} text-gray-400 hover:text-orange-600 hover:bg-orange-100`} title="Modifier" onClick={() => onStartEdit(cat)} disabled={submitting}>
                    <IconEdit />
                  </button>
                  <button className={`${iconBtn} text-gray-400 hover:text-blue-600 hover:bg-blue-100`} title="Voir sur le site" onClick={() => window.open(`/categories/${cat.slug}`, '_blank')}>
                    <IconEye />
                  </button>
                  <button className={`${iconBtn} text-gray-400 hover:text-red-600 hover:bg-red-100`} title="Supprimer" onClick={() => onDelete(cat.id)} disabled={submitting}>
                    <IconTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">Aucune catégorie. Ajoutez-en une ci-dessus.</p>
        )}
      </div>
    )}
  </div>
);

export default CategoriesPanel;