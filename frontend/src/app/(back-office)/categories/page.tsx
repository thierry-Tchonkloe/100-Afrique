// src/app/(back-office)/categories/page.tsx
"use client";

import { ProtectedRoute } from '@/components/Dashboard/ProtectedRoute';
import { useCategoriesManager } from '@/components/categories/useCategoriesManager';
import { useTagsManager } from '@/components/categories/useTagsManager';
import { useTaxonomySettings } from '@/components/categories/useTaxonomySettings';
import CategoriesPanel from '@/components/categories/CategoriesPanel';
import TagsPanel from '@/components/categories/TagsPanel';
import TaxonomySettingsPanel from '@/components/categories/TaxonomySettingsPanel';

export default function CategoryTagsManager() {
  const cats = useCategoriesManager();
  const tags = useTagsManager();
  const settings = useTaxonomySettings();

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories et des Tags</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organisez la taxonomie de votre site pour une meilleure navigation et un SEO optimisé
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <CategoriesPanel
            categories={cats.categories}
            loading={cats.loading}
            submitting={cats.submitting}
            error={cats.error}
            newName={cats.newName} setNewName={cats.setNewName}
            newSlug={cats.newSlug} setNewSlug={cats.setNewSlug}
            newDescription={cats.newDescription} setNewDescription={cats.setNewDescription}
            editingId={cats.editingId}
            editName={cats.editName} setEditName={cats.setEditName}
            editSlug={cats.editSlug} setEditSlug={cats.setEditSlug}
            onAdd={cats.handleAdd}
            onStartEdit={cats.startEdit}
            onUpdate={cats.handleUpdate}
            onDelete={cats.handleDelete}
            onCancelEdit={cats.cancelEdit}
          />

          <TagsPanel
            tags={tags.tags}
            filteredTags={tags.filteredTags}
            loading={tags.loading}
            submitting={tags.submitting}
            error={tags.error}
            newName={tags.newName} setNewName={tags.setNewName}
            search={tags.search} setSearch={tags.setSearch}
            editingId={tags.editingId}
            editName={tags.editName} setEditName={tags.setEditName}
            onAdd={tags.handleAdd}
            onStartEdit={tags.startEdit}
            onUpdate={tags.handleUpdate}
            onDelete={tags.handleDelete}
            onCancelEdit={tags.cancelEdit}
          />
        </div>

        <TaxonomySettingsPanel
          maxTags={settings.maxTags} setMaxTags={settings.setMaxTags}
          tagsEnabled={settings.tagsEnabled} setTagsEnabled={settings.setTagsEnabled}
          submitting={settings.submitting}
          onSave={settings.handleSave}
        />
      </div>
    </ProtectedRoute>
  );
}