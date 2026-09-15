// src/components/categories/useTaxonomySettings.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export function useTaxonomySettings() {
  const [maxTags, setMaxTags] = useState('5');
  const [tagsEnabled, setTagsEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/admin/settings/taxonomy')
      .then((res) => {
        const settings = res.data.data;
        setMaxTags(String(settings?.maxTags || 5));
        setTagsEnabled(settings?.tagsEnabled !== false);
      })
      .catch((err) => console.error('Erreur récupération paramètres:', err));
  }, []);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await api.put('/admin/settings/taxonomy', { maxTags: parseInt(maxTags), tagsEnabled });
      alert('Paramètres enregistrés avec succès !');
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  return { maxTags, setMaxTags, tagsEnabled, setTagsEnabled, submitting, handleSave };
}