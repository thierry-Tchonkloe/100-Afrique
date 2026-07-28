// src/components/recruteur/Avatar.tsx
//
// AVANT : cette même fonction (initiales + couleur déterministe par
// première lettre du nom) existait à l'identique dans dashboard/page.tsx,
// CandidateCard.tsx et CandidateDetailPanel.tsx — 3 copies. Une modif
// (nouvelle couleur, nouvelle taille) devait être répliquée 3 fois.

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];

interface AvatarProps {
  name: string;
  src?: string;
  /** Taille en pixels (largeur = hauteur). Défaut : 36px (w-9 h-9). */
  size?: number;
}

export default function Avatar({ name, src, size = 36 }: AvatarProps) {
  const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  const color = COLORS[name.charCodeAt(0) % COLORS.length];

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${src ? '' : color}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold" style={{ fontSize: size * 0.35 }}>{initials}</span>
      )}
    </div>
  );
}