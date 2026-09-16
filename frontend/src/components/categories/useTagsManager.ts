// src/components/categories/useTagsManager.ts
"use client";
import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/hooks/useApiCrud';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  _count?: { articles: number };
}

export function useTagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/tags');
      setTags(res.data.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement des tags'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const name = newName.startsWith('#') ? newName.trim() : `#${newName.trim()}`;
    const slug = name.replace('#', '').toLowerCase()
      .replace(/\s+/g, '-').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '');
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/admin/tags', { name, slug });
      setTags((prev) => [...prev, res.data.data]);
      setNewName('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la création'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (tag: Tag) => { setEditingId(tag.id); setEditName(tag.name); };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await api.put(`/admin/tags/${id}`, { name: editName.trim() });
      setTags((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
      setEditingId(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la modification'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) return;
    try {
      setSubmitting(true);
      setError('');
      await api.delete(`/admin/tags/${id}`);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTags = useMemo(
    () => tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())),
    [tags, search]
  );

  return {
    tags, filteredTags, loading, submitting, error,
    newName, setNewName, search, setSearch,
    editingId, editName, setEditName,
    handleAdd, startEdit, handleUpdate, handleDelete, cancelEdit: () => setEditingId(null),
  };
}