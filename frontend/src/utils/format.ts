// src/utils/format.ts
export function formatBig(n: number): string {
  if (n === 0) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
}
