'use client';
// src/components/emploi/entreprise-detail/Lightbox.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({
  photos, initial, onClose,
}: {
  photos: { id: string; url: string; alt?: string }[]; initial: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(initial);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose, photos.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">✕</button>
      <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + photos.length) % photos.length); }}
              className="absolute left-4 p-3 text-white/70 hover:text-white">
        <ChevronLeft size={32} />
      </button>
      <img src={photos[idx].url} alt={photos[idx].alt ?? ''}
           className="max-w-[88vw] max-h-[82vh] object-contain rounded-2xl shadow-2xl"
           onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % photos.length); }}
              className="absolute right-4 p-3 text-white/70 hover:text-white">
        <ChevronRight size={32} />
      </button>
      <p className="absolute bottom-5 text-white/50 text-sm">{idx + 1} / {photos.length}</p>
    </div>
  );
}
