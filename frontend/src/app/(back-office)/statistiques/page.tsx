"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, CartesianGrid, } from "recharts";
import { Users, FileText, Clock, TrendingUp, TrendingDown, ExternalLink, Download, ChevronDown, Play, MousePointer, Mail, Eye, } from "lucide-react";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";

// ─── DATA ───────────────────────────────────────────────────────────────────

const trafficData = [
    { date: "Jan", visiteurs: 18000, pages: 52000 },
    { date: "Fév", visiteurs: 19500, pages: 58000 },
    { date: "Mar", visiteurs: 21000, pages: 61000 },
    { date: "Avr", visiteurs: 20000, pages: 59000 },
    { date: "Mai", visiteurs: 22000, pages: 67000 },
    { date: "Juin", visiteurs: 24567, pages: 89234 },
];

const acquisitionData = [
    { name: "Direct", value: 35, color: "#1e40af" },
    { name: "Référencement", value: 28, color: "#f59e0b" },
    { name: "Réseaux Sociaux", value: 22, color: "#10b981" },
    { name: "Newsletter", value: 15, color: "#ef4444" },
];

const topArticles = [
    { title: "Guide Complet du Sénégal", subtitle: "Taux de rebond: 32%", vues: "5,324" },
    { title: "Les Plages du Maroc", subtitle: "Taux de rebond: 29%", vues: "4,891" },
    { title: "Cuisine Africaine Authentique", subtitle: "Taux de rebond: 31%", vues: "4,567" },
];

const topDestinations = [
    { title: "Sénégal", subtitle: "1ère destination phare", vues: "8,224", highlight: true },
    { title: "Maroc", subtitle: "1ère principale", vues: "6,891" },
    { title: "Côte d'Ivoire", subtitle: "2ème destination", vues: "5,567" },
];

const viewingTimeData = [
    { label: "Épisode 1", value: 280 },
    { label: "Épisode 2", value: 310 },
    { label: "Épisode 3", value: 290 },
    { label: "Épisode 4", value: 340 },
    { label: "Épisode 5", value: 320 },
];

const topVideos = [
    { title: "Reportage Dakar 2024", subtitle: "Temps moyen: 12m", duration: "254h", highlight: true },
    { title: "Culture Marocaine", subtitle: "Temps moyen: 8m 45s", duration: "189h" },
    { title: "Paysages d'Afrique", subtitle: "Temps moyen: 12m 32s", duration: "167h" },
];

