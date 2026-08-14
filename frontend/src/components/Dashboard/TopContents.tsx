// src/components/Dashboard/TopContents.tsx
"use client";

import { Crosshair } from "lucide-react";
import type { TopContent } from "@/hooks/useDashboardStats";

interface Props {
  articles: TopContent[];
  videos: TopContent[];
  loading: boolean;
}

function SkeletonRow() {
  return (
    <li className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-1.5">
        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
      </div>
      <div className="h-4 bg-gray-100 animate-pulse rounded w-16 shrink-0" />
    </li>
  );
}

function ContentList({
  items,
  loading,
}: {
  items: TopContent[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <ul className="space-y-3">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        Aucun contenu trouvé.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800 line-clamp-1">
              {item.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{item.publishedAgo}</p>
          </div>
          <span className="text-sm font-semibold text-[#F59E0B] whitespace-nowrap">
            {item.views.toLocaleString("fr-FR")} vues
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TopContents({ articles, videos, loading }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Contenus les Plus Consultés
        </h2>
        <Crosshair size={18} className="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Top Articles (7 derniers jours)
          </h3>
          <ContentList items={articles} loading={loading} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Top Vidéos (7 derniers jours)
          </h3>
          <ContentList items={videos} loading={loading} />
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="text-sm text-[#F59E0B] hover:text-orange-600 font-medium transition-colors">
          Accéder à l&apos;Analyse Détaillée →
        </button>
      </div>
    </div>
  );
}
