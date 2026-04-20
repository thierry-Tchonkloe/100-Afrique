// src/app/(back-office)/admin/page.tsx
"use client";

import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatsCards from "@/components/Dashboard/StatsCards";
import TasksFlow from "@/components/Dashboard/TasksFlow";
import TopContents from "@/components/Dashboard/TopContents";
import AdminMonetisation from "@/components/Dashboard/AdminMonetisation";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const dashboardData = useDashboardStats();

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mt-7">
              Tableau de Bord
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Vue d&apos;ensemble des performances et tâches en attente.
            </p>
          </div>
          <button
            onClick={dashboardData.reload}
            disabled={dashboardData.loading}
            className="mt-8 flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={dashboardData.loading ? "animate-spin" : ""}
            />
            Actualiser
          </button>
        </div>

        {/* Error Banner */}
        {dashboardData.error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {dashboardData.error}
            <button
              onClick={dashboardData.reload}
              className="ml-auto underline text-red-600 hover:text-red-800"
            >
              Réessayer
            </button>
          </div>
        )}

        <StatsCards
          stats={dashboardData.stats}
          loading={dashboardData.loading}
        />

        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Flux de Travail et Tâches en Attente
        </h2>
        <TasksFlow
          tasks={dashboardData.tasks}
          loading={dashboardData.loading}
        />

        <TopContents
          articles={dashboardData.topArticles}
          videos={dashboardData.topVideos}
          loading={dashboardData.loading}
        />

        <AdminMonetisation
          adStatuses={dashboardData.adStatuses}
          contactStats={dashboardData.contactStats}
          loading={dashboardData.loading}
        />
      </div>
    </ProtectedRoute>
  );
}
























// // src/app/(back-office)/admin/page.tsx

// import StatsCards from "@/components/Dashboard/StatsCards";
// import TasksFlow from "@/components/Dashboard/TasksFlow";
// import TopContents from "@/components/Dashboard/TopContents";
// import AdminMonetisation from "@/components/Dashboard/AdminMonetisation";

// import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";

// export default function DashboardPage() {
//     return (
//         <ProtectedRoute requiredRole="SUPER_ADMIN">
//         <div className="space-y-8">
//         {/* Header */}
//         <div>
//             <h1 className="text-2xl font-bold text-gray-900 mt-7">Tableau de Bord</h1>
//             <p className="text-sm text-gray-500 mt-1">
//             Bienvenue, Marie. Voici les statistiques clés et les tâches en attente.
//             </p>
//         </div>

//         <StatsCards />
//         <h2 className="text-base font-semibold text-gray-900 mb-5">
//             Flux de Travail et Tâches en Attente
//         </h2>
//         <TasksFlow />
//         <TopContents />
//         <AdminMonetisation />
//         </div>
//         </ProtectedRoute>
//     );
// }