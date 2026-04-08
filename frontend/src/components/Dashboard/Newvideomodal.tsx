// // "use client";

// // import { useState } from "react";
// // import { X, Plus, Video, Link2, Clock, Tag, ChevronDown } from "lucide-react";

// // type Statut = "brouillon" | "en_cours" | "publie" | "archive" | "";
// // type Format = "interview" | "reportage" | "documentaire" | "plateau" | "terrain" | "";

// // interface VideoFormData {
// //     titre: string;
// //     lien: string;
// //     duree: string;
// //     statut: Statut;
// //     format: Format;
// // }

// // const STATUTS: { value: Statut; label: string }[] = [
// //     { value: "brouillon", label: "Brouillon" },
// //     { value: "en_cours", label: "En cours de montage" },
// //     { value: "publie", label: "Publié" },
// //     { value: "archive", label: "Archivé" },
// // ];

// // const FORMATS: { value: Format; label: string }[] = [
// //     { value: "interview", label: "Interview" },
// //     { value: "reportage", label: "Reportage" },
// //     { value: "documentaire", label: "Documentaire" },
// //     { value: "plateau", label: "Plateau TV" },
// //     { value: "terrain", label: "Terrain" },
// // ];

// // interface SelectProps {
// //     value: string;
// //     onChange: (val: string) => void;
// //     placeholder: string;
// //     options: { value: string; label: string }[];
// // }

// // function CustomSelect({ value, onChange, placeholder, options }: SelectProps) {
// //     const [open, setOpen] = useState(false);
// //     const selected = options.find((o) => o.value === value);

// //     return (
// //         <div className="relative">
// //         <button
// //             type="button"
// //             onClick={() => setOpen(!open)}
// //             className={`
// //             w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white
// //             text-left text-sm font-medium transition-all duration-200
// //             ${open
// //                 ? "border-orange-500 ring-2 ring-orange-100"
// //                 : "border-gray-200 hover:border-gray-300"
// //             }
// //             ${value ? "text-gray-800" : "text-gray-400"}
// //             `}
// //         >
// //             <span>{selected ? selected.label : placeholder}</span>
// //             <ChevronDown
// //             size={16}
// //             className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
// //             />
// //         </button>

// //         {open && (
// //             <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
// //             {options.map((opt) => (
// //                 <button
// //                 key={opt.value}
// //                 type="button"
// //                 onClick={() => {
// //                     onChange(opt.value);
// //                     setOpen(false);
// //                 }}
// //                 className={`
// //                     w-full px-4 py-2.5 text-left text-sm transition-colors
// //                     ${value === opt.value
// //                     ? "bg-orange-50 text-orange-600 font-semibold"
// //                     : "text-gray-700 hover:bg-gray-50"
// //                     }
// //                 `}
// //                 >
// //                 {opt.label}
// //                 </button>
// //             ))}
// //             </div>
// //         )}
// //         </div>
// //     );
// // }

// // interface FieldProps {
// //     label: string;
// //     required?: boolean;
// //     icon: React.ReactNode;
// //     children: React.ReactNode;
// // }

// // function Field({ label, required, icon, children }: FieldProps) {
// //     return (
// //         <div className="flex flex-col gap-1.5">
// //         <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
// //             <span className="text-orange-500">{icon}</span>
// //             {label}
// //             {required && <span className="text-orange-500 ml-0.5">*</span>}
// //         </label>
// //         {children}
// //         </div>
// //     );
// // }

// // interface Props {
// //     onClose?: () => void;
// //     onSubmit?: (data: VideoFormData) => void;
// // }

// // export default function NewVideoModal({ onClose, onSubmit }: Props) {
// //     const [form, setForm] = useState<VideoFormData>({
// //         titre: "",
// //         lien: "",
// //         duree: "",
// //         statut: "",
// //         format: "",
// //     });

// //     const [errors, setErrors] = useState<Partial<Record<keyof VideoFormData, string>>>({});

