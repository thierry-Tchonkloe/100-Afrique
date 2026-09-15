// src/components/categories/useCategoriesManager.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/hooks/useApiCrud';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type?: string;
  order?: number;
  color?: string;
  _count?: { articles: number };
}

export function useCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement des catégories'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const slug = newSlug.trim() || newName.toLowerCase()
      .replace(/\s+/g, '-').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '');
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/admin/categories', {
        name: newName.trim(), slug, description: newDescription.trim() || undefined,
        type: 'MAGAZINE', order: categories.length,
      });
      setCategories((prev) => [...prev, res.data.data]);
      setNewName(''); setNewSlug(''); setNewDescription('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la création'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id); setEditName(cat.name); setEditSlug(cat.slug);
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await api.put(`/admin/categories/${id}`, { name: editName.trim(), slug: editSlug.trim() });
      setCategories((prev) => prev.map((c) => (c.id === id ? res.data.data : c)));
      setEditingId(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la modification'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    try {
      setSubmitting(true);
      setError('');
      await api.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    categories, loading, submitting, error,
    newName, setNewName, newSlug, setNewSlug, newDescription, setNewDescription,
    editingId, editName, setEditName, editSlug, setEditSlug,
    handleAdd, startEdit, handleUpdate, handleDelete, cancelEdit: () => setEditingId(null),
  };
}