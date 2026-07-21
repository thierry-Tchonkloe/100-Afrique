"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Calendar, ChevronDown, Copy,
  Download, ExternalLink, Eye, Facebook, Globe,
  Linkedin, Loader2, MessageCircle, Share2, X, Check,
} from "lucide-react";
import {
  fetchMagazineBySlug,
  type Magazine,
} from "@/services/Dashboard/magazineService";
import MagazineImage from "@/components/shared/MagazineImage";

// ─── Types & utils ────────────────────────────────────────────────────────────

type SharePlatform = "facebook" | "linkedin" | "whatsapp";

const KNOWN_IFRAME_BLOCKERS = [
  "aviationweek.com", "mymauritius.travel", "tourismupdate.co.za",
  "traveller.com.au", "lonelyplanet.com", "tripadvisor.com",
  "booking.com", "airbnb.com", "skyscanner.com",
];

function isDomainBlocked(url?: string | null) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return KNOWN_IFRAME_BLOCKERS.some((b) => hostname.endsWith(b));
  } catch { return false; }
}

function stripHtml(input?: string | null) {
  return (input || "")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

const isDocumentUrl = (url?: string | null) => /\.(pdf|doc|docx|ppt|pptx)$/i.test(url || "");
const isIssuuUrl    = (url?: string | null) => /issuu\.com/i.test(url || "");
const isFlipHtmlUrl = (url?: string | null) => /fliphtml5\.com/i.test(url || "");

function getEmbedPreviewUrl(magazine: Magazine) {
  const raw = magazine.embedUrl || magazine.previewUrl || magazine.readOnlineUrl || magazine.url;
  if (!raw) return "";
  if (isDocumentUrl(raw)) return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(raw)}`;
  if (isIssuuUrl(raw)) return raw.includes("/embed") ? raw : `${raw.replace(/\/$/, "")}/embed`;
  if (isFlipHtmlUrl(raw)) return raw;
  return raw;
}

function getDownloadHref(m: Magazine) {
  return [m.downloadUrl, m.url, m.readOnlineUrl].find(isDocumentUrl) || "";
}

function getDescription(m: Magazine) {
  return stripHtml(m.content) || stripHtml(m.excerpt);
}

// ─── Hook reveal on scroll ────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Reading progress ─────────────────────────────────────────────────────────

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setP(el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]" style={{ background: "rgba(0,0,0,0.07)" }}>
      <div className="h-full rounded-full" style={{ width: `${p}%`, background: "linear-gradient(to right, #1A5C43, #C8A84B)" }} />
    </div>
  );
}

// ─── PreviewModal ─────────────────────────────────────────────────────────────

function PreviewModal({ isOpen, onClose, magazine }: { isOpen: boolean; onClose: () => void; magazine: Magazine | null }) {
  type St = "loading" | "loaded" | "blocked";
  const [state, setState] = useState<St>("loading");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setState("loading");
    timer.current = setTimeout(() => setState((s) => s === "loading" ? "blocked" : s), 8000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [isOpen, magazine?.slug]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!isOpen || !magazine) return null;

  const previewUrl   = getEmbedPreviewUrl(magazine);
  const externalUrl  = magazine.readOnlineUrl || magazine.url;
  const canTryEmbed  = !!previewUrl && !isDomainBlocked(previewUrl);

  const Fallback = () => (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center rounded-2xl" style={{ background: "#F7F9F8" }}>
      <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl mb-6" style={{ background: "rgba(26,92,67,0.08)" }}>
        <Globe size={36} style={{ color: "#1A5C43", opacity: 0.4 }} />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#B85C38" }}>
          <X size={13} className="text-white" strokeWidth={3} />
        </div>
      </div>
      <h3 className="text-xl font-black mb-3" style={{ color: "#0D1A10" }}>Aperçu non disponible</h3>
      <p className="text-sm leading-relaxed text-gray-500 max-w-sm mb-8">
        La source <strong style={{ color: "#0D1A10" }}>{magazine.source}</strong> n&apos;autorise pas
        l&apos;affichage intégré. Consultez le contenu directement sur le site d&apos;origine.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <a href={externalUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          <ExternalLink size={14} /> Ouvrir sur {magazine.source}
        </a>
        <button onClick={onClose}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors">
          Fermer
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(13,43,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        {/* En-tête modal */}
        <div className="flex shrink-0 items-center justify-between px-6 py-4 md:px-8 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "#B85C38" }}>Aperçu du magazine</p>
            <h2 className="mt-0.5 line-clamp-1 text-lg font-black" style={{ color: "#0D1A10" }}>{magazine.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a href={externalUrl} target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#1A5C43] hover:text-[#1A5C43] transition-colors">
              <ExternalLink size={12} /> Ouvrir
            </a>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
              aria-label="Fermer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Corps modal */}
        <div className="relative flex-1 p-3 md:p-4" style={{ background: "#F7F9F8" }}>
          {!canTryEmbed ? <Fallback /> : (
            <>
              {state === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 rounded-2xl" style={{ background: "#F7F9F8" }}>
                  <Loader2 className="animate-spin" size={32} style={{ color: "#1A5C43" }} />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Chargement de l&apos;aperçu…</p>
                </div>
              )}
              {state === "blocked" ? <Fallback /> : (
                <iframe
                  src={previewUrl}
                  title={`Aperçu ${magazine.title}`}
                  className="h-full min-h-[60vh] w-full rounded-2xl border-0 bg-white"
                  allow="fullscreen"
                  loading="lazy"
                  onLoad={() => { if (timer.current) clearTimeout(timer.current); setState("loaded"); }}
                  onError={() => { if (timer.current) clearTimeout(timer.current); setState("blocked"); }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hero background avec fallback ───────────────────────────────────────────

function HeroBackground({ src, active }: { src?: string | null; active: boolean }) {
  const FALLBACK = "/images/magazine-placeholder.jpg";
  const resolved = src?.trim() || FALLBACK;
  const [bgSrc, setBgSrc] = useState(resolved);
  return (
    <>
      <img src={bgSrc} alt="" aria-hidden className="sr-only" onError={() => setBgSrc(FALLBACK)} />
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform ease-linear"
        style={{
          backgroundImage: `url(${bgSrc})`,
          transitionDuration: "10000ms",
          transform: active ? "scale(1.06)" : "scale(1)",
        }}
      />
    </>
  );
}

// ─── Carte magazine similaire ─────────────────────────────────────────────────

function RelatedMagazineCard({ item, delay = 0 }: { item: any; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
    >
      <Link href={`/magazine/${item.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-[#1A5C43]/20 hover:shadow-xl transition-all duration-300">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <MagazineImage src={item.coverImage} alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-2" style={{ color: "#B85C38" }}>{item.source}</p>
          <h3 className="line-clamp-2 font-bold text-[14px] leading-snug mb-2 transition-colors" style={{ color: "#0D1A10" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1A5C43")}
            onMouseLeave={e => (e.currentTarget.style.color = "#0D1A10")}>
            {item.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">{stripHtml(item.excerpt)}</p>
        </div>
      </Link>
    </div>
  );
}

// ─── Bouton de partage social ─────────────────────────────────────────────────

function SocialShareBtn({
  platform, label, icon, color, onClick,
}: { platform: SharePlatform; label: string; icon: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 transition-all hover:shadow-md active:scale-95"
      style={{ background: "#fff" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.color = "#374151"; }}
    >
      {icon} {label}
    </button>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MagazineDetailPage() {
  const params  = useParams();
  const slug    = params?.slug as string;

  const [magazine, setMagazine]             = useState<Magazine | null>(null);
  const [loading, setLoading]               = useState(true);
  const [notFound, setNotFound]             = useState(false);
  const [showFull, setShowFull]             = useState(false);
  const [previewOpen, setPreviewOpen]       = useState(false);
  const [copySuccess, setCopySuccess]       = useState(false);
  const [heroActive, setHeroActive]         = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchMagazineBySlug(slug)
      .then((res) => setMagazine(res.data))
      .catch(() => setNotFound(true))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setHeroActive(true), 80);
      });
  }, [slug]);

  const description = useMemo(() => magazine ? getDescription(magazine) : "", [magazine]);
  const shortDesc   = description.length > 520 ? `${description.slice(0, 520).trim()}…` : description;
  const isLong      = description.length > 520;

  const currentUrl  = typeof window !== "undefined"
    ? window.location.href
    : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/magazine/${slug || ""}`;

  const handleShare = (p: SharePlatform) => {
    const urls: Record<SharePlatform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${magazine?.title || ""} ${currentUrl}`)}`,
    };
    window.open(urls[p], "_blank", "width=640,height=540");
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(currentUrl); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }
    catch {}
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4" style={{ background: "#0D2B1A" }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "#C8A84B" }} />
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold animate-pulse">Chargement du magazine…</p>
      </div>
    );
  }

  // ── 404 ──
  if (notFound || !magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 px-4" style={{ background: "#0D2B1A" }}>
        <p className="text-[120px] font-black leading-none" style={{ color: "rgba(255,255,255,0.04)" }}>404</p>
        <h1 className="text-2xl font-black text-white">Magazine introuvable</h1>
        <p className="text-white/40 text-sm text-center max-w-xs">Ce magazine n&apos;est plus disponible ou son lien a changé.</p>
        <Link href="/actualites"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}>
          <ArrowLeft size={14} /> Retour aux actualités
        </Link>
      </div>
    );
  }

  const downloadHref      = getDownloadHref(magazine);
  const relatedMagazines  = (magazine as any).relatedMagazines || [];

  return (
    <>
      <main className="min-h-screen" style={{ background: "#F7F9F8" }}>
        <ReadingProgress />

        {/* ═══════════════════════════════════════════════════════
            HERO — Plein écran cinématique
        ═══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "70vh", maxHeight: 800 }}>

          {/* Fond image Ken Burns */}
          <HeroBackground src={magazine.coverImage} active={heroActive} />

          {/* Overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,35,20,0.55) 0%, rgba(10,35,20,0.75) 55%, rgba(10,35,20,0.97) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(10,35,20,0.5) 0%, transparent 60%)" }} />

          {/* Barre accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(to right, #1A5C43, #C8A84B, #B85C38)" }} />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 py-20 flex flex-col h-full justify-end" style={{ minHeight: "70vh" }}>

            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 mb-8 text-white/50 text-[11px] font-semibold uppercase tracking-wider transition-all duration-500"
              style={{ opacity: heroActive ? 1 : 0, transform: heroActive ? "none" : "translateY(12px)", transitionDelay: "100ms" }}
            >
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link>
              <span>/</span>
              <span className="text-white/80 line-clamp-1 max-w-xs">{magazine.title}</span>
            </div>

            {/* Badge source */}
            <div
              className="flex items-center gap-2 mb-5 transition-all duration-500"
              style={{ opacity: heroActive ? 1 : 0, transform: heroActive ? "none" : "translateY(14px)", transitionDelay: "180ms" }}
            >
              <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] text-white" style={{ background: "#B85C38" }}>
                {magazine.source}
              </span>
              <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/80"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                Magazine
              </span>
            </div>

            {/* Titre */}
            <h1
              className="text-white font-black text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-[1.05] mb-6 transition-all duration-700"
              style={{
                letterSpacing: "-0.025em",
                textShadow: "0 4px 24px rgba(0,0,0,0.35)",
                opacity: heroActive ? 1 : 0,
                transform: heroActive ? "none" : "translateY(24px)",
                transitionDelay: "280ms",
              }}
            >
              {magazine.title}
            </h1>

            {/* Meta */}
            <div
              className="flex flex-wrap items-center gap-4 transition-all duration-500"
              style={{ opacity: heroActive ? 1 : 0, transform: heroActive ? "none" : "translateY(14px)", transitionDelay: "400ms" }}
            >
              <span className="flex items-center gap-1.5 text-white/55 text-xs">
                <Calendar size={12} style={{ color: "#C8A84B" }} />
                {new Date(magazine.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5 text-white/55 text-xs">
                <Share2 size={12} style={{ color: "#C8A84B" }} />
                Extrait depuis {magazine.source}
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CONTENU PRINCIPAL
        ═══════════════════════════════════════════════════════ */}
        <section className="max-w-[1300px] mx-auto px-4 sm:px-6 -mt-10 pb-20 relative z-10">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">

              {/* ── Sidebar gauche ── */}
              <aside className="border-b border-gray-100 lg:border-b-0 lg:border-r p-6 md:p-8 lg:p-10" style={{ background: "#FAFBFC" }}>

                {/* Cover */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg mb-8">
                  <MagazineImage src={magazine.coverImage} alt={magazine.title} className="h-auto w-full object-cover" />
                </div>

                {/* Boutons CTA principaux */}
                <div className="flex flex-col gap-3 mb-8">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
                    style={{ background: "#1A5C43" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
                  >
                    <Eye size={16} /> Aperçu du magazine
                  </button>
                  {downloadHref && (
                    <a href={downloadHref} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-md active:scale-95 border-2"
                      style={{ borderColor: "#1A5C43", color: "#1A5C43" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1A5C43"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A5C43"; }}>
                      <Download size={16} /> Télécharger
                    </a>
                  )}
                </div>

                {/* Partage */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: "#0D1A10" }}>Partager</p>
                  <div className="grid grid-cols-1 gap-2">
                    <SocialShareBtn platform="facebook" label="Facebook" icon={<Facebook size={15} />} color="#1877F2" onClick={() => handleShare("facebook")} />
                    <SocialShareBtn platform="linkedin" label="LinkedIn" icon={<Linkedin size={15} />} color="#0A66C2" onClick={() => handleShare("linkedin")} />
                    <SocialShareBtn platform="whatsapp" label="WhatsApp" icon={<MessageCircle size={15} />} color="#25D366" onClick={() => handleShare("whatsapp")} />
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all active:scale-95"
                      style={{
                        borderColor: copySuccess ? "#1A5C43" : "#F3F4F6",
                        color: copySuccess ? "#1A5C43" : "#374151",
                        background: copySuccess ? "rgba(26,92,67,0.06)" : "#fff",
                      }}
                    >
                      {copySuccess ? <Check size={15} /> : <Copy size={15} />}
                      {copySuccess ? "Lien copié !" : "Copier le lien"}
                    </button>
                  </div>
                </div>
              </aside>

              {/* ── Contenu droit ── */}
              <div className="p-6 md:p-8 lg:p-10">

                <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-5" style={{ color: "#B85C38" }}>
                  Description du magazine
                </p>

                {/* Texte description */}
                <div className="text-[15px] leading-[1.85] text-gray-600 max-w-2xl">
                  {showFull || !isLong ? description : shortDesc}
                </div>

                {isLong && (
                  <button onClick={() => setShowFull((p) => !p)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                    style={{ color: "#1A5C43" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B85C38")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1A5C43")}>
                    {showFull ? "Réduire" : "Lire plus"}
                    <ChevronDown size={15} className={`transition-transform ${showFull ? "rotate-180" : ""}`} />
                  </button>
                )}

                {/* Info embed */}
                <div className="mt-10 p-5 rounded-2xl" style={{ background: "rgba(26,92,67,0.05)", border: "1px solid rgba(26,92,67,0.1)" }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-3" style={{ color: "#1A5C43" }}>Aperçu embarqué</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    L&apos;aperçu s&apos;ouvre dans une fenêtre modale. PDF, Issuu et FlipHTML5 sont supportés.
                    Si la source bloque l&apos;intégration, un lien direct vous est proposé.
                  </p>
                  <a href={magazine.readOnlineUrl || magazine.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                    style={{ color: "#1A5C43" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B85C38")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1A5C43")}>
                    <Globe size={14} /> Ouvrir la source originale
                  </a>
                </div>

                {/* Retour */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
                  <Link href="/actualites"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
                    style={{ background: "#1A5C43" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}>
                    <ArrowLeft size={13} /> Retour aux actualités
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Magazines similaires ── */}
          {relatedMagazines.length > 0 && (
            <RelatedSection items={relatedMagazines.slice(0, 3)} />
          )}
        </section>
      </main>

      <PreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} magazine={magazine} />
    </>
  );
}

// ─── Section similaires ───────────────────────────────────────────────────────

function RelatedSection({ items }: { items: any[] }) {
  const { ref, visible } = useReveal(0.15);
  return (
    <section className="mt-16">
      <div
        ref={ref}
        className="flex items-end justify-between mb-10 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#B85C38" }}>— À découvrir aussi</p>
          <h2 className="text-3xl font-black leading-none" style={{ color: "#0D1A10", letterSpacing: "-0.03em" }}>
            Autres <span style={{ color: "#1A5C43" }}>magazines</span>
          </h2>
        </div>
        <Link href="/actualites"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}>
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => <RelatedMagazineCard key={item.id} item={item} delay={i * 100} />)}
      </div>
    </section>
  );
}