// //     const validate = (): boolean => {
// //         const newErrors: Partial<Record<keyof VideoFormData, string>> = {};
// //         if (!form.titre.trim()) newErrors.titre = "Le titre est requis.";
// //         if (!form.lien.trim()) newErrors.lien = "Le lien est requis.";
// //         if (!form.statut) newErrors.statut = "Veuillez sélectionner un statut.";
// //         if (!form.format) newErrors.format = "Veuillez sélectionner un format.";
// //         if (form.duree && !/^\d{2}:\d{2}$/.test(form.duree))
// //         newErrors.duree = "Format attendu : MM:SS";
// //         setErrors(newErrors);
// //         return Object.keys(newErrors).length === 0;
// //     };

// //     const handleSubmit = () => {
// //         if (validate()) onSubmit?.(form);
// //     };

// //     const inputClass = (field: keyof VideoFormData) => `
// //         w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 bg-white
// //         placeholder:text-gray-400 outline-none transition-all duration-200
// //         ${errors[field]
// //         ? "border-red-400 ring-2 ring-red-100"
// //         : "border-gray-200 hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
// //         }
// //     `;

// //     return (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
// //         <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">

// //             {/* Header */}
// //             <div className="px-7 pt-7 pb-5 border-b border-gray-100">
// //             <div className="flex items-start justify-between gap-4">
// //                 <div>
// //                 <div className="flex items-center gap-2 mb-1">
// //                     <div className="p-1.5 bg-orange-100 rounded-lg">
// //                     <Video size={16} className="text-orange-500" />
// //                     </div>
// //                     <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
// //                     Démarrer l&apos;Enregistrement d&apos;une Nouvelle Vidéo
// //                     </h2>
// //                 </div>
// //                 <p className="text-sm text-gray-500 mt-2">
// //                     Veuillez fournir le titre, l&apos;URL de la source (YouTube/Vimeo) et le statut initial.
// //                 </p>
// //                 </div>
// //                 <button
// //                 onClick={onClose}
// //                 className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
// //                 >
// //                 <X size={18} />
// //                 </button>
// //             </div>
// //             </div>

// //             {/* Form */}
// //             <div className="px-7 py-6 flex flex-col gap-5">

// //             {/* Titre */}
// //             <Field label="Titre de l'Interview / du Reportage" required icon={<Tag size={14} />}>
// //                 <input
// //                 type="text"
// //                 value={form.titre}
// //                 onChange={(e) => setForm({ ...form, titre: e.target.value })}
// //                 placeholder="Ex: Interview du PDG d'Air Afrique sur le marché B2B"
// //                 className={inputClass("titre")}
// //                 />
// //                 {errors.titre && (
// //                 <p className="text-xs text-red-500 mt-0.5">{errors.titre}</p>
// //                 )}
// //             </Field>

// //             {/* Lien */}
// //             <Field label="Lien de la Vidéo (YouTube, Vimeo, etc.)" required icon={<Link2 size={14} />}>
// //                 <textarea
// //                 value={form.lien}
// //                 onChange={(e) => setForm({ ...form, lien: e.target.value })}
// //                 placeholder={"Entrez ici l'URL complète ou le code d'intégration (<iframe>) de la plateforme vidéo source"}
// //                 rows={3}
// //                 className={`${inputClass("lien")} resize-none`}
// //                 />
// //                 {errors.lien && (
// //                 <p className="text-xs text-red-500 mt-0.5">{errors.lien}</p>
// //                 )}
// //             </Field>

// //             {/* Durée + Statut */}
// //             <div className="grid grid-cols-2 gap-4">
// //                 <Field label="Durée approximative (format MM:SS)" icon={<Clock size={14} />}>
// //                 <input
// //                     type="text"
// //                     value={form.duree}
// //                     onChange={(e) => setForm({ ...form, duree: e.target.value })}
// //                     placeholder="Ex: 08:30"
// //                     className={inputClass("duree")}
// //                 />
// //                 {errors.duree && (
// //                     <p className="text-xs text-red-500 mt-0.5">{errors.duree}</p>
// //                 )}
// //                 </Field>

// //                 <Field label="Statut de Démarrage" required icon={<ChevronDown size={14} />}>
// //                 <CustomSelect
// //                     value={form.statut}
// //                     onChange={(val) => setForm({ ...form, statut: val as Statut })}
// //                     placeholder="Sélectionner un statut"
// //                     options={STATUTS}
// //                 />
// //                 {errors.statut && (
// //                     <p className="text-xs text-red-500 mt-0.5">{errors.statut}</p>
// //                 )}
// //                 </Field>
// //             </div>

// //             {/* Format */}
// //             <Field label="Format (Rubrique i Tourisme TV)" required icon={<Video size={14} />}>
// //                 <CustomSelect
// //                 value={form.format}
// //                 onChange={(val) => setForm({ ...form, format: val as Format })}
// //                 placeholder="Sélectionner un format"
// //                 options={FORMATS}
// //                 />
// //                 {errors.format && (
// //                 <p className="text-xs text-red-500 mt-0.5">{errors.format}</p>
// //                 )}
// //             </Field>
// //             </div>

// //             {/* Footer */}
// //             <div className="px-7 pb-7 flex items-center justify-end gap-3">
// //             <button
// //                 type="button"
// //                 onClick={onClose}
// //                 className="px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
// //                 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
// //             >
// //                 Annuler
// //             </button>
// //             <button
// //                 type="button"
// //                 onClick={handleSubmit}
// //                 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600
// //                 text-white text-sm font-bold tracking-wide transition-all duration-200
// //                 shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-[0.98]"
// //             >
// //                 <Plus size={16} />
// //                 AJOUTER ET ÉDITER LES DÉTAILS
// //             </button>
// //             </div>
// //         </div>
// //         </div>
// //     );
// // }



















// "use client";

// import { useState, useEffect } from "react";
// import { X, Plus, Video, Link2, Clock, Tag, ChevronDown, Loader2, AlertCircle } from "lucide-react";
// import { getToken } from "@/lib/auth";

// // ─── Auth ─────────────────────────────────────────────────────────────────────

// function getAuthHeaders(): HeadersInit {
//     const token = getToken();
//     return {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
// }

// function extractArray<T>(json: any, keys: string[]): T[] {
//     for (const key of keys) {
//         if (key === "") {
//             if (Array.isArray(json)) return json;
//             continue;
//         }
//         const value = key.split(".").reduce((acc: any, k: string) => acc?.[k], json);
//         if (Array.isArray(value)) return value;
//     }
//     return [];
// }

// // ─── Types ───────────────────────────────────────────────────────────────────

// type Statut = "brouillon" | "en_cours" | "publie" | "archive" | "";
// type Format = "interview" | "reportage" | "documentaire" | "plateau" | "terrain" | "";

// interface VideoFormData {
//     titre: string;
//     lien: string;
//     duree: string;
//     statut: Statut;
//     format: Format;
//     authorId: number | null;
// }

// const STATUTS: { value: Statut; label: string }[] = [
//     { value: "brouillon", label: "Brouillon" },
//     { value: "en_cours", label: "En cours de montage" },
//     { value: "publie", label: "Publié" },
//     { value: "archive", label: "Archivé" },
// ];

// const FORMATS: { value: Format; label: string }[] = [
//     { value: "interview", label: "Interview" },
//     { value: "reportage", label: "Reportage" },
//     { value: "documentaire", label: "Documentaire" },
//     { value: "plateau", label: "Plateau TV" },
//     { value: "terrain", label: "Terrain" },
// ];

// interface Author {
//     id: number;
//     name: string;
//     role?: string;
// }

// interface SelectProps {
//     value: string;
//     onChange: (val: string) => void;
//     placeholder: string;
//     options: { value: string; label: string }[];
//     disabled?: boolean;
// }

// function CustomSelect({ value, onChange, placeholder, options, disabled }: SelectProps) {
//     const [open, setOpen] = useState(false);
//     const selected = options.find((o) => o.value === value);

//     return (
//         <div className="relative">
//             <button
//                 type="button"
//                 disabled={disabled}
//                 onClick={() => !disabled && setOpen(!open)}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white
//                     text-left text-sm font-medium transition-all duration-200
//                     ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
//                     ${open ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-200 hover:border-gray-300"}
//                     ${value ? "text-gray-800" : "text-gray-400"}`}
//             >
//                 <span>{selected ? selected.label : placeholder}</span>
//                 <ChevronDown
//                     size={16}
//                     className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//                 />
//             </button>

//             {open && (
//                 <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//                     {options.map((opt) => (
//                         <button
//                             key={opt.value}
//                             type="button"
//                             onClick={() => {
//                                 onChange(opt.value);
//                                 setOpen(false);
//                             }}
//                             className={`w-full px-4 py-2.5 text-left text-sm transition-colors
//                                 ${value === opt.value
//                                     ? "bg-orange-50 text-orange-600 font-semibold"
//                                     : "text-gray-700 hover:bg-gray-50"
//                                 }`}
//                         >
//                             {opt.label}
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// interface FieldProps {
//     label: string;
//     required?: boolean;
//     icon: React.ReactNode;
//     children: React.ReactNode;
// }

// function Field({ label, required, icon, children }: FieldProps) {
//     return (
//         <div className="flex flex-col gap-1.5">
//             <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
//                 <span className="text-orange-500">{icon}</span>
//                 {label}
//                 {required && <span className="text-orange-500 ml-0.5">*</span>}
//             </label>
//             {children}
//         </div>
//     );
// }

// interface Props {
//     isOpen?: boolean;
//     onClose?: () => void;
//     onSuccess?: () => void;
// }

// export default function NewVideoModal({ isOpen = true, onClose, onSuccess }: Props) {
//     const [form, setForm] = useState<VideoFormData>({
//         titre: "",
//         lien: "",
//         duree: "",
//         statut: "",
//         format: "",
//         authorId: null,
//     });
//     const [errors, setErrors] = useState<Partial<Record<keyof VideoFormData, string>>>({});
//     const [submitting, setSubmitting] = useState(false);
//     const [apiError, setApiError] = useState<string | null>(null);

//     // Données distantes
//     const [authors, setAuthors] = useState<Author[]>([]);
//     const [loadingAuthors, setLoadingAuthors] = useState(false);

//     const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

//     // ── Chargement des auteurs ──────────────────────────────────────────────
//     useEffect(() => {
//         if (!isOpen) return;
//         if (authors.length) return;

//         setLoadingAuthors(true);
//         fetch(`${API}/admin/users`, { headers: getAuthHeaders() })
//             .then((r) => r.json())
//             .then((json) => {
//                 console.log("Authors API response:", json);
//                 const list = extractArray<Author>(json, ["", "data", "data.users"]);
//                 setAuthors(list);
//             })
//             .catch((err) => {
//                 console.error("Authors error:", err);
//                 setAuthors([]);
//             })
//             .finally(() => setLoadingAuthors(false));
//     }, [isOpen]);

//     // ── Reset à la fermeture ──────────────────────────────────────────────────
//     useEffect(() => {
//         if (!isOpen) {
//             setForm({ titre: "", lien: "", duree: "", statut: "", format: "", authorId: null });
//             setErrors({});
//             setApiError(null);
//         }
//     }, [isOpen]);

//     // ── Échap pour fermer ─────────────────────────────────────────────────────
//     useEffect(() => {
//         const handler = (e: KeyboardEvent) => {
//             if (e.key === "Escape" && isOpen) onClose?.();
//         };
//         document.addEventListener("keydown", handler);
//         return () => document.removeEventListener("keydown", handler);
//     }, [isOpen, onClose]);

//     const validate = (): boolean => {
//         const newErrors: Partial<Record<keyof VideoFormData, string>> = {};
//         if (!form.titre.trim()) newErrors.titre = "Le titre est requis.";
//         if (!form.lien.trim()) newErrors.lien = "Le lien est requis.";
//         if (!form.statut) newErrors.statut = "Veuillez sélectionner un statut.";
//         if (!form.format) newErrors.format = "Veuillez sélectionner un format.";
//         if (!form.authorId) newErrors.authorId = "Veuillez sélectionner un auteur.";
//         if (form.duree && !/^\d{2}:\d{2}$/.test(form.duree))
//             newErrors.duree = "Format attendu : MM:SS";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // const handleSubmit = async () => {
//     //     if (!validate()) return;
//     //     setSubmitting(true);
//     //     setApiError(null);

//     //     try {
//     //         const res = await fetch(`${API}/admin/articles/quick`, {
//     //             method: "POST",
//     //             headers: getAuthHeaders(),
//     //             credentials: "include",
//     //             body: JSON.stringify({
//     //                 titre: form.titre.trim(),
//     //                 lien: form.lien.trim(),
//     //                 duree: form.duree || undefined,
//     //                 statut: form.statut,
//     //                 format: form.format,
//     //                 authorId: form.authorId,
//     //             }),
//     //         });

//     //         console.log("Create Video API response:", res.body);

//     //         if (!res.ok) {
//     //             const json = await res.json();
//     //             const msg =
//     //                 json?.errors?.[0]?.message ??
//     //                 json?.message ??
//     //                 "Erreur lors de la création.";
//     //             setApiError(msg);
//     //             return;
//     //         }

//     //         const json = await res.json();
//     //         const id = json?.data?.id ?? json?.data?.video?.id ?? json?.id;

//     //         if (!id) {
//     //             setApiError("ID de la vidéo introuvable.");
//     //             return;
//     //         }

//     //         onSuccess?.();
//     //         onClose?.();
//     //     } catch {
//     //         setApiError("Erreur réseau. Vérifiez votre connexion et réessayez.");
//     //     } finally {
//     //         setSubmitting(false);
//     //     }
//     // };


//     const handleSubmit = async () => {
//         if (!validate()) return;

//         setSubmitting(true);
//         setApiError(null);

//         try {
//             const payload = {
//                 title: form.titre.trim(),
//                 status:
//                     form.statut === "publie"
//                         ? "PUBLISHED"
//                         : form.statut === "brouillon"
//                         ? "DRAFT"
//                         : form.statut === "en_cours"
//                         ? "REVIEW"
//                         : form.statut === "archive"
//                         ? "ARCHIVED"
//                         : "DRAFT",

//                 categoryId: 1, // ⚠️ à remplacer dynamiquement plus tard
//                 authorId: form.authorId,
//             };

//             console.log("Payload envoyé:", payload);

//             const res = await fetch(`${API}/admin/articles/quick`, {
//                 method: "POST",
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(payload),
//             });

//             const json = await res.json();

//             if (!res.ok) {
//                 console.error("Erreur backend:", json);
//                 setApiError(
//                     json?.errors?.[0]?.message ||
//                     json?.message ||
//                     "Erreur lors de la création."
//                 );
//                 return;
//             }

//             onSuccess?.();
//             onClose?.();

//         } catch (err) {
//             console.error(err);
//             setApiError("Erreur réseau.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const inputClass = (field: keyof VideoFormData) => `
//         w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 bg-white
//         placeholder:text-gray-400 outline-none transition-all duration-200
//         ${errors[field]
//             ? "border-red-400 ring-2 ring-red-100"
//             : "border-gray-200 hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//         }
//     `;

//     // Auteur options pour CustomSelect
//     const authorOptions = authors.map((a) => ({
//         value: String(a.id),
//         label: a.name + (a.role ? ` — ${a.role}` : ""),
//     }));

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//             <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">

//                 {/* Header */}
//                 <div className="px-7 pt-7 pb-5 border-b border-gray-100">
//                     <div className="flex items-start justify-between gap-4">
//                         <div>
//                             <div className="flex items-center gap-2 mb-1">
//                                 <div className="p-1.5 bg-orange-100 rounded-lg">
//                                     <Video size={16} className="text-orange-500" />
//                                 </div>
//                                 <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
//                                     Démarrer l&apos;Enregistrement d&apos;une Nouvelle Vidéo
//                                 </h2>
//                             </div>
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Veuillez fournir le titre, l&apos;URL de la source (YouTube/Vimeo) et le statut initial.
//                             </p>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Form */}
//                 <div className="px-7 py-6 flex flex-col gap-5">

//                     {/* Bannière erreur API */}
//                     {apiError && (
//                         <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
//                             <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                             <span>{apiError}</span>
//                         </div>
//                     )}

