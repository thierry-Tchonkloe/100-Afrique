// src/components/shared/backoffice/useAuthorsAndDestinations.ts
"use client";
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { extractArray } from '@/lib/backoffice/extractArray';
import { fetchDestinationsForSelect, DestinationOption } from '@/services/Dashboard/destinationservice';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function authHeaders(): HeadersInit {
  const token = getToken();
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export interface Author {
  id: number;
  name: string;
  role?: string;
  avatar?: string;
}

/** Fetch paresseux des auteurs — se déclenche une seule fois quand `enabled` passe à true. */
export function useAuthors(enabled: boolean) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || authors.length) return;
    setLoading(true);
    fetch(`${API}/admin/users`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => setAuthors(extractArray<Author>(json, ['', 'data', 'data.users'])))
      .catch(() => setAuthors([]))
      .finally(() => setLoading(false));
  }, [enabled, authors.length]);

  return { authors, loadingAuthors: loading };
}

/** Fetch paresseux des catégories — utilisé par Newarticlemodal. */
export interface CategoryOption {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export function useCategoriesFetch(enabled: boolean) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || categories.length) return;
    setLoading(true);
    fetch(`${API}/admin/categories`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => setCategories(extractArray<CategoryOption>(json, ['', 'data', 'data.categories'])))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [enabled, categories.length]);

  return { categories, loadingCategories: loading };
}

/** Fetch paresseux des destinations existantes (association optionnelle). */
export function useDestinationsFetch(enabled: boolean) {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || destinations.length) return;
    setLoading(true);
    fetchDestinationsForSelect()
      .then(setDestinations)
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, [enabled, destinations.length]);

  return { destinations, loadingDestinations: loading };
}