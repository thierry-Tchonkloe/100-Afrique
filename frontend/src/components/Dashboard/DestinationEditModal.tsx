// "use client";

// import React, { useState, useRef, useCallback } from "react";
// import { X, Eye, Save, Upload, Plus, Image as ImageIcon, Globe, Info, FileText, Trash2, GripVertical, } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface GalleryImage {
//     id: string;
//     url: string;
//     file?: File;
// }

// type TabId = "general" | "media" | "pratique";

// interface Tab {
//     id: TabId;
//     label: string;
//     icon: React.ReactNode;
// }

// // ─── Subcomponents ────────────────────────────────────────────────────────────

// const CoverUploadZone = ({ coverImage, onFileChange, }: { coverImage: string | null; onFileChange: (file: File) => void; }) => {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const [isDragging, setIsDragging] = useState(false);

//     const handleDrop = useCallback(
//         (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const file = e.dataTransfer.files[0];
//         if (file && file.type.startsWith("image/")) onFileChange(file);
//         },
//         [onFileChange]
//     );

//     return (
//         <div className="space-y-3">
//         <label className="block text-sm font-semibold text-slate-700 tracking-wide">
//             Image Principale (Header)
//         </label>

//         <div
//             className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
//             isDragging
//                 ? "border-orange-400 bg-orange-50 scale-[1.01]"
//                 : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/40"
//             }`}
//             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//         >
//             {/* Preview */}
//             <div className="w-full h-52 relative">
//             {coverImage ? (
//                 <img
//                 src={coverImage}
//                 alt="Cover preview"
//                 className="w-full h-full object-cover"
//                 />
//             ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
//                 <ImageIcon size={40} strokeWidth={1.2} />
//                 <p className="text-sm font-medium">Glissez une image ici</p>
//                 <p className="text-xs text-slate-300">ou cliquez pour parcourir</p>
//                 </div>
//             )}

//             {/* Gradient overlay on image */}
//             {coverImage && (
//                 <div className="absolute inset-0 bg-lineair-to-t from-black/30 via-transparent to-transparent" />
//             )}
//             </div>

//             {/* Upload button */}
//             <div className="flex flex-col items-center gap-1.5 py-4 bg-white/80 backdrop-blur-sm border-t border-slate-100">
//             <button
//                 type="button"
//                 onClick={() => inputRef.current?.click()}
//                 className="inline-flex items-center gap-2 px-5 py-2.5 bg-lineair-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-200 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-all duration-150"
//             >
//                 <Upload size={15} />
//                 Ajouter / Remplacer l'Image de Couverture
//             </button>
//             <p className="text-xs text-slate-400">
//                 Format recommandé&nbsp;: 1920×800px, JPG ou PNG
//             </p>
//             </div>

//             <input
//             ref={inputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) onFileChange(file);
//             }}
//             />
//         </div>
//         </div>
//     );
// };

// const GalleryGrid = ({ images, onAdd, onRemove, }: { images: GalleryImage[]; onAdd: (file: File) => void; onRemove: (id: string) => void; }) => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     return (
//         <div className="space-y-3">
//         <label className="block text-sm font-semibold text-slate-700 tracking-wide">
//             Galerie d'Images
//         </label>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {images.map((img) => (
//             <div
//                 key={img.id}
//                 className="group relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm hover:shadow-md transition-all"
//             >
//                 <img
//                 src={img.url}
//                 alt=""
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
//                 <button
//                     type="button"
//                     onClick={() => onRemove(img.id)}
//                     className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-150 scale-90 group-hover:scale-100"
//                 >
//                     <Trash2 size={13} />
//                 </button>
//                 </div>

//                 {/* Drag handle */}
//                 <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-60 text-white transition-opacity cursor-grab">
//                 <GripVertical size={14} />
//                 </div>
//             </div>
//             ))}

//             {/* Add button */}
//             <button
//             type="button"
//             onClick={() => inputRef.current?.click()}
//             className="aspect-4/3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-orange-500 transition-all duration-200 group"
//             >
//             <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
//                 <Plus size={16} />
//             </div>
//             <span className="text-xs font-medium">Ajouter</span>
//             </button>
//         </div>

//         <input
//             ref={inputRef}
//             type="file"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={(e) => {
//             Array.from(e.target.files ?? []).forEach((file) => onAdd(file));
//             e.target.value = "";
//             }}
//         />
//         </div>
//     );
// };

// // ─── Main Modal ───────────────────────────────────────────────────────────────

// interface DestinationEditModalProps {
//     destinationName?: string;
//     isOpen: boolean;
//     onClose: () => void;
//     onPreview?: () => void;
//     onSaveDraft?: () => void;
//     onPublish?: () => void;
// }

// const TABS: Tab[] = [
//     { id: "general", label: "Général & Description", icon: <FileText size={14} /> },
//     { id: "media", label: "Médias & SEO", icon: <Globe size={14} /> },
//     { id: "pratique", label: "Informations Pratiques", icon: <Info size={14} /> },
// ];