//                     {/* Titre */}
//                     <Field label="Titre de l'Interview / du Reportage" required icon={<Tag size={14} />}>
//                         <input
//                             type="text"
//                             value={form.titre}
//                             onChange={(e) => setForm({ ...form, titre: e.target.value })}
//                             placeholder="Ex: Interview du PDG d'Air Afrique sur le marché B2B"
//                             className={inputClass("titre")}
//                         />
//                         {errors.titre && <p className="text-xs text-red-500 mt-0.5">{errors.titre}</p>}
//                     </Field>

//                     {/* Lien */}
//                     <Field label="Lien de la Vidéo (YouTube, Vimeo, etc.)" required icon={<Link2 size={14} />}>
//                         <textarea
//                             value={form.lien}
//                             onChange={(e) => setForm({ ...form, lien: e.target.value })}
//                             placeholder={"Entrez ici l'URL complète ou le code d'intégration (<iframe>)"}
//                             rows={3}
//                             className={`${inputClass("lien")} resize-none`}
//                         />
//                         {errors.lien && <p className="text-xs text-red-500 mt-0.5">{errors.lien}</p>}
//                     </Field>

//                     {/* Durée + Statut */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <Field label="Durée approximative (MM:SS)" icon={<Clock size={14} />}>
//                             <input
//                                 type="text"
//                                 value={form.duree}
//                                 onChange={(e) => setForm({ ...form, duree: e.target.value })}
//                                 placeholder="Ex: 08:30"
//                                 className={inputClass("duree")}
//                             />
//                             {errors.duree && <p className="text-xs text-red-500 mt-0.5">{errors.duree}</p>}
//                         </Field>

//                         <Field label="Statut de Démarrage" required icon={<ChevronDown size={14} />}>
//                             <CustomSelect
//                                 value={form.statut}
//                                 onChange={(val) => setForm({ ...form, statut: val as Statut })}
//                                 placeholder="Sélectionner un statut"
//                                 options={STATUTS}
//                             />
//                             {errors.statut && <p className="text-xs text-red-500 mt-0.5">{errors.statut}</p>}
//                         </Field>
//                     </div>

//                     {/* Format */}
//                     <Field label="Format (Rubrique i Tourisme TV)" required icon={<Video size={14} />}>
//                         <CustomSelect
//                             value={form.format}
//                             onChange={(val) => setForm({ ...form, format: val as Format })}
//                             placeholder="Sélectionner un format"
//                             options={FORMATS}
//                         />
//                         {errors.format && <p className="text-xs text-red-500 mt-0.5">{errors.format}</p>}
//                     </Field>

//                     {/* Auteur — dynamique depuis l'API */}
//                     <Field label="Auteur / Responsable de la Vidéo" required icon={<Tag size={14} />}>
//                         {loadingAuthors ? (
//                             <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-400">
//                                 <Loader2 size={15} className="animate-spin" />
//                                 Chargement des auteurs…
//                             </div>
//                         ) : authors.length === 0 ? (
//                             <p className="text-sm text-gray-400 px-4 py-3 rounded-xl border-2 border-gray-200">
//                                 Aucun auteur disponible.
//                             </p>
//                         ) : (
//                             <CustomSelect
//                                 value={form.authorId ? String(form.authorId) : ""}
//                                 onChange={(val) => setForm({ ...form, authorId: val ? parseInt(val, 10) : null })}
//                                 placeholder="Sélectionner un auteur"
//                                 options={authorOptions}
//                             />
//                         )}
//                         {errors.authorId && <p className="text-xs text-red-500 mt-0.5">{errors.authorId}</p>}
//                     </Field>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-7 pb-7 flex items-center justify-end gap-3">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         disabled={submitting}
//                         className="px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600
//                             hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
//                     >
//                         Annuler
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleSubmit}
//                         disabled={submitting || loadingAuthors}
//                         className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600
//                             text-white text-sm font-bold tracking-wide transition-all duration-200
//                             shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-[0.98]
//                             disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                         {submitting ? (
//                             <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
//                         ) : (
//                             <><Plus size={16} /> AJOUTER ET ÉDITER LES DÉTAILS</>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }





"use client";

