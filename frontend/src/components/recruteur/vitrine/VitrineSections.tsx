// src/components/recruteur/vitrine/VitrineSections.tsx
// CORRECTION : IdentiteSection — après upload Cloudinary réussi, on appelle
// onChange({ logoUrl }) avec l'URL finale. Le state local n'est utilisé QUE
// comme prévisualisation pendant l'upload en cours (blob temporaire).
// Le reste des sections (ChiffresSection, CultureSection, MediaSection) est
// identique à la version précédente.
'use client';

import { useRef, useState, useEffect } from 'react';
import { ImageIcon, Plus, Trash2, X } from 'lucide-react';
import type {
  VitrineData, VitrineKpi, KpiIcon, CompanyValue, Perk,
} from '@/types/vitrine.types';
import { KPI_ICONS, ALL_PERKS, SECTORS_LIST } from '@/types/vitrine.types';
import {
  uploadLogo, uploadBanner, uploadPhoto, deletePhoto,
} from '@/services/vitrine.service';

const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';
const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';

// ── Section wrapper ───────────────────────────────────────────────────────────
function SectionCard({ id, title, subtitle, children }: {
  id: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div id={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── KPI Tile ──────────────────────────────────────────────────────────────────
function KpiTile({ kpi, onChange, onDelete }: {
  kpi: VitrineKpi;
  onChange: (k: VitrineKpi) => void;
  onDelete: () => void;
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const iconDef = KPI_ICONS.find((i) => i.key === kpi.icon);
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 relative group">
      <button onClick={onDelete}
        className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400
                   hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
        <Trash2 size={13} />
      </button>
      <div className="relative mb-3">
        <button onClick={() => setShowIconPicker((v) => !v)}
          className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center
                     justify-center text-xl hover:border-[#E8622A] transition">
          {iconDef?.emoji ?? '📊'}
        </button>
        {showIconPicker && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl
                          shadow-lg z-10 p-2 grid grid-cols-5 gap-1 w-44">
            {KPI_ICONS.map((ic) => (
              <button key={ic.key} title={ic.label}
                onClick={() => { onChange({ ...kpi, icon: ic.key }); setShowIconPicker(false); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-base">
                {ic.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <input value={kpi.value} onChange={(e) => onChange({ ...kpi, value: e.target.value })}
        placeholder="150"
        className="w-full text-2xl font-bold text-gray-900 bg-transparent outline-none
                   border-b border-transparent hover:border-gray-200 focus:border-[#E8622A] transition mb-1" />
      <input value={kpi.label} onChange={(e) => onChange({ ...kpi, label: e.target.value })}
        placeholder="Collaborateurs"
        className="w-full text-xs text-gray-500 bg-transparent outline-none border-b border-transparent
                   hover:border-gray-200 focus:border-[#E8622A] transition" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Identité Visuelle — CORRIGÉE
// ─────────────────────────────────────────────────────────────────────────────

interface IdentiteProps {
  vitrine: VitrineData;
  onChange: (v: Partial<VitrineData>) => void;
}

export function IdentiteSection({ vitrine, onChange }: IdentiteProps) {
  const [logoUploading,   setLogoUploading]   = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoError,       setLogoError]       = useState('');
  const [bannerError,     setBannerError]     = useState('');

  // Prévisualisations blob temporaires UNIQUEMENT pendant l'upload
  const [logoBlobPreview,   setLogoBlobPreview]   = useState<string | undefined>();
  const [bannerBlobPreview, setBannerBlobPreview] = useState<string | undefined>();

  const logoRef   = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // Ce qu'on affiche = blob pendant l'upload, sinon l'URL persistée depuis vitrine
  const logoDisplay   = logoBlobPreview   ?? vitrine.logoUrl   ?? undefined;
  const bannerDisplay = bannerBlobPreview ?? vitrine.bannerUrl ?? undefined;

  // ── Upload logo ────────────────────────────────────────────────────────────
  async function handleLogo(file: File) {
    setLogoError('');

    // 1. Créer un aperçu immédiat (blob local)
    const blob = URL.createObjectURL(file);
    setLogoBlobPreview(blob);
    setLogoUploading(true);

    try {
      // 2. Uploader sur Cloudinary via le backend
      const { url } = await uploadLogo(file);

      // 3. CORRECTION PRINCIPALE : propager l'URL Cloudinary dans vitrine
      //    C'est cette valeur qui sera envoyée lors du clic "Enregistrer"
      onChange({ logoUrl: url });

      // 4. Supprimer le blob temporaire (plus nécessaire)
      setLogoBlobPreview(undefined);
      URL.revokeObjectURL(blob);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Upload du logo échoué. Réessayez.';
      setLogoError(msg);
      // En cas d'erreur : effacer la prévisualisation blob
      setLogoBlobPreview(undefined);
      URL.revokeObjectURL(blob);
    } finally {
      setLogoUploading(false);
      if (logoRef.current) logoRef.current.value = '';
    }
  }

  // ── Upload bannière ────────────────────────────────────────────────────────
  async function handleBanner(file: File) {
    setBannerError('');

    const blob = URL.createObjectURL(file);
    setBannerBlobPreview(blob);
    setBannerUploading(true);

    try {
      const { url } = await uploadBanner(file);

      // CORRECTION PRINCIPALE : propager l'URL Cloudinary dans vitrine
      onChange({ bannerUrl: url });

      setBannerBlobPreview(undefined);
      URL.revokeObjectURL(blob);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Upload de la bannière échoué. Réessayez.';
      setBannerError(msg);
      setBannerBlobPreview(undefined);
      URL.revokeObjectURL(blob);
    } finally {
      setBannerUploading(false);
      if (bannerRef.current) bannerRef.current.value = '';
    }
  }

  return (
    <SectionCard id="identite" title="Identité Visuelle"
      subtitle="Logo et bannière de couverture de votre entreprise">

      <div className="flex gap-4 flex-wrap">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-[140px]">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Logo de l'entreprise
            {vitrine.logoUrl && !logoUploading && (
              <span className="ml-2 text-green-500 text-[10px] font-normal">✓ Enregistré</span>
            )}
          </p>

          <div
            onClick={() => !logoUploading && logoRef.current?.click()}
            className={[
              'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center',
              'text-center gap-2 h-36 transition',
              logoUploading
                ? 'opacity-60 cursor-wait border-[#E8622A]/40'
                : 'cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8]',
              logoDisplay ? 'border-[#E8622A]/20 bg-gray-50' : 'border-gray-200',
            ].join(' ')}
            style={logoDisplay && !logoUploading ? {
              backgroundImage:    `url(${logoDisplay})`,
              backgroundSize:     'contain',
              backgroundRepeat:   'no-repeat',
              backgroundPosition: 'center',
            } : {}}
          >
            {!logoDisplay && !logoUploading && (
              <>
                <ImageIcon size={28} className="text-gray-300" />
                <p className="text-xs text-gray-400 font-medium">Cliquez pour uploader</p>
                <p className="text-[10px] text-gray-300">PNG, JPG (max 5 Mo)</p>
              </>
            )}
            {logoUploading && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Upload en cours…</p>
              </div>
            )}
          </div>

          <input ref={logoRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogo(f); }} />

          {logoError && (
            <p className="text-xs text-red-500 mt-1.5">{logoError}</p>
          )}

          {vitrine.logoUrl && !logoUploading && (
            <button
              onClick={() => onChange({ logoUrl: undefined })}
              className="mt-1 text-[10px] text-red-400 hover:text-red-600 transition"
            >
              Supprimer le logo
            </button>
          )}
        </div>

        {/* ── Bannière ──────────────────────────────────────────────────── */}
        <div className="flex-[2] min-w-52">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Bannière de couverture
            {vitrine.bannerUrl && !bannerUploading && (
              <span className="ml-2 text-green-500 text-[10px] font-normal">✓ Enregistrée</span>
            )}
          </p>

          <div
            className={[
              'border-2 border-dashed rounded-2xl h-36 flex flex-col items-center justify-center',
              'text-center gap-2 relative overflow-hidden transition',
              bannerUploading
                ? 'opacity-60 cursor-wait border-[#E8622A]/40'
                : 'cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8]',
              bannerDisplay ? 'border-[#E8622A]/20' : 'border-gray-200',
            ].join(' ')}
            style={bannerDisplay ? {
              backgroundImage:    `url(${bannerDisplay})`,
              backgroundSize:     'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            {!bannerDisplay && !bannerUploading && (
              <>
                <ImageIcon size={28} className="text-gray-300" />
                <p className="text-xs text-gray-400 font-medium">Cliquez pour uploader</p>
                <p className="text-[10px] text-gray-300">PNG, JPG (max 20 Mo)</p>
              </>
            )}

            {bannerUploading && (
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className="w-6 h-6 border-2 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-white font-medium bg-black/50 px-2 py-0.5 rounded">
                  Upload en cours…
                </p>
              </div>
            )}

            {/* Input file en overlay — actif seulement quand pas d'upload en cours */}
            {!bannerUploading && (
              <input
                ref={bannerRef}
                type="file"
                accept="image/*,video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBanner(f); }}
              />
            )}
          </div>

          {bannerError && (
            <p className="text-xs text-red-500 mt-1.5">{bannerError}</p>
          )}

          {vitrine.bannerUrl && !bannerUploading && (
            <button
              onClick={() => onChange({ bannerUrl: undefined })}
              className="mt-1 text-[10px] text-red-400 hover:text-red-600 transition"
            >
              Supprimer la bannière
            </button>
          )}
        </div>
      </div>

      {/* Slogan */}
      <div>
        <label className={LABEL}>Slogan accrocheur</label>
        <input
          value={vitrine.slogan}
          onChange={(e) => onChange({ slogan: e.target.value })}
          maxLength={100}
          placeholder="Ex: Rejoignez une équipe passionnée au service de l'excellence hôtelière"
          className={INPUT}
        />
        <p className="text-xs text-gray-400 mt-1">{vitrine.slogan.length}/100 caractères</p>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Chiffres Clés
// ─────────────────────────────────────────────────────────────────────────────

export function ChiffresSection({
  vitrine,
  onChange,
}: {
  vitrine: VitrineData;
  onChange: (v: Partial<VitrineData>) => void;
}) {
  function updateKpi(id: string, kpi: VitrineKpi) {
    onChange({ kpis: vitrine.kpis.map((k) => (k.id === id ? kpi : k)) });
  }
  function deleteKpi(id: string) {
    onChange({ kpis: vitrine.kpis.filter((k) => k.id !== id) });
  }
  function addKpi() {
    if (vitrine.kpis.length >= 6) return;
    onChange({
      kpis: [
        ...vitrine.kpis,
        { id: `k-${Date.now()}`, icon: 'chart' as KpiIcon, value: '', label: '' },
      ],
    });
  }

  return (
    <SectionCard id="chiffres" title="Chiffres Clés"
      subtitle="Mettez en avant vos statistiques pour rassurer les candidats">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vitrine.kpis.map((kpi) => (
          <KpiTile
            key={kpi.id}
            kpi={kpi}
            onChange={(k) => updateKpi(kpi.id, k)}
            onDelete={() => deleteKpi(kpi.id)}
          />
        ))}
        {vitrine.kpis.length < 6 && (
          <button
            onClick={addKpi}
            className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4
                       flex flex-col items-center justify-center gap-2 text-gray-400
                       hover:border-[#E8622A]/50 hover:text-[#E8622A] hover:bg-[#FFFAF8] transition"
          >
            <Plus size={20} />
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Localisation du siège</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
            <input
              value={vitrine.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="Paris, France"
              className={INPUT + ' pl-8'}
            />
          </div>
        </div>
        <div>
          <label className={LABEL}>Secteur d'activité</label>
          <select
            value={vitrine.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className={INPUT}
          >
            <option value="">Choisir…</option>
            {SECTORS_LIST.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Culture & Valeurs
// ─────────────────────────────────────────────────────────────────────────────

function MiniEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // seulement au montage

  function exec(cmd: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E8622A]/30 focus-within:border-[#E8622A] transition">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
        {[
          { cmd: 'bold',                label: 'B',  cls: 'font-bold' },
          { cmd: 'italic',              label: 'I',  cls: 'italic'    },
          { cmd: 'underline',           label: 'U',  cls: 'underline' },
          { cmd: 'insertUnorderedList', label: '≡',  cls: ''          },
          { cmd: 'insertOrderedList',   label: '1.', cls: ''          },
        ].map(({ cmd, label, cls }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
            className={`w-7 h-7 rounded-lg text-xs text-gray-600 hover:bg-white hover:shadow-sm
                       transition flex items-center justify-center ${cls}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="min-h-32 p-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
      />
    </div>
  );
}

function ValueCard({
  val,
  onChange,
  onDelete,
}: {
  val: CompanyValue;
  onChange: (v: CompanyValue) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 relative group">
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400 transition"
      >
        <X size={14} />
      </button>
      <input
        value={val.title}
        onChange={(e) => onChange({ ...val, title: e.target.value })}
        placeholder="Titre de la valeur"
        maxLength={30}
        className="w-full font-bold text-gray-800 text-sm outline-none mb-2 border-b border-transparent
                   hover:border-gray-200 focus:border-[#E8622A] transition pb-1 pr-6"
      />
      <textarea
        value={val.description}
        onChange={(e) => onChange({ ...val, description: e.target.value })}
        placeholder="Décrivez cette valeur…"
        rows={3}
        maxLength={200}
        className="w-full text-xs text-gray-600 resize-none outline-none border-none bg-transparent"
      />
    </div>
  );
}

export function CultureSection({
  vitrine,
  onChange,
}: {
  vitrine: VitrineData;
  onChange: (v: Partial<VitrineData>) => void;
}) {
  function togglePerk(perk: Perk) {
    const has = vitrine.perks.includes(perk);
    onChange({
      perks: has ? vitrine.perks.filter((p) => p !== perk) : [...vitrine.perks, perk],
    });
  }

  return (
    <SectionCard id="culture" title="Culture & Valeurs"
      subtitle="Racontez votre histoire et partagez vos valeurs">
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Qui sommes-nous ?</p>
        <MiniEditor
          value={vitrine.aboutUs}
          onChange={(v) => onChange({ aboutUs: v })}
          placeholder="Racontez l'histoire de votre entreprise…"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-700">Nos Valeurs</p>
          {vitrine.values.length < 4 && (
            <button
              onClick={() =>
                onChange({
                  values: [
                    ...vitrine.values,
                    { id: `v-${Date.now()}`, title: '', description: '' },
                  ],
                })
              }
              className="text-xs text-[#E8622A] font-medium hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Ajouter
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vitrine.values.map((val) => (
            <ValueCard
              key={val.id}
              val={val}
              onChange={(v) =>
                onChange({ values: vitrine.values.map((x) => (x.id === val.id ? v : x)) })
              }
              onDelete={() =>
                onChange({ values: vitrine.values.filter((x) => x.id !== val.id) })
              }
            />
          ))}
          {vitrine.values.length < 4 && (
            <button
              onClick={() =>
                onChange({
                  values: [
                    ...vitrine.values,
                    { id: `v-${Date.now()}`, title: '', description: '' },
                  ],
                })
              }
              className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col
                         items-center justify-center gap-2 text-gray-400 hover:border-[#E8622A]/50
                         hover:text-[#E8622A] hover:bg-[#FFFAF8] transition min-h-24"
            >
              <Plus size={18} />
              <span className="text-xs">Ajouter une valeur</span>
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3">Avantages &amp; Bénéfices</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_PERKS.map((perk) => {
            const active = vitrine.perks.includes(perk);
            return (
              <label
                key={perk}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer
                            transition text-sm ${
                  active
                    ? 'border-[#E8622A] bg-[#FFF3EC] text-[#E8622A] font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => togglePerk(perk)}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    active ? 'border-[#E8622A] bg-[#E8622A]' : 'border-gray-300'
                  }`}
                >
                  {active && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {perk}
              </label>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Galerie Médias
// ─────────────────────────────────────────────────────────────────────────────

export function MediaSection({
  vitrine,
  onChange,
}: {
  vitrine: VitrineData;
  onChange: (v: Partial<VitrineData>) => void;
}) {
  const photoRef    = useRef<HTMLInputElement>(null);
  const [videoInput, setVideoInput] = useState('');
  const [uploading,  setUploading]  = useState(false);
  const [photoError, setPhotoError] = useState('');

  async function handlePhotoUpload(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    setPhotoError('');

    for (const file of Array.from(files)) {
      if (vitrine.photos.length >= 12) break;
      try {
        const { id, url } = await uploadPhoto(file);
        // Append photo with real Cloudinary URL
        onChange({ photos: [...vitrine.photos, { id, url }] });
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? 'Upload photo échoué.';
        setPhotoError(msg);
      }
    }

    setUploading(false);
    if (photoRef.current) photoRef.current.value = '';
  }

  async function removePhoto(id: string) {
    onChange({ photos: vitrine.photos.filter((p) => p.id !== id) });
    try {
      await deletePhoto(id);
    } catch {
      // Non-bloquant : la photo est déjà retirée de l'UI
    }
  }

  function addVideo() {
    if (!videoInput.trim()) return;
    const match = videoInput.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const thumb = match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
    onChange({
      videos: [
        ...vitrine.videos,
        {
          id: `vid-${Date.now()}`,
          url: videoInput.trim(),
          thumbnailUrl: thumb,
          title: 'Vidéo de présentation',
        },
      ],
    });
    setVideoInput('');
  }

  return (
    <SectionCard id="medias" title="Galerie Médias">
      {/* Photos */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3">
          Album Photo{' '}
          <span className="text-gray-400 font-normal">
            ({vitrine.photos.length}/12 max)
          </span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vitrine.photos.length < 12 && (
            <button
              onClick={() => photoRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col
                         items-center justify-center gap-1.5 text-gray-400 hover:border-[#E8622A]/50
                         hover:text-[#E8622A] hover:bg-[#FFFAF8] transition disabled:opacity-50"
            >
              <Plus size={20} />
              <span className="text-[10px] font-medium">
                {uploading ? 'Upload…' : 'Ajouter'}
              </span>
            </button>
          )}
          {vitrine.photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100"
            >
              <img
                src={photo.url}
                alt={photo.alt ?? ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                              transition flex items-center justify-center">
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center
                             text-white hover:bg-red-600 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {photoError && <p className="text-xs text-red-500 mt-2">{photoError}</p>}
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files)}
        />
      </div>

      {/* Videos */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3">Vidéos de présentation</p>
        <div className="space-y-3">
          {vitrine.videos.map((vid) => (
            <div
              key={vid.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group"
            >
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {vid.title ?? 'Vidéo'}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{vid.url}</p>
              </div>
              <button
                onClick={() =>
                  onChange({ videos: vitrine.videos.filter((v) => v.id !== vid.id) })
                }
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50
                           transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addVideo(); }
              }}
              placeholder="Lien YouTube ou Vimeo"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
            />
            <button
              onClick={addVideo}
              disabled={!videoInput.trim()}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs
                         font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-40"
            >
              <Plus size={13} /> Ajouter
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}





















// // src/components/recruteur/vitrine/VitrineSections.tsx
// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { ImageIcon, Plus, Trash2, X } from 'lucide-react';
// import type {
//   VitrineData, VitrineKpi, KpiIcon, CompanyValue, Perk,
// } from '@/types/vitrine.types';
// import { KPI_ICONS, ALL_PERKS, SECTORS_LIST } from '@/types/vitrine.types';
// import {
//   uploadLogo, uploadBanner, uploadPhoto, deletePhoto,
// } from '@/services/vitrine.service';

// const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';
// const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';

// // ── Section wrapper ───────────────────────────────────────────────────────────
// function SectionCard({ id, title, subtitle, children }: {
//   id: string; title: string; subtitle?: string; children: React.ReactNode;
// }) {
//   return (
//     <div id={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
//       <div>
//         <h2 className="font-bold text-gray-900 text-base">{title}</h2>
//         {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
//       </div>
//       {children}
//     </div>
//   );
// }

// // ── KPI Tile ──────────────────────────────────────────────────────────────────
// function KpiTile({ kpi, onChange, onDelete }: {
//   kpi: VitrineKpi;
//   onChange: (k: VitrineKpi) => void;
//   onDelete: () => void;
// }) {
//   const [showIconPicker, setShowIconPicker] = useState(false);
//   const iconDef = KPI_ICONS.find((i) => i.key === kpi.icon);
//   return (
//     <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 relative group">
//       <button onClick={onDelete}
//         className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400
//                    hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
//         <Trash2 size={13} />
//       </button>
//       <div className="relative mb-3">
//         <button onClick={() => setShowIconPicker((v) => !v)}
//           className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center
//                      justify-center text-xl hover:border-[#E8622A] transition">
//           {iconDef?.emoji ?? '📊'}
//         </button>
//         {showIconPicker && (
//           <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl
//                           shadow-lg z-10 p-2 grid grid-cols-5 gap-1 w-44">
//             {KPI_ICONS.map((ic) => (
//               <button key={ic.key} title={ic.label}
//                 onClick={() => { onChange({ ...kpi, icon: ic.key }); setShowIconPicker(false); }}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-base">
//                 {ic.emoji}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <input value={kpi.value} onChange={(e) => onChange({ ...kpi, value: e.target.value })}
//         placeholder="150"
//         className="w-full text-2xl font-bold text-gray-900 bg-transparent outline-none
//                    border-b border-transparent hover:border-gray-200 focus:border-[#E8622A] transition mb-1" />
//       <input value={kpi.label} onChange={(e) => onChange({ ...kpi, label: e.target.value })}
//         placeholder="Collaborateurs"
//         className="w-full text-xs text-gray-500 bg-transparent outline-none border-b border-transparent
//                    hover:border-gray-200 focus:border-[#E8622A] transition" />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Identité Visuelle
// // ─────────────────────────────────────────────────────────────────────────────

// interface IdentiteProps {
//   vitrine: VitrineData;
//   onChange: (v: Partial<VitrineData>) => void;
// }

// export function IdentiteSection({ vitrine, onChange }: IdentiteProps) {
//   // ── FIX PRINCIPAL : ne pas stocker l'URL dans un state local séparé
//   // On lit directement vitrine.logoUrl / vitrine.bannerUrl pour l'affichage.
//   // Un state "preview" local est utilisé SEULEMENT pendant l'upload
//   // (blob URL temporaire) et est remplacé par l'URL Cloudinary dès que
//   // l'upload réussit — ce qui met à jour vitrine via onChange().

//   const [logoUploading,   setLogoUploading]   = useState(false);
//   const [bannerUploading, setBannerUploading] = useState(false);
//   const [logoError,       setLogoError]       = useState('');
//   const [bannerError,     setBannerError]     = useState('');

//   // URLs d'aperçu temporaires (blob:) pendant l'upload en cours
//   const [logoBlobPreview,   setLogoBlobPreview]   = useState<string | undefined>();
//   const [bannerBlobPreview, setBannerBlobPreview] = useState<string | undefined>();

//   const logoRef   = useRef<HTMLInputElement>(null);
//   const bannerRef = useRef<HTMLInputElement>(null);

//   // L'URL à afficher : priorité au blob temporaire, sinon l'URL persistée
//   const logoDisplay   = logoBlobPreview   ?? vitrine.logoUrl   ?? undefined;
//   const bannerDisplay = bannerBlobPreview ?? vitrine.bannerUrl ?? undefined;

//   async function handleLogo(file: File) {
//     setLogoError('');
//     const blob = URL.createObjectURL(file);
//     setLogoBlobPreview(blob);   // aperçu immédiat
//     setLogoUploading(true);
//     try {
//       const { url } = await uploadLogo(file);
//       // ── CRITIQUE : mettre à jour vitrine.logoUrl avec l'URL Cloudinary
//       // C'est cette valeur qui sera envoyée au backend lors du handleSave()
//       onChange({ logoUrl: url });
//       setLogoBlobPreview(undefined);  // plus besoin du blob
//       URL.revokeObjectURL(blob);
//     } catch (err: any) {
//       setLogoError(err?.response?.data?.message ?? 'Upload échoué. Réessayez.');
//       setLogoBlobPreview(undefined);
//       URL.revokeObjectURL(blob);
//     } finally {
//       setLogoUploading(false);
//       if (logoRef.current) logoRef.current.value = '';
//     }
//   }

//   async function handleBanner(file: File) {
//     setBannerError('');
//     const blob = URL.createObjectURL(file);
//     setBannerBlobPreview(blob);
//     setBannerUploading(true);
//     try {
//       const { url } = await uploadBanner(file);
//       onChange({ bannerUrl: url });
//       setBannerBlobPreview(undefined);
//       URL.revokeObjectURL(blob);
//     } catch (err: any) {
//       setBannerError(err?.response?.data?.message ?? 'Upload échoué. Réessayez.');
//       setBannerBlobPreview(undefined);
//       URL.revokeObjectURL(blob);
//     } finally {
//       setBannerUploading(false);
//       if (bannerRef.current) bannerRef.current.value = '';
//     }
//   }

//   return (
//     <SectionCard id="identite" title="Identité Visuelle"
//       subtitle="Logo et bannière de couverture de votre entreprise">

//       <div className="flex gap-4 flex-wrap">

//         {/* ── Logo ──────────────────────────────────────────────────────── */}
//         <div className="flex-1 min-w-[140px]">
//           <p className="text-xs font-medium text-gray-600 mb-2">
//             Logo de l'entreprise
//             {vitrine.logoUrl && <span className="ml-2 text-green-500 text-[10px] font-normal">✓ Enregistré</span>}
//           </p>
//           <div
//             onClick={() => !logoUploading && logoRef.current?.click()}
//             className={[
//               'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center',
//               'text-center gap-2 h-36 transition',
//               logoUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8]',
//               logoDisplay ? 'border-[#E8622A]/20' : 'border-gray-200',
//             ].join(' ')}
//             style={logoDisplay ? {
//               backgroundImage:    `url(${logoDisplay})`,
//               backgroundSize:     'contain',
//               backgroundRepeat:   'no-repeat',
//               backgroundPosition: 'center',
//               backgroundColor:    '#fafafa',
//             } : {}}
//           >
//             {!logoDisplay && !logoUploading && (
//               <>
//                 <ImageIcon size={28} className="text-gray-300" />
//                 <p className="text-xs text-gray-400 font-medium">Cliquez pour uploader</p>
//                 <p className="text-[10px] text-gray-300">PNG, JPG (max 5Mo)</p>
//               </>
//             )}
//             {logoUploading && (
//               <div className="flex flex-col items-center gap-2">
//                 <div className="w-6 h-6 border-2 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
//                 <p className="text-xs text-gray-400">Upload…</p>
//               </div>
//             )}
//           </div>
//           <input ref={logoRef} type="file" accept="image/*" className="hidden"
//             onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogo(f); }} />
//           {logoError && <p className="text-xs text-red-500 mt-1">{logoError}</p>}
//           {vitrine.logoUrl && !logoUploading && (
//             <button
//               onClick={() => onChange({ logoUrl: undefined })}
//               className="mt-1 text-[10px] text-red-400 hover:text-red-600 transition"
//             >
//               Supprimer
//             </button>
//           )}
//         </div>

//         {/* ── Bannière ──────────────────────────────────────────────────── */}
//         <div className="flex-[2] min-w-52">
//           <p className="text-xs font-medium text-gray-600 mb-2">
//             Bannière de couverture
//             {vitrine.bannerUrl && <span className="ml-2 text-green-500 text-[10px] font-normal">✓ Enregistrée</span>}
//           </p>
//           <div
//             className={[
//               'border-2 border-dashed rounded-2xl h-36 flex flex-col items-center justify-center',
//               'text-center gap-2 relative overflow-hidden transition',
//               bannerUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8]',
//               bannerDisplay ? 'border-[#E8622A]/20' : 'border-gray-200',
//             ].join(' ')}
//             style={bannerDisplay ? {
//               backgroundImage:    `url(${bannerDisplay})`,
//               backgroundSize:     'cover',
//               backgroundPosition: 'center',
//             } : {}}
//           >
//             {!bannerDisplay && !bannerUploading && (
//               <>
//                 <ImageIcon size={28} className="text-gray-300" />
//                 <p className="text-xs text-gray-400 font-medium">Cliquez pour uploader</p>
//                 <p className="text-[10px] text-gray-300">PNG, JPG (max 20Mo)</p>
//               </>
//             )}
//             {bannerUploading && (
//               <div className="flex flex-col items-center gap-2 relative z-10">
//                 <div className="w-6 h-6 border-2 border-[#E8622A] border-t-transparent rounded-full animate-spin" />
//                 <p className="text-xs text-white font-medium bg-black/40 px-2 py-0.5 rounded">Upload…</p>
//               </div>
//             )}
//             {!bannerUploading && (
//               <input ref={bannerRef} type="file" accept="image/*,video/*"
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//                 onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBanner(f); }} />
//             )}
//           </div>
//           {bannerError && <p className="text-xs text-red-500 mt-1">{bannerError}</p>}
//           {vitrine.bannerUrl && !bannerUploading && (
//             <button
//               onClick={() => onChange({ bannerUrl: undefined })}
//               className="mt-1 text-[10px] text-red-400 hover:text-red-600 transition"
//             >
//               Supprimer
//             </button>
//           )}
//         </div>
//       </div>

//       <div>
//         <label className={LABEL}>Slogan accrocheur</label>
//         <input
//           value={vitrine.slogan}
//           onChange={(e) => onChange({ slogan: e.target.value })}
//           maxLength={100}
//           placeholder="Ex: Rejoignez une équipe passionnée au service de l'excellence hôtelière"
//           className={INPUT}
//         />
//         <p className="text-xs text-gray-400 mt-1">{vitrine.slogan.length}/100 caractères</p>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Chiffres Clés
// // ─────────────────────────────────────────────────────────────────────────────

// export function ChiffresSection({ vitrine, onChange }: { vitrine: VitrineData; onChange: (v: Partial<VitrineData>) => void }) {
//   function updateKpi(id: string, kpi: VitrineKpi) {
//     onChange({ kpis: vitrine.kpis.map((k) => k.id === id ? kpi : k) });
//   }
//   function deleteKpi(id: string) {
//     onChange({ kpis: vitrine.kpis.filter((k) => k.id !== id) });
//   }
//   function addKpi() {
//     if (vitrine.kpis.length >= 6) return;
//     onChange({ kpis: [...vitrine.kpis, { id: `k-${Date.now()}`, icon: 'chart' as KpiIcon, value: '', label: '' }] });
//   }
//   return (
//     <SectionCard id="chiffres" title="Chiffres Clés"
//       subtitle="Mettez en avant vos statistiques pour rassurer les candidats">
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {vitrine.kpis.map((kpi) => (
//           <KpiTile key={kpi.id} kpi={kpi}
//             onChange={(k) => updateKpi(kpi.id, k)}
//             onDelete={() => deleteKpi(kpi.id)} />
//         ))}
//         {vitrine.kpis.length < 6 && (
//           <button onClick={addKpi}
//             className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4
//                        flex flex-col items-center justify-center gap-2 text-gray-400
//                        hover:border-[#E8622A]/50 hover:text-[#E8622A] hover:bg-[#FFFAF8] transition">
//             <Plus size={20} /><span className="text-xs font-medium">Ajouter</span>
//           </button>
//         )}
//       </div>
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className={LABEL}>Localisation du siège</label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
//             <input value={vitrine.location} onChange={(e) => onChange({ location: e.target.value })}
//               placeholder="Paris, France" className={INPUT + ' pl-8'} />
//           </div>
//         </div>
//         <div>
//           <label className={LABEL}>Secteur d'activité</label>
//           <select value={vitrine.sector} onChange={(e) => onChange({ sector: e.target.value })} className={INPUT}>
//             <option value="">Choisir…</option>
//             {SECTORS_LIST.map((s) => <option key={s}>{s}</option>)}
//           </select>
//         </div>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Culture & Valeurs
// // ─────────────────────────────────────────────────────────────────────────────

// function MiniEditor({ value, onChange, placeholder }: {
//   value: string; onChange: (v: string) => void; placeholder: string;
// }) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerHTML !== value) {
//       editorRef.current.innerHTML = value;
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // uniquement au montage

//   function exec(cmd: string) {
//     editorRef.current?.focus();
//     document.execCommand(cmd, false);
//   }
//   return (
//     <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E8622A]/30 focus-within:border-[#E8622A] transition">
//       <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
//         {[
//           { cmd: 'bold',                label: 'B',  cls: 'font-bold' },
//           { cmd: 'italic',              label: 'I',  cls: 'italic'    },
//           { cmd: 'underline',           label: 'U',  cls: 'underline' },
//           { cmd: 'insertUnorderedList', label: '≡',  cls: ''          },
//           { cmd: 'insertOrderedList',   label: '1.', cls: ''          },
//         ].map(({ cmd, label, cls }) => (
//           <button key={cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
//             className={`w-7 h-7 rounded-lg text-xs text-gray-600 hover:bg-white hover:shadow-sm
//                        transition flex items-center justify-center ${cls}`}>
//             {label}
//           </button>
//         ))}
//       </div>
//       <div ref={editorRef} contentEditable suppressContentEditableWarning
//         onInput={(e) => onChange(e.currentTarget.innerHTML)}
//         className="min-h-32 p-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none"
//         data-placeholder={placeholder} />
//     </div>
//   );
// }

// function ValueCard({ val, onChange, onDelete }: {
//   val: CompanyValue; onChange: (v: CompanyValue) => void; onDelete: () => void;
// }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-4 relative group">
//       <button onClick={onDelete} className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400 transition">
//         <X size={14} />
//       </button>
//       <input value={val.title} onChange={(e) => onChange({ ...val, title: e.target.value })}
//         placeholder="Titre de la valeur" maxLength={30}
//         className="w-full font-bold text-gray-800 text-sm outline-none mb-2 border-b border-transparent
//                    hover:border-gray-200 focus:border-[#E8622A] transition pb-1 pr-6" />
//       <textarea value={val.description} onChange={(e) => onChange({ ...val, description: e.target.value })}
//         placeholder="Décrivez cette valeur…" rows={3} maxLength={200}
//         className="w-full text-xs text-gray-600 resize-none outline-none border-none bg-transparent" />
//     </div>
//   );
// }

// export function CultureSection({ vitrine, onChange }: { vitrine: VitrineData; onChange: (v: Partial<VitrineData>) => void }) {
//   function togglePerk(perk: Perk) {
//     const has = vitrine.perks.includes(perk);
//     onChange({ perks: has ? vitrine.perks.filter((p) => p !== perk) : [...vitrine.perks, perk] });
//   }
//   return (
//     <SectionCard id="culture" title="Culture & Valeurs" subtitle="Racontez votre histoire et partagez vos valeurs">
//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-2">Qui sommes-nous ?</p>
//         <MiniEditor value={vitrine.aboutUs} onChange={(v) => onChange({ aboutUs: v })}
//           placeholder="Racontez l'histoire de votre entreprise…" />
//       </div>
//       <div>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-semibold text-gray-700">Nos Valeurs</p>
//           {vitrine.values.length < 4 && (
//             <button onClick={() => onChange({ values: [...vitrine.values, { id: `v-${Date.now()}`, title: '', description: '' }] })}
//               className="text-xs text-[#E8622A] font-medium hover:underline flex items-center gap-1">
//               <Plus size={12} /> Ajouter
//             </button>
//           )}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {vitrine.values.map((val) => (
//             <ValueCard key={val.id} val={val}
//               onChange={(v) => onChange({ values: vitrine.values.map((x) => x.id === val.id ? v : x) })}
//               onDelete={() => onChange({ values: vitrine.values.filter((x) => x.id !== val.id) })} />
//           ))}
//           {vitrine.values.length < 4 && (
//             <button onClick={() => onChange({ values: [...vitrine.values, { id: `v-${Date.now()}`, title: '', description: '' }] })}
//               className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center
//                          justify-center gap-2 text-gray-400 hover:border-[#E8622A]/50 hover:text-[#E8622A]
//                          hover:bg-[#FFFAF8] transition min-h-24">
//               <Plus size={18} /><span className="text-xs">Ajouter une valeur</span>
//             </button>
//           )}
//         </div>
//       </div>
//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-3">Avantages &amp; Bénéfices</p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//           {ALL_PERKS.map((perk) => {
//             const active = vitrine.perks.includes(perk);
//             return (
//               <label key={perk} className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition text-sm ${
//                 active ? 'border-[#E8622A] bg-[#FFF3EC] text-[#E8622A] font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
//               }`}>
//                 <input type="checkbox" checked={active} onChange={() => togglePerk(perk)} className="hidden" />
//                 <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
//                   active ? 'border-[#E8622A] bg-[#E8622A]' : 'border-gray-300'
//                 }`}>
//                   {active && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
//                     <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>}
//                 </span>
//                 {perk}
//               </label>
//             );
//           })}
//         </div>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Galerie Médias
// // ─────────────────────────────────────────────────────────────────────────────

// export function MediaSection({ vitrine, onChange }: { vitrine: VitrineData; onChange: (v: Partial<VitrineData>) => void }) {
//   const photoRef     = useRef<HTMLInputElement>(null);
//   const [videoInput, setVideoInput] = useState('');
//   const [uploading,  setUploading]  = useState(false);

//   async function handlePhotoUpload(files: FileList | null) {
//     if (!files) return;
//     setUploading(true);
//     for (const file of Array.from(files)) {
//       if (vitrine.photos.length >= 12) break;
//       try {
//         // ── FIX : utiliser uniquement l'URL Cloudinary retournée par l'API
//         const { id, url } = await uploadPhoto(file);
//         onChange({ photos: [...vitrine.photos, { id, url }] });
//       } catch (err) {
//         console.error('[MediaSection] Photo upload échoué', err);
//       }
//     }
//     setUploading(false);
//     if (photoRef.current) photoRef.current.value = '';
//   }

//   async function removePhoto(id: string) {
//     onChange({ photos: vitrine.photos.filter((p) => p.id !== id) });
//     try { await deletePhoto(id); } catch {}
//   }

//   function addVideo() {
//     if (!videoInput.trim()) return;
//     const match = videoInput.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
//     const thumb = match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
//     onChange({
//       videos: [...vitrine.videos, {
//         id: `vid-${Date.now()}`, url: videoInput.trim(), thumbnailUrl: thumb, title: 'Vidéo de présentation',
//       }],
//     });
//     setVideoInput('');
//   }

//   return (
//     <SectionCard id="medias" title="Galerie Médias">
//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-3">
//           Album Photo <span className="text-gray-400 font-normal">({vitrine.photos.length}/12 max)</span>
//         </p>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {vitrine.photos.length < 12 && (
//             <button onClick={() => photoRef.current?.click()} disabled={uploading}
//               className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col
//                          items-center justify-center gap-1.5 text-gray-400 hover:border-[#E8622A]/50
//                          hover:text-[#E8622A] hover:bg-[#FFFAF8] transition disabled:opacity-50">
//               <Plus size={20} />
//               <span className="text-[10px] font-medium">{uploading ? 'Upload…' : 'Ajouter'}</span>
//             </button>
//           )}
//           {vitrine.photos.map((photo) => (
//             <div key={photo.id} className="relative aspect-square group rounded-2xl overflow-hidden border border-gray-100">
//               <img src={photo.url} alt={photo.alt ?? ''} className="w-full h-full object-cover" />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                 <button onClick={() => removePhoto(photo.id)}
//                   className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
//                   <Trash2 size={13} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <input ref={photoRef} type="file" accept="image/*" multiple className="hidden"
//           onChange={(e) => handlePhotoUpload(e.target.files)} />
//       </div>
//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-3">Vidéos de présentation</p>
//         <div className="space-y-3">
//           {vitrine.videos.map((vid) => (
//             <div key={vid.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
//               <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-gray-700 truncate">{vid.title ?? 'Vidéo'}</p>
//                 <p className="text-[10px] text-gray-400 truncate">{vid.url}</p>
//               </div>
//               <button onClick={() => onChange({ videos: vitrine.videos.filter((v) => v.id !== vid.id) })}
//                 className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <input value={videoInput} onChange={(e) => setVideoInput(e.target.value)}
//               onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addVideo(); } }}
//               placeholder="Lien YouTube ou Vimeo"
//               className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white
//                          focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition" />
//             <button onClick={addVideo} disabled={!videoInput.trim()}
//               className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium
//                          px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-40">
//               <Plus size={13} /> Ajouter
//             </button>
//           </div>
//         </div>
//       </div>
//     </SectionCard>
//   );
// }





















// // src/components/recruteur/vitrine/VitrineSections.tsx
// 'use client';

// import { useRef, useState } from 'react';
// import { Upload, ImageIcon, Plus, Trash2, X } from 'lucide-react';
// import type {
//   VitrineData, VitrineKpi, KpiIcon, CompanyValue, Perk,
// } from '@/types/vitrine.types';
// import { KPI_ICONS, ALL_PERKS, SECTORS_LIST } from '@/types/vitrine.types';
// import {
//   uploadLogo, uploadBanner, uploadPhoto, deletePhoto,
// } from '@/services/vitrine.service';

// const INPUT = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';
// const LABEL = 'block text-xs font-medium text-gray-500 mb-1.5';

// // ── Shared section wrapper ────────────────────────────────────────────────────
// function SectionCard({ id, title, subtitle, children }: {
//   id: string; title: string; subtitle?: string; children: React.ReactNode;
// }) {
//   return (
//     <div id={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
//       <div>
//         <h2 className="font-bold text-gray-900 text-base">{title}</h2>
//         {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
//       </div>
//       {children}
//     </div>
//   );
// }

// // ── Drop zone ─────────────────────────────────────────────────────────────────
// function DropZone({ label, hint, preview, onFile, aspect = 'square' }: {
//   label: string; hint: string; preview?: string;
//   onFile: (f: File) => void; aspect?: 'square' | 'wide';
// }) {
//   const ref = useRef<HTMLInputElement>(null);
//   return (
//     <div className="flex-1 min-w-0">
//       <p className="text-xs font-medium text-gray-600 mb-2">{label}</p>
//       <div
//         onClick={() => ref.current?.click()}
//         className={`border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer
//                    hover:border-[#E8622A]/50 hover:bg-[#FFFAF8] transition flex flex-col
//                    items-center justify-center text-center gap-2
//                    ${aspect === 'wide' ? 'h-32' : 'h-36'}`}
//         style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
//       >
//         {!preview && (
//           <>
//             <ImageIcon size={28} className="text-gray-300" />
//             <p className="text-xs text-gray-400 font-medium">{hint}</p>
//             <p className="text-[10px] text-gray-300">PNG, JPG (max 5Mo)</p>
//           </>
//         )}
//       </div>
//       <input ref={ref} type="file" accept="image/*" className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
//     </div>
//   );
// }

// // ── KPI Tile ──────────────────────────────────────────────────────────────────
// function KpiTile({ kpi, onChange, onDelete }: {
//   kpi: VitrineKpi;
//   onChange: (k: VitrineKpi) => void;
//   onDelete: () => void;
// }) {
//   const [showIconPicker, setShowIconPicker] = useState(false);
//   const iconDef = KPI_ICONS.find((i) => i.key === kpi.icon);

//   return (
//     <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 relative group">
//       <button onClick={onDelete}
//         className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400
//                    hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
//         <Trash2 size={13} />
//       </button>

//       {/* Icon picker */}
//       <div className="relative mb-3">
//         <button onClick={() => setShowIconPicker((v) => !v)}
//           className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center
//                      justify-center text-xl hover:border-[#E8622A] transition">
//           {iconDef?.emoji ?? '📊'}
//         </button>
//         {showIconPicker && (
//           <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl
//                           shadow-lg z-10 p-2 grid grid-cols-5 gap-1 w-44">
//             {KPI_ICONS.map((ic) => (
//               <button key={ic.key} title={ic.label}
//                 onClick={() => { onChange({ ...kpi, icon: ic.key }); setShowIconPicker(false); }}
//                 className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-base">
//                 {ic.emoji}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <input value={kpi.value} onChange={(e) => onChange({ ...kpi, value: e.target.value })}
//         placeholder="150" className="w-full text-2xl font-bold text-gray-900 bg-transparent
//                                    outline-none border-b border-transparent hover:border-gray-200
//                                    focus:border-[#E8622A] transition mb-1" />
//       <input value={kpi.label} onChange={(e) => onChange({ ...kpi, label: e.target.value })}
//         placeholder="Collaborateurs" className="w-full text-xs text-gray-500 bg-transparent
//                                                outline-none border-b border-transparent
//                                                hover:border-gray-200 focus:border-[#E8622A] transition" />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Identité Visuelle
// // ─────────────────────────────────────────────────────────────────────────────

// interface IdentiteProps {
//   vitrine: VitrineData;
//   onChange: (v: Partial<VitrineData>) => void;
// }

// export function IdentiteSection({ vitrine, onChange }: IdentiteProps) {
//   const [logoPreview,   setLogoPreview]   = useState<string | undefined>(vitrine.logoUrl);
//   const [bannerPreview, setBannerPreview] = useState<string | undefined>(vitrine.bannerUrl);

//   async function handleLogo(file: File) {
//     const url = URL.createObjectURL(file);
//     setLogoPreview(url);
//     try {
//       const { url: apiUrl } = await uploadLogo(file);
//       onChange({ logoUrl: apiUrl });
//     } catch {
//       onChange({ logoUrl: url });
//     }
//   }

//   async function handleBanner(file: File) {
//     const url = URL.createObjectURL(file);
//     setBannerPreview(url);
//     try {
//       const { url: apiUrl } = await uploadBanner(file);
//       onChange({ bannerUrl: apiUrl });
//     } catch {
//       onChange({ bannerUrl: url });
//     }
//   }

//   return (
//     <SectionCard id="identite" title="Identité Visuelle"
//       subtitle="Logo et bannière de couverture de votre entreprise">
//       <div className="flex gap-4 flex-wrap">
//         <DropZone label="Logo de l'entreprise" hint="Glissez votre logo ici" preview={logoPreview} onFile={handleLogo} />
//         <div className="flex-[2] min-w-52">
//           <p className="text-xs font-medium text-gray-600 mb-2">Bannière de couverture</p>
//           <div onClick={() => {}} className="border-2 border-dashed border-gray-200 rounded-2xl
//                                             cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8]
//                                             transition h-36 flex flex-col items-center justify-center
//                                             text-center gap-2 relative overflow-hidden"
//             style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover' } : {}}>
//             {!bannerPreview && (
//               <>
//                 <ImageIcon size={28} className="text-gray-300" />
//                 <p className="text-xs text-gray-400 font-medium">Glissez votre bannière ici</p>
//                 <p className="text-[10px] text-gray-300">PNG, JPG ou MP4 pour vidéo (max 20Mo)</p>
//               </>
//             )}
//             <input type="file" accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer"
//               onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBanner(f); }} />
//           </div>
//         </div>
//       </div>

//       <div>
//         <label className={LABEL}>Slogan accrocheur</label>
//         <input value={vitrine.slogan}
//           onChange={(e) => onChange({ slogan: e.target.value })}
//           maxLength={100}
//           placeholder="Ex: Rejoignez une équipe passionnée au service de l'excellence hôtelière"
//           className={INPUT} />
//         <p className="text-xs text-gray-400 mt-1">{vitrine.slogan.length}/100 caractères</p>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Chiffres Clés
// // ─────────────────────────────────────────────────────────────────────────────

// interface ChiffresProps {
//   vitrine: VitrineData;
//   onChange: (v: Partial<VitrineData>) => void;
// }

// export function ChiffresSection({ vitrine, onChange }: ChiffresProps) {
//   function updateKpi(id: string, kpi: VitrineKpi) {
//     onChange({ kpis: vitrine.kpis.map((k) => k.id === id ? kpi : k) });
//   }
//   function deleteKpi(id: string) {
//     onChange({ kpis: vitrine.kpis.filter((k) => k.id !== id) });
//   }
//   function addKpi() {
//     if (vitrine.kpis.length >= 6) return;
//     onChange({ kpis: [...vitrine.kpis, { id: `k-${Date.now()}`, icon: 'chart', value: '', label: '' }] });
//   }

//   return (
//     <SectionCard id="chiffres" title="Chiffres Clés"
//       subtitle="Mettez en avant vos statistiques pour rassurer les candidats">
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {vitrine.kpis.map((kpi) => (
//           <KpiTile key={kpi.id} kpi={kpi}
//             onChange={(k) => updateKpi(kpi.id, k)}
//             onDelete={() => deleteKpi(kpi.id)} />
//         ))}
//         {vitrine.kpis.length < 6 && (
//           <button onClick={addKpi}
//             className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4
//                        flex flex-col items-center justify-center gap-2 text-gray-400
//                        hover:border-[#E8622A]/50 hover:text-[#E8622A] hover:bg-[#FFFAF8] transition">
//             <Plus size={20} />
//             <span className="text-xs font-medium">Ajouter</span>
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className={LABEL}>Localisation du siège</label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📍</span>
//             <input value={vitrine.location}
//               onChange={(e) => onChange({ location: e.target.value })}
//               placeholder="Paris, France"
//               className={INPUT + ' pl-8'} />
//           </div>
//         </div>
//         <div>
//           <label className={LABEL}>Secteur d'activité</label>
//           <select value={vitrine.sector}
//             onChange={(e) => onChange({ sector: e.target.value })}
//             className={INPUT}>
//             <option value="">Choisir…</option>
//             {SECTORS_LIST.map((s) => <option key={s}>{s}</option>)}
//           </select>
//         </div>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Culture & Valeurs
// // ─────────────────────────────────────────────────────────────────────────────

// interface CultureProps {
//   vitrine: VitrineData;
//   onChange: (v: Partial<VitrineData>) => void;
// }

// // Mini WYSIWYG toolbar (formatting via document.execCommand — acceptable for this use case)
// function MiniEditor({ value, onChange, placeholder }: {
//   value: string; onChange: (v: string) => void; placeholder: string;
// }) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   function exec(cmd: string) {
//     editorRef.current?.focus();
//     document.execCommand(cmd, false);
//   }
//   return (
//     <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E8622A]/30 focus-within:border-[#E8622A] transition">
//       <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
//         {[
//           { cmd: 'bold',          label: 'B', cls: 'font-bold'   },
//           { cmd: 'italic',        label: 'I', cls: 'italic'      },
//           { cmd: 'underline',     label: 'U', cls: 'underline'   },
//           { cmd: 'insertUnorderedList', label: '≡', cls: ''      },
//           { cmd: 'insertOrderedList',   label: '1.', cls: ''     },
//         ].map(({ cmd, label, cls }) => (
//           <button key={cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
//             className={`w-7 h-7 rounded-lg text-xs text-gray-600 hover:bg-white hover:shadow-sm
//                        transition flex items-center justify-center ${cls}`}>
//             {label}
//           </button>
//         ))}
//       </div>
//       <div
//         ref={editorRef}
//         contentEditable
//         suppressContentEditableWarning
//         onInput={(e) => onChange(e.currentTarget.innerHTML)}
//         className="min-h-32 p-3 text-sm text-gray-800 outline-none prose prose-sm max-w-none"
//         dangerouslySetInnerHTML={{ __html: value }}
//         data-placeholder={placeholder}
//         style={{ '--placeholder': `"${placeholder}"` } as React.CSSProperties}
//       />
//     </div>
//   );
// }

// function ValueCard({ val, onChange, onDelete }: {
//   val: CompanyValue; onChange: (v: CompanyValue) => void; onDelete: () => void;
// }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-4 relative group">
//       <button onClick={onDelete}
//         className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-400 transition">
//         <X size={14} />
//       </button>
//       <input value={val.title} onChange={(e) => onChange({ ...val, title: e.target.value })}
//         placeholder="Titre de la valeur" maxLength={30}
//         className="w-full font-bold text-gray-800 text-sm outline-none mb-2 border-b border-transparent
//                    hover:border-gray-200 focus:border-[#E8622A] transition pb-1 pr-6" />
//       <textarea value={val.description} onChange={(e) => onChange({ ...val, description: e.target.value })}
//         placeholder="Décrivez cette valeur…" rows={3} maxLength={200}
//         className="w-full text-xs text-gray-600 resize-none outline-none border-none bg-transparent" />
//     </div>
//   );
// }

// export function CultureSection({ vitrine, onChange }: CultureProps) {
//   function updateValue(id: string, val: CompanyValue) {
//     onChange({ values: vitrine.values.map((v) => v.id === id ? val : v) });
//   }
//   function deleteValue(id: string) {
//     onChange({ values: vitrine.values.filter((v) => v.id !== id) });
//   }
//   function addValue() {
//     if (vitrine.values.length >= 4) return;
//     onChange({ values: [...vitrine.values, { id: `v-${Date.now()}`, title: '', description: '' }] });
//   }
//   function togglePerk(perk: Perk) {
//     const has = vitrine.perks.includes(perk);
//     onChange({ perks: has ? vitrine.perks.filter((p) => p !== perk) : [...vitrine.perks, perk] });
//   }

//   return (
//     <SectionCard id="culture" title="Culture & Valeurs"
//       subtitle="Racontez votre histoire et partagez vos valeurs">

//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-2">Qui sommes-nous ?</p>
//         <MiniEditor
//           value={vitrine.aboutUs}
//           onChange={(v) => onChange({ aboutUs: v })}
//           placeholder="Racontez l'histoire de votre entreprise, votre mission, votre vision…"
//         />
//       </div>

//       <div>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-semibold text-gray-700">Nos Valeurs</p>
//           {vitrine.values.length < 4 && (
//             <button onClick={addValue}
//               className="text-xs text-[#E8622A] font-medium hover:underline flex items-center gap-1">
//               <Plus size={12} /> Ajouter une valeur
//             </button>
//           )}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {vitrine.values.map((val) => (
//             <ValueCard key={val.id} val={val}
//               onChange={(v) => updateValue(val.id, v)}
//               onDelete={() => deleteValue(val.id)} />
//           ))}
//           {vitrine.values.length < 4 && (
//             <button onClick={addValue}
//               className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col
//                          items-center justify-center gap-2 text-gray-400 hover:border-[#E8622A]/50
//                          hover:text-[#E8622A] hover:bg-[#FFFAF8] transition min-h-24">
//               <Plus size={18} /> <span className="text-xs">Ajouter une valeur</span>
//             </button>
//           )}
//         </div>
//       </div>

//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-3">Avantages &amp; Bénéfices</p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//           {ALL_PERKS.map((perk) => {
//             const active = vitrine.perks.includes(perk);
//             return (
//               <label key={perk}
//                 className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer transition text-sm ${
//                   active
//                     ? 'border-[#E8622A] bg-[#FFF3EC] text-[#E8622A] font-semibold'
//                     : 'border-gray-200 text-gray-600 hover:border-gray-300'
//                 }`}>
//                 <input type="checkbox" checked={active} onChange={() => togglePerk(perk)} className="hidden" />
//                 <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
//                   active ? 'border-[#E8622A] bg-[#E8622A]' : 'border-gray-300'
//                 }`}>
//                   {active && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
//                     <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>}
//                 </span>
//                 {perk}
//               </label>
//             );
//           })}
//         </div>
//       </div>
//     </SectionCard>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION: Galerie Médias
// // ─────────────────────────────────────────────────────────────────────────────

// interface MediaProps {
//   vitrine: VitrineData;
//   onChange: (v: Partial<VitrineData>) => void;
// }

// function getYoutubeThumbnail(url: string): string {
//   const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
//   if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
//   return '';
// }

// export function MediaSection({ vitrine, onChange }: MediaProps) {
//   const photoRef = useRef<HTMLInputElement>(null);
//   const [videoInput, setVideoInput] = useState('');
//   const [uploading, setUploading] = useState(false);

//   async function handlePhotoUpload(files: FileList | null) {
//     if (!files) return;
//     setUploading(true);
//     for (const file of Array.from(files)) {
//       if (vitrine.photos.length >= 12) break;
//       const url = URL.createObjectURL(file);
//       try {
//         const { id, url: apiUrl } = await uploadPhoto(file);
//         onChange({ photos: [...vitrine.photos, { id, url: apiUrl }] });
//       } catch {
//         onChange({ photos: [...vitrine.photos, { id: `p-${Date.now()}-${Math.random()}`, url }] });
//       }
//     }
//     setUploading(false);
//   }

//   async function removePhoto(id: string) {
//     onChange({ photos: vitrine.photos.filter((p) => p.id !== id) });
//     try { await deletePhoto(id); } catch {}
//   }

//   function addVideo() {
//     if (!videoInput.trim()) return;
//     const thumb = getYoutubeThumbnail(videoInput);
//     onChange({
//       videos: [...vitrine.videos, {
//         id: `vid-${Date.now()}`,
//         url: videoInput.trim(),
//         thumbnailUrl: thumb,
//         title: 'Vidéo de présentation',
//       }],
//     });
//     setVideoInput('');
//   }

//   function removeVideo(id: string) {
//     onChange({ videos: vitrine.videos.filter((v) => v.id !== id) });
//   }

//   return (
//     <SectionCard id="medias" title="Galerie Médias">
//       {/* Photos */}
//       <div>
//         <div className="flex items-center justify-between mb-3">
//           <p className="text-xs font-semibold text-gray-700">
//             Album Photo <span className="text-gray-400 font-normal">({vitrine.photos.length}/12 max)</span>
//           </p>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {/* Add button */}
//           {vitrine.photos.length < 12 && (
//             <button onClick={() => photoRef.current?.click()} disabled={uploading}
//               className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col
//                          items-center justify-center gap-1.5 text-gray-400 hover:border-[#E8622A]/50
//                          hover:text-[#E8622A] hover:bg-[#FFFAF8] transition">
//               <Plus size={20} />
//               <span className="text-[10px] font-medium">{uploading ? 'Upload…' : 'Ajouter une photo'}</span>
//             </button>
//           )}
//           {/* Photos */}
//           {vitrine.photos.map((photo) => (
//             <div key={photo.id} className="relative aspect-square group rounded-2xl overflow-hidden">
//               <img src={photo.url} alt={photo.alt ?? ''} className="w-full h-full object-cover" />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition
//                               flex items-center justify-center">
//                 <button onClick={() => removePhoto(photo.id)}
//                   className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
//                   <Trash2 size={13} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <input ref={photoRef} type="file" accept="image/*" multiple className="hidden"
//           onChange={(e) => handlePhotoUpload(e.target.files)} />
//       </div>

//       {/* Videos */}
//       <div>
//         <p className="text-xs font-semibold text-gray-700 mb-3">Vidéos de présentation</p>
//         <div className="space-y-3">
//           {vitrine.videos.map((vid) => (
//             <div key={vid.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
//               <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2H8.18v13.88a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.28 0 .54.04.79.1V8.18l7.93-1.18v6.23a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5" />
//                 </svg>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-gray-700 truncate">{vid.title ?? 'Vidéo'}</p>
//                 <p className="text-[10px] text-gray-400 truncate">{vid.url}</p>
//               </div>
//               <button onClick={() => removeVideo(vid.id)}
//                 className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition
//                            opacity-0 group-hover:opacity-100">
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           ))}
//           <div className="flex gap-2">
//             <input value={videoInput} onChange={(e) => setVideoInput(e.target.value)}
//               onKeyDown={(e) => { if (e.key === 'Enter') addVideo(); }}
//               placeholder="Lien YouTube ou Vimeo"
//               className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white
//                          focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition" />
//             <button onClick={addVideo} disabled={!videoInput.trim()}
//               className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium
//                          px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-40">
//               <Plus size={13} /> Ajouter une vidéo
//             </button>
//           </div>
//         </div>
//       </div>
//     </SectionCard>
//   );
// }