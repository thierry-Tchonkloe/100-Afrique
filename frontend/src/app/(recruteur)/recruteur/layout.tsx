// src/app/(recruteur)/recruteur/layout.tsx
'use client';
//
// ── FIX: Ce layout Next.js NE doit PAS recevoir de props métier (profile, etc.)
// car il est instancié UNE SEULE FOIS par Next.js pour toutes les pages enfants.
// Les pages enfants gèrent leurs propres données et les passent via Context.
// Avant le fix, dashboard/page.tsx wrappait lui-même dans <RecruteurLayout>
// ce qui créait un double sidebar + double header.

import { useState } from 'react';
import RecruteurSidebar from '@/components/recruteur/RecruteurSidebar';
import RecruteurHeader from '@/components/recruteur/RecruteurHeader';
import { RecruteurContextProvider, useRecruteurContext } from '@/context/RecruteurContext';

// ── Inner layout (reads from context) ────────────────────────────────────────
function RecruteurShell({ children }: { children: React.ReactNode }) {
  const { profile, newCandidaturesCount, switchEtab } = useRecruteurContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      <RecruteurSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        newCandidaturesCount={newCandidaturesCount}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RecruteurHeader
          profile={profile ?? undefined}
          onMenuClick={() => setSidebarOpen(true)}
          onEtablissementChange={switchEtab}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Root layout export ────────────────────────────────────────────────────────
export default function RecruteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecruteurContextProvider>
      <RecruteurShell>{children}</RecruteurShell>
    </RecruteurContextProvider>
  );
}


























// // src/app/(recruteur)/recruteur/layout.tsx
// 'use client';

// import { useState } from 'react';
// import RecruteurSidebar from '@/components/recruteur/RecruteurSidebar';
// import RecruteurHeader from '@/components/recruteur/RecruteurHeader';
// import type { RecruteurProfile } from '@/types/recruteur.types';

// interface RecruteurLayoutProps {
//   children: React.ReactNode;
//   profile?: RecruteurProfile;
//   newCandidaturesCount?: number;
//   onEtablissementChange?: (id: string) => void;
// }

// export default function RecruteurLayout({
//   children,
//   profile,
//   newCandidaturesCount = 0,
//   onEtablissementChange,
// }: RecruteurLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
//       <RecruteurSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         newCandidaturesCount={newCandidaturesCount}
//       />
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <RecruteurHeader
//           profile={profile}
//           onMenuClick={() => setSidebarOpen(true)}
//           onEtablissementChange={onEtablissementChange}
//         />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }