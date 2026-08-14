// src/hooks/useConseilsSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchArticles } from '@/services/conseils.service';
import type { Article } from '@/data/mockArticles';

export function useConseilsSearch() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Debounce : 400ms après la frappe avant de relancer la recherche
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(() => {
    setLoading(true);
    fetchArticles(activeCategory || undefined, search || undefined)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  useEffect(() => { load(); }, [load]);

  function clearAll() {
    setSearchInput('');
    setSearch('');
    setActiveCategory('');
  }

  return {
    articles, loading, search, searchInput, setSearchInput, activeCategory, setActiveCategory, clearAll,
  };
}
