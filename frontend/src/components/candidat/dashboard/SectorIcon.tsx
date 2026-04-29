// src/components/emploi/SectorIcon.tsx
import { Hotel, Utensils, Car, Music, Globe, Bed, Wine } from 'lucide-react';

const SECTOR_MAP: Record<string, { icon: typeof Hotel; bg: string; color: string }> = {
  hotel:      { icon: Hotel,    bg: 'bg-blue-50',   color: 'text-blue-500' },
  restaurant: { icon: Utensils, bg: 'bg-orange-50', color: 'text-orange-500' },
  transport:  { icon: Car,      bg: 'bg-green-50',  color: 'text-green-500' },
  events:     { icon: Music,    bg: 'bg-purple-50', color: 'text-purple-500' },
  lodging:    { icon: Bed,      bg: 'bg-indigo-50', color: 'text-indigo-500' },
  bar:        { icon: Wine,     bg: 'bg-pink-50',   color: 'text-pink-500' },
  tourism:    { icon: Globe,    bg: 'bg-teal-50',   color: 'text-teal-500' },
};

interface SectorIconProps {
  sector: string;
  size?: number;
}

export default function SectorIcon({ sector, size = 16 }: SectorIconProps) {
  const entry = SECTOR_MAP[sector] ?? { icon: Globe, bg: 'bg-gray-100', color: 'text-gray-500' };
  const Icon = entry.icon;
  return (
    <div className={`w-10 h-10 rounded-xl ${entry.bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={size} className={entry.color} />
    </div>
  );
}