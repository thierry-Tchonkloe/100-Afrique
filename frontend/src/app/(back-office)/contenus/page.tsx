"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Edit2, Eye, Trash2, Plus, Search, ChevronDown,
  FileText, Video, Globe, Sofa, MapPin, ChevronLeft, ChevronRight,
  AlertCircle, Loader2,
} from "lucide-react";

import NewArticleModal from "@/components/Dashboard/Newarticlemodal";
import ArticleEditor from "@/components/Dashboard/ArticleEditor";
import VideoTable from "@/components/Dashboard/VideoTable";
import StaticPage from "@/components/Dashboard/StaticPage";
import Salon from "@/components/Dashboard/Salon";
import Destination from "@/components/Dashboard/Destination";

import {
  fetchAdminArticles,
  deleteArticle,
  Article,
  ArticleFilters,
  STATUS_API_TO_UI,
  STATUS_UI_TO_API,
  ArticleStatus,
} from "@/services/Dashboard/articleservice";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "Articles" | "Vidéos" | "Pages Statiques" | "Salons" | "Destinations";

// ─── Config ───────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; icon: React.ElementType }[] = [
  { key: "Articles", icon: FileText },
  { key: "Vidéos", icon: Video },
  { key: "Pages Statiques", icon: Globe },
  { key: "Salons", icon: Sofa },
  { key: "Destinations", icon: MapPin },
];

const STATUS_UI_LIST = ["Publié", "Brouillon", "En révision", "Archivé"];

const STATUS_COLORS: Record<string, string> = {
  Publié: "bg-green-50 text-green-700 border border-green-200",
  Brouillon: "bg-amber-50 text-amber-700 border border-amber-200",
  "En révision": "bg-orange-50 text-orange-700 border border-orange-200",
  Archivé: "bg-slate-100 text-slate-500 border border-slate-200",
};

const ITEMS_PER_PAGE = 5;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
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

