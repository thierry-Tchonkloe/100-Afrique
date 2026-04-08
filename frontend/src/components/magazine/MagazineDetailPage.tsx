"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Copy,
  Download,
  Eye,
  Facebook,
  Globe,
  Linkedin,
  Loader2,
  MessageCircle,
  Share2,
  X,
} from "lucide-react";
import {
  fetchMagazineBySlug,
  type Magazine,
} from "@/services/Dashboard/magazineService";

type SharePlatform = "facebook" | "linkedin" | "whatsapp";

function stripHtml(input?: string | null) {
  return (input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function isDocumentUrl(url?: string | null) {
  return /\.(pdf|doc|docx|ppt|pptx)$/i.test(url || "");
}

function isIssuuUrl(url?: string | null) {
  return /issuu\.com/i.test(url || "");
}

function isFlipHtmlUrl(url?: string | null) {
  return /fliphtml5\.com/i.test(url || "");
}

function getEmbedPreviewUrl(magazine: Magazine) {
  const rawUrl =
    magazine.embedUrl || magazine.previewUrl || magazine.readOnlineUrl || magazine.url;

  if (!rawUrl) {
    return "";
  }

  if (isDocumentUrl(rawUrl)) {
    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(rawUrl)}`;
  }

  if (isIssuuUrl(rawUrl)) {
    return rawUrl.includes("/embed") ? rawUrl : `${rawUrl.replace(/\/$/, "")}/embed`;
  }

  if (isFlipHtmlUrl(rawUrl)) {
    return rawUrl;
  }

  return rawUrl;
}

function getDownloadHref(magazine: Magazine) {
  const directCandidates = [magazine.downloadUrl, magazine.url, magazine.readOnlineUrl];
  return directCandidates.find((item) => isDocumentUrl(item)) || "";
}

function getDescription(magazine: Magazine) {
  return stripHtml(magazine.content) || stripHtml(magazine.excerpt);
}

function PreviewModal({
  isOpen,
  onClose,
  magazine,
}: {
  isOpen: boolean;
  onClose: () => void;
  magazine: Magazine | null;
}) {
  if (!isOpen || !magazine) return null;

  const previewUrl = getEmbedPreviewUrl(magazine);
  const externalUrl = magazine.readOnlineUrl || magazine.url;
  const canEmbed = !!previewUrl;

  return (
    <div className="fixed inset-0 z-[120] bg-[#001A4D]/80 backdrop-blur-sm p-4 md:p-8">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F39C12]">
              Aperçu du magazine
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#001A4D] md:text-2xl">
              {magazine.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-[#001A4D]"
            aria-label="Fermer l'aperçu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 bg-slate-100 p-3 md:p-5">
          {canEmbed ? (
            <iframe
              src={previewUrl}
              title={`Aperçu ${magazine.title}`}
              className="h-full min-h-[70vh] w-full rounded-2xl border-0 bg-white"
              allow="fullscreen"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[70vh] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center">
              <Globe className="mb-4 text-[#F39C12]" size={38} />
              <h3 className="text-xl font-bold text-[#001A4D]">
                Aperçu embarqué indisponible
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                Cette source n&apos;autorise pas l&apos;aperçu direct dans la plateforme.
                Vous pouvez tout de même ouvrir le magazine dans un nouvel onglet.
              </p>
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center rounded-full bg-[#001A4D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F39C12]"
              >
                Ouvrir le magazine
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MagazineDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadMagazine = async () => {
      try {
        const response = await fetchMagazineBySlug(slug);
        setMagazine(response.data);
      } catch (error) {
        console.error("Erreur chargement magazine:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadMagazine();
  }, [slug]);

  const description = useMemo(
    () => (magazine ? getDescription(magazine) : ""),
    [magazine],
  );
  const shortDescription = description.length > 520
    ? `${description.slice(0, 520).trim()}...`
    : description;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/magazine/${slug || ""}`;

  const handleShare = (platform: SharePlatform) => {
    const shareUrls: Record<SharePlatform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${magazine?.title || ""} ${currentUrl}`)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=640,height=540");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 1800);
    } catch (error) {
      console.error("Copie du lien impossible:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#F39C12]" size={42} />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#001A4D]">
            Chargement du magazine
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-lg text-center">
          <p className="text-7xl font-black text-[#001A4D]/10">404</p>
          <h1 className="mt-3 text-3xl font-bold text-[#001A4D]">
            Magazine introuvable
          </h1>
          <p className="mt-4 text-slate-500">
            Ce magazine n&apos;est plus disponible ou son lien a changé.
          </p>
          <Link
            href="/actualites"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#001A4D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F39C12]"
          >
            <ArrowLeft size={16} />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  const coverImage = magazine.coverImage || "/images/magazine-placeholder.jpg";
  const previewUrl = getEmbedPreviewUrl(magazine);
  const downloadHref = getDownloadHref(magazine);
  const hasLongDescription = description.length > 520;
  const relatedMagazines = magazine.relatedMagazines || [];

  return (
    <>
      <main className="min-h-screen bg-[#F7F8FA]">
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001A4D]/60 via-[#001A4D]/82 to-[#001A4D]" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft size={14} />
              Retour à la page Actualités
            </Link>

            <div className="mt-10 max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#F39C12]">
                Magazine | {magazine.source}
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
                {magazine.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={15} />
                  {new Date(magazine.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Share2 size={15} />
                  Magazine extrait depuis {magazine.source}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] bg-white shadow-xl shadow-slate-200/70">
            <div className="grid gap-0 lg:grid-cols-[460px,minmax(0,1fr)]">
              <aside className="border-b border-slate-100 bg-[#FBFCFD] p-6 md:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="mx-auto max-w-[360px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                  <img
                    src={coverImage}
                    alt={magazine.title}
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#001A4D]">
                    Partager ce magazine
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleShare("facebook")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#1877F2] hover:text-[#1877F2]"
                    >
                      <Facebook size={16} />
                      Facebook
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare("linkedin")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare("whatsapp")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#25D366] hover:text-[#25D366]"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#001A4D] hover:text-[#001A4D]"
                    >
                      <Copy size={16} />
                      {copySuccess ? "Copié" : "Copier"}
                    </button>
                  </div>
                </div>
              </aside>

              <div className="p-6 md:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F39C12]">
                  Description du magazine
                </p>
                <div className="mt-5 max-w-4xl text-[15px] leading-8 text-slate-600">
                  {showFullDescription || !hasLongDescription
                    ? description
                    : shortDescription}
                </div>

                {hasLongDescription && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription((prev) => !prev)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#001A4D] transition hover:text-[#F39C12]"
                  >
                    {showFullDescription ? "Réduire" : "Lire plus"}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${showFullDescription ? "rotate-180" : ""}`}
                    />
                  </button>
                )}

                <div className="mt-8 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#001A4D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F39C12] md:min-w-[220px]"
                  >
                    <Eye size={18} />
                    Aperçu
                  </button>

                  {downloadHref && (
                    <a
                      href={downloadHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-[#001A4D] px-6 py-3 text-sm font-bold text-[#001A4D] transition hover:border-[#F39C12] hover:text-[#F39C12] md:min-w-[240px]"
                    >
                      <Download size={18} />
                      Télécharger
                    </a>
                  )}
                </div>

                <div className="mt-8 rounded-[24px] border border-[#F39C12]/15 bg-[#FFF8EE] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#001A4D]">
                    Aperçu embarqué
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    L&apos;aperçu s&apos;ouvre dans une modal directement sur votre site. Les
                    liens de type PDF, document, Issuu ou FlipHTML5 sont affichés dans la
                    modal dès que la source permet l&apos;intégration.
                  </p>
                  <a
                    href={magazine.readOnlineUrl || magazine.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#F39C12]"
                  >
                    Ouvrir la source originale
                    <Globe size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {relatedMagazines.length > 0 && (
            <section className="mt-12">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F39C12]">
                  À découvrir aussi
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#001A4D]">
                  Autres magazines de la même source
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedMagazines.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/magazine/${item.slug}`}
                    className="group overflow-hidden rounded-[24px] bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={item.coverImage || "/images/magazine-placeholder.jpg"}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F39C12]">
                        {item.source}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-bold text-[#001A4D] transition group-hover:text-[#F39C12]">
                        {item.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {stripHtml(item.excerpt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        magazine={magazine}
      />
    </>
  );
}
