// src/components/Dashboard/Destination.tsx
"use client";

import { useState } from "react";
import {
  Edit2, Eye, Trash2, Plus, Search, ChevronDown,
  ChevronLeft, ChevronRight, AlertCircle, Loader2, MapPin,
} from "lucide-react";

import CreateDestinationModal from "@/components/Dashboard/Newdestinationmodal";
import DestinationEdit from "@/components/Dashboard/DestinationEdit";
import { useContentList } from "@/hooks/useContentList";
import { STATUS_API_TO_UI } from "@/services/Dashboard/destinationservice";
import { Article } from "@/services/Dashboard/articleservice";

// ─── Config ───────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;
const STATUS_UI_LIST = ["Publié", "Brouillon", "En révision", "Archivé"];

const STATUS_COLORS: Record<string, string> = {
  Publié:        "bg-green-50 text-green-700 border border-green-200",
  Brouillon:     "bg-amber-50 text-amber-700 border border-amber-200",
  "En révision": "bg-orange-50 text-orange-700 border border-orange-200",
  Archivé:       "bg-slate-100 text-slate-500 border border-slate-200",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function DeleteModal({
  item, onConfirm, onCancel,
}: { item: Article; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Supprimer la destination
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-medium text-gray-700">{item.title}</span> ?
          Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
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

export default function Destination() {
  const {
    items: destinations,
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
  } = useContentList({ type: "DESTINATION", itemsPerPage: ITEMS_PER_PAGE });

  const [openCreate, setOpenCreate]         = useState(false);
  const [editingDest, setEditingDest]       = useState<Article | null>(null);
  const [toDelete, setToDelete]             = useState<Article | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusUI = (status: string) =>
    STATUS_API_TO_UI[status as keyof typeof STATUS_API_TO_UI] ?? status;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    });

  const confirmDelete = () => {
    if (!toDelete) return;
    const target = toDelete;
    setToDelete(null);
    handleDelete(target.id).catch((err: Error) => alert(err.message));
  };

  const handleAfterSave = () => {
    setOpenCreate(false);
    setEditingDest(null);
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
          Créer une Nouvelle Destination
        </button>

        <CreateDestinationModal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={(article) => {
            setOpenCreate(false);
            setEditingDest(article);
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
              <th className="text-left px-6 py-3">Destination</th>
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
                  <p className="text-slate-400 text-sm">Chargement des destinations...</p>
                </td>
              </tr>
            ) : destinations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  Aucune destination trouvée.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => {
                const statusUI = getStatusUI(dest.status);
                return (
                  <tr
                    key={dest.id}
                    className={`group hover:bg-slate-50/80 transition-all duration-200 ${
                      deletingId === dest.id ? "opacity-0 scale-95" : "opacity-100"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">
                      <div className="flex items-center gap-3">
                        {dest.coverImage ? (
                          <img
                            src={dest.coverImage}
                            alt={dest.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <MapPin size={18} className="text-orange-400" />
                          </div>
                        )}
                        <div>
                          <span className="line-clamp-1">{dest.title}</span>
                          <span className="block text-xs text-slate-400 font-normal font-mono mt-0.5 truncate">
                            /{dest.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CategoryBadge category={dest.category} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {dest.author.name.charAt(0)}
                        </div>
                        <span className="text-slate-600">{dest.author.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500">
                      {formatDate(dest.updatedAt)}
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
                          onClick={() => setEditingDest(dest)}
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
                          onClick={() => setToDelete(dest)}
                          disabled={deletingId === dest.id}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === dest.id
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

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                currentPage === p
                  ? "bg-amber-500 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
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

      {/* Delete Confirm Modal */}
      {toDelete && (
        <DeleteModal
          item={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {/* Edit Modal */}
      <DestinationEdit
        isOpen={!!editingDest}
        destination={editingDest}
        onClose={() => setEditingDest(null)}
        onSubmit={handleAfterSave}
      />
    </>
  );
}