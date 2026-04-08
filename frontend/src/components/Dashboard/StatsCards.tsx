"use client";

import { Users, Play, Mail, FileText } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";


const sparkData = [
    { v: 20 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 23 }, { v: 28 }, { v: 30 },
];

const stats = [
    {
        label: "Visiteurs Uniques (Mois)",
        value: "24,567",
        trend: "+12.5% vs mois précédent",
        trendColor: "text-[#F59E0B]",
        icon: Users,
        iconColor: "text-orange-400",
        showChart: true,
    },
    {
        label: "Vues | Tourisme TV",
        value: "156,890",
        trend: "+8.3% ce mois",
        trendColor: "text-[#F59E0B]",
        icon: Play,
        iconColor: "text-orange-400",
        showChart: false,
    },
    {
        label: "Nouveaux Abonnés Newsletter",
        value: "1,247",
        trend: "+15.7% ce mois",
        trendColor: "text-[#F59E0B]",
        icon: Mail,
        iconColor: "text-orange-400",
        showChart: false,
    },
    {
        label: "Publications ce Mois",
        value: "67",
        sub: "Articles, vidéos, fiches",
        icon: FileText,
        iconColor: "text-orange-400",
        showChart: false,
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{s.label}</span>
                <s.icon size={18} className={s.iconColor} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            {s.trend && (
                <p className={`text-xs font-medium ${s.trendColor}`}>{s.trend}</p>
            )}
            {s.sub && (
                <p className="text-xs text-gray-400">{s.sub}</p>
            )}
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





// "use client";

// import { useState, useEffect } from "react";
// import { Users, Play, Mail, FileText, TrendingUp } from "lucide-react";
// import { LineChart, Line, ResponsiveContainer } from "recharts";
// import { getToken } from "@/lib/auth";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// const sparkData = [
//     { v: 20 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 23 }, { v: 28 }, { v: 30 },
// ];

// interface DashboardStats {
//     articles: { total: number; published: number; draft: number };
//     categories: number;
//     destinations: number;
//     users: number;
//     media: number;
//     totalViews: number;
//     newsletterSubscribers: number;
// }

// interface StatCard {
//     label: string;
//     value: string;
//     trend?: string;
//     sub?: string;
//     icon: React.ElementType;
//     showChart?: boolean;
// }

// function formatNumber(n: number): string {
//     if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
//     if (n >= 1_000) return n.toLocaleString("fr-FR");
//     return String(n);
// }

// function buildStats(data: DashboardStats): StatCard[] {
//     return [
//         {
//             label: "Total Vues Articles",
//             value: formatNumber(data.totalViews),
//             trend: "Toutes publications confondues",
//             icon: Users,
//             showChart: true,
//         },
//         {
//             label: "Articles Publiés",
//             value: formatNumber(data.articles.published),
//             sub: `${data.articles.draft} brouillon${data.articles.draft > 1 ? "s" : ""}`,
//             icon: Play,
//         },
//         {
//             label: "Abonnés Newsletter",
//             value: formatNumber(data.newsletterSubscribers),
//             trend: "Inscrits actifs",
//             icon: Mail,
//         },
//         {
//             label: "Publications Totales",
//             value: formatNumber(data.articles.total),
//             sub: `Articles, médias (${data.media}), catégories (${data.categories})`,
//             icon: FileText,
//         },
//     ];
// }

// function SkeletonCard() {
//     return (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
//         <div className="flex items-center justify-between">
//             <div className="h-3 bg-gray-200 rounded w-32" />
//             <div className="h-4 w-4 bg-gray-200 rounded" />
//         </div>
//         <div className="h-8 bg-gray-200 rounded w-24" />
//         <div className="h-3 bg-gray-100 rounded w-20" />
//         </div>
//     );
// }

// export default function StatsCards() {
//     const [stats, setStats] = useState<StatCard[] | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // const token = typeof window !== "undefined"
//         // ? localStorage.getItem("admin_token")
//         // : null;

//         const token = getToken();
//         console.log("Token récupéré:", token);

//         if (!token) {
//             setError("Token d'authentification manquant. Connectez-vous pour voir les statistiques.");
//             setLoading(false);
//             return;
//         }

//         fetch(`${API_BASE}/admin/stats/dashboard`, {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//             if (!res.ok) throw new Error(`Erreur ${res.status}`);
//             return res.json();
//         })
//         .then((json) => {
//             if (json.success) {
//                 setStats(buildStats(json.data));
//             } else {
//                 console.error("Réponse inattendue de l'API", json);
//                 throw new Error("Réponse inattendue de l'API");
//             }
//         })
//         .catch((err) => {
//             console.error("Erreur lors de la récupération des statistiques:", err);
//             setError(err.message);
//         })
//         .finally(() => setLoading(false));
//     }, []);

//     if (loading) {
//         return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
//         </div>
//         );
//     }

//     if (error) {
//         console.log(error);
//         return (
//             <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 flex items-center gap-2">
//                 <TrendingUp size={16} className="shrink-0" />
//                 {error}
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats!.map((s, i) => (
//             <div
//             key={i}
//             className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2"
//             >
//             <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-500">{s.label}</span>
//                 <s.icon size={18} className="text-orange-400" />
//             </div>
//             <p className="text-3xl font-bold text-gray-900">{s.value}</p>
//             {s.trend && (
//                 <p className="text-xs font-medium text-amber-500">{s.trend}</p>
//             )}
//             {s.sub && (
//                 <p className="text-xs text-gray-400">{s.sub}</p>
//             )}
//             {s.showChart && (
//                 <div className="mt-2 h-12">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={sparkData}>
//                     <Line
//                         type="monotone"
//                         dataKey="v"
//                         stroke="#f97316"
//                         strokeWidth={2}
//                         dot={false}
//                     />
//                     </LineChart>
//                 </ResponsiveContainer>
//                 </div>
//             )}
//             </div>
//         ))}
//         </div>
//     );
// }