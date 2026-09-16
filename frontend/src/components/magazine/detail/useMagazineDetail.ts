// src/components/magazine/detail/useMagazineDetail.ts
"use client";
import { useEffect, useMemo, useState } from 'react';
import { fetchMagazineBySlug, type Magazine } from '@/services/Dashboard/magazineService';
import { getDescription } from './magazineUtils';

export function useMagazineDetail(slug: string | undefined) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [heroActive, setHeroActive] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetchMagazineBySlug(slug)
      .then((res) => { if (!cancelled) setMagazine(res.data); })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setTimeout(() => setHeroActive(true), 80);
      });

    return () => { cancelled = true; };
  }, [slug]);

  const description = useMemo(() => (magazine ? getDescription(magazine) : ''), [magazine]);
  const shortDesc = description.length > 520 ? `${description.slice(0, 520).trim()}…` : description;
  const isLong = description.length > 520;

  return { magazine, loading, notFound, heroActive, description, shortDesc, isLong };
}