// "use client";

// import { useState } from "react";
// import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type AdZone = {
//     id: string;
//     name: string;
//     dimensions: string;
//     path: string;
//     fillRate: number;
//     enabled: boolean;
//     color: string;
// };

// type Banner = {
//     id: string;
//     advertiser: string;
//     campaign: string;
//     type: "Image JPG" | "Code HTML/JS";
//     startDate: string;
//     endDate: string;
//     status: "Actif" | "Futur" | "Expiré";
// };

// // ─── Mock Data ─────────────────────────────────────────────────────────────────

// const initialZones: AdZone[] = [
//     { id: "top-banner", name: "Top Banner Accueil", dimensions: "728 × 90 pixels", path: "/accueil", fillRate: 85, enabled: true, color: "#f97316" },
//     { id: "skyscraper", name: "Skyscraper Sidebar", dimensions: "160 × 600 pixels", path: "/articles/*", fillRate: 92, enabled: true, color: "#f97316" },
//     { id: "rectangle-moyen", name: "Rectangle Moyen", dimensions: "300 × 250 pixels", path: "/destinations/*", fillRate: 0, enabled: false, color: "#f97316" },
//     { id: "leaderboard", name: "Leaderboard Footer", dimensions: "728 × 90 pixels", path: "Toutes les pages", fillRate: 67, enabled: true, color: "#f97316" },
//     { id: "large-rectangle", name: "Large Rectangle", dimensions: "336 × 280 pixels", path: "/videos/*", fillRate: 73, enabled: true, color: "#f97316" },
//     { id: "mobile-banner", name: "Mobile Banner", dimensions: "320 × 50 pixels", path: "Mobile uniquement", fillRate: 88, enabled: true, color: "#f97316" },
// ];

// const initialBanners: Banner[] = [
//     { id: "1", advertiser: "Agence Voyage Plus", campaign: "Campagne Été 2024", type: "Image JPG", startDate: "01/06/2024", endDate: "31/08/2024", status: "Actif" },
//     { id: "2", advertiser: "Promotion Été 2024", campaign: "Office de Tourisme 2024", type: "Image JPG", startDate: "01/06/2024", endDate: "31/08/2024", status: "Actif" },
//     { id: "3", advertiser: "Google AdSense", campaign: "Code Automatique 2024", type: "Code HTML/JS", startDate: "15/05/2024", endDate: "15/12/2024", status: "Futur" },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function CircularProgress({ value }: { value: number }) {
//     const r = 28;
//     const circ = 2 * Math.PI * r;
//     const offset = circ - (value / 100) * circ;
//     return (
//         <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
//         <circle cx="36" cy="36" r={r} fill="none" stroke="#fed7aa" strokeWidth="6" />
//         <circle
//             cx="36" cy="36" r={r} fill="none"
//             stroke="#f97316" strokeWidth="6"
//             strokeDasharray={circ}
//             strokeDashoffset={offset}
//             strokeLinecap="round"
//             style={{ transition: "stroke-dashoffset 0.6s ease" }}
//         />
//         </svg>
//     );
// }

// function FillRateBar({ value }: { value: number }) {
//     const color =
//         value >= 80 ? "bg-orange-500" : value >= 50 ? "bg-amber-400" : "bg-gray-300";
//     return (
//         <div className="mt-3">
//         <div className="flex justify-between items-center mb-1">
//             <span className="text-xs text-gray-500">Taux de Remplissage</span>
//             <span className="text-xs font-bold text-orange-500">{value}%</span>
//         </div>
//         <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//             <div
//             className={`h-full rounded-full transition-all duration-700 ${color}`}
//             style={{ width: `${value}%` }}
//             />
//         </div>
//         </div>
//     );
// }

// function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
//     return (
//         <button
//         onClick={onChange}
//         className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${
//             enabled ? "bg-orange-500" : "bg-gray-200"
//         }`}
//         >
//         <span
//             className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
//             enabled ? "translate-x-4" : "translate-x-0.5"
//             }`}
//         />
//         </button>
//     );
// }

// function StatusBadge({ status }: { status: Banner["status"] }) {
//     const map = {
//         Actif: "bg-emerald-50 text-emerald-600 border border-emerald-200",
//         Futur: "bg-blue-50 text-blue-600 border border-blue-200",
//         Expiré: "bg-gray-100 text-gray-500 border border-gray-200",
//     };
//     return (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
//         <span className={`w-1.5 h-1.5 rounded-full ${
//             status === "Actif" ? "bg-emerald-500" : status === "Futur" ? "bg-blue-500" : "bg-gray-400"
//         }`} />
//         {status}
//         </span>
//     );
// }

