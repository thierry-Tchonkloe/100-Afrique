// src/components/Dashboard/TasksFlow.tsx
"use client";

import { useState } from "react";
import { X, ArrowRight, AlertCircle, CheckCircle2, Clock, Megaphone, Mail } from "lucide-react";
import type { TasksData, TaskItem } from "@/hooks/useDashboardStats";

interface Props {
  tasks: TasksData | null;
  loading: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  content:    <CheckCircle2 size={14} />,
  event:      <Clock size={14} />,
  ads:        <Megaphone size={14} />,
  newsletter: <Mail size={14} />,
};

const CATEGORY_LABELS: Record<string, string> = {
  content:    "Contenus",
  event:      "Événements",
  ads:        "Publicités",
  newsletter: "Newsletter",
};

const PRIORITY_DOT: Record<string, string> = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-emerald-400",
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function AllTasksModal({
  allTasks,
  onClose,
}: {
  allTasks: TaskItem[];
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(allTasks.map((t) => t.category)))];

  const filtered =
    activeCategory === "all"
      ? allTasks
      : allTasks.filter((t) => t.category === activeCategory);

  // Trier : high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...filtered].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const highCount = allTasks.filter((t) => t.priority === "high" && Number(t.count) > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Toutes les Tâches en Attente
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {allTasks.length} tâches au total
              {highCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-semibold">
                  <AlertCircle size={11} />
                  {highCount} priorité haute
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-50 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-amber-500 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat !== "all" && CATEGORY_ICONS[cat]}
              {cat === "all" ? "Toutes" : CATEGORY_LABELS[cat]}
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat === "all"
                  ? allTasks.length
                  : allTasks.filter((t) => t.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Aucune tâche dans cette catégorie.
            </div>
          ) : (
            sorted.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${task.bgColor} transition-all`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Priority dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`}
                  />
                  {/* Category icon */}
                  <span className={`shrink-0 ${task.color}`}>
                    {CATEGORY_ICONS[task.category]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {task.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">
                      {CATEGORY_LABELS[task.category]} ·{" "}
                      {task.priority === "high"
                        ? "Priorité haute"
                        : task.priority === "medium"
                        ? "Priorité moyenne"
                        : "Priorité basse"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`text-xl font-bold ${task.color}`}>
                    {task.count}
                  </span>
                  {task.actionHref && (
                    <a
                      href={task.actionHref}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-amber-600 transition-colors whitespace-nowrap"
                    >
                      {task.actionLabel}
                      <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Haute
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Moyenne
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Basse
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return <div className="h-9 w-16 bg-gray-100 animate-pulse rounded mx-auto" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TasksFlow({ tasks, loading }: Props) {
  const [showModal, setShowModal] = useState(false);

  // 4 éléments en vedette dans la grille
  const gridItems = [
    {
      value: loading ? null : tasks?.drafts ?? 0,
      label: "Articles en Brouillon",
      color: "text-[#F59E0B]",
    },
    {
      value: loading ? null : tasks?.pendingReview ?? 0,
      label: "Soumissions à Réviser",
      color: "text-[#F59E0B]",
    },
    {
      value: loading
        ? null
        : tasks?.nextEvent
        ? `J-${tasks.nextEvent.daysLeft}`
        : (tasks?.allTasks.find((t) => t.id === "salon-drafts")?.count ?? "–"),
      label: tasks?.nextEvent?.name ?? "Salons en Brouillon",
      color: "text-blue-500",
    },
    {
      value: loading ? null : tasks?.expiredAds ?? 0,
      label: "Espaces Pub Expirés",
      color: "text-[#F59E0B]",
    },
  ];

  // Résumé complémentaire (ligne sous la grille)
  const extraItems: { label: string; count: number | string; color: string }[] = loading
    ? []
    : [
        { label: "Vidéos en brouillon", count: tasks?.allTasks.find((t) => t.id === "video-drafts")?.count ?? 0, color: "text-amber-600" },
        { label: "Pages non publiées", count: tasks?.allTasks.find((t) => t.id === "page-drafts")?.count ?? 0, color: "text-slate-600" },
        { label: "Destinations brouillon", count: tasks?.allTasks.find((t) => t.id === "destination-drafts")?.count ?? 0, color: "text-emerald-600" },
        { label: "Vidéos en révision", count: tasks?.allTasks.find((t) => t.id === "video-review")?.count ?? 0, color: "text-orange-600" },
      ];

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Grille principale */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {gridItems.map((t, i) => (
            <div key={i} className="text-center">
              {t.value === null ? (
                <Skeleton />
              ) : (
                <p className={`text-3xl font-bold ${t.color}`}>{t.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{t.label}</p>
            </div>
          ))}
        </div>

        {/* Ligne complémentaire */}
        {!loading && extraItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-5 py-3 border-y border-dashed border-gray-100">
            {extraItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className={`font-bold ${item.color}`}>{item.count}</span>
                <span className="text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-5 py-3 border-y border-dashed border-gray-100">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => !loading && setShowModal(true)}
            disabled={loading}
            className="bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40"
          >
            Voir toutes les Tâches
          </button>
        </div>
      </div>

      {showModal && tasks?.allTasks && (
        <AllTasksModal
          allTasks={tasks.allTasks}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}











// // src/components/Dashboard/TasksFlow.tsx
// "use client";

// import type { TasksData } from "@/hooks/useDashboardStats";

// interface Props {
//   tasks: TasksData | null;
//   loading: boolean;
// }

// function Skeleton() {
//   return (
//     <div className="h-9 w-16 bg-gray-100 animate-pulse rounded mx-auto" />
//   );
// }

// export default function TasksFlow({ tasks, loading }: Props) {
//   const items = [
//     {
//       value: loading ? null : tasks?.drafts ?? 0,
//       label: "Articles en Brouillon",
//       color: "text-[#F59E0B]",
//     },
//     {
//       value: loading ? null : tasks?.pendingReview ?? 0,
//       label: "Soumissions à Réviser",
//       color: "text-[#F59E0B]",
//     },
//     {
//       value: loading
//         ? null
//         : tasks?.nextEvent
//         ? `J-${tasks.nextEvent.daysLeft}`
//         : "–",
//       label: tasks?.nextEvent?.name ?? "Prochain Événement",
//       color: "text-blue-500",
//     },
//     {
//       value: loading ? null : tasks?.expiredAds ?? 0,
//       label: "Espaces Pub Expirés",
//       color: "text-[#F59E0B]",
//     },
//   ];

//   return (
//     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//         {items.map((t, i) => (
//           <div key={i} className="text-center">
//             {t.value === null ? (
//               <Skeleton />
//             ) : (
//               <p className={`text-3xl font-bold ${t.color}`}>{t.value}</p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">{t.label}</p>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center">
//         <button className="bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
//           Voir toutes les Tâches
//         </button>
//       </div>
//     </div>
//   );
// }
















// // src/components/Dashboard/TasksFlow.tsx
// import { AlertTriangle } from "lucide-react";

// const tasks = [
//     { value: "12",   label: "Articles en Brouillon",  color: "text-[#F59E0B]" },
//     { value: "5",    label: "Soumissions à Réviser",   color: "text-[#F59E0B]" },
//     { value: "J-45", label: "ITB Berlin 2024",          color: "text-blue-500"   },
//     { value: "2",    label: "Espaces Pub Expirés",      color: "text-[#F59E0B]" },
// ];

// export default function TasksFlow() {
//     return (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//                 {tasks.map((t, i) => (
//                 <div key={i} className="text-center">
//                     <p className={`text-3xl font-bold ${t.color}`}>{t.value}</p>
//                     <p className="text-xs text-gray-500 mt-1">{t.label}</p>
//                 </div>
//                 ))}
//             </div>
//             <div className="flex justify-center">
//                 <button className="bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
//                 Voir toutes les Tâches
//                 </button>
//             </div>
//         </div>
//     );
// }