import { useState, useEffect, useRef } from "react";
import { X, PenSquare, Loader2, AlertCircle, Video, Tag, ChevronDown,} from "lucide-react";
import { getToken } from "@/lib/auth";
import { quickCreateVideo } from "@/services/Dashboard/video.service";
import { Article } from "@/services/Dashboard/articleservice";

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
    id: number;
    name: string;
    role?: string;
}

interface FormData {
    title: string;
    statusUI: string;
    authorId: string;
}

interface FormErrors {
    title?: string;
    statusUI?: string;
    authorId?: string;
}

interface NewVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Reçoit l'article créé pour ouvrir l'éditeur directement */
    onSuccess?: (article: Article) => void;
}

// ─── Statuts ──────────────────────────────────────────────────────────────────

const STATUSES = [
    { value: "DRAFT",     label: "Brouillon",   color: "text-slate-600",   dot: "bg-slate-400"   },
    { value: "REVIEW",    label: "En révision", color: "text-amber-600",   dot: "bg-amber-400"   },
    { value: "PUBLISHED", label: "Publié",      color: "text-emerald-600", dot: "bg-emerald-400" },
    { value: "ARCHIVED",  label: "Archivé",     color: "text-rose-600",    dot: "bg-rose-400"    },
];

// ─── Helper : extraction tableau depuis une réponse API variable ──────────────

function extractArray<T>(json: unknown, keys: string[]): T[] {
    for (const key of keys) {
        const val = key === ""
        ? json
        : key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], json);
        if (Array.isArray(val)) return val as T[];
    }
    return [];
}

function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Custom Select (commun avec NewArticleModal) ──────────────────────────────

interface SelectOption {
    value: string;
    label: string;
    dot?: string;
    color?: string;
    avatar?: string;
    sublabel?: string;
}

