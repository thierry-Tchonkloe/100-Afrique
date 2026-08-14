// src/services/conseils.service.ts
import { MOCK_ARTICLES, type Article } from '@/data/mockArticles';

// TODO: remplacer par appel API réel quand le backend /conseils sera branché
//   GET /api/emploi/conseils?category=&search=&page=1&limit=9
export async function fetchArticles(category?: string, search?: string): Promise<Article[]> {
  // Simulation réseau
  await new Promise((r) => setTimeout(r, 350));
  let list = MOCK_ARTICLES;
  if (category) list = list.filter((a) =>
    a.category === category || a.category.toLowerCase().includes(category.toLowerCase())
  );
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((a) =>
      a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    );
  }
  return list;
}
