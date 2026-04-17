"use client";

import { useState } from "react";
import { PageData, parseContent, formatDate, readingTime, STATUS_BADGE } from "./types";

interface BlogTemplateProps {
    page: PageData;
}

export default function BlogTemplate({ page }: BlogTemplateProps) {
    const blocks   = parseContent(page.content);
    const badge    = STATUS_BADGE[page.status];
    const minutes  = readingTime(page.content);
    const headings = blocks.filter((b) => b.type === "heading");
    const [activeHeading, setActiveHeading] = useState<number | null>(null);

    // Initiales auteur
    const initials = page.author?.name
        ? page.author.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "AU";

    return (
        <div className="min-h-screen bg-white">
        {/* ── Topbar ── */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>monsite.com</span>
            <span>/</span>
            <span className="text-slate-500">{page.navigation.linkGroup.toLowerCase()}</span>
            <span>/</span>
            <span className="text-slate-700">{page.slug || "article"}</span>
            </div>
            <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{minutes} min de lecture</span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}>
                {badge.label}
            </span>
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* ── Header article ── */}
            <header className="mb-8 max-w-2xl">
            {/* Catégorie */}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                {page.navigation.linkGroup}
            </span>

            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-[1.2] mb-5">
                {page.title}
            </h1>

            {/* Meta auteur */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                </div>
                <span className="font-medium text-slate-700">{page.author?.name ?? "Auteur"}</span>
                </div>
                <span className="text-slate-300">·</span>
                {page.updatedAt && <span>{formatDate(page.updatedAt)}</span>}
                <span className="text-slate-300">·</span>
                <span>{minutes} min de lecture</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-400 text-xs">/{page.slug}</span>
            </div>
            </header>

            {/* ── Body: contenu + sommaire ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12">
            {/* Contenu éditorial */}
            <article className="prose-sm max-w-none">
                {blocks.map((block, i) => {
                if (block.type === "heading") {
                    const headingIndex = headings.findIndex((h) => h.value === block.value);
                    return (
                    <h2
                        key={i}
                        id={`h-${i}`}
                        className="text-xl font-semibold text-slate-800 mt-10 mb-4 scroll-mt-20 first:mt-0"
                        onMouseEnter={() => setActiveHeading(headingIndex)}
                        onMouseLeave={() => setActiveHeading(null)}
                    >
                        <span className="inline-flex items-baseline gap-2">
                        <span className={`w-0.5 h-4 rounded-full transition-colors ${activeHeading === headingIndex ? "bg-orange-400" : "bg-slate-200"}`} />
                        {block.value}
                        </span>
                    </h2>
                    );
                }
                if (block.type === "quote") {
                    return (
                    <blockquote
                        key={i}
                        className="my-6 pl-5 border-l-[3px] border-orange-400 bg-orange-50/40 py-3 pr-4 rounded-r-lg"
                    >
                        <p className="text-[15px] text-slate-700 italic leading-relaxed m-0">
                        {block.value}
                        </p>
                    </blockquote>
                    );
                }
                return (
                    <p key={i} className="text-[15px] text-slate-600 leading-[1.85] mb-5">
                    {block.value}
                    </p>
                );
                })}

                {/* Tags en bas d'article */}
                <div className="mt-10 pt-6 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mr-1">Tags</span>
                    {[page.navigation.linkGroup, page.pageTemplate.replace("Modèle ", ""), ...(page.seo.metaTitle.split(" ").slice(0, 2))].map(
                    (tag, i) => (
                        <span
                        key={i}
                        className="text-xs text-slate-500 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 transition-colors px-3 py-1 rounded-full cursor-pointer"
                        >
                        {tag}
                        </span>
                    )
                    )}
                </div>
                </div>
            </article>

            {/* Sommaire ancré */}
            {headings.length > 0 && (
                <aside className="hidden lg:block">
                <div className="sticky top-20">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Dans cet article
                    </p>
                    <nav className="space-y-0.5">
                    {headings.map((h, i) => (
                        <a
                        key={i}
                        href={`#h-${blocks.findIndex((b) => b.value === h.value && b.type === "heading")}`}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                            activeHeading === i
                            ? "bg-orange-50 text-orange-600"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                        onMouseEnter={() => setActiveHeading(i)}
                        onMouseLeave={() => setActiveHeading(null)}
                        >
                        <span className={`w-1 h-1 rounded-full shrink-0 transition-colors ${activeHeading === i ? "bg-orange-400" : "bg-slate-300"}`} />
                        <span className="truncate">{h.value}</span>
                        </a>
                    ))}
                    </nav>

                    {/* Infos compactes */}
                    <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5">
                    <div className="text-xs text-slate-400">
                        <span className="block font-medium text-slate-600 mb-0.5">Visibilité</span>
                        {page.visibility}
                    </div>
                    {page.navigation.includeInMainMenu && (
                        <div className="text-xs text-slate-400">
                        <span className="block font-medium text-slate-600 mb-0.5">Position menu</span>
                        #{page.navigation.sortOrder}
                        </div>
                    )}
                    {page.navigation.includeInFooter && (
                        <div className="text-xs text-orange-500 font-medium">✓ Inclus dans le footer</div>
                    )}
                    </div>
                </div>
                </aside>
            )}
            </div>
        </div>
        </div>
    );
}