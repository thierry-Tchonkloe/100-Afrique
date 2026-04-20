// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//     Edit2, Eye, Trash2, Plus, Search, ChevronDown,
//     ChevronLeft, ChevronRight, AlertCircle, Loader2,
// } from "lucide-react";

// import NewVideoModal from "@/components/Dashboard/Newvideomodal";
// import VideoEdit from "@/components/Dashboard/VideoEdit";


// import { fetchAdminArticles, deleteArticle, Article, ArticleFilters, STATUS_API_TO_UI, STATUS_UI_TO_API,} from "@/services/Dashboard/articleservice";

// // ─── Config ───────────────────────────────────────────────────────────────────

// const ITEMS_PER_PAGE = 5;
// const STATUS_UI_LIST = ["Publié", "Brouillon", "En révision", "Archivé"];

// const STATUS_COLORS: Record<string, string> = {
//     Publié: "bg-green-50 text-green-700 border border-green-200",
//     Brouillon: "bg-amber-50 text-amber-700 border border-amber-200",
//     "En révision": "bg-orange-50 text-orange-700 border border-orange-200",
//     Archivé: "bg-slate-100 text-slate-500 border border-slate-200",
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function SelectDropdown({ value, options, onChange, placeholder }: {value: string; options: string[]; onChange: (v: string) => void; placeholder: string;}) {
//     return (
//         <div className="relative">
//             <select
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
//             >
//                 <option value="">{placeholder}</option>
//                 {options.map((o) => <option key={o} value={o}>{o}</option>)}
//             </select>
//             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//         </div>
//     );
// }

// function YoutubeThumb() {
//     return (
//         <div className="shrink-0 w-14 h-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
//         <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//         </svg>
//         </div>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function VideoTable() {
//     // ── Filters ──
//     const [search, setSearch] = useState("");
//     const [filterStatut, setFilterStatut] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     // ── Data ──
//     const [videos, setVideos] = useState<Article[]>([]);
//     const [pagination, setPagination] = useState({
//         totalItems: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // ── Modals ──
//     const [openCreate, setOpenCreate] = useState(false);
//     const [selectedEditVideo, setSelectedEditVideo] = useState<Article | null>(null);
//     const [deletingId, setDeletingId] = useState<number | null>(null);

//     // ── Fetch ──────────────────────────────────────────────────────────────────

//     const loadVideos = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//         const filters: ArticleFilters = {
//             type: "VIDEO",
//             page: currentPage,
//             pageSize: ITEMS_PER_PAGE,
//             ...(search.trim() ? { search: search.trim() } : {}),
//             ...(filterStatut ? { status: STATUS_UI_TO_API[filterStatut]} : {}),
//         };

//         const res = await fetchAdminArticles(filters);
//         setVideos(res.data);
//         setPagination({
//             totalItems: res.pagination.totalItems,
//             totalPages: res.pagination.totalPages,
//             hasNextPage: res.pagination.hasNextPage,
//             hasPrevPage: res.pagination.hasPrevPage,
//         });
//         } catch (err: unknown) {
//         setError((err as Error).message || "Erreur lors du chargement des vidéos");
//         } finally {
//         setLoading(false);
//         }
//     }, [currentPage, search, filterStatut]);

//     // Debounce search
//     useEffect(() => {
//         const timer = setTimeout(() => {
//         setCurrentPage(1);
//         loadVideos();
//         }, search ? 400 : 0);
//         return () => clearTimeout(timer);
//     }, [search, loadVideos]);

//     // Reload on page/filter change
//     useEffect(() => {
//         loadVideos();
//     }, [currentPage, filterStatut, loadVideos]);

//     // ── Delete ─────────────────────────────────────────────────────────────────

//     const handleDelete = async (id: number) => {
//         if (!confirm("Supprimer cette vidéo définitivement ?")) return;
//         setDeletingId(id);
//         try {
//         await deleteArticle(id);
//         const newTotal = pagination.totalItems - 1;
//         const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
//         if (currentPage > newTotalPages && newTotalPages > 0) {
//             setCurrentPage(newTotalPages);
//         } else {
//             await loadVideos();
//         }
//         } catch (err: unknown) {
//         alert((err as Error).message || "Impossible de supprimer la vidéo");
//         } finally {
//         setDeletingId(null);
//         }
//     };

//     const handleAfterSave = () => {
//         setOpenCreate(false);
//         setSelectedEditVideo(null);
//         loadVideos();
//     };

//     const getStatusUI = (status: string) =>
//         STATUS_API_TO_UI[status as keyof typeof STATUS_API_TO_UI] ?? status;

//     const formatDate = (iso: string) =>
//         new Date(iso).toLocaleDateString("fr-FR", {
//         day: "numeric", month: "short", year: "numeric",
//         });

//     // ── Render ─────────────────────────────────────────────────────────────────

//     return (
//         <>
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-50">
//             <div className="relative flex-1 min-w-50">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//                 type="text"
//                 placeholder="Rechercher par titre..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
//             />
//             </div>

//             <SelectDropdown
//             value={filterStatut}
//             options={STATUS_UI_LIST}
//             onChange={(v) => { setFilterStatut(v); setCurrentPage(1); }}
//             placeholder="Tous les statuts"
//             />

//             <button
//             onClick={() => setOpenCreate(true)}
//             className="ml-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-amber-200"
//             >
//             <Plus size={16} />
//             Créer une Nouvelle Vidéo
//             </button>

//             {openCreate && (
//             <NewVideoModal
//                 onClose={() => setOpenCreate(false)}
//                 onSubmit={handleAfterSave}
//             />
//             )}
//         </div>

//         {/* Error */}
//         {error && (
//             <div className="mx-6 my-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//             <AlertCircle size={16} className="shrink-0" />
//             {error}
//             <button onClick={loadVideos} className="ml-auto underline text-red-600 hover:text-red-800">
//                 Réessayer
//             </button>
//             </div>
//         )}

//         {/* Table */}
//         <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//             <thead>
//                 <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/60">
//                 <th className="text-left px-6 py-3">Titre</th>
//                 <th className="text-center px-4 py-3">Catégorie</th>
//                 <th className="text-center px-4 py-3">Auteur</th>
//                 <th className="text-center px-4 py-3">Modifié le</th>
//                 <th className="text-center px-4 py-3">Statut</th>
//                 <th className="text-center px-4 py-3">Actions</th>
//                 </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//                 {loading ? (
//                 <tr>
//                     <td colSpan={6} className="text-center py-16">
//                     <Loader2 size={22} className="animate-spin text-amber-400 mx-auto mb-2" />
//                     <p className="text-slate-400 text-sm">Chargement des vidéos...</p>
//                     </td>
//                 </tr>
//                 ) : videos.length === 0 ? (
//                 <tr>
//                     <td colSpan={6} className="text-center py-12 text-slate-400">
//                     Aucune vidéo trouvée.
//                     </td>
//                 </tr>
//                 ) : (
//                 videos.map((video) => {
//                     const statusUI = getStatusUI(video.status);
//                     return (
//                     <tr
//                         key={video.id}
//                         className={`group hover:bg-slate-50/80 transition-all duration-200 ${
//                         deletingId === video.id ? "opacity-0 scale-95" : "opacity-100"
//                         }`}
//                     >
//                         <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
//                         <div className="flex items-center gap-3">
//                             <YoutubeThumb />
//                             <div>
//                             <span className="line-clamp-1">{video.title}</span>
//                             <span className="block text-xs text-slate-400 font-normal font-mono mt-0.5 truncate">
//                                 /{video.slug}
//                             </span>
//                             </div>
//                         </div>
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                         <span
//                             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
//                             style={{
//                             backgroundColor: `${video.category.color}15`,
//                             color: video.category.color,
//                             borderColor: `${video.category.color}40`,
//                             }}
//                         >
//                             {video.category.name}
//                         </span>
//                         </td>
//                         <td className="px-4 py-4 text-center text-slate-600">{video.author.name}</td>
//                         <td className="px-4 py-4 text-center text-slate-500">{formatDate(video.updatedAt)}</td>
//                         <td className="px-4 py-4 text-center">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[statusUI] ?? "bg-slate-100 text-slate-500"}`}>
//                             {statusUI}
//                         </span>
//                         </td>
//                         <td className="px-4 py-4">
//                         <div className="flex items-center justify-center gap-1">
//                             <button
//                             onClick={() => setSelectedEditVideo(video)}
//                             className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
//                             title="Modifier"
//                             >
//                             <Edit2 size={15} />
//                             </button>
//                             <button
//                             className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
//                             title="Prévisualiser"
//                             >
//                             <Eye size={15} />
//                             </button>
//                             <button
//                             onClick={() => handleDelete(video.id)}
//                             disabled={deletingId === video.id}
//                             className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
//                             title="Supprimer"
//                             >
//                             {deletingId === video.id
//                                 ? <Loader2 size={15} className="animate-spin" />
//                                 : <Trash2 size={15} />
//                             }
//                             </button>
//                         </div>
//                         </td>
//                     </tr>
//                     );
//                 })
//                 )}
//             </tbody>
//             </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
//             <p className="text-sm text-slate-500">
//             Affichage de{" "}
//             <span className="font-medium text-slate-700">
//                 {pagination.totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
//             </span>{" "}
//             à{" "}
//             <span className="font-medium text-slate-700">
//                 {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)}
//             </span>{" "}
//             sur{" "}
//             <span className="font-medium text-slate-700">{pagination.totalItems}</span>{" "}
//             résultats
//             </p>

//             <div className="flex items-center gap-1">
//             <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={!pagination.hasPrevPage || loading}
//                 className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//                 <ChevronLeft size={14} /> Précédent
//             </button>

//             {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
//                     currentPage === page
//                     ? "bg-amber-500 text-white shadow-sm"
//                     : "border border-slate-200 text-slate-600 hover:bg-slate-50"
//                 }`}
//                 >
//                 {page}
//                 </button>
//             ))}

//             <button
//                 onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
//                 disabled={!pagination.hasNextPage || loading}
//                 className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//                 Suivant <ChevronRight size={14} />
//             </button>
//             </div>
//         </div>

//         {/* Edit Modal */}
//         <VideoEdit
//             isOpen={!!selectedEditVideo}
//             ///video={selectedEditVideo}
//             onClose={() => setSelectedEditVideo(null)}
//             //onSubmit={handleAfterSave}
//         />
//         </>
//     );
// }




// src/components/Dashboard/VideoTable.tsx
"use client";

import { useState } from "react";
import { Edit2, Eye, Trash2, Plus, Search, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Loader2,} from "lucide-react";

import NewVideoModal from "@/components/Dashboard/Newvideomodal";
import VideoEdit from "@/components/Dashboard/VideoEdit";
import { useContentList } from "@/hooks/useContentList";
import { STATUS_API_TO_UI } from "@/services/Dashboard/video.service";
import { Article } from "@/services/Dashboard/articleservice";

// ─── Config ───────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;
const STATUS_UI_LIST = ["Publié", "Brouillon", "En révision", "Archivé"];

const STATUS_COLORS: Record<string, string> = {
    Publié:      "bg-green-50 text-green-700 border border-green-200",
    Brouillon:   "bg-amber-50 text-amber-700 border border-amber-200",
    "En révision": "bg-orange-50 text-orange-700 border border-orange-200",
    Archivé:     "bg-slate-100 text-slate-500 border border-slate-200",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectDropdown({value, options, onChange, placeholder,}: {value: string; options: string[]; onChange: (v: string) => void; placeholder: string; }) {
    return (
        <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
        >
            <option value="">{placeholder}</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        </div>
    );
}

function YoutubeThumb() {
    return (
        <div className="shrink-0 w-14 h-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        </div>
    );
}

function CategoryBadge({ category }: { category: Article["category"] }) {
    return (
        <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
        style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
            borderColor: `${category.color}40`,
        }}
        >
        {category.name}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VideoTable() {
    const {
        items: videos,
        pagination,
        loading,
        error,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        currentPage,
        setCurrentPage,
        deletingId,
        handleDelete,
        reload,
    } = useContentList({ type: "VIDEO", itemsPerPage: ITEMS_PER_PAGE });

    const [openCreate, setOpenCreate]               = useState(false);
    const [selectedEditVideo, setSelectedEditVideo] = useState<Article | null>(null);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const getStatusUI = (status: string) =>
        STATUS_API_TO_UI[status as keyof typeof STATUS_API_TO_UI] ?? status;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric", month: "short", year: "numeric",
        });

    const onDelete = (id: number) => {
        handleDelete(id, () => confirm("Supprimer cette vidéo définitivement ?")).catch(
        (err: Error) => alert(err.message)
        );
    };

    const handleAfterSave = () => {
        setOpenCreate(false);
        setSelectedEditVideo(null);
        reload();
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-50">
            <div className="relative flex-1 min-w-50">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                placeholder="Rechercher par titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            </div>

            <SelectDropdown
            value={filterStatus}
            options={STATUS_UI_LIST}
            onChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}
            placeholder="Tous les statuts"
            />

            <button
            onClick={() => setOpenCreate(true)}
            className="ml-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-amber-200"
            >
            <Plus size={16} />
            Créer une Nouvelle Vidéo
            </button>

            <NewVideoModal
            isOpen={openCreate}
            onClose={() => setOpenCreate(false)}
            onSuccess={(article) => {
                setOpenCreate(false);
                setSelectedEditVideo(article);
            }}
            />
        </div>

        {/* Error */}
        {error && (
            <div className="mx-6 my-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {error}
            <button onClick={reload} className="ml-auto underline text-red-600 hover:text-red-800">
                Réessayer
            </button>
            </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                <th className="text-left px-6 py-3">Titre</th>
                <th className="text-center px-4 py-3">Catégorie</th>
                <th className="text-center px-4 py-3">Auteur</th>
                <th className="text-center px-4 py-3">Modifié le</th>
                <th className="text-center px-4 py-3">Statut</th>
                <th className="text-center px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {loading ? (
                <tr>
                    <td colSpan={6} className="text-center py-16">
                    <Loader2 size={22} className="animate-spin text-amber-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Chargement des vidéos...</p>
                    </td>
                </tr>
                ) : videos.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                    Aucune vidéo trouvée.
                    </td>
                </tr>
                ) : (
                videos.map((video) => {
                    const statusUI = getStatusUI(video.status);
                    return (
                    <tr
                        key={video.id}
                        className={`group hover:bg-slate-50/80 transition-all duration-200 ${
                        deletingId === video.id ? "opacity-0 scale-95" : "opacity-100"
                        }`}
                    >
                        <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
                        <div className="flex items-center gap-3">
                            <YoutubeThumb />
                            <div>
                            <span className="line-clamp-1">{video.title}</span>
                            <span className="block text-xs text-slate-400 font-normal font-mono mt-0.5 truncate">
                                /{video.slug}
                            </span>
                            </div>
                        </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                        <CategoryBadge category={video.category} />
                        </td>
                        <td className="px-4 py-4 text-center text-slate-600">
                        {video.author.name}
                        </td>
                        <td className="px-4 py-4 text-center text-slate-500">
                        {formatDate(video.updatedAt)}
                        </td>
                        <td className="px-4 py-4 text-center">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[statusUI] ?? "bg-slate-100 text-slate-500"
                            }`}
                        >
                            {statusUI}
                        </span>
                        </td>
                        <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                            <button
                            onClick={() => setSelectedEditVideo(video)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Modifier"
                            >
                            <Edit2 size={15} />
                            </button>
                            <button
                            className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Prévisualiser"
                            >
                            <Eye size={15} />
                            </button>
                            <button
                            onClick={() => onDelete(video.id)}
                            disabled={deletingId === video.id}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Supprimer"
                            >
                            {deletingId === video.id
                                ? <Loader2 size={15} className="animate-spin" />
                                : <Trash2 size={15} />
                            }
                            </button>
                        </div>
                        </td>
                    </tr>
                    );
                })
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
            <p className="text-sm text-slate-500">
            Affichage de{" "}
            <span className="font-medium text-slate-700">
                {pagination.totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium text-slate-700">
                {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)}
            </span>{" "}
            sur{" "}
            <span className="font-medium text-slate-700">{pagination.totalItems}</span>{" "}
            résultats
            </p>

            <div className="flex items-center gap-1">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPrevPage || loading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={14} /> Précédent
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                    currentPage === page
                    ? "bg-amber-500 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                >
                {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={!pagination.hasNextPage || loading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Suivant <ChevronRight size={14} />
            </button>
            </div>
        </div>

        {/* Edit Modal */}
        <VideoEdit
            isOpen={!!selectedEditVideo}
            video={selectedEditVideo}
            onClose={() => setSelectedEditVideo(null)}
            onSubmit={handleAfterSave}
        />
        </>
    );
}