const newsletterData = [
    { date: "J1", nouveaux: 20 },
    { date: "J2", nouveaux: 35 },
    { date: "J3", nouveaux: 28 },
    { date: "J4", nouveaux: 45 },
    { date: "J5", nouveaux: 38 },
    { date: "J6", nouveaux: 52 },
];

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, delta, positive, sub, }: { icon: React.ReactNode; label: string; value: string; delta: string; positive: boolean; sub: string; }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="mt-1 text-gray-400">{icon}</div>
        <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <div className="flex items-center gap-1 mt-1">
            {positive ? (
            <TrendingUp size={12} className="text-emerald-500 shrink-0" />
            ) : (
            <TrendingDown size={12} className="text-red-500 shrink-0" />
            )}
            <span className={`text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
            {delta}
            </span>
            <span className="text-xs text-gray-400 truncate">{sub}</span>
        </div>
        </div>
    </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
        {children}
    </h2>
);

const ContentRow = ({ title, subtitle, vues, highlight, }: { title: string; subtitle: string; vues: string; highlight?: boolean; }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
        <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span
        className={`ml-3 text-sm font-bold shrink-0 ${
            highlight ? "text-amber-500" : "text-gray-600"
        }`}
        >
        {vues} <span className="text-xs font-normal text-gray-400">vues</span>
        </span>
    </div>
);

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
                {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
            </p>
            ))}
        </div>
        );
    }
    return null;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function StatsDashboard() {
    const [period, setPeriod] = useState("30 derniers jours");

    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Statistiques et Performances du Site
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                Analyse des données de trafic, d&apos;engagement des contenus et de monétisation
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition">
                <span>{period}</span>
                <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition">
                Comparer avec la période précédente
                </button>
                <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-gray-800 transition shadow-sm">
                <Download size={14} />
                Générer un Rapport PDF
                </button>
            </div>
            </div>

            {/* ── TRAFIC ET ACQUISITION ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>Trafic et Acquisition</SectionTitle>

            {/* Line Chart */}
            <div className="mb-6">
                <p className="text-xs text-gray-400 text-center mb-2 tracking-wide">Évolution du Trafic</p>
                <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trafficData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="visiteurs" name="Visiteurs Uniques" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="pages" name="Pages Vues" stroke="#1e3a8a" strokeWidth={2.5} dot={false} />
                </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                {[{ color: "#f59e0b", label: "Visiteurs Uniques" }, { color: "#1e3a8a", label: "Pages Vues" }].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color, display: "inline-block" }} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard
                icon={<Users size={18} />}
                label="Visiteurs Uniques"
                value="24,567"
                delta="+12.3%"
                positive={true}
                sub="période précédente"
                />
                <StatCard
                icon={<FileText size={18} />}
                label="Pages Vues"
                value="89,234"
                delta="+8.5% de hausse"
                positive={true}
                sub="période précédente"
                />
                <StatCard
                icon={<TrendingDown size={18} />}
                label="Taux de Rebond"
                value="42.8%"
                delta="-17% par rapport"
                positive={false}
                sub="période précédente"
                />
                <StatCard
                icon={<Clock size={18} />}
                label="Durée Moyenne"
                value="3m 42s"
                delta="+0.4% en hausse"
                positive={true}
                sub="période précédente"
                />
            </div>

            {/* Acquisition Sources */}
            <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Sources d&apos;Acquisition</p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-44 h-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={acquisitionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        >
                        {acquisitionData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => `${v}%`} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                    {acquisitionData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-sm text-gray-700">{d.name}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-auto">{d.value}%</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </section>

            {/* ── PERFORMANCE DES CONTENUS ÉCRITS ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>Performance des Contenus Écrits</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Articles</p>
                {topArticles.map((a) => (
                    <ContentRow key={a.title} {...a} />
                ))}
                </div>
                <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Fiches Destinations</p>
                {topDestinations.map((d) => (
                    <ContentRow key={d.title} {...d} />
                ))}
                </div>
            </div>
            </section>

            {/* ── STATISTIQUES TOURISME TV ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>Statistiques · Tourisme TV</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Temps de Visionnage</p>
                <p className="text-xs text-gray-400 mb-3">Temps de visionnage (heures)</p>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={viewingTimeData} barCategoryGap="30%">
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v: any) => `${v}h`} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                {/* Top Videos */}
                <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Vidéos</p>
                {topVideos.map((v) => (
                    <div key={v.title} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <Play size={12} className="text-gray-300 shrink-0" />
                        <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{v.title}</p>
                        <p className="text-xs text-gray-400">{v.subtitle}</p>
                        </div>
                    </div>
                    <span className={`ml-3 text-sm font-bold shrink-0 ${v.highlight ? "text-amber-500" : "text-gray-600"}`}>
                        {v.duration}
                    </span>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* ── SUIVI DES ACTIONS COMMERCIALES ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>Suivi des Actions Commerciales</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Clics Publicitaires */}
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <MousePointer size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clics Publicitaires</p>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">1,234</p>
                <p className="text-xs text-gray-400 mt-1">CTAs réalisés</p>
                <p className="text-xs font-semibold text-amber-600 mt-2">CTR: 2.8%</p>
                </div>

                {/* CTAs Partenaires */}
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Eye size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CTAs Partenaires</p>
                </div>
                <div className="space-y-1 mt-2">
                    {[
                    { label: "Droit Ancrage", value: "99 clics" },
                    { label: "XX Hôtels", value: "156 clics" },
                    { label: "Forfait Fin de vols", value: "67 clics" },
                    ].map((row) => (
                    <div key={row.label} className="flex justify-between text-xs">
                        <span className="text-gray-500">{row.label}</span>
                        <span className="font-semibold text-gray-700">{row.value}</span>
                    </div>
                    ))}
                </div>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Mail size={14} className="text-gray-500" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Newsletter</p>
                </div>
                <p className="text-xs text-gray-400 mb-2">Nouveaux Abonnements</p>
                <ResponsiveContainer width="100%" height={70}>
                    <AreaChart data={newsletterData}>
                    <defs>
                        <linearGradient id="newsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="nouveaux" stroke="#10b981" strokeWidth={2} fill="url(#newsGrad)" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
            </section>

            {/* ── ACCÈS AUX OUTILS EXTERNES ── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle>Accès aux outils externes</SectionTitle>
            <div className="flex flex-wrap gap-4">
                {[
                {
                    icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    ),
                    label: "Google Analytics",
                    sub: "Accéder aux données détaillées",
                },
                {
                    icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#4285F4" opacity="0.15"/>
                        <path d="M15.5 8.5L12 5 8.5 8.5M12 5v14M8.5 15.5L12 19l3.5-3.5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    ),
                    label: "Google Search Console",
                    sub: "Optimiser le référencement",
                },
                ].map((tool) => (
                <a
                    key={tool.label}
                    href="#"
                    className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 hover:border-gray-300 transition group"
                >
                    {tool.icon}
                    <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition">{tool.label}</p>
                    <p className="text-xs text-gray-400">{tool.sub}</p>
                    </div>
                    <ExternalLink size={13} className="text-gray-300 ml-2 group-hover:text-blue-400 transition" />
                </a>
                ))}
            </div>
            </section>

        </div>
        </div>
    </ProtectedRoute>
    );
}