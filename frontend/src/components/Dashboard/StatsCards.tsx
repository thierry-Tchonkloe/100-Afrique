// src/components/Dashboard/StatsCards.tsx
"use client";

import { Users, Play, Mail, FileText } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { DashboardStats } from "@/hooks/useDashboardStats";

const sparkData = [
  { v: 20 }, { v: 22 }, { v: 18 }, { v: 25 },
  { v: 23 }, { v: 28 }, { v: 30 },
];

function SkeletonBlock({ w = "w-24", h = "h-8" }: { w?: string; h?: string }) {
  return (
    <div className={`${h} ${w} bg-gray-100 animate-pulse rounded`} />
  );
}

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: Props) {
  const items = [
    {
      label: "Visiteurs Uniques (Mois)",
      value: stats?.visitors.total
        ? stats.visitors.total.toLocaleString("fr-FR")
        : "–",
      trend:
        stats?.visitors.trend != null && stats.visitors.trend !== 0
          ? `${stats.visitors.trend > 0 ? "+" : ""}${stats.visitors.trend}% vs mois précédent`
          : null,
      icon: Users,
      showChart: true,
    },
    {
      label: "Vues | Tourisme TV",
      value: stats?.videoViews.total
        ? stats.videoViews.total.toLocaleString("fr-FR")
        : "–",
      trend:
        stats?.videoViews.trend != null && stats.videoViews.trend !== 0
          ? `${stats.videoViews.trend > 0 ? "+" : ""}${stats.videoViews.trend}% ce mois`
          : null,
      icon: Play,
      showChart: false,
    },
    {
      label: "Nouveaux Abonnés Newsletter",
      value: stats?.newsletterSubscribers.newThisMonth != null
        ? stats.newsletterSubscribers.newThisMonth.toLocaleString("fr-FR")
        : "–",
      trend:
        stats?.newsletterSubscribers.trend != null &&
        stats.newsletterSubscribers.trend !== 0
          ? `+${stats.newsletterSubscribers.trend}% ce mois`
          : `Total : ${stats?.newsletterSubscribers.total.toLocaleString("fr-FR") ?? "–"}`,
      icon: Mail,
      showChart: false,
    },
    {
      label: "Publications ce Mois",
      value: stats?.publications.total != null
        ? stats.publications.total.toLocaleString("fr-FR")
        : "–",
      sub: "Articles & vidéos",
      icon: FileText,
      showChart: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{s.label}</span>
            <s.icon size={18} className="text-orange-400" />
          </div>

          {loading ? (
            <SkeletonBlock h="h-9" w="w-28" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
          )}

          {loading ? (
            <SkeletonBlock h="h-3.5" w="w-36" />
          ) : s.trend ? (
            <p className="text-xs font-medium text-[#F59E0B]">{s.trend}</p>
          ) : s.sub ? (
            <p className="text-xs text-gray-400">{s.sub}</p>
          ) : null}

          {s.showChart && (
            <div className="mt-2 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
