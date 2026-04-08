// "use client";

// import { useState } from "react";
// import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
// // ─── Types ────────────────────────────────────────────────────────────────────

// type Status = "Actif" | "Désabonné" | "Non Confirmé";
// type Source = "Page d'Accueil" | "Modale" | "Footer" | "Article";

// interface Subscriber {
//     id: number;
//     email: string;
//     date: string;
//     status: Status;
//     source: Source;
// }

// // ─── Mock Data ────────────────────────────────────────────────────────────────

// const SUBSCRIBERS: Subscriber[] = [
//     { id: 1, email: "marie.dupont@example.com",   date: "15 Jan 2024", status: "Actif",         source: "Page d'Accueil" },
//     { id: 2, email: "jean.martin@example.com",    date: "12 Jan 2024", status: "Actif",         source: "Modale"         },
//     { id: 3, email: "sophie.bernard@example.com", date: "08 Jan 2024", status: "Désabonné",     source: "Footer"         },
//     { id: 4, email: "lucas.petit@example.com",    date: "05 Jan 2024", status: "Non Confirmé",  source: "Article"        },
//     { id: 5, email: "emma.rousseau@example.com",  date: "02 Jan 2024", status: "Actif",         source: "Page d'Accueil" },
//     { id: 6, email: "paul.moreau@example.com",    date: "28 Déc 2023", status: "Actif",         source: "Modale"         },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function StatCard({ label, value, sub, subType, icon, accent, }: { label: string; value: string; sub?: string; subType?: "success" | "warning"; icon: React.ReactNode; accent: string; }) {
//     return (
//         <div className="flex-1 min-w-40 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
//         <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
//             {icon}
//         </div>
//         <div>
//             <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
//             <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
//             {sub && (
//             <p className={`text-xs font-semibold mt-0.5 ${subType === "success" ? "text-emerald-500" : "text-amber-500"}`}>
//                 {sub}
//             </p>
//             )}
//         </div>
//         </div>
//     );
// }

// function StatusBadge({ status }: { status: Status }) {
//     const map: Record<Status, { bg: string; dot: string; text: string }> = {
//         "Actif":        { bg: "bg-emerald-50",  dot: "bg-emerald-400", text: "text-emerald-700" },
//         "Désabonné":    { bg: "bg-red-50",      dot: "bg-red-400",     text: "text-red-600"     },
//         "Non Confirmé": { bg: "bg-amber-50",    dot: "bg-amber-400",   text: "text-amber-700"   },
//     };
//     const s = map[status];
//     return (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
//         <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//         {status}
//         </span>
//     );
// }

