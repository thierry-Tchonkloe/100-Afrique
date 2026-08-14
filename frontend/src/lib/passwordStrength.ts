// src/lib/passwordStrength.ts
// Extrait de src/app/(emploi)/auth/page.tsx — logique pure, réutilisable
// partout où une force de mot de passe doit être évaluée.

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export function getPasswordStrength(pwd: string): PasswordStrength {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { score: 1, label: 'Faible', color: 'bg-red-500' },
    { score: 2, label: 'Moyen', color: 'bg-orange-400' },
    { score: 3, label: 'Bon', color: 'bg-yellow-400' },
    { score: 4, label: 'Excellent', color: 'bg-green-500' },
  ];
  return map[score - 1] ?? { score: 0, label: '', color: '' };
}
