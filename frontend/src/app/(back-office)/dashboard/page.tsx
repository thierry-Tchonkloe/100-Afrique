// src/app/(back-office)/admin/page.tsx

import StatsCards from "@/components/Dashboard/StatsCards";
import TasksFlow from "@/components/Dashboard/TasksFlow";
import TopContents from "@/components/Dashboard/TopContents";
import AdminMonetisation from "@/components/Dashboard/AdminMonetisation";

import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mt-7">Tableau de Bord</h1>
            <p className="text-sm text-gray-500 mt-1">
            Bienvenue, Marie. Voici les statistiques clés et les tâches en attente.
            </p>
        </div>

        <StatsCards />
        <h2 className="text-base font-semibold text-gray-900 mb-5">
            Flux de Travail et Tâches en Attente
        </h2>
        <TasksFlow />
        <TopContents />
        <AdminMonetisation />
        </div>
        </ProtectedRoute>
    );
}