function SelectDropdown({
  value, options, onChange, placeholder,
}: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder: string;
}) {
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
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GestionDesContenusArticle() {

  const isFetchingRef = useRef(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Articles");

  // ── Filters (controlled, not applied until search debounce) ──
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Data ──
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Modals ──
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const loadArticles = useCallback(async () => {
    if (isFetchingRef.current) return; // 🚫 bloque les appels multiples
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      // const STATUS_UI_TO_API_MAP: Record<string, string> = {
      //   Publié: "PUBLISHED",
      //   Brouillon: "DRAFT",
      //   "En révision": "REVIEW",
      //   Archivé: "ARCHIVED",
      // };

      const filters: ArticleFilters = {
        type: "ARTICLE",
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(filterStatut ? { status: STATUS_UI_TO_API[filterStatut] as ArticleStatus } : {}),
      };

      const res = await fetchAdminArticles(filters);
      setArticles(res.data);
      // setPagination({
      //   totalItems: res.pagination.totalItems,
      //   totalPages: res.pagination.totalPages,
      //   hasNextPage: res.pagination.hasNextPage,
      //   hasPrevPage: res.pagination.hasPrevPage,
      // });
      setPagination(res.pagination);
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, search, filterStatut]);

  // Debounce search
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCurrentPage(1);
  //     loadArticles();
  //   }, search ? 400 : 0);
  //   return () => clearTimeout(timer);
  // }, [search, loadArticles]);

  // // Reload when page or filter changes
  // useEffect(() => {
  //   loadArticles();
  // }, [currentPage, filterStatut, loadArticles]);

  useEffect(() => {
  const delay = setTimeout(() => {
    loadArticles();
  }, search ? 400 : 0); // debounce recherche

  return () => clearTimeout(delay);
}, [search, loadArticles]);

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      // Reload current page (or go back if last item on page)
      const newTotal = pagination.totalItems - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else {
        await loadArticles();
      }
    } catch (err: unknown) {
      alert((err as Error).message || "Impossible de supprimer l'article");
    } finally {
      setDeletingId(null);
    }
  };

  // ── After create / edit ────────────────────────────────────────────────────

  const handleAfterSave = () => {
    setOpenCreate(false);
    setSelectedArticle(null);
    loadArticles();
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusUI = (status: string) =>
    STATUS_API_TO_UI[status as keyof typeof STATUS_API_TO_UI] ?? status;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ── Render ─────────────────────────────────────────────────────────────────


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Contenus</h1>
          <p className="mt-1 text-slate-500 text-sm">Vue d&aposensemble et accès rapide aux archives</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Tabs */}
          <div className="border-b border-slate-100 px-6">
            <nav className="flex gap-1 -mb-px">
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === key
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                  }`}
                >
                  <Icon size={15} />
                  {key}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Articles Tab ── */}
          {activeTab === "Articles" && (
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
                  value={filterStatut}
                  options={STATUS_UI_LIST}
                  onChange={(v) => { setFilterStatut(v); setCurrentPage(1); }}
                  placeholder="Tous les statuts"
                />

                <button
                  onClick={() => setOpenCreate(true)}
                  className="ml-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-amber-200"
                >
                  <Plus size={16} />
                  Créer un Nouvel Article
                </button>

                {/* <NewArticleModal
                  isOpen={openCreate}
                  onClose={() => setOpenCreate(false)}
                  //onSubmit={handleAfterSave}
                  onSuccess={(article) => setSelectedArticle(article)}
                /> */}

                <NewArticleModal
                  isOpen={openCreate}
                  onClose={() => setOpenCreate(false)}
                  onSuccess={(article) => {
                    setOpenCreate(false);      // ferme modal
                    setSelectedArticle(article); // ouvre editor
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mx-6 my-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                  <button
                    onClick={loadArticles}
                    className="ml-auto underline text-red-600 hover:text-red-800"
                  >
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
                      <th className="text-center px-4 py-3">Vues</th>
                      <th className="text-center px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16">
                          <Loader2 size={22} className="animate-spin text-amber-400 mx-auto mb-2" />
                          <p className="text-slate-400 text-sm">Chargement des articles...</p>
                        </td>
                      </tr>
                    ) : articles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          Aucun résultat trouvé.
                        </td>
                      </tr>
                    ) : (
                      articles.map((article) => {
                        const statusUI = getStatusUI(article.status);
                        return (
                          <tr
                            key={article.id}
                            className={`group hover:bg-slate-50/80 transition-all duration-200 ${
                              deletingId === article.id ? "opacity-0 scale-95" : "opacity-100"
                            }`}
                          >
                            <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
                              <span className="line-clamp-1">{article.title}</span>
                              <span className="block text-xs text-slate-400 font-normal font-mono mt-0.5 truncate">
                                /{article.slug}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <CategoryBadge category={article.category} />
                            </td>
                            <td className="px-4 py-4 text-center text-slate-600">{article.author.name}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{formatDate(article.updatedAt)}</td>
                            <td className="px-4 py-4 text-center">
                              <Badge
                                label={statusUI}
                                colorClass={STATUS_COLORS[statusUI] ?? "bg-slate-100 text-slate-500"}
                              />
                            </td>
                            <td className="px-4 py-4 text-center text-slate-500 tabular-nums">{article.views}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setSelectedArticle(article)}
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
                                  onClick={() => handleDelete(article.id)}
                                  disabled={deletingId === article.id}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  title="Supprimer"
                                >
                                  {deletingId === article.id
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={!pagination.hasNextPage || loading}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Vidéos" && <VideoTable />}
          {activeTab === "Pages Statiques" && <StaticPage />}
          {activeTab === "Salons" && <Salon />}
          {activeTab === "Destinations" && <Destination />}

        </div>

        {/* Article Editor Modal */}
        <ArticleEditor
          isOpen={!!selectedArticle}
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSubmit={handleAfterSave}
        />

      </div>
    </div>
  );
}