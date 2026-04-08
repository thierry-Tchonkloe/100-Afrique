"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getToken } from "@/lib/auth";

// ── Config ──────────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ── Types ──────────────────────────────────────────────────────────────────────
type MediaType = "all" | "image" | "video" | "pdf";
type ViewMode = "grid" | "list";

interface ApiMedia {
    id: number;
    url: string;
    publicId: string;
    filename: string;
    altText: string | null;
    size: number;
    mimeType: string;
    createdAt: string;
}

interface MediaFile {
    id: string;
    name: string;
    type: "image" | "video" | "pdf";
    size: string;
    dimensions?: string;
    resolution?: string;
    thumbnail?: string;
    selected: boolean;
    raw: ApiMedia;
}

interface Pagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatSize(bytes: number): string {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
}

function mimeToType(mime: string): "image" | "video" | "pdf" {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime === "application/pdf") return "pdf";
    return "image";
}

function apiToMediaFile(m: ApiMedia): MediaFile {
    const type = mimeToType(m.mimeType);
    return {
        id: String(m.id),
        name: m.filename,
        type,
        size: formatSize(m.size),
        thumbnail: type === "image" ? m.url : undefined,
        selected: false,
        raw: m,
    };
}

// ── API calls ──────────────────────────────────────────────────────────────────
async function fetchMedia(page = 1, pageSize = 20): Promise<{ data: ApiMedia[]; pagination: Pagination }> {
    const res = await fetch(`${API_BASE}/admin/media?page=${page}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Erreur lors du chargement des médias");
    const json = await res.json();
    return { data: json.data, pagination: json.pagination };
}

async function deleteMedia(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
}

async function uploadMedia(file: File, altText: string): Promise<ApiMedia> {
    const formData = new FormData();
    formData.append("image", file);
    if (altText) formData.append("altText", altText);

    const res = await fetch(`${API_BASE}/admin/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Erreur lors de l'upload");
    }
    const json = await res.json();
    return json.data;
}

async function updateMedia(id: number, altText: string, filename: string): Promise<ApiMedia> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ altText, filename }),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    const json = await res.json();
    return json.data;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const GridIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ListIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

const InfoIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const PdfIcon = () => (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
        <rect width="48" height="56" rx="4" fill="#FEE2E2" />
        <rect x="8" y="28" width="32" height="5" rx="2" fill="#EF4444" opacity="0.8" />
        <text x="24" y="33" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif">PDF</text>
        <rect x="8" y="36" width="24" height="2.5" rx="1" fill="#EF4444" opacity="0.4" />
        <rect x="8" y="41" width="20" height="2.5" rx="1" fill="#EF4444" opacity="0.4" />
    </svg>
);

const VideoPlaceholderIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="4" fill="#EDE9FE" />
        <circle cx="24" cy="24" r="12" fill="#8B5CF6" opacity="0.2" />
        <polygon points="20 18 34 24 20 30" fill="#7C3AED" />
    </svg>
);

// ── Subcomponents ──────────────────────────────────────────────────────────────
function FilterSelect({ value, onChange, options }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-9 py-2.5 text-sm text-gray-700 font-medium cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
            >
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronIcon />
            </div>
        </div>
    );
}

