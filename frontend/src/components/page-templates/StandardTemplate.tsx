"use client";

import { PageData, parseContent, formatDate, STATUS_BADGE } from "./types";

interface StandardTemplateProps {
    page: PageData;
}

export default function StandardTemplate({ page }: StandardTemplateProps) {
    const blocks  = parseContent(page.content);
    const badge   = STATUS_BADGE[page.status];
    const headings = blocks.filter((b) => b.type === "heading");

    return (
        <div className="min-h-screen bg-slate-50">
        {/* ── Topbar ── */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>monsite.com</span>
            <span>/</span>
            <span className="text-slate-600">{page.slug || "page"}</span>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* ── Header ── */}
            <div className="mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-start justify-between gap-4">
                <div>
                <h1 className="text-3xl font-semibold text-slate-900 leading-tight mb-3">
                    {page.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.className}`}
                    >
                    {badge.label}
                    </span>
                    {page.author && <span>par <strong className="text-slate-700">{page.author.name}</strong></span>}
                    {page.updatedAt && (
                    <span>Modifié le {formatDate(page.updatedAt)}</span>
                    )}
                    {page.navigation.includeInMainMenu && (
                    <span className="text-orange-500">
                        ↳ Menu principal · #{page.navigation.sortOrder}
                    </span>
                    )}
                </div>
                </div>
            </div>
            </div>

            {/* ── Body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
            {/* Contenu principal */}
            <article>
                <div className="flex gap-5">
                {/* Accent vertical orange */}
                <div className="hidden sm:block w-0.5 bg-orange-400 rounded-full shrink-0 self-stretch" />
                <div className="space-y-0">
                    {blocks.map((block, i) => {
                    if (block.type === "heading") {
                        return (
                        <h2
                            key={i}
                            id={`section-${i}`}
                            className="text-xl font-semibold text-slate-800 mt-8 mb-3 first:mt-0"
                        >
                            {block.value}
                        </h2>
                        );
                    }
                    if (block.type === "quote") {
                        return (
                        <blockquote
                            key={i}
                            className="border-l-4 border-orange-400 pl-4 my-4 italic text-slate-600 text-[15px] leading-relaxed"
                        >
                            {block.value}
                        </blockquote>
                        );
                    }
                    return (
                        <p
                        key={i}
                        className="text-[15px] text-slate-600 leading-relaxed mb-4"
                        >
                        {block.value}
                        </p>
                    );
                    })}
                </div>
                </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-4">
                {/* Infos page */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Informations
                </h3>
                <dl className="space-y-2 text-sm">
                    {[
                    { label: "Statut",      value: <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${badge.className}`}>{badge.label}</span> },
                    { label: "Visibilité",  value: page.visibility },
                    { label: "Auteur",      value: page.author?.name ?? "—" },
                    { label: "Groupe",      value: page.navigation.linkGroup },
                    { label: "Modèle",      value: page.pageTemplate },
                    { label: "Menu principal", value: page.navigation.includeInMainMenu ? `Oui · #${page.navigation.sortOrder}` : "Non" },
                    { label: "Footer",      value: page.navigation.includeInFooter ? "Oui" : "Non" },
                    ...(page.updatedAt ? [{ label: "Modifié", value: formatDate(page.updatedAt) }] : []),
                    ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0">
                        <dt className="text-slate-500 shrink-0">{label}</dt>
                        <dd className="text-slate-800 text-right">{value}</dd>
                    </div>
                    ))}
                </dl>
                </div>

                {/* SEO */}
                {(page.seo.metaTitle || page.seo.metaDescription) && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    SEO
                    </h3>
                    {page.seo.metaTitle && (
                    <p className="text-sm font-medium text-slate-800 mb-1.5 leading-snug">
                        {page.seo.metaTitle}
                    </p>
                    )}
                    {page.seo.metaDescription && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {page.seo.metaDescription}
                    </p>
                    )}
                </div>
                )}

                {/* Sommaire */}
                {headings.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Sommaire
                    </h3>
                    <ul className="space-y-1">
                    {headings.map((h, i) => (
                        <li key={i}>
                        <a
                            href={`#section-${i}`}
                            className="text-sm text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-2"
                        >
                            <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                            {h.value}
                        </a>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </aside>
            </div>
        </div>
        </div>
    );
}