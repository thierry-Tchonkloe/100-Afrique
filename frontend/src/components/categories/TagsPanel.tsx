// src/components/categories/TagsPanel.tsx
"use client";
import React from 'react';
import { IconEdit, IconTrash, IconPlus, IconLoader, IconSearch, IconMerge, inputCls, btnOrange, iconBtn } from './icons/CategoryIcons';
import type { Tag } from './useTagsManager';

interface TagsPanelProps {
  tags: Tag[];
  filteredTags: Tag[];
  loading: boolean;
  submitting: boolean;
  error: string;
  newName: string; setNewName: (v: string) => void;
  search: string; setSearch: (v: string) => void;
  editingId: number | null;
  editName: string; setEditName: (v: string) => void;
  onAdd: () => void;
  onStartEdit: (tag: Tag) => void;
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

const TagsPanel = ({
  tags, filteredTags, loading, submitting, error,
  newName, setNewName, search, setSearch,
  editingId, editName, setEditName,
  onAdd, onStartEdit, onUpdate, onDelete, onCancelEdit,
}: TagsPanelProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h2 className="text-base font-semibold text-gray-800 mb-4">Tags et Mots-clés Secondaires</h2>

    {error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">{error}</div>
    )}

    <div className="space-y-2 mb-4">
      <input
        className={inputCls}
        placeholder="Nom du nouveau tag"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        disabled={submitting}
      />
      <button className={btnOrange} onClick={onAdd} disabled={submitting || !newName.trim()}>
        {submitting ? <IconLoader /> : <IconPlus />}
        {submitting ? 'Ajout...' : 'Ajouter Tag'}
      </button>
    </div>

    <div className="relative mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
      <input
        className={`${inputCls} pl-9`}
        placeholder="Rechercher un tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {loading ? (
      <div className="flex justify-center py-10"><IconLoader className="text-orange-500" /></div>
    ) : (
      <div className="space-y-2 mb-4">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {editingId === tag.id ? (
                <input
                  autoFocus
                  className="text-sm border border-orange-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-orange-400 w-40"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onUpdate(tag.id); if (e.key === 'Escape') onCancelEdit(); }}
                  disabled={submitting}
                />
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shrink-0 bg-blue-500">
                  {tag.name}
                </span>
              )}
              <span className="text-xs text-gray-400">({tag._count?.articles || 0} utilisations)</span>
            </div>

            <div className="flex items-center gap-0.5 shrink-0 ml-2">
              {editingId === tag.id ? (
                <>
                  <button className={`${iconBtn} text-green-600 hover:bg-green-100`} onClick={() => onUpdate(tag.id)} disabled={submitting}>
                    {submitting ? <IconLoader /> : <CheckIcon />}
                  </button>
                  <button className={`${iconBtn} text-gray-500 hover:bg-gray-100`} onClick={onCancelEdit} disabled={submitting}>
                    <XIcon />
                  </button>
                </>
              ) : (
                <>
                  <button className={`${iconBtn} text-gray-400 hover:text-orange-600 hover:bg-orange-100`} title="Modifier" onClick={() => onStartEdit(tag)} disabled={submitting}>
                    <IconEdit />
                  </button>
                  <button className={`${iconBtn} text-gray-400 hover:text-red-600 hover:bg-red-100`} title="Supprimer" onClick={() => onDelete(tag.id)} disabled={submitting}>
                    <IconTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredTags.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            {search ? 'Aucun tag trouvé.' : 'Aucun tag. Ajoutez-en un ci-dessus.'}
          </p>
        )}
      </div>
    )}

    <button
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 active:bg-black text-white text-sm font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50"
      disabled={tags.length < 2}
      title={tags.length < 2 ? 'Nécessite au moins 2 tags' : 'Fusionner des tags'}
    >
      <IconMerge />
      Fusionner Tags
    </button>
  </div>
);

export default TagsPanel;