// function TypeBadge({ type }: { type: Banner["type"] }) {
//     return (
//         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
//         type === "Image JPG"
//             ? "bg-blue-50 text-blue-600 border border-blue-200"
//             : "bg-purple-50 text-purple-600 border border-purple-200"
//         }`}>
//         {type === "Image JPG" ? (
//             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
//         ) : (
//             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//         )}
//         {type}
//         </span>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function AdSpaceManager() {
//     const [zones, setZones] = useState<AdZone[]>(initialZones);
//     const [banners, setBanners] = useState<Banner[]>(initialBanners);
//     const [selectedZone, setSelectedZone] = useState<AdZone>(initialZones[0]);
//     const [thirdPartyCode, setThirdPartyCode] = useState(
//         `<!-- Collez vos codes HTML/JavaScript ici → <! -- Exemple: Google Ad Manager →\n<script async\nsrc="https://www.googletagservices.com/tag/js/gpt.js"></script> <script> window.googletag = window.googletag || {cmd: []};\n</script>`
//     );

//     const globalFill = Math.round(
//         zones.filter((z) => z.enabled).reduce((acc, z) => acc + z.fillRate, 0) /
//         Math.max(zones.filter((z) => z.enabled).length, 1)
//     );

//     const toggleZone = (id: string) => {
//         setZones((prev) =>
//         prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z))
//         );
//     };

//     const deleteBanner = (id: string) => {
//         setBanners((prev) => prev.filter((b) => b.id !== id));
//     };

//     return (
//         <ProtectedRoute requiredRole="SUPER_ADMIN">
//         <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

//             {/* ── Header ── */}
//             <div className="flex items-start justify-between">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//                 Gestion des Espaces Publicitaires
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1">
//                 Définition des emplacements, attribution des bannières et suivi des performances
//                 </p>
//             </div>
//             <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                 </svg>
//                 Définir un Nouvel Emplacement
//             </button>
//             </div>

//             {/* ── Global Fill Rate ── */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
//             <div>
//                 <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
//                 Taux de Remplissage Global
//                 </p>
//                 <p className="text-4xl font-black text-gray-900">{globalFill}%</p>
//             </div>
//             <div className="relative flex items-center justify-center">
//                 <CircularProgress value={globalFill} />
//                 <span className="absolute text-sm font-bold text-orange-500">{globalFill}%</span>
//             </div>
//             </div>

