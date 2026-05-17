// src/app/(emploi)/candidat/layout.tsx
'use client';

import { useState, useCallback } from 'react';
import CandidatSidebar from '@/components/candidat/CandidatSidebar';
import CandidatHeader  from '@/components/candidat/CandidatHeader';
import { useCandidatDashboard } from '@/hooks/useCandidatDashboard';
import type { CandidatNotification } from '@/types/emploi.types';

export default function CandidatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Source de vérité : profil + notifications depuis le hook dashboard
  const { data, setData } = useCandidatDashboard();

  // Mise à jour locale des notifications (marquer lu) sans re-fetch réseau
  const handleNotificationsChange = useCallback(
    (updated: CandidatNotification[]) => {
      setData((prev) => (prev ? { ...prev, notifications: updated } : prev));
    },
    [setData],
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <CandidatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header dynamique — profil et notifications réels */}
        <CandidatHeader
          profile={data?.profile}
          notifications={data?.notifications ?? []}
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationsChange={handleNotificationsChange}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}














// // src/app/(emploi)/candidat/layout.tsx
// 'use client';

// import { useState } from 'react';
// import CandidatSidebar from '@/components/candidat/CandidatSidebar';
// import CandidatHeader from '@/components/candidat/CandidatHeader';

// export default function CandidatLayout({ children }: { children: React.ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Sidebar */}
//       <CandidatSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main column */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <CandidatHeader onMenuClick={() => setSidebarOpen(true)} />

//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }