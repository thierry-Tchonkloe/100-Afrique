// src/lib/backoffice/extractArray.ts
/**
 * Extrait un tableau depuis une réponse API dont la forme peut varier
 * ({data: [...]}, {data: {users: [...]}}, ou tableau brut).
 */
export function extractArray<T>(json: unknown, keys: string[]): T[] {
  for (const key of keys) {
    const val = key === ''
      ? json
      : key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], json);
    if (Array.isArray(val)) return val as T[];
  }
  return [];
}

export function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}