function CustomSelect({placeholder, options, value, onChange, error, disabled, renderOption, renderSelected,}: {
    placeholder: string;
    options: SelectOption[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    disabled?: boolean;
    renderOption?: (opt: SelectOption) => React.ReactNode;
    renderSelected?: (opt: SelectOption) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
        <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((p) => !p)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white text-left transition-all duration-200 outline-none
            ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
            ${error
                ? "border-rose-400 ring-2 ring-rose-100"
                : open
                ? "border-orange-400 ring-2 ring-orange-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
        >
            <span className={selected ? "text-slate-800" : "text-slate-400"}>
            {selected
                ? renderSelected ? renderSelected(selected) : selected.label
                : placeholder}
            </span>
            <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {open && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in">
            {options.map((opt) => (
                <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150
                    ${value === opt.value ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                >
                {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
                {value === opt.value && (
                    <svg className="w-4 h-4 text-orange-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                </button>
            ))}
            </div>
        )}

        {error && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle size={13} className="shrink-0" /> {error}
            </p>
        )}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function NewVideoModal({ isOpen, onClose, onSuccess }: NewVideoModalProps) {
    const [form, setForm]           = useState<FormData>({ title: "", statusUI: "DRAFT", authorId: "" });
    const [errors, setErrors]       = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError]   = useState<string | null>(null);

    const [authors, setAuthors]           = useState<Author[]>([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);
    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

    // ── Chargement des auteurs ──────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen || authors.length) return;
        setLoadingAuthors(true);
        fetch(`${API}/admin/users`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((json) => setAuthors(extractArray<Author>(json, ["", "data", "data.users"])))
        .catch(() => setAuthors([]))
        .finally(() => setLoadingAuthors(false));
    }, [isOpen]);

    // ── Reset / focus ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (isOpen) {
        setTimeout(() => titleRef.current?.focus(), 100);
        } else {
        setForm({ title: "", statusUI: "DRAFT", authorId: "" });
        setErrors({});
        setApiError(null);
        }
    }, [isOpen]);

    // ── Échap ──────────────────────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // ── Validation ─────────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.title.trim())              errs.title    = "Le titre est requis.";
        else if (form.title.trim().length < 5) errs.title  = "Minimum 5 caractères.";
        if (!form.statusUI)                  errs.statusUI = "Veuillez sélectionner un statut.";
        if (!form.authorId)                  errs.authorId = "Veuillez sélectionner un auteur.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Soumission ─────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);

        try {
        const article = await quickCreateVideo({
            title:    form.title,
            statusUI: form.statusUI,
            authorId: Number(form.authorId),
            type:     "VIDEO",
        });

        console.log(article);

        onSuccess?.(article);
        onClose();
        } catch (err: unknown) {
        setApiError((err as Error).message || "Erreur lors de la création.");
        } finally {
        setSubmitting(false);
        }
    };

    // ── Options ────────────────────────────────────────────────────────────────

    const statusOptions: SelectOption[] = STATUSES.map((s) => ({
        value: s.value, label: s.label, color: s.color, dot: s.dot,
    }));

    const authorOptions: SelectOption[] = authors.map((a) => ({
        value:    String(a.id),
        label:    a.name,
        sublabel: a.role,
        avatar:   a.name ? initials(a.name) : "?",
    }));

    if (!isOpen) return null;

    return (
        <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-video-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
                <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Video size={16} className="text-orange-500" />
                    </div>
                    <h2 id="new-video-title" className="text-xl font-bold text-slate-900 leading-tight">
                    Démarrer la Création{" "}
                    <span className="text-orange-600">d&apos;une Nouvelle Vidéo</span>
                    </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    Renseignez les informations de base. Vous pourrez compléter les détails ensuite.
                </p>
                </div>
                <button
                onClick={onClose}
                className="shrink-0 ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Fermer"
                >
                <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Erreur API */}
                {apiError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
                )}

                {/* Titre */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Titre de la Vidéo <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <input
                    ref={titleRef}
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value }));
                    if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                    }}
                    placeholder="Ex : Interview du PDG d'Air Afrique sur le marché B2B"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all duration-200
                    ${errors.title
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-slate-300"
                    }`}
                />
                {errors.title && (
                    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" /> {errors.title}
                    </p>
                )}
                </div>

                {/* Statut */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Statut Initial <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <CustomSelect
                    placeholder="Sélectionner un statut"
                    options={statusOptions}
                    value={form.statusUI}
                    onChange={(v) => {
                    setForm((p) => ({ ...p, statusUI: v }));
                    if (errors.statusUI) setErrors((p) => ({ ...p, statusUI: undefined }));
                    }}
                    error={errors.statusUI}
                    renderOption={(opt) => (
                    <>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />
                        <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                    </>
                    )}
                    renderSelected={(opt) => (
                    <span className="flex items-center gap-2 text-sm">
                        <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                        <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                    </span>
                    )}
                />
                </div>

                {/* Auteur */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Auteur / Réalisateur <span className="text-orange-500 ml-0.5">*</span>
                </label>
                {loadingAuthors ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                    <Loader2 size={15} className="animate-spin" /> Chargement des auteurs…
                    </div>
                ) : authors.length === 0 ? (
                    <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">
                    Aucun auteur disponible.
                    </p>
                ) : (
                    <CustomSelect
                    placeholder="Sélectionner un auteur"
                    options={authorOptions}
                    value={form.authorId}
                    onChange={(v) => {
                        setForm((p) => ({ ...p, authorId: v }));
                        if (errors.authorId) setErrors((p) => ({ ...p, authorId: undefined }));
                    }}
                    error={errors.authorId}
                    renderOption={(opt) => (
                        <>
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {opt.avatar}
                        </span>
                        <span>
                            <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
                            {opt.sublabel && <span className="block text-xs text-slate-400">{opt.sublabel}</span>}
                        </span>
                        </>
                    )}
                    renderSelected={(opt) => (
                        <span className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                            {opt.avatar}
                        </span>
                        <span className="font-medium text-slate-800">{opt.label}</span>
                        </span>
                    )}
                    />
                )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 disabled:opacity-50"
                >
                Annuler
                </button>
                <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || loadingAuthors || authors.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                >
                {submitting
                    ? <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
                    : <><PenSquare className="w-4 h-4" /> Commencer l&apos;édition</>
                }
                </button>
            </div>
            </div>
        </div>

        <style>{`
            @keyframes animate-in {
            from { opacity: 0; transform: translateY(-6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-in { animation: animate-in 0.15s ease-out; }
        `}</style>
        </>
    );
}