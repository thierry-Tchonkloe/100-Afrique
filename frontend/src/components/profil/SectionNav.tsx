// src/components/profil/SectionNav.tsx
'use client';

import clsx from 'clsx';

export const SECTIONS = [
  { id: 'identite', label: 'Identité & Bio', done: true },
  { id: 'experiences', label: 'Expériences', done: true },
  { id: 'formations', label: 'Formations', done: true },
  { id: 'competences', label: 'Compétences', done: true },
  { id: 'documents', label: 'Documents', done: false },
  { id: 'visibilite', label: 'Visibilité', done: false },
];

interface SectionNavProps {
  active: string;
}

export default function SectionNav({ active }: SectionNavProps) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
        Sections
      </p>
      <ul className="space-y-0.5">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => scrollTo(s.id)}
              className={clsx(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                active === s.id
                  ? 'bg-[#FFF3EC] text-[#E8622A] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <span
                className={clsx(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  active === s.id
                    ? 'bg-[#E8622A]'
                    : s.done
                    ? 'bg-gray-300'
                    : 'bg-gray-200'
                )}
              />
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}