// src/components/Dashboard/AdminMonetisation.tsx
"use client";

import type { AdStatus, ContactStats } from "@/hooks/useDashboardStats";

interface Props {
  adStatuses: AdStatus[];
  contactStats: ContactStats | null;
  loading: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIF: "Actif",
  FUTUR: "Futur",
  EXPIRE: "Expiré",
};

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 bg-gray-100 animate-pulse rounded ${w}`} />;
}

export default function AdminMonetisation({
  adStatuses,
  contactStats,
  loading,
}: Props) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Administration et Monétisation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Statut des Publicités */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Statut des Publicités
          </h3>

          {loading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="space-y-1.5 flex-1">
                    <SkeletonLine w="w-2/3" />
                    <SkeletonLine w="w-1/3" />
                  </div>
                  <div className="h-6 w-14 bg-gray-100 animate-pulse rounded-full ml-4" />
                </li>
              ))}
            </ul>
          ) : adStatuses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Aucune bannière configurée.
            </p>
          ) : (
            <ul className="space-y-3">
              {adStatuses.map((ad, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {ad.name}
                    </p>
                    <p className="text-xs text-gray-400">{ad.company}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ad.status === "ACTIF"
                        ? "bg-green-100 text-green-600"
                        : ad.status === "FUTUR"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {STATUS_LABELS[ad.status] ?? ad.status}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
            Gérer les Espaces Publicitaires
          </button>
        </div>

        {/* Statistiques de Contact */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Statistiques de Contact
          </h3>

          <div className="text-center">
            {loading ? (
              <div className="h-14 w-20 bg-gray-100 animate-pulse rounded mx-auto" />
            ) : (
              <p className="text-5xl font-bold text-[#F59E0B]">
                {contactStats?.totalLeads ?? "–"}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Nouveaux abonnés ce mois
            </p>
          </div>

          <ul className="space-y-2">
            {loading
              ? [0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center justify-between">
                    <SkeletonLine w="w-1/2" />
                    <SkeletonLine w="w-8" />
                  </li>
                ))
              : (contactStats?.byCategory ?? []).map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-semibold text-gray-800">
                      {c.count > 0 ? c.count : "–"}
                    </span>
                  </li>
                ))}
          </ul>

          <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
            Gérer les Leads Partenaires
          </button>
        </div>

      </div>
    </div>
  );
}




























// // src/components/Dashboard/AdminMonetisation.tsx
// const ads = [
//     { name: "Top Banner",        company: "Air France",   status: "Actif",  active: true },
//     { name: "Sidebar Skyscraper",company: "Booking.com",  status: "Expiré", active: false },
//     { name: "Article Banner",    company: "Emirates",      status: "Actif",  active: true },
// ];

// const contacts = [
//     { label: "Agences de voyage",   count: 12 },
//     { label: "Compagnies aériennes",count: 7  },
//     { label: "Offices de tourisme", count: 4  },
// ];

// export default function AdminMonetisation() {
//     return (
//         <div>
//             <h2 className="text-base font-semibold text-gray-900 mb-4">Administration et Monétisation</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {/* Statut des Publicités */}
//             <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
//                 <h3 className="text-sm font-semibold text-gray-700">Statut des Publicités</h3>
//                 <ul className="space-y-3">
//                 {ads.map((ad, i) => (
//                     <li key={i} className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-gray-800">{ad.name}</p>
//                         <p className="text-xs text-gray-400">{ad.company}</p>
//                     </div>
//                     <span
//                         className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                         ad.active
//                             ? "bg-green-100 text-green-600"
//                             : "bg-red-100 text-red-500"
//                         }`}
//                     >
//                         {ad.status}
//                     </span>
//                     </li>
//                 ))}
//                 </ul>
//                 <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
//                     Gérer les Espaces Publicitaires
//                 </button>
//             </div>

//             {/* Statistiques de Contact */}
//             <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
//                 <h3 className="text-sm font-semibold text-gray-700">Statistiques de Contact</h3>
//                 <div className="text-center">
//                 <p className="text-5xl font-bold text-[#F59E0B]">23</p>
//                 <p className="text-xs text-gray-400 mt-1">Demandes Kit Média cette semaine</p>
//                 </div>
//                 <ul className="space-y-2">
//                 {contacts.map((c, i) => (
//                     <li key={i} className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">{c.label}</span>
//                     <span className="font-semibold text-gray-800">{c.count}</span>
//                     </li>
//                 ))}
//                 </ul>
//                 <button className="mt-auto bg-[#F59E0B] hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full">
//                 Gérer les Leads Partenaires
//                 </button>
//             </div>

//             </div>
//         </div>
//     );
// }