// // ─── Sample gallery images (replace with real data) ───────────────────────────
// const INITIAL_GALLERY: GalleryImage[] = [
//     { id: "1", url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80" },
//     { id: "2", url: "https://images.unsplash.com/photo-1580746738099-89d06b82ea1b?w=400&q=80" },
//     { id: "3", url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400&q=80" },
// ];

// export default function DestinationEditModal({ destinationName = "Sénégal", isOpen, onClose, onPreview, onSaveDraft, onPublish, }: DestinationEditModalProps) {
//     const [activeTab, setActiveTab] = useState<TabId>("media");
//     const [coverImage, setCoverImage] = useState<string | null>(
//         "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80"
//     );
//     const [gallery, setGallery] = useState<GalleryImage[]>(INITIAL_GALLERY);
//     const [isSaving, setIsSaving] = useState(false);

//     const handleCoverChange = (file: File) => {
//         const url = URL.createObjectURL(file);
//         setCoverImage(url);
//     };

//     const handleGalleryAdd = (file: File) => {
//         const url = URL.createObjectURL(file);
//         setGallery((prev) => [...prev, { id: crypto.randomUUID(), url, file }]);
//     };

//     const handleGalleryRemove = (id: string) => {
//         setGallery((prev) => prev.filter((img) => img.id !== id));
//     };

//     const handlePublish = async () => {
//         setIsSaving(true);
//         await new Promise((r) => setTimeout(r, 1200));
//         setIsSaving(false);
//         onPublish?.();
//     };

//     if (!isOpen) return null;

//     return (
//         // ── Backdrop ──────────────────────────────────────────────────────────────
//         <div
//         className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//         >
//         {/* ── Panel ─────────────────────────────────────────────────────────── */}
//         <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">

//             {/* ── Header ──────────────────────────────────────────────────────── */}
//             <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
//             <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                 Édition de la Fiche Destination&nbsp;:&nbsp;
//                 <span className="text-orange-500">{destinationName}</span>
//                 </h2>
//                 <p className="mt-0.5 text-xs text-slate-400 font-medium">
//                 Gérez tous les détails de votre destination touristique
//                 </p>
//             </div>
//             <button
//                 type="button"
//                 onClick={onClose}
//                 className="ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
//             >
//                 <X size={18} />
//             </button>
//             </div>

//             {/* ── Tabs ────────────────────────────────────────────────────────── */}
//             <div className="flex gap-1 px-6 pt-3 border-b border-slate-100 shrink-0 bg-white">
//             {TABS.map((tab) => (
//                 <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all duration-150 -mb-px ${
//                     activeTab === tab.id
//                     ? "border-orange-500 text-orange-600 bg-orange-50/60"
//                     : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
//                 }`}
//                 >
//                 {tab.icon}
//                 {tab.label}
//                 </button>
//             ))}
//             </div>

//             {/* ── Body ────────────────────────────────────────────────────────── */}
//             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
//             {activeTab === "media" && (
//                 <>
//                 <section>
//                     <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
//                     <span className="w-1 h-4 rounded-full bg-orange-500 inline-block" />
//                     Média à la Une
//                     </h3>
//                     <CoverUploadZone
//                     coverImage={coverImage}
//                     onFileChange={handleCoverChange}
//                     />
//                 </section>

//                 <div className="border-t border-slate-100" />

//                 <section>
//                     <GalleryGrid
//                     images={gallery}
//                     onAdd={handleGalleryAdd}
//                     onRemove={handleGalleryRemove}
//                     />
//                 </section>
//                 </>
//             )}

//             {activeTab === "general" && (
//                 <div className="flex items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium">
//                 Contenu — Général &amp; Description (à implémenter)
//                 </div>
//             )}

//             {activeTab === "pratique" && (
//                 <div className="flex items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium">
//                 Contenu — Informations Pratiques (à implémenter)
//                 </div>
//             )}
//             </div>

//             {/* ── Footer ──────────────────────────────────────────────────────── */}
//             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
//             <button
//                 type="button"
//                 onClick={onClose}
//                 className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
//             >
//                 <X size={14} />
//                 Fermer la Modale
//             </button>

//             <div className="flex items-center gap-2.5">
//                 <button
//                 type="button"
//                 onClick={onPreview}
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
//                 >
//                 <Eye size={14} />
//                 Prévisualiser la Fiche
//                 </button>

//                 <button
//                 type="button"
//                 onClick={onSaveDraft}
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 shadow-sm transition-all"
//                 >
//                 <Save size={14} />
//                 Enregistrer le Brouillon
//                 </button>

//                 <button
//                 type="button"
//                 onClick={handlePublish}
//                 disabled={isSaving}
//                 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lineair-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-md shadow-orange-200 hover:from-orange-600 hover:to-orange-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150"
//                 >
//                 {isSaving ? (
//                     <>
//                     <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
//                     </svg>
//                     Publication…
//                     </>
//                 ) : (
//                     <>
//                     <Upload size={14} />
//                     Enregistrer et Publier la Fiche
//                     </>
//                 )}
//                 </button>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// }