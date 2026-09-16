// src/components/chatbot/useChatbotSettings.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ChatbotSettings, DEFAULT_SETTINGS, getApiErrorMessage } from './types';

export function useChatbotSettings() {
  const [settings, setSettings] = useState<ChatbotSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/chatbot/settings');
      if (response.data.data) setSettings(response.data.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const updateSettings = (patch: Partial<ChatbotSettings>) => setSettings((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await api.put('/admin/chatbot/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSaving(false);
    }
  };

  return { settings, updateSettings, loading, saving, saved, error, setError, handleSave };
}