function MediaCard({ file, onToggle, onDelete, onEdit }: {
    file: MediaFile;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (file: MediaFile) => void;
}) {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            className={`group relative rounded-xl overflow-hidden bg-white border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                file.selected ? "border-amber-400 shadow-md shadow-amber-100" : "border-gray-100 hover:border-gray-200"
            }`}
            onClick={() => onToggle(file.id)}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Thumbnail */}
            <div className="relative h-35 bg-gray-50 flex items-center justify-center overflow-hidden">
                {file.type === "pdf" ? (
                    <div className="flex flex-col items-center justify-center h-full"><PdfIcon /></div>
                ) : file.type === "video" ? (
                    <div className="flex items-center justify-center h-full"><VideoPlaceholderIcon /></div>
                ) : file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : null}

                {file.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <PlayIcon />
                        </div>
                    </div>
                )}

                {/* Checkbox */}
                <div
                    className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        file.selected ? "bg-amber-400 border-amber-400" : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => { e.stopPropagation(); onToggle(file.id); }}
                >
                    {file.selected && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>

                {/* Action buttons */}
                {showActions && (
                    <div className="absolute top-2 right-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(file)}
                            className="w-7 h-7 rounded-md bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 flex items-center justify-center shadow-sm transition-all"
                            title="Modifier"
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={() => onDelete(file.id)}
                            className="w-7 h-7 rounded-md bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 flex items-center justify-center shadow-sm transition-all"
                            title="Supprimer"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-gray-800 truncate leading-snug">{file.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                    {file.size}
                    {file.type === "pdf" && " • PDF"}
                    {file.type === "video" && " • Vidéo"}
                </p>
            </div>
        </div>
    );
}

function MediaListRow({ file, onToggle, onDelete, onEdit }: {
    file: MediaFile;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (file: MediaFile) => void;
}) {
    const typeColors: Record<string, string> = {
        image: "bg-blue-50 text-blue-600",
        video: "bg-purple-50 text-purple-600",
        pdf: "bg-red-50 text-red-600",
    };

    return (
        <div
            className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm group ${
                file.selected ? "border-amber-400 bg-amber-50/30" : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
            onClick={() => onToggle(file.id)}
        >
            <div className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${file.selected ? "bg-amber-400 border-amber-400" : "border-gray-300"}`}>
                {file.selected && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>

            <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {file.type === "pdf" ? (
                    <span className="text-red-500 text-xs font-bold">PDF</span>
                ) : file.type === "video" ? (
                    <span className="text-purple-500 text-sm">▶</span>
                ) : file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                ) : null}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size}</p>
            </div>

            <span className={`shrink-0 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${typeColors[file.type]}`}>
                {file.type}
            </span>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(file)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <EditIcon />
                </button>
                <button onClick={() => onDelete(file.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
}

// ── Upload Modal ───────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (media: ApiMedia) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [altText, setAltText] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "application/pdf"];
    const MAX_SIZE = 10 * 1024 * 1024;

    const handleFileSelect = (selected: File) => {
        setError(null);
        if (!ACCEPTED.includes(selected.type)) {
            setError("Format non supporté. Utilisez JPEG, PNG, GIF, WebP, MP4 ou PDF.");
            return;
        }
        if (selected.size > MAX_SIZE) {
            setError("Fichier trop volumineux. Maximum 10 MB.");
            return;
        }
        setFile(selected);
        if (selected.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(selected));
        } else {
            setPreview(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFileSelect(dropped);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const result = await uploadMedia(file, altText);
            onSuccess(result);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
        } finally {
            setLoading(false);
        }
    };

    const fileTypeLabel = file?.type.startsWith("image/") ? "Image" : file?.type === "video/mp4" ? "Vidéo" : file?.type === "application/pdf" ? "PDF" : "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Ajouter un média</h2>
                        <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, GIF, WebP, MP4, PDF · max 10 MB</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Drop zone */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl transition-all ${
                            isDragging ? "border-amber-400 bg-amber-50" : file ? "border-green-400 bg-green-50/40" : "border-gray-200 hover:border-amber-300 bg-gray-50 hover:bg-amber-50/20"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !file && fileInputRef.current?.click()}
                        style={{ cursor: file ? "default" : "pointer" }}
                    >
                        {file ? (
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                        {preview ? (
                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-gray-500 uppercase">{fileTypeLabel}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-400">{formatSize(file.size)} · {fileTypeLabel}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            Prêt à l'envoi
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setError(null); }}
                                        className="shrink-0 p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">
                                    {isDragging ? "Déposez ici" : "Glissez-déposez ou cliquez pour parcourir"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP, MP4, PDF — max 10 MB</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.pdf"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                    </div>

                    {/* Alt text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Texte alternatif <span className="text-gray-400 font-normal">(optionnel)</span>
                        </label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Ex : Coucher de soleil sur la plage de Cotonou..."
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">Améliore l'accessibilité et le référencement</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <UploadIcon />
                                Téléverser
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditModal({ file, onClose, onSuccess }: { file: MediaFile; onClose: () => void; onSuccess: (updated: ApiMedia) => void }) {
    const [altText, setAltText] = useState(file.raw.altText || "");
    const [filename, setFilename] = useState(file.raw.filename);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateMedia(file.raw.id, altText, filename);
            onSuccess(updated);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Modifier le média</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                        {file.type === "image" && file.thumbnail ? (
                            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                        ) : file.type === "pdf" ? (
                            <PdfIcon />
                        ) : (
                            <VideoPlaceholderIcon />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du fichier</label>
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Texte alternatif</label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Décrivez le contenu du fichier..."
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} disabled={loading} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all">
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !filename}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────────
function ConfirmDeleteModal({ file, onClose, onConfirm }: { file: MediaFile; onClose: () => void; onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="px-6 py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
                        <TrashIcon />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Supprimer ce média ?</h2>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">"{file.name}"</span> sera supprimé définitivement de Cloudinary et de la base de données. Cette action est irréversible.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-6 pb-6">
                    <button onClick={onClose} className="flex-1 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${
            type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
            {type === "success" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            )}
            {message}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MediaLibrary() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<MediaType>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [isDragging, setIsDragging] = useState(false);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
    const [deletingFile, setDeletingFile] = useState<MediaFile | null>(null);

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
    }, []);

    const loadMedia = useCallback(async (page = 1) => {
        setLoading(true);
        setFetchError(null);
        try {
            const { data, pagination: pag } = await fetchMedia(page, 20);
            setFiles(data.map(apiToMediaFile));
            setPagination(pag);
            setCurrentPage(page);
        } catch (err: unknown) {
            setFetchError(err instanceof Error ? err.message : "Erreur de chargement");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadMedia(1); }, [loadMedia]);

    const toggleSelect = (id: string) => {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, selected: !f.selected } : f));
    };

    const handleUploadSuccess = (media: ApiMedia) => {
        setFiles((prev) => [apiToMediaFile(media), ...prev]);
        showToast("Média ajouté avec succès !");
    };

    const handleEditSuccess = (updated: ApiMedia) => {
        setFiles((prev) => prev.map((f) => f.id === String(updated.id) ? apiToMediaFile(updated) : f));
        showToast("Média mis à jour !");
    };

    const handleDeleteConfirm = async () => {
        if (!deletingFile) return;
        try {
            await deleteMedia(deletingFile.raw.id);
            setFiles((prev) => prev.filter((f) => f.id !== deletingFile.id));
            showToast("Média supprimé");
        } catch {
            showToast("Erreur lors de la suppression", "error");
        } finally {
            setDeletingFile(null);
        }
    };

    const handleBulkDelete = async () => {
        const selected = files.filter((f) => f.selected);
        let success = 0;
        for (const f of selected) {
            try {
                await deleteMedia(f.raw.id);
                success++;
            } catch {
                showToast(`Impossible de supprimer ${f.name}`, "error");
            }
        }
        setFiles((prev) => prev.filter((f) => !f.selected));
        if (success > 0) showToast(`${success} média(s) supprimé(s)`);
    };

    const filtered = files.filter((f) => {
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || f.type === typeFilter;
        return matchSearch && matchType;
    });

    const selectedCount = files.filter((f) => f.selected).length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans" onDragEnter={() => setIsDragging(true)}>
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bibliothèque Médias</h1>
                        {selectedCount > 0 ? (
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm text-amber-600 font-medium">
                                    {selectedCount} fichier{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
                                </p>
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 bg-white px-3 py-1 rounded-lg transition-all"
                                >
                                    <TrashIcon />
                                    Supprimer la sélection
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 mt-0.5">
                                {loading ? "Chargement..." : pagination ? `${pagination.totalItems} fichier${pagination.totalItems !== 1 ? "s" : ""}` : ""}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all duration-150 hover:shadow-md"
                    >
                        <UploadIcon />
                        Télécharger des Fichiers
                    </button>
                </div>

                {/* Info banner */}
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 text-blue-700 text-sm px-4 py-3 rounded-xl mb-6">
                    <span className="shrink-0 text-blue-500"><InfoIcon /></span>
                    <span>
                        <span className="font-semibold">Formats supportés&nbsp;:</span> JPEG, PNG, GIF, WebP, MP4, PDF
                        &nbsp;•&nbsp;
                        <span className="font-semibold">Taille maximale&nbsp;:</span> 10 MB par fichier
                    </span>
                </div>

                {/* Drag & drop overlay */}
                {isDragging && (
                    <div
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); setShowUploadModal(true); }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-amber-500/10 backdrop-blur-sm"
                        style={{ border: "4px dashed #F59E0B", margin: "16px", borderRadius: "24px" }}
                    >
                        <div className="text-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                <UploadIcon />
                            </div>
                            <p className="text-amber-700 font-bold text-lg">Déposez vos fichiers ici</p>
                            <p className="text-amber-600 text-sm mt-1">Relâchez pour ouvrir l'upload</p>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-55 relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                            <input
                                type="text"
                                placeholder="Rechercher par nom, texte alternatif..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <FilterSelect
                            value={typeFilter}
                            onChange={(v) => setTypeFilter(v as MediaType)}
                            options={[
                                { value: "all", label: "Tous les types" },
                                { value: "image", label: "Images" },
                                { value: "video", label: "Vidéos" },
                                { value: "pdf", label: "PDF" },
                            ]}
                        />

                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg ml-auto">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-amber-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <GridIcon />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-amber-500 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <ListIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <svg className="animate-spin mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <p className="text-sm">Chargement des médias...</p>
                    </div>
                ) : fetchError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-medium mb-1">{fetchError}</p>
                        <p className="text-gray-400 text-sm mb-4">Vérifiez votre connexion et votre token d'authentification.</p>
                        <button onClick={() => loadMedia(1)} className="text-sm text-amber-600 hover:text-amber-700 font-semibold border border-amber-200 hover:border-amber-300 px-4 py-2 rounded-xl transition-all">
                            Réessayer
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg font-medium">Aucun fichier trouvé</p>
                        <p className="text-sm mt-1">Modifiez vos filtres ou ajoutez un nouveau média.</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filtered.map((file) => (
                            <MediaCard
                                key={file.id}
                                file={file}
                                onToggle={toggleSelect}
                                onDelete={(id) => setDeletingFile(files.find((f) => f.id === id)!)}
                                onEdit={setEditingFile}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.map((file) => (
                            <MediaListRow
                                key={file.id}
                                file={file}
                                onToggle={toggleSelect}
                                onDelete={(id) => setDeletingFile(files.find((f) => f.id === id)!)}
                                onEdit={setEditingFile}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && !loading && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => loadMedia(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Précédent
                        </button>
                        <span className="text-sm text-gray-500 px-3">
                            Page {currentPage} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => loadMedia(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Suivant →
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showUploadModal && (
                <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={handleUploadSuccess} />
            )}
            {editingFile && (
                <EditModal file={editingFile} onClose={() => setEditingFile(null)} onSuccess={handleEditSuccess} />
            )}
            {deletingFile && (
                <ConfirmDeleteModal file={deletingFile} onClose={() => setDeletingFile(null)} onConfirm={handleDeleteConfirm} />
            )}

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}