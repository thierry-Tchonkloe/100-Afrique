// src/components/Dashboard/destinationedit/useDestinationEditForm.ts
"use client";
import { useCallback, useRef, useState } from 'react';
import { updateDestination, createDestination, editDestination, UpdateDestinationPayload } from '@/services/Dashboard/destinationservice';
import { Article, Tag, STATUS_API_TO_UI, STATUS_UI_TO_API } from '@/services/Dashboard/articleservice';

export type TabId = 'general' | 'media' | 'pratique';
export interface GalleryImage { id: string; url: string; file?: File }

export interface DestinationForm {
  title: string;
  status: string;
  categoryId: number | undefined;
  selectedTagIds: number[];
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
  slogan: string;
  typeZone: string;
  niveauGeographique: string;
  description: string;
  continent: string;
  regionAssociee: string;
  langue: string;
  monnaie: string;
  fuseauHoraire: string;
  officeTourisme: string;
  climatDominant: string;
  population: string;
  codeTel: string;
  meillerePeriode: string;
}

export const TYPES_ZONE = ['Pays', 'Région', 'Ville', 'Site', 'Île'];
export const NIVEAUX_GEO = ['National', 'Régional', 'Local'];
export const CONTINENTS = ['Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Europe', 'Océanie'];
export const REGIONS: Record<string, string[]> = {
  Afrique: ["Afrique de l'Ouest", "Afrique de l'Est", 'Afrique du Nord', 'Afrique Centrale', 'Afrique Australe'],
  'Amérique du Nord': ['Caraïbes', 'Amérique Centrale', 'Amérique du Nord'],
  'Amérique du Sud': ['Cône Sud', 'Amazonie', 'Andes'],
  Asie: ['Asie du Sud-Est', 'Asie du Sud', "Asie de l'Est", 'Moyen-Orient'],
  Europe: ["Europe de l'Ouest", "Europe de l'Est", 'Europe du Sud', 'Europe du Nord'],
  Océanie: ['Australasie', 'Mélanésie', 'Polynésie', 'Micronésie'],
};
export const CLIMATS = ['Tropical', 'Subtropical', 'Tempéré', 'Méditerranéen', 'Continental', 'Aride', 'Polaire'];
export const FUSEAUX = Array.from({ length: 25 }, (_, i) => `UTC${i < 12 ? `-${12 - i}` : i === 12 ? '+0' : `+${i - 12}`}`);

function extractBodyText(article: Article): string {
  if (!article.content || !Array.isArray(article.content)) return '';
  return (article.content as { type: string; value: string }[])
    .filter((b) => b.type === 'text' || b.type === 'heading')
    .map((b) => (b.type === 'heading' ? `## ${b.value}` : b.value))
    .join('\n\n');
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/admin/articles', { method: 'POST', body: fd });
  const data = await res.json();
  const url = data.url ?? data.data?.coverImage ?? null;
  if (!url) throw new Error("URL d'upload introuvable.");
  return url;
}