//             {/* ── Ad Zones Grid ── */}
//             <section>
//             <h2 className="text-base font-bold text-gray-800 mb-4">
//                 Inventaire des Zones d&aposAffichage
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {zones.map((zone) => (
//                 <div
//                     key={zone.id}
//                     onClick={() => setSelectedZone(zone)}
//                     className={`bg-white rounded-xl border transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md ${
//                     selectedZone.id === zone.id
//                         ? "border-orange-400 ring-2 ring-orange-100"
//                         : "border-gray-200"
//                     }`}
//                 >
//                     <div className="p-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <h3 className="text-sm font-bold text-gray-800 leading-tight">{zone.name}</h3>
//                         <Toggle enabled={zone.enabled} onChange={() => toggleZone(zone.id)} />
//                     </div>
//                     <div className="space-y-0.5">
//                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                         <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
//                         </svg>
//                         {zone.dimensions}
//                         </div>
//                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                         <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.102 1.101" />
//                         </svg>
//                         {zone.path}
//                         </div>
//                     </div>
//                     <FillRateBar value={zone.fillRate} />
//                     </div>

//                     {/* Card Footer */}
//                     <div className="border-t border-gray-100 px-4 py-2.5 flex gap-2">
//                     <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md py-1.5 transition-colors">
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                         Paramètres
//                     </button>
//                     <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md py-1.5 transition-colors">
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         Bannières
//                     </button>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//             </section>

//             {/* ── Banners Table ── */}
//             <section>
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-base font-bold text-gray-800">
//                 Bannières pour l&aposEmplacement :{" "}
//                 <span className="text-orange-500">{selectedZone.name}</span>
//                 </h2>
//                 <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                 </svg>
//                 Ajouter une Nouvelle Bannière
//                 </button>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <table className="w-full text-sm">
//                 <thead>
//                     <tr className="border-b border-gray-100 bg-gray-50/70">
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-14">Aperçu</th>
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Annonceur / Campagne</th>
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Période d&aposAffichage</th>
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
//                     <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                     {banners.map((banner) => (
//                     <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
//                         {/* Preview */}
//                         <td className="px-4 py-3">
//                         <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
//                             {banner.type === "Image JPG" ? (
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
//                             </svg>
//                             ) : (
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
//                             </svg>
//                             )}
//                         </div>
//                         </td>
//                         {/* Advertiser */}
//                         <td className="px-4 py-3">
//                         <p className="font-semibold text-gray-800">{banner.advertiser}</p>
//                         <p className="text-xs text-gray-500">{banner.campaign}</p>
//                         </td>
//                         {/* Type */}
//                         <td className="px-4 py-3">
//                         <TypeBadge type={banner.type} />
//                         </td>
//                         {/* Period */}
//                         <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
//                         {banner.startDate} – {banner.endDate}
//                         </td>
//                         {/* Status */}
//                         <td className="px-4 py-3">
//                         <StatusBadge status={banner.status} />
//                         </td>
//                         {/* Actions */}
//                         <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                             <button className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors">
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
//                             </svg>
//                             </button>
//                             <button
//                             onClick={() => deleteBanner(banner.id)}
//                             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
//                             >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//                             </svg>
//                             </button>
//                         </div>
//                         </td>
//                     </tr>
//                     ))}
//                     {banners.length === 0 && (
//                     <tr>
//                         <td colSpan={6} className="text-center py-10 text-sm text-gray-400">
//                         Aucune bannière pour cet emplacement.
//                         </td>
//                     </tr>
//                     )}
//                 </tbody>
//                 </table>
//             </div>
//             </section>

//             {/* ── Third-Party Codes ── */}
//             <section>
//             <h2 className="text-base font-bold text-gray-800 mb-4">
//                 Codes Tiers et Intégration
//             </h2>
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
//                 <div className="mb-3">
//                 <p className="text-sm font-semibold text-gray-700">Codes de suivi et publicité externes</p>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                     Collez ici vos codes Google Ad Manager, codes de vérification ou autres scripts tiers.
//                 </p>
//                 </div>
//                 <div className="relative">
//                 <div className="absolute top-3 left-3 flex gap-1.5">
//                     <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
//                     <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
//                     <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
//                 </div>
//                 <textarea
//                     value={thirdPartyCode}
//                     onChange={(e) => setThirdPartyCode(e.target.value)}
//                     rows={6}
//                     className="w-full bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700 px-4 pt-8 pb-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 leading-relaxed placeholder:text-gray-600"
//                     placeholder={`<!-- Collez vos codes HTML/JavaScript ici -->`}
//                     spellCheck={false}
//                 />
//                 </div>
//                 <div className="flex justify-end mt-4">
//                 <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
//                     </svg>
//                     Enregistrer les Codes Tiers
//                 </button>
//                 </div>
//             </div>
//             </section>

//         </div>
//         </div>
//     </ProtectedRoute>
//     );
// }










"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
import { getToken } from "@/lib/auth";

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// function getToken() {
//   return getToken();
// }

async function apiFetch<T>( path: string, options: RequestInit = {} ): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
        Authorization: `Bearer ${getToken()}`,
        ...(options.headers ?? {}),
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
    return json as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerType = "IMAGE_JPG" | "HTML_JS";
type BannerStatus = "ACTIF" | "FUTUR" | "EXPIRE";

interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
    type: BannerType;
    imageUrl: string | null;
    publicId: string | null;
    htmlCode: string | null;
    startDate: string;
    endDate: string;
    status: BannerStatus;
    createdAt: string;
    updatedAt: string;
    advertisingId: number;
}

interface AdZone {
    id: number;
    name: string;
    slug: string;
    width: number;
    height: number;
    path: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    banners: Banner[];
    fillRate: number;
}

interface ThirdPartyCode {
    id: number;
    code: string;
    updatedAt: string;
}

interface Stats {
    totalZones: number;
    enabledZones: number;
    globalFillRate: number;
    activeBanners: number;
}

// ─── API hooks ────────────────────────────────────────────────────────────────

function useApi<T>(path: string | null, deps: unknown[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch_ = useCallback(async () => {
        if (!path) return;
        setLoading(true);
        setError(null);
        try {
        const res = await apiFetch<{ success: boolean; data: T }>(path);
        setData(res.data);
        } catch (e) {
        setError((e as Error).message);
        } finally {
        setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, ...deps]);

    useEffect(() => { fetch_(); }, [fetch_]);
    return { data, loading, error, refetch: fetch_ };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function toInputDate(iso: string) {
    return iso ? iso.slice(0, 10) : "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner({ sm }: { sm?: boolean }) {
    return (
        <svg
        className={`animate-spin ${sm ? "w-4 h-4" : "w-6 h-6"} text-orange-500`}
        fill="none"
        viewBox="0 0 24 24"
        >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}

function Toast({ msg, type, onClose, }: { msg: string; type: "success" | "error"; onClose: () => void; }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium animate-fade-in-up ${
            type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
        >
        {type === "success" ? (
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
        )}
        {msg}
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        </div>
    );
}

function CircularProgress({ value }: { value: number }) {
    const r = 28;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#fed7aa" strokeWidth="6" />
        <circle
            cx="36" cy="36" r={r} fill="none"
            stroke="#f97316" strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        </svg>
    );
}

function FillRateBar({ value }: { value: number }) {
    const color =
        value >= 80 ? "bg-orange-500" : value >= 50 ? "bg-amber-400" : "bg-gray-300";
    return (
        <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Taux de Remplissage</span>
            <span className="text-xs font-bold text-orange-500">{value}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${value}%` }}
            />
        </div>
        </div>
    );
}

function Toggle({ enabled, loading, onChange, }: { enabled: boolean; loading?: boolean; onChange: () => void; }) {
    return (
        <button
        onClick={(e) => { e.stopPropagation(); onChange(); }}
        disabled={loading}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-60 ${
            enabled ? "bg-orange-500" : "bg-gray-200"
        }`}
        >
        {loading ? (
            <span className="absolute inset-0 flex items-center justify-center">
            <Spinner sm />
            </span>
        ) : (
            <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
            />
        )}
        </button>
    );
}

function StatusBadge({ status }: { status: BannerStatus }) {
    const map: Record<BannerStatus, string> = {
        ACTIF: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        FUTUR: "bg-blue-50 text-blue-600 border border-blue-200",
        EXPIRE: "bg-gray-100 text-gray-500 border border-gray-200",
    };
    const dotMap: Record<BannerStatus, string> = {
        ACTIF: "bg-emerald-500",
        FUTUR: "bg-blue-500",
        EXPIRE: "bg-gray-400",
    };
    const labelMap: Record<BannerStatus, string> = {
        ACTIF: "Actif",
        FUTUR: "Futur",
        EXPIRE: "Expiré",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
        {labelMap[status]}
        </span>
    );
}

function TypeBadge({ type }: { type: BannerType }) {
    return (
        <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
            type === "IMAGE_JPG"
            ? "bg-blue-50 text-blue-600 border border-blue-200"
            : "bg-purple-50 text-purple-600 border border-purple-200"
        }`}
        >
        {type === "IMAGE_JPG" ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        )}
        {type === "IMAGE_JPG" ? "Image JPG" : "Code HTML/JS"}
        </span>
    );
}

// ─── Modal: Zone Form ─────────────────────────────────────────────────────────

interface ZoneFormData {
    name: string;
    slug: string;
    width: string;
    height: string;
    path: string;
    isEnabled: boolean;
}

function ZoneModal({ zone, onClose, onSaved, onToast, }: { zone?: AdZone | null; onClose: () => void; onSaved: () => void; onToast: (msg: string, type: "success" | "error") => void; }) {
    const isEdit = !!zone;
    const [form, setForm] = useState<ZoneFormData>({
        name: zone?.name ?? "",
        slug: zone?.slug ?? "",
        width: zone?.width?.toString() ?? "",
        height: zone?.height?.toString() ?? "",
        path: zone?.path ?? "",
        isEnabled: zone?.isEnabled ?? true,
    });
    const [saving, setSaving] = useState(false);

    function autoSlug(name: string) {
        return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    function handleChange(k: keyof ZoneFormData, v: string | boolean) {
        setForm((p) => {
        const next = { ...p, [k]: v };
        if (k === "name" && !isEdit) next.slug = autoSlug(v as string);
        return next;
        });
    }

    async function handleSubmit() {
        setSaving(true);
        try {
        const body = {
            name: form.name,
            slug: form.slug,
            width: parseInt(form.width),
            height: parseInt(form.height),
            path: form.path,
            isEnabled: form.isEnabled,
        };
        if (isEdit) {
            await apiFetch(`/admin/advertising/zones/${zone.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            });
            onToast("Zone mise à jour avec succès", "success");
        } else {
            await apiFetch("/admin/advertising/zones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            });
            onToast("Zone créée avec succès", "success");
        }
        onSaved();
        onClose();
        } catch (e) {
        onToast((e as Error).message, "error");
        } finally {
        setSaving(false);
        }
    }

    return (
        <ModalOverlay onClose={onClose}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">
            {isEdit ? "Modifier la Zone" : "Nouvelle Zone Publicitaire"}
        </h2>
        <div className="space-y-4">
            <Field label="Nom de la zone">
            <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Top Banner Accueil"
                className={inputCls}
            />
            </Field>
            <Field label="Slug">
            <input
                type="text"
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="top-banner-accueil"
                className={inputCls}
            />
            </Field>
            <div className="grid grid-cols-2 gap-3">
            <Field label="Largeur (px)">
                <input
                type="number"
                value={form.width}
                onChange={(e) => handleChange("width", e.target.value)}
                placeholder="728"
                className={inputCls}
                />
            </Field>
            <Field label="Hauteur (px)">
                <input
                type="number"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
                placeholder="90"
                className={inputCls}
                />
            </Field>
            </div>
            <Field label="Chemin URL">
            <input
                type="text"
                value={form.path}
                onChange={(e) => handleChange("path", e.target.value)}
                placeholder="/accueil, /articles/*, /"
                className={inputCls}
            />
            </Field>
            <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-gray-700">Zone activée</span>
            <Toggle enabled={form.isEnabled} onChange={() => handleChange("isEnabled", !form.isEnabled)} />
            </div>
        </div>
        <ModalActions onClose={onClose} onSave={handleSubmit} saving={saving} label={isEdit ? "Enregistrer" : "Créer"} />
        </ModalOverlay>
    );
}

// ─── Modal: Banner Form ───────────────────────────────────────────────────────

interface BannerFormData {
    advertiser: string;
    campaign: string;
    type: BannerType;
    htmlCode?: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
}

function BannerModal({ banner, zoneId, onClose, onSaved, onToast, }: { banner?: Banner | null; zoneId: number; onClose: () => void; onSaved: () => void; onToast: (msg: string, type: "success" | "error") => void; }) {
    const isEdit = !!banner;
    const [form, setForm] = useState<BannerFormData>({
        advertiser: banner?.advertiser ?? "",
        campaign: banner?.campaign ?? "",
        type: banner?.type ?? "IMAGE_JPG",
        htmlCode: banner?.htmlCode ?? "",
        startDate: banner ? toInputDate(banner.startDate) : "",
        endDate: banner ? toInputDate(banner.endDate) : "",
        imageUrl: banner?.imageUrl ?? "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleChange(k: keyof BannerFormData, v: string) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    // if (form.type === "IMAGE_JPG" && !imageFile && !isEdit) {
    //     throw new Error("Veuillez sélectionner une image");
    // }



//     async function handleSubmit() {
//     setSaving(true);
//     try {
//         const fd = new FormData();

//         fd.append("advertiser", form.advertiser);
//         fd.append("campaign", form.campaign);
//         fd.append("type", form.type);
//         fd.append("startDate", new Date(form.startDate).toISOString());
//         fd.append("endDate", new Date(form.endDate).toISOString());

//         if (!isEdit) fd.append("advertisingId", String(zoneId));

//         if (form.type === "HTML_JS") {
//             if (!form.htmlCode?.trim()) {
//                 throw new Error("Le code HTML est requis");
//             }
//             fd.append("htmlCode", form.htmlCode);
//         } else if (form.type === "IMAGE_JPG") {
//             if (imageFile) {
//                 fd.append("image", imageFile);
//             }
//         }

//         // 🔥 👉 METTRE ICI
//         console.log("FORMDATA ENVOYÉ 👉");
//         for (const pair of fd.entries()) {
//             console.log(pair[0], pair[1]);
//         }

//         // 🔥 appel API
//         if (isEdit) {
//             await apiFetch(`/admin/advertising/banners/${banner.id}`, {
//                 method: "PATCH",
//                 body: fd,
//             });
//         } else {
//             await apiFetch("/admin/advertising/banners", {
//                 method: "POST",
//                 body: fd,
//             });
//         }

//         onToast("Succès", "success");
//         onSaved();
//         onClose();

//     } catch (e) {
//         onToast((e as Error).message, "error");
//     } finally {
//         setSaving(false);
//     }
// }

    async function handleSubmit() {
        setSaving(true);

        try {
            const fd = new FormData();

            fd.append("advertiser", form.advertiser);
            fd.append("campaign", form.campaign);
            fd.append("type", form.type);
            fd.append("startDate", new Date(form.startDate).toISOString());
            fd.append("endDate", new Date(form.endDate).toISOString());

            if (!isEdit) {
            fd.append("advertisingId", String(zoneId));
            }

            // ✅ HTML
            if (form.type === "HTML_JS") {
            if (!form.htmlCode?.trim()) {
                throw new Error("Le code HTML est requis");
            }
            fd.append("htmlCode", form.htmlCode);
            }

            // ✅ IMAGE
            if (form.type === "IMAGE_JPG") {
            if (!imageFile && !isEdit) {
                throw new Error("Veuillez sélectionner une image");
            }

            if (imageFile) {
                fd.append("image", imageFile); // ✅ FIX ICI
            }
            }

            if (isEdit) {
            await apiFetch(`/admin/advertising/banners/${banner.id}`, {
                method: "PATCH",
                body: fd,
            });
            } else {
            await apiFetch("/admin/advertising/banners", {
                method: "POST",
                body: fd,
            });
            }

            onToast("Succès", "success");
            onSaved();
            onClose();

        } catch (e) {
            onToast((e as Error).message, "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalOverlay onClose={onClose}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">
            {isEdit ? "Modifier la Bannière" : "Nouvelle Bannière"}
        </h2>
        <div className="space-y-4">
            <Field label="Annonceur">
            <input
                type="text"
                value={form.advertiser}
                onChange={(e) => handleChange("advertiser", e.target.value)}
                placeholder="Agence Voyage Plus"
                className={inputCls}
            />
            </Field>
            <Field label="Campagne">
            <input
                type="text"
                value={form.campaign}
                onChange={(e) => handleChange("campaign", e.target.value)}
                placeholder="Campagne Été 2025"
                className={inputCls}
            />
            </Field>
            <Field label="Type de bannière">
            <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value as BannerType)}
                className={inputCls}
            >
                <option value="IMAGE_JPG">Image JPG</option>
                <option value="HTML_JS">Code HTML/JS</option>
            </select>
            </Field>

            {form.type === "IMAGE_JPG" ? (
            <Field label="Image (JPG/PNG/WebP, max 5 MB)">
                <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                {imageFile ? (
                    <p className="text-sm text-gray-700 font-medium">{imageFile.name}</p>
                ) : banner?.imageUrl ? (
                    <p className="text-xs text-gray-500">Image actuelle — cliquez pour remplacer</p>
                ) : (
                    <p className="text-xs text-gray-400">Cliquez pour sélectionner une image</p>
                )}
                </div>
                <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
            </Field>
            ) : (
            <Field label="Code HTML/JS">
                <textarea
                value={form.htmlCode}
                onChange={(e) => handleChange("htmlCode", e.target.value)}
                rows={5}
                placeholder="<script>...</script>"
                className={`${inputCls} font-mono text-xs resize-none`}
                />
            </Field>
            )}

            <div className="grid grid-cols-2 gap-3">
            <Field label="Date de début">
                <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={inputCls}
                />
            </Field>
            <Field label="Date de fin">
                <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className={inputCls}
                />
            </Field>
            </div>
        </div>
        <ModalActions onClose={onClose} onSave={handleSubmit} saving={saving} label={isEdit ? "Enregistrer" : "Créer"} />
        </ModalOverlay>
    );
}

// ─── Modal: Confirm Delete ─────────────────────────────────────────────────────

function ConfirmModal({ title, message, onClose, onConfirm, }: { title: string; message: string; onClose: () => void; onConfirm: () => void; }) {
    const [loading, setLoading] = useState(false);
    async function handle() {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    }
    return (
        <ModalOverlay onClose={onClose}>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className={secondaryBtn}>Annuler</button>
            <button
            onClick={handle}
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
            {loading && <Spinner sm />}
            Supprimer
            </button>
        </div>
        </ModalOverlay>
    );
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

const inputCls = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 placeholder:text-gray-400";

const secondaryBtn = "text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
        {children}
        </div>
    );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {children}
        </div>
        </div>
    );
}

function ModalActions({ onClose, onSave, saving, label, }: { onClose: () => void; onSave: () => void; saving: boolean; label: string; }) {
    return (
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button onClick={onClose} className={secondaryBtn}>Annuler</button>
        <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
            {saving && <Spinner sm />}
            {label}
        </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdSpaceManager() {
    // ── Data ──
    const { data: zones, loading: zonesLoading, refetch: refetchZones } = useApi<AdZone[]>("/admin/advertising/zones");
    const [selectedZone, setSelectedZone] = useState<AdZone | null>(null);
    const { data: zoneBanners, loading: bannersLoading, refetch: refetchBanners } = useApi<Banner[]>(
        selectedZone ? `/admin/advertising/zones/${selectedZone.id}/banners` : null,
        [selectedZone?.id]
    );
    const { data: thirdParty, refetch: refetchThirdParty } = useApi<ThirdPartyCode>("/admin/advertising/third-party");

    // ── Third-party code local state ──
    const [thirdPartyCode, setThirdPartyCode] = useState("");
    const [savingThirdParty, setSavingThirdParty] = useState(false);

    useEffect(() => {
        if (thirdParty?.code) setThirdPartyCode(thirdParty.code);
    }, [thirdParty]);

    // Set default selected zone
    useEffect(() => {
        if (zones?.length && !selectedZone) setSelectedZone(zones[0]);
    }, [zones, selectedZone]);

    // ── Toast ──
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const showToast = useCallback((msg: string, type: "success" | "error") => setToast({ msg, type }), []);

    // ── Modals ──
    const [zoneModal, setZoneModal] = useState<{ open: boolean; zone?: AdZone | null }>({ open: false });
    const [bannerModal, setBannerModal] = useState<{ open: boolean; banner?: Banner | null }>({ open: false });
    const [confirmDelete, setConfirmDelete] = useState<{
        open: boolean;
        type: "zone" | "banner";
        id: number;
        name: string;
    } | null>(null);

    // ── Toggle zone enabled ──
    const [togglingId, setTogglingId] = useState<number | null>(null);
    async function toggleZone(zone: AdZone) {
        setTogglingId(zone.id);
        try {
        await apiFetch(`/admin/advertising/zones/${zone.id}/toggle`, { method: "PATCH" });
        await refetchZones();
        // keep selectedZone in sync
        if (selectedZone?.id === zone.id) {
            setSelectedZone((z) => z ? { ...z, isEnabled: !z.isEnabled } : z);
        }
        } catch (e) {
        showToast((e as Error).message, "error");
        } finally {
        setTogglingId(null);
        }
    }

    // ── Delete ──
    async function handleDelete() {
        if (!confirmDelete) return;
        try {
        if (confirmDelete.type === "zone") {
            await apiFetch(`/admin/advertising/zones/${confirmDelete.id}`, { method: "DELETE" });
            showToast("Zone supprimée", "success");
            if (selectedZone?.id === confirmDelete.id) setSelectedZone(null);
            await refetchZones();
        } else {
            await apiFetch(`/admin/advertising/banners/${confirmDelete.id}`, { method: "DELETE" });
            showToast("Bannière supprimée", "success");
            await refetchBanners();
        }
        } catch (e) {
        showToast((e as Error).message, "error");
        }
        setConfirmDelete(null);
    }

    // ── Refresh banner statuses ──
    async function refreshStatuses() {
        try {
        await apiFetch("/admin/advertising/banners/refresh-statuses", { method: "POST" });
        showToast("Statuts mis à jour", "success");
        await refetchBanners();
        } catch (e) {
        showToast((e as Error).message, "error");
        }
    }

    // ── Save third-party code ──
    async function saveThirdParty() {
        setSavingThirdParty(true);
        try {
        await apiFetch("/admin/advertising/third-party", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: thirdPartyCode }),
        });
        showToast("Codes tiers enregistrés", "success");
        await refetchThirdParty();
        } catch (e) {
        showToast((e as Error).message, "error");
        } finally {
        setSavingThirdParty(false);
        }
    }

    // ── Computed stats ──
    const enabledZones = zones?.filter((z) => z.isEnabled) ?? [];
    const globalFill =
        enabledZones.length > 0
        ? Math.round(enabledZones.reduce((acc, z) => acc + (z.fillRate ?? 0), 0) / enabledZones.length)
        : 0;
    const activeBanners = zones?.flatMap((z) => z.banners).filter((b) => b.status === "ACTIF").length ?? 0;

    // ─────────────────────────────────────────────────────────────────────────────

    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Gestion des Espaces Publicitaires
                </h1>
                <p className="text-lg text-gray-500 mt-1">
                    Définition des emplacements, attribution des bannières et suivi des performances
                </p>
                </div>
                <button
                onClick={() => setZoneModal({ open: true, zone: null })}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-lg font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Définir un Nouvel Emplacement
                </button>
            </div>

            {/* ── Global Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                { label: "Zones totales", value: zones?.length ?? "–", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
                { label: "Zones actives", value: enabledZones.length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Bannières actives", value: activeBanners, icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: "Remplissage global", value: `${globalFill}%`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                ].map(({ label, value, icon }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                    <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900">{value}</p>
                        <p className="text-lg text-gray-500">{label}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {/* ── Global Fill Rate Card ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
                <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Taux de Remplissage Global (Zones Actives)
                </p>
                <p className="text-4xl font-black text-gray-900">{globalFill}%</p>
                </div>
                <div className="relative flex items-center justify-center">
                <CircularProgress value={globalFill} />
                <span className="absolute text-sm font-bold text-orange-500">{globalFill}%</span>
                </div>
            </div>

            {/* ── Ad Zones Grid ── */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Inventaire des Zones d&apos;Affichage
                </h2>
                {zonesLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(zones ?? []).map((zone) => (
                    <div
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`bg-white rounded-xl border transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md ${
                        selectedZone?.id === zone.id
                            ? "border-orange-400 ring-2 ring-orange-100"
                            : "border-gray-200"
                        }`}
                    >
                        <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-bold text-gray-800 leading-tight">{zone.name}</h3>
                            <Toggle
                            enabled={zone.isEnabled}
                            loading={togglingId === zone.id}
                            onChange={() => toggleZone(zone)}
                            />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-base text-gray-500">
                            <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {zone.width} × {zone.height} pixels
                            </div>
                            <div className="flex items-center gap-1.5 text-base text-gray-500">
                            <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            </svg>
                            {zone.path}
                            </div>
                            <div className="flex items-center gap-1.5 text-base text-gray-500">
                            <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                            {zone.banners?.length ?? 0} bannière{(zone.banners?.length ?? 0) > 1 ? "s" : ""}
                            </div>
                        </div>
                        <FillRateBar value={zone.fillRate ?? 0} />
                        </div>

                        {/* Card Footer */}
                        <div className="border-t border-gray-100 px-4 py-2.5 flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setZoneModal({ open: true, zone }); }}
                            className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-md py-1.5 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                            Modifier
                        </button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete({ open: true, type: "zone", id: zone.id, name: zone.name });
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md py-1.5 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Supprimer
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedZone(zone); }}
                            className="flex-1 flex items-center justify-center gap-1.5 text-base font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md py-1.5 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Bannières
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </section>

            {/* ── Banners Table ── */}
            {selectedZone && (
                <section>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                    <h2 className="text-base font-bold text-gray-800">
                        Bannières —{" "}
                        <span className="text-orange-500">{selectedZone.name}</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {selectedZone.width} × {selectedZone.height} px · {selectedZone.path}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={refreshStatuses}
                        className="flex items-center gap-1.5 text-base font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                        title="Mettre à jour les statuts selon les dates"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualiser statuts
                    </button>
                    <button
                        onClick={() => setBannerModal({ open: true, banner: null })}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter une Bannière
                    </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {bannersLoading ? (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                    ) : (
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/70">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-14">Aperçu</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Annonceur / Campagne</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Période d&apos;Affichage</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {(zoneBanners ?? []).map((banner) => (
                            <tr key={banner.id} className="hover:bg-gray-50/60 transition-colors">
                            {/* Preview */}
                            <td className="px-4 py-3">
                                {banner.imageUrl ? (
                                <img src={banner.imageUrl} alt={banner.advertiser} className="w-10 h-10 rounded-lg object-cover border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                    </svg>
                                </div>
                                )}
                            </td>
                            {/* Advertiser */}
                            <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800">{banner.advertiser}</p>
                                <p className="text-xs text-gray-500">{banner.campaign}</p>
                            </td>
                            {/* Type */}
                            <td className="px-4 py-3">
                                <TypeBadge type={banner.type} />
                            </td>
                            {/* Period */}
                            <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                                {fmtDate(banner.startDate)} – {fmtDate(banner.endDate)}
                            </td>
                            {/* Status */}
                            <td className="px-4 py-3">
                                <StatusBadge status={banner.status} />
                            </td>
                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setBannerModal({ open: true, banner })}
                                    className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                                    title="Modifier"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() =>
                                    setConfirmDelete({
                                        open: true,
                                        type: "banner",
                                        id: banner.id,
                                        name: `${banner.advertiser} – ${banner.campaign}`,
                                    })
                                    }
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Supprimer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        {(zoneBanners ?? []).length === 0 && !bannersLoading && (
                            <tr>
                            <td colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-base text-gray-400">Aucune bannière pour cette zone</p>
                                <button
                                    onClick={() => setBannerModal({ open: true, banner: null })}
                                    className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    Ajouter la première bannière →
                                </button>
                                </div>
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    )}
                </div>
                </section>
            )}

            {/* ── Third-Party Codes ── */}
            <section>
                <h2 className="text-base font-bold text-gray-800 mb-4">
                Codes Tiers et Intégration
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">Codes de suivi et publicité externes</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                    Collez ici vos codes Google Ad Manager, codes de vérification ou autres scripts tiers.
                    </p>
                    {thirdParty?.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                        Dernière mise à jour : {fmtDate(thirdParty.updatedAt)}
                    </p>
                    )}
                </div>
                <div className="relative">
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <textarea
                    value={thirdPartyCode}
                    onChange={(e) => setThirdPartyCode(e.target.value)}
                    rows={8}
                    className="w-full bg-gray-900 text-green-400 font-mono text-xs rounded-lg border border-gray-700 px-4 pt-8 pb-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 leading-relaxed placeholder:text-gray-600"
                    placeholder={`<!-- Collez vos codes HTML/JavaScript ici -->`}
                    spellCheck={false}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button
                    onClick={saveThirdParty}
                    disabled={savingThirdParty}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-60"
                    >
                    {savingThirdParty ? (
                        <Spinner sm />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                        </svg>
                    )}
                    Enregistrer les Codes Tiers
                    </button>
                </div>
                </div>
            </section>

            </div>
        </div>

        {/* ── Modals ── */}
        {zoneModal.open && (
            <ZoneModal
            zone={zoneModal.zone}
            onClose={() => setZoneModal({ open: false })}
            onSaved={refetchZones}
            onToast={showToast}
            />
        )}

        {bannerModal.open && selectedZone && (
            <BannerModal
            banner={bannerModal.banner}
            zoneId={selectedZone.id}
            onClose={() => setBannerModal({ open: false })}
            onSaved={refetchBanners}
            onToast={showToast}
            />
        )}

        {confirmDelete?.open && (
            <ConfirmModal
            title={`Supprimer ${confirmDelete.type === "zone" ? "la zone" : "la bannière"}`}
            message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.name}" ? Cette action est irréversible.`}
            onClose={() => setConfirmDelete(null)}
            onConfirm={handleDelete}
            />
        )}

        {/* ── Toast ── */}
        {toast && (
            <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* ── Animation styles ── */}
        <style>{`
            @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.25s ease; }
        `}</style>
        </ProtectedRoute>
    );
}