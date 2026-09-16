// src/components/magazine/MagazineDetailPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Share2, Calendar } from "lucide-react";

import { useMagazineDetail } from "./detail/useMagazineDetail";
import ReadingProgress from "@/components/shared/ReadingProgress";
import MagazineHeroBackground from "./detail/MagazineHeroBackground";
import PreviewModal from "./detail/PreviewModal";
import MagazineSidebarActions from "./detail/MagazineSidebarActions";
import MagazineDescription from "./detail/MagazineDescription";
import RelatedMagazines from "./detail/RelatedMagazines";

export default function MagazineDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { magazine, loading, notFound, heroActive, description, shortDesc, isLong } = useMagazineDetail(slug);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4" style={{ background: "#0D2B1A" }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "#C8A84B" }} />
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold animate-pulse">Chargement du magazine…</p>
      </div>
    );
  }

  if (notFound || !magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 px-4" style={{ background: "#0D2B1A" }}>
        <p className="text-[120px] font-black leading-none" style={{ color: "rgba(255,255,255,0.04)" }}>404</p>
        <h1 className="text-2xl font-black text-white">Magazine introuvable</h1>
        <p className="text-white/40 text-sm text-center max-w-xs">Ce magazine n&apos;est plus disponible ou son lien a changé.</p>
        <Link
          href="/actualites"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: "#1A5C43" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B85C38")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1A5C43")}
        >
          <ArrowLeft size={14} /> Retour aux actualités
        </Link>
      </div>
    );
  }

  const relatedMagazines = (magazine as any).relatedMagazines || [];

  return (
    <>
      <main className="min-h-screen" style={{ background: "#F7F9F8" }}>
        <ReadingProgress />

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ minHeight: "70vh", maxHeight: 800 }}>
          <MagazineHeroBackground src={magazine.coverImage} active={heroActive} />

          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,35,20,0.55) 0%, rgba(10,35,20,0.75) 55%, rgba(10,35,20,0.97) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(10,35,20,0.5) 0%, transparent 60%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(to right, #1A5C43, #C8A84B, #B85C38)" }} />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 py-20 flex flex-col h-full justify-end" style={{ minHeight: "70vh" }}>

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

            <div
              className="flex items-center gap-2 mb-5 transition-all duration-500"
              style={{ opacity: heroActive ? 1 : 0, transform: heroActive ? "none" : "translateY(14px)", transitionDelay: "180ms" }}
            >
              <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] text-white" style={{ background: "#B85C38" }}>
                {magazine.source}
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/80"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                Magazine
              </span>
            </div>

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

        {/* ── CONTENU PRINCIPAL ── */}
        <section className="max-w-[1300px] mx-auto px-4 sm:px-6 -mt-10 pb-20 relative z-10">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">
              <MagazineSidebarActions magazine={magazine} onOpenPreview={() => setPreviewOpen(true)} />
              <MagazineDescription
                magazine={magazine}
                description={description}
                shortDesc={shortDesc}
                isLong={isLong}
              />
            </div>
          </div>

          <RelatedMagazines items={relatedMagazines.slice(0, 3)} />
        </section>
      </main>

      <PreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} magazine={magazine} />
    </>
  );
}