export function useDestinationEditForm(destination: Article, onSubmit?: (a: Article) => void) {
  const dest = destination?.destination ?? null;
  const destIdRef = useRef<number | null>(dest?.id ?? null);

  const [form, setForm] = useState<DestinationForm>({
    title: destination.title ?? '',
    status: STATUS_API_TO_UI[destination.status] ?? 'DRAFT',
    categoryId: destination.category?.id ?? undefined,
    selectedTagIds: (destination.tags ?? []).map((t: Tag) => t.id),
    metaTitle: destination.metaTitle ?? '',
    metaDescription: destination.metaDescription ?? '',
    featured: dest?.featured ?? false,
    slogan: dest?.slogan ?? '',
    typeZone: dest?.typeZone ?? TYPES_ZONE[0],
    niveauGeographique: dest?.niveauGeographique ?? NIVEAUX_GEO[0],
    description: dest?.description ?? extractBodyText(destination),
    continent: dest?.continent ?? CONTINENTS[0],
    regionAssociee: dest?.regionAssociee ?? REGIONS[CONTINENTS[0]]?.[0] ?? '',
    langue: dest?.langue ?? '',
    monnaie: dest?.monnaie ?? '',
    fuseauHoraire: dest?.fuseauHoraire ?? '',
    officeTourisme: dest?.officeTourisme ?? '',
    climatDominant: dest?.climatDominant ?? '',
    population: dest?.population ?? '',
    codeTel: dest?.codeTel ?? '',
    meillerePeriode: dest?.meillerePeriode ?? '',
  });

  const [coverImage, setCoverImage] = useState<string | null>(dest?.coverImage ?? destination.coverImage ?? null);
  const [coverPendingFile, setCoverPendingFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const patch = useCallback((p: Partial<DestinationForm>) => setForm((prev) => ({ ...prev, ...p })), []);

  const handleCoverFileChange = (file: File) => {
    setCoverImage(URL.createObjectURL(file));
    setCoverPendingFile(file);
  };
  const handleCoverUrlChange = (url: string) => {
    setCoverImage(url || null);
    setCoverPendingFile(null);
  };
  const addGalleryImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setGallery((prev) => [...prev, { id: crypto.randomUUID(), url, file }]);
  };
  const removeGalleryImage = (id: string) => setGallery((prev) => prev.filter((img) => img.id !== id));

  const save = async (publish = false) => {
    if (publish) setPublishing(true); else setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      let finalCoverImage = coverImage && !coverImage.startsWith('blob:') ? coverImage : null;
      if (coverPendingFile) {
        finalCoverImage = await uploadImage(coverPendingFile);
        setCoverImage(finalCoverImage);
        setCoverPendingFile(null);
      }

      const apiStatus = STATUS_UI_TO_API[form.status] as 'DRAFT' | 'PUBLISHED' | 'REVIEW' | 'ARCHIVED';
      const targetStatus = publish ? 'PUBLISHED' : apiStatus;

      const contentBlocks = form.description.trim()
        ? (form.description.split(/\n{2,}/).map((line) => {
            const t = line.trim();
            if (!t) return null;
            if (t.startsWith('## ')) return { type: 'heading', value: t.slice(3) };
            return { type: 'text', value: t };
          }).filter(Boolean) as { type: string; value: string }[])
        : [{ type: 'text', value: 'Contenu vide' }];

      const payload: UpdateDestinationPayload = {
        title: form.title.trim(),
        name: form.title.trim(),
        status: targetStatus,
        content: contentBlocks,
        categoryId: form.categoryId,
        tags: form.selectedTagIds,
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        coverImage: finalCoverImage ?? undefined,
        featured: form.featured,
        slogan: form.slogan.trim(),
        typeZone: form.typeZone,
        niveauGeographique: form.niveauGeographique,
        continent: form.continent,
        regionAssociee: form.regionAssociee,
        langue: form.langue.trim(),
        monnaie: form.monnaie.trim(),
        fuseauHoraire: form.fuseauHoraire,
        officeTourisme: form.officeTourisme.trim(),
        climatDominant: form.climatDominant,
        population: form.population.trim(),
        codeTel: form.codeTel.trim(),
        meillerePeriode: form.meillerePeriode.trim(),
        description: form.description.trim(),
      };

      if (!destIdRef.current) {
        const newDest = await createDestination(payload);
        destIdRef.current = newDest.data.id as number;
      } else {
        await editDestination(destIdRef.current, payload);
      }

      const res = await updateDestination(destination.id, payload);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (publish) onSubmit?.(res.data);
    } catch (err: unknown) {
      setSaveError((err as Error).message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  return {
    dest, form, patch, coverImage, gallery,
    handleCoverFileChange, handleCoverUrlChange, addGalleryImage, removeGalleryImage,
    saving, publishing, saveError, saveSuccess, save,
  };
}