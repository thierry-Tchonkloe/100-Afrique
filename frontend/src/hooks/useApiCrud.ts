// src/hooks/useApiCrud.ts
"use client";
import { useCallback, useState } from 'react';
import api from '@/lib/api';

interface ApiError {
  response?: { data?: { message?: string; error?: string } };
  message?: string;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiError;
  return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
}

/** Fetch + état loading/error générique pour une liste. */
export function useFetchList<T>(path: string, extract: (res: any) => T[] = (r) => r.data.data ?? []) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(path);
      setItems(extract(res));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erreur lors du chargement'));
    } finally {
      setLoading(false);
    }
  }, [path]);

  return { items, setItems, loading, error, setError, reload };
}