// function ActionButtons({ status }: { status: Status }) {
//     return (
//         <div className="flex items-center gap-1.5">
//         <button
//             title="Modifier"
//             className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition-colors"
//         >
//             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0111 16H9v-2a2 2 0 01.586-1.414z" />
//             </svg>
//         </button>
//         <button
//             title="Supprimer"
//             className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
//         >
//             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//         </button>
//         </div>
//     );
// }

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const IconUsers = () => (
//     <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
// );
// const IconUserPlus = () => (
//     <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-4-3a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//     </svg>
// );
// const IconUserMinus = () => (
//     <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm8-5h6" />
//     </svg>
// );
// const IconDownload = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
//     </svg>
// );
// const IconExternal = () => (
//     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//     </svg>
// );
// const IconShield = () => (
//     <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//     </svg>
// );
// const IconSearch = () => (
//     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 16.65 7.5 7.5 0 0016.65 16.65z" />
//     </svg>
// );
// const IconChevronLeft = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//     </svg>
// );
// const IconChevronRight = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//     </svg>
// );

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function NewsletterPage() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [statusFilter, setStatusFilter] = useState("Tous");
//     const [sourceFilter, setSourceFilter] = useState("Toutes");
//     const [dateFilter, setDateFilter] = useState("Toutes les dates");
//     const [activeOnly, setActiveOnly] = useState(true);
//     const [includeUnsub, setIncludeUnsub] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);

//     const totalPages = 2076;

//     const filtered = SUBSCRIBERS.filter((s) => {
//         const matchSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
//         const matchStatus = statusFilter === "Tous" || s.status === statusFilter;
//         const matchSource = sourceFilter === "Toutes" || s.source === sourceFilter;
//         return matchSearch && matchStatus && matchSource;
//     });

//     return (
//         <ProtectedRoute requiredRole="SUPER_ADMIN">
//         <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

//             {/* ── Header ── */}
//             <div>
//             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//                 Gestion de la Newsletter et Abonnés
//             </h1>
//             <p className="text-sm text-gray-400 mt-0.5">
//                 Surveillance des listes d&aposemails et gestion des exportations
//             </p>
//             </div>

//             {/* ── Stat Cards ── */}
//             <div className="flex flex-wrap gap-4">
//             <StatCard
//                 label="Total des Abonnés"
//                 value="12,458"
//                 icon={<IconUsers />}
//                 accent="bg-orange-50"
//             />
//             <StatCard
//                 label="Nouveaux Abonnés (Mois)"
//                 value="342"
//                 sub="▲ +12.5%"
//                 subType="success"
//                 icon={<IconUserPlus />}
//                 accent="bg-emerald-50"
//             />
//             <StatCard
//                 label="Taux de Désabonnement"
//                 value="2.8%"
//                 sub="⚠ Attention"
//                 subType="warning"
//                 icon={<IconUserMinus />}
//                 accent="bg-red-50"
//             />
//             </div>

//             {/* ── Export Panel ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
//             <h2 className="text-sm font-semibold text-gray-700 mb-3">Exportation et Campagnes</h2>
//             <div className="flex flex-wrap items-center gap-4">
//                 <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-orange-200">
//                 <IconDownload />
//                 Exporter la Liste Complète (CSV)
//                 </button>
//                 <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
//                 <input
//                     type="checkbox"
//                     checked={activeOnly}
//                     onChange={(e) => setActiveOnly(e.target.checked)}
//                     className="accent-orange-500 w-3.5 h-3.5 rounded"
//                 />
//                 Inclure seulement les actifs
//                 </label>
//                 <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
//                 <input
//                     type="checkbox"
//                     checked={includeUnsub}
//                     onChange={(e) => setIncludeUnsub(e.target.checked)}
//                     className="accent-orange-500 w-3.5 h-3.5 rounded"
//                 />
//                 Inclure les désabonnés
//                 </label>
//             </div>
//             <button className="mt-3 flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
//                 <IconExternal />
//                 Accéder à la plateforme de Campagne Email
//             </button>
//             </div>

//             {/* ── Filters ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
//             <div className="flex flex-wrap items-center gap-3">
//                 {/* Search */}
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-50 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300 transition-all">
//                 <IconSearch />
//                 <input
//                     type="text"
//                     placeholder="Rechercher par email..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
//                 />
//                 </div>

//                 {/* Status */}
//                 <div className="flex items-center gap-2">
//                 <label className="text-xs font-medium text-gray-400 whitespace-nowrap">Statut :</label>
//                 <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
//                 >
//                     {["Tous", "Actif", "Désabonné", "Non Confirmé"].map((o) => (
//                     <option key={o}>{o}</option>
//                     ))}
//                 </select>
//                 </div>

//                 {/* Source */}
//                 <div className="flex items-center gap-2">
//                 <label className="text-xs font-medium text-gray-400 whitespace-nowrap">Source :</label>
//                 <select
//                     value={sourceFilter}
//                     onChange={(e) => setSourceFilter(e.target.value)}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
//                 >
//                     {["Toutes", "Page d'Accueil", "Modale", "Footer", "Article"].map((o) => (
//                     <option key={o}>{o}</option>
//                     ))}
//                 </select>
//                 </div>

//                 {/* Date */}
//                 <div className="flex items-center gap-2">
//                 <label className="text-xs font-medium text-gray-400 whitespace-nowrap">Date :</label>
//                 <select
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
//                 >
//                     {["Toutes les dates", "Aujourd'hui", "7 derniers jours", "30 derniers jours"].map((o) => (
//                     <option key={o}>{o}</option>
//                     ))}
//                 </select>
//                 </div>
//             </div>
//             </div>

//             {/* ── Table ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                 <thead>
//                     <tr className="border-b border-gray-100 bg-gray-50/60">
//                     {["Adresse Email", "Date d'Abonnement", "Statut", "Source", "Actions"].map((h) => (
//                         <th
//                         key={h}
//                         className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
//                         >
//                         {h}
//                         </th>
//                     ))}
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                     {filtered.map((sub) => (
//                     <tr key={sub.id} className="hover:bg-orange-50/30 transition-colors group">
//                         <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
//                         {sub.email}
//                         </td>
//                         <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{sub.date}</td>
//                         <td className="px-5 py-3.5">
//                         <StatusBadge status={sub.status} />
//                         </td>
//                         <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{sub.source}</td>
//                         <td className="px-5 py-3.5">
//                         <ActionButtons status={sub.status} />
//                         </td>
//                     </tr>
//                     ))}
//                 </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
//                 <p className="text-xs text-gray-400">
//                 Affichage de 1 à {filtered.length} sur <span className="font-semibold text-gray-600">12,458</span> abonnés
//                 </p>
//                 <div className="flex items-center gap-1">
//                 <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                     <IconChevronLeft />
//                 </button>

//                 {[1, 2, 3].map((p) => (
//                     <button
//                     key={p}
//                     onClick={() => setCurrentPage(p)}
//                     className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
//                         currentPage === p
//                         ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
//                         : "border border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-white"
//                     }`}
//                     >
//                     {p}
//                     </button>
//                 ))}

//                 <span className="w-7 h-7 flex items-center justify-center text-gray-400 text-xs">…</span>

//                 <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-white transition-all ${
//                     currentPage === totalPages ? "bg-orange-500 text-white border-orange-500" : ""
//                     }`}
//                 >
//                     {totalPages.toLocaleString()}
//                 </button>

//                 <button
//                     onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={currentPage === totalPages}
//                     className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                 >
//                     <IconChevronRight />
//                 </button>
//                 </div>
//             </div>
//             </div>

//             {/* ── RGPD Banner ── */}
//             <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3">
//             <div className="mt-0.5 shrink-0">
//                 <IconShield />
//             </div>
//             <div>
//                 <p className="text-sm font-semibold text-amber-800 mb-1">Conformité RGPD</p>
//                 <p className="text-xs text-amber-700 leading-relaxed">
//                 Toutes les suppressions d&aposabonnés sont définitives et irréversibles. Assurez-vous de respecter les règles
//                 RGPD en matière de conservation et de traitement des données personnelles. Les utilisateurs ont le droit
//                 d&aposaccéder, de modifier ou de supprimer leurs données à tout moment.
//                 </p>
//                 <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
//                 <IconShield />
//                 Vérifier la Politique de Confidentialité
//                 <IconExternal />
//                 </button>
//             </div>
//             </div>

//         </div>
//         </div>
//     </ProtectedRoute>
//     );
// }




















"use client";

import { useState, useEffect, useCallback } from "react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";

import {getToken} from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type Source = "website" | "salons_page" | "actualites_page";
type SubscriptionType = "general" | "alerts_salons" | "actualites_page";

interface Subscriber {
    id: number;
    email: string;
    source: Source;
    type: SubscriptionType;
    isActive: boolean;
    verifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

interface NewsletterStats {
    total: number;
    last30Days: number;
}

// ─── API helpers ────────────────────────────────────────────────────────────── 

const API_BASE = process.env.NEXT_PUBLIC_API_URL;


async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...(options?.headers ?? {}),
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, subType, icon, accent, loading,}:
    { label: string; value: string; sub?: string; subType?: "success" | "warning"; icon: React.ReactNode; accent: string; loading?: boolean;}) {
    return (
        <div className="flex-1 min-w-40 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                {loading ? (
                    <div className="h-7 w-20 bg-gray-100 animate-pulse rounded mt-1" />
                ) : (
                    <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
                )}
                {sub && !loading && (
                <p className={`text-xs font-semibold mt-0.5 ${subType === "success" ? "text-emerald-500" : "text-amber-500"}`}>
                    {sub}
                </p>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ isActive, verifiedAt }: { isActive: boolean; verifiedAt: string | null }) {
    if (!isActive)
        return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Désabonné
        </span>
        );
    if (!verifiedAt)
        return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Non Confirmé
        </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Actif
        </span>
    );
}

const SOURCE_LABELS: Record<Source, string> = {
    website: "Site Web",
    salons_page: "Page Salons",
    actualites_page: "Page Actualités",
};

const TYPE_LABELS: Record<SubscriptionType, string> = {
    general: "Général",
    alerts_salons: "Alertes Salons",
    actualites_page: "Actualités",
};

function ConfirmModal({ email, onConfirm, onCancel, loading, }: { email: string; onConfirm: () => void; onCancel: () => void; loading: boolean; }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Supprimer cet abonné ?</h3>
            <p className="text-sm text-gray-500 mb-5">
            Cette action est <span className="font-semibold text-red-600">définitive et irréversible</span> (RGPD). L'adresse{" "}
            <span className="font-medium text-gray-700">{email}</span> sera définitivement supprimée.
            </p>
            <div className="flex gap-3">
            <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
                Annuler
            </button>
            <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                )}
                Supprimer
            </button>
            </div>
        </div>
        </div>
    );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconUsers = () => (
    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconUserPlus = () => (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-4-3a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);
const IconUserMinus = () => (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm8-5h6" />
    </svg>
);
const IconDownload = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
);
const IconExternal = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
const IconShield = () => (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const IconSearch = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 16.65 7.5 7.5 0 0016.65 16.65z" />
    </svg>
);
const IconChevronLeft = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const IconChevronRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewsletterPage() {
    // State
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [sourceFilter, setSourceFilter] = useState("Toutes");
    const [currentPage, setCurrentPage] = useState(1);

    // Delete confirm modal
    const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Export
    const [exportLoading, setExportLoading] = useState(false);
    const [activeOnly, setActiveOnly] = useState(true);
    const [includeUnsub, setIncludeUnsub] = useState(false);

    // ── Fetch stats ──────────────────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
        setStatsLoading(true);
        const res = await apiFetch<{ success: boolean; data: NewsletterStats }>("/admin/newsletter/stats");
        setStats(res.data);
        } catch {
        setError("Impossible de charger les statistiques.");
        } finally {
        setStatsLoading(false);
        }
    }, []);

    // ── Fetch subscribers ────────────────────────────────────────────────────────
    const fetchSubscribers = useCallback(async (page = 1) => {
        try {
        setListLoading(true);
        setError(null);

        const params = new URLSearchParams({ page: String(page), pageSize: "10" });
        if (searchQuery) params.set("search", searchQuery);

        const res = await apiFetch<{ success: boolean; data: { data: Subscriber[]; pagination: Pagination } }>(
            `/admin/newsletter?${params.toString()}`
        );
        setSubscribers(res.data.data);
        setPagination(res.data.pagination);
        } catch {
        setError("Impossible de charger les abonnés.");
        } finally {
        setListLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    useEffect(() => {
        const timer = setTimeout(() => fetchSubscribers(currentPage), 300);
        return () => clearTimeout(timer);
    }, [fetchSubscribers, currentPage, searchQuery]);

    // ── Delete ────────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
        setDeleteLoading(true);
        await apiFetch(`/admin/newsletter/${deleteTarget.id}`, { method: "DELETE" });
        setDeleteTarget(null);
        await fetchSubscribers(currentPage);
        await fetchStats();
        } catch {
        setError("Impossible de supprimer cet abonné.");
        } finally {
        setDeleteLoading(false);
        }
    };

    // ── Client-side filtering (status & source since API may not support it) ──────
    const filtered = subscribers.filter((s) => {
        const matchStatus =
        statusFilter === "Tous" ||
        (statusFilter === "Actif" && s.isActive && s.verifiedAt) ||
        (statusFilter === "Désabonné" && !s.isActive) ||
        (statusFilter === "Non Confirmé" && s.isActive && !s.verifiedAt);

        const matchSource =
        sourceFilter === "Toutes" ||
        (sourceFilter === "Site Web" && s.source === "website") ||
        (sourceFilter === "Page Salons" && s.source === "salons_page") ||
        (sourceFilter === "Page Actualités" && s.source === "actualites_page");

        return matchStatus && matchSource;
    });

    // ── Computed stats ────────────────────────────────────────────────────────────
    const totalSubscribers = stats?.total ?? 0;
    const newThisMonth = stats?.last30Days ?? 0;
    const activeCount = subscribers.filter((s) => s.isActive && s.verifiedAt).length;
    const inactiveCount = subscribers.filter((s) => !s.isActive).length;
    // Taux de désabonnement = désabonnés / total de la page courante (indicatif)
    const unsubRate =
        subscribers.length > 0 ? ((inactiveCount / subscribers.length) * 100).toFixed(1) : "0.0";

    // ── Export CSV ────────────────────────────────────────────────────────────────
    const handleExport = async () => {
        try {
        setExportLoading(true);
        // Fetch all subscribers for export (pageSize=1000 to get maximum)
        const params = new URLSearchParams({ page: "1", pageSize: "1000" });
        const res = await apiFetch<{ success: boolean; data: { data: Subscriber[] } }>(
            `/admin/newsletter?${params.toString()}`
        );

        let data = res.data.data;

        // Apply export filters
        if (activeOnly && !includeUnsub) {
            data = data.filter((s) => s.isActive);
        } else if (activeOnly && includeUnsub) {
            // Keep all — active + inactive
        } else if (!includeUnsub) {
            data = data.filter((s) => s.isActive);
        }

        if (!includeUnsub) {
            data = data.filter((s) => s.isActive);
        }

        // Build CSV
        const headers = ["ID", "Email", "Source", "Type", "Statut", "Vérifié le", "Inscrit le"];
        const rows = data.map((s) => [
            s.id,
            s.email,
            SOURCE_LABELS[s.source] ?? s.source,
            TYPE_LABELS[s.type] ?? s.type,
            s.isActive ? (s.verifiedAt ? "Actif" : "Non Confirmé") : "Désabonné",
            s.verifiedAt ? new Date(s.verifiedAt).toLocaleDateString("fr-FR") : "",
            new Date(s.createdAt).toLocaleDateString("fr-FR"),
        ]);

        const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter_abonnes_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        } catch {
        setError("Impossible d'exporter la liste.");
        } finally {
        setExportLoading(false);
        }
    };

    // ── Format date ───────────────────────────────────────────────────────────────
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

    // ── Render ────────────────────────────────────────────────────────────────────
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

            {/* ── Header ── */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Gestion de la Newsletter et Abonnés
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                Surveillance des listes d&apos;emails et gestion des exportations
                </p>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                </div>
            )}

            {/* ── Stat Cards ── */}
            <div className="flex flex-wrap gap-4">
                <StatCard
                label="Total des Abonnés"
                value={totalSubscribers.toLocaleString("fr-FR")}
                icon={<IconUsers />}
                accent="bg-orange-50"
                loading={statsLoading}
                />
                <StatCard
                label="Nouveaux (30 jours)"
                value={newThisMonth.toLocaleString("fr-FR")}
                sub={newThisMonth > 0 ? `▲ +${newThisMonth}` : undefined}
                subType="success"
                icon={<IconUserPlus />}
                accent="bg-emerald-50"
                loading={statsLoading}
                />
                <StatCard
                label="Taux de Désabonnement"
                value={`${unsubRate}%`}
                sub={parseFloat(unsubRate) > 5 ? "⚠ Attention" : "✓ Normal"}
                subType={parseFloat(unsubRate) > 5 ? "warning" : "success"}
                icon={<IconUserMinus />}
                accent="bg-red-50"
                loading={listLoading}
                />
            </div>

            {/* ── Export Panel ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Exportation et Campagnes</h2>
                <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shadow-orange-200 disabled:opacity-60"
                >
                    {exportLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    ) : (
                    <IconDownload />
                    )}
                    Exporter la Liste Complète (CSV)
                </button>
                <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                    type="checkbox"
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.target.checked)}
                    className="accent-orange-500 w-3.5 h-3.5 rounded"
                    />
                    Inclure seulement les actifs
                </label>
                <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                    type="checkbox"
                    checked={includeUnsub}
                    onChange={(e) => setIncludeUnsub(e.target.checked)}
                    className="accent-orange-500 w-3.5 h-3.5 rounded"
                    />
                    Inclure les désabonnés
                </label>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
                <IconExternal />
                Accéder à la plateforme de Campagne Email
                </button>
            </div>

            {/* ── Filters ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-50 bg-gray-50 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300 transition-all">
                    <IconSearch />
                    <input
                    type="text"
                    placeholder="Rechercher par email..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                    />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-400 whitespace-nowrap">Statut :</label>
                    <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                    >
                    {["Tous", "Actif", "Désabonné", "Non Confirmé"].map((o) => (
                        <option key={o}>{o}</option>
                    ))}
                    </select>
                </div>

                {/* Source */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-400 whitespace-nowrap">Source :</label>
                    <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                    >
                    {["Toutes", "Site Web", "Page Salons", "Page Actualités"].map((o) => (
                        <option key={o}>{o}</option>
                    ))}
                    </select>
                </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        {["Adresse Email", "Source", "Type", "Statut", "Inscrit le", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {listLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                            {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-5 py-4">
                                <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                            </td>
                            ))}
                        </tr>
                        ))
                    ) : filtered.length === 0 ? (
                        <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                            Aucun abonné trouvé.
                        </td>
                        </tr>
                    ) : (
                        filtered.map((sub) => (
                        <tr key={sub.id} className="hover:bg-orange-50/30 transition-colors group">
                            <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">{sub.email}</td>
                            <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                            {SOURCE_LABELS[sub.source] ?? sub.source}
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                            {TYPE_LABELS[sub.type] ?? sub.type}
                            </td>
                            <td className="px-5 py-3.5">
                            <StatusBadge isActive={sub.isActive} verifiedAt={sub.verifiedAt} />
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(sub.createdAt)}</td>
                            <td className="px-5 py-3.5">
                            <button
                                title="Supprimer"
                                onClick={() => setDeleteTarget(sub)}
                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
                <p className="text-xs text-gray-400">
                    Affichage de {filtered.length === 0 ? 0 : (currentPage - 1) * pagination.pageSize + 1} à{" "}
                    {Math.min(currentPage * pagination.pageSize, pagination.total)} sur{" "}
                    <span className="font-semibold text-gray-600">{pagination.total.toLocaleString("fr-FR")}</span> abonnés
                </p>
                <div className="flex items-center gap-1">
                    <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                    <IconChevronLeft />
                    </button>

                    {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        currentPage === p
                            ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                            : "border border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-white"
                        }`}
                    >
                        {p}
                    </button>
                    ))}

                    {pagination.totalPages > 4 && (
                    <span className="w-7 h-7 flex items-center justify-center text-gray-400 text-xs">…</span>
                    )}

                    {pagination.totalPages > 3 && (
                    <button
                        onClick={() => setCurrentPage(pagination.totalPages)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-white transition-all ${
                        currentPage === pagination.totalPages ? "bg-orange-500 text-white border-orange-500" : ""
                        }`}
                    >
                        {pagination.totalPages}
                    </button>
                    )}

                    <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                    <IconChevronRight />
                    </button>
                </div>
                </div>
            </div>

            {/* ── RGPD Banner ── */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3">
                <div className="mt-0.5 shrink-0">
                <IconShield />
                </div>
                <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Conformité RGPD</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                    Toutes les suppressions d&apos;abonnés sont <strong>définitives et irréversibles</strong>. Assurez-vous de respecter les règles
                    RGPD en matière de conservation et de traitement des données personnelles. Les utilisateurs ont le droit
                    d&apos;accéder, de modifier ou de supprimer leurs données à tout moment.
                </p>
                <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                    <IconShield />
                    Vérifier la Politique de Confidentialité
                    <IconExternal />
                </button>
                </div>
            </div>

            </div>
        </div>

        {/* ── Delete Confirm Modal ── */}
        {deleteTarget && (
            <ConfirmModal
            email={deleteTarget.email}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
            />
        )}
        </ProtectedRoute>
    );
}