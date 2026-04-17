"use client";

import { PageData, parseContent, formatDate, STATUS_BADGE, ContentBlock } from "./types";

interface FullWidthTemplateProps {
    page: PageData;
}

interface Section {
  heading?: string;
  paragraphs: string[];
}


export default function FullWidthTemplate({ page }: FullWidthTemplateProps) {
    const blocks = parseContent(page.content);
    const badge  = STATUS_BADGE[page.status];

    // Sépare le premier bloc de texte (intro du hero) du reste
    const introBlock = blocks.find((b) => b.type === "text");
    const sections   = groupBySections(blocks);

    return (
        <div className="min-h-screen bg-white">
        {/* ── Topbar ── */}
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>monsite.com</span>
            <span>/</span>
            <span className="text-slate-600">{page.slug || "page"}</span>
            </div>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
            {badge.label}
            </span>
        </div>

        {/* ── Hero pleine largeur ── */}
        <section className="relative bg-linear-to-br from-orange-50 via-orange-50/60 to-white overflow-hidden">
            {/* Cercle décoratif */}
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-orange-400/8 pointer-events-none" />
            <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-orange-300/10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 py-16 sm:py-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-orange-500/70 mb-6">
                <span>Accueil</span>
                <span className="text-orange-300">/</span>
                <span className="text-orange-600 font-medium">{page.navigation.linkGroup}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 leading-[1.15] max-w-3xl mb-6">
                {page.title}
            </h1>

            {introBlock && (
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                {introBlock.value}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {page.author && (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                    {page.author.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{page.author.name}</span>
                </div>
                )}
                {page.updatedAt && <span>Modifié le {formatDate(page.updatedAt)}</span>}
                {page.navigation.includeInMainMenu && (
                <span className="text-orange-500 font-medium">
                    Menu principal · #{page.navigation.sortOrder}
                </span>
                )}
            </div>
            </div>
        </section>

        {/* ── Sections en cartes ── */}
        {sections.length > 0 && (
            <section className="max-w-7xl mx-auto px-8 py-12">
            <div
                className={`grid gap-6 ${
                sections.length === 1
                    ? "grid-cols-1"
                    : sections.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
            >
                {sections.map((section, i) => (
                <div
                    key={i}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50 transition-all duration-200"
                >
                    {/* Trait orange en haut */}
                    <div className="w-8 h-0.5 bg-orange-400 rounded-full mb-4 group-hover:w-12 transition-all duration-300" />
                    {section.heading && (
                    <h2 className="text-lg font-semibold text-slate-800 mb-3 leading-snug">
                        {section.heading}
                    </h2>
                    )}
                    <div className="space-y-3">
                    {section.paragraphs.map((p, j) => (
                        <p key={j} className="text-sm text-slate-600 leading-relaxed">
                        {p}
                        </p>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </section>
        )}

        {/* ── Bande SEO ── */}
        {(page.seo.metaTitle || page.seo.metaDescription) && (
            <section className="bg-slate-50 border-t border-slate-100 px-8 py-8">
            <div className="max-w-7xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Aperçu dans les moteurs de recherche
                </p>
                <p className="text-base font-medium text-blue-700 mb-1">{page.seo.metaTitle}</p>
                <p className="text-sm text-slate-500 max-w-2xl">{page.seo.metaDescription}</p>
            </div>
            </section>
        )}
        </div>
    );
    }

    /** Regroupe les blocs par section (heading + paragraphes suivants) */
    function groupBySections(blocks: ContentBlock[]): Section[] {
        const sections: Section[] = [];
        let current: Section | null = null;

        for (const block of blocks) {
            if (block.type === "heading") {
            if (current) sections.push(current);
            current = { heading: block.value, paragraphs: [] };
            } else if (block.type === "text") {
            if (!current) current = { paragraphs: [] };
            current.paragraphs.push(block.value);
            }
        }
        if (current && (current.heading || current.paragraphs.length > 0)) {
            sections.push(current);
        }

        // Re-groupage : retourne aussi des Section[] (heading reste undefined)
        if (sections.length === 1 && !sections[0].heading && sections[0].paragraphs.length > 2) {
            const paras = sections[0].paragraphs;
            const regrouped: Section[] = [];
            for (let i = 0; i < paras.length; i += 2) {
            regrouped.push({ heading: undefined, paragraphs: paras.slice(i, i + 2) });
            }
            return regrouped;
        }

        return sections;
    }