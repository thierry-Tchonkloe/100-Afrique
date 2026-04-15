"use client";

import { useAdvertising } from "@/hooks/useAdvertising.public";
//import api from "@/lib/api";
import { useState, useEffect } from "react";


interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
    description: string;        // ← nouveau
    officialWebSite: string;    // ← nouveau
    type: "IMAGE_JPG" | "HTML_JS";
    imageUrl: string | null;
    htmlCode: string | null;
    startDate: string;
    endDate: string;
    status: "ACTIF" | "FUTUR" | "EXPIRE";
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const ROTATION_INTERVAL = 5000; // 5s

// ─── Composant : Bannière individuelle ───────────────────────────────────────


function BannerSlide({
    banner,
    width,
    height,
    visible,
}: {
    banner: Banner;
    width: number;
    height: number;
    visible: boolean;
}) {
    const baseClass = `absolute inset-0 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`;

    if (banner.type === "HTML_JS" && banner.htmlCode) {
        return (
            <div
                className={baseClass}
                dangerouslySetInnerHTML={{ __html: banner.htmlCode }}
            />
        );
    }

    if (banner.type === "IMAGE_JPG" && banner.imageUrl) {
        return (
            <div className={baseClass}>
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${banner.imageUrl})`,
                    }}
                    onError={() => {}}
                />

                {/* Gradient overlay — gauche opaque, droite transparente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent" />

                {/* Contenu superposé */}
                <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                    {/* <div className="flex flex-row gap-1.5 max-w-[100%]">
                        
                        <span className="text-white/85 text-[15px] font-bold uppercase tracking-widest">
                            {banner.advertiser}
                        </span>

                        <div className="mx-xxl-auto max-w-[100%] flex flex-col gap-1.5">
                            
                            <h2 className="text-white font-extrabold leading-tight drop-shadow"
                                style={{
                                    fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
                                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                }}
                            >
                                {banner.campaign}
                            </h2>

                           
                            <p className="text-white/80 leading-snug mt-0.5"
                                style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)" }}
                            >
                                {banner.description}
                            </p>

                            
                            {banner.officialWebSite && (
                                <a
                                    href={banner.officialWebSite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 self-start inline-flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/80 text-white text-xs font-semibold tracking-wide backdrop-blur-sm bg-white/10 hover:bg-white/25 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Voir plus
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div> */}



                    <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                        {/* Advertiser — collé à gauche */}
                        <span className="absolute top-3 lg:top-9 text-white/90 text-[16px] font-bold uppercase tracking-widest shrink-0">
                            {banner.advertiser}
                        </span>

                        {/* Contenu central — vraiment centré sur toute la bannière */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                            <div className="flex flex-col items-center gap-1.5 text-center max-w-[55%] pointer-events-auto">
                                {/* Titre principal = campaign */}
                                <h2
                                    className="text-white font-extrabold leading-tight drop-shadow"
                                    style={{
                                        fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
                                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    {banner.campaign}
                                </h2>

                                {/* Description */}
                                <p
                                    className="text-white/80 leading-snug"
                                    style={{ fontSize: "clamp(0.72rem, 1.5vw, 0.975rem)" }}
                                >
                                    {banner.description}
                                </p>

                                {/* CTA */}
                                {banner.officialWebSite && (
                                    <a
                                        href={banner.officialWebSite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/80 text-white text-xs font-semibold tracking-wide backdrop-blur-sm bg-white/10 hover:bg-white/25 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Voir plus
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge "Pub" */}
                <span className="absolute bottom-1 right-2 text-[9px] text-white/80 select-none tracking-wider">
                    Pub
                </span>
            </div>
        );
    }

    return null;
}


// ─── Composant : Zone publicitaire ───────────────────────────────────────────


export function AdvertisingBanner({
    zoneSlug,
    showDots,
    className,
}: {
    zoneSlug: string;
    showDots: boolean;
    className: string;
}) {
    const { zone, activeBanners, loading } = useAdvertising(zoneSlug);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    // Rotation automatique
    useEffect(() => {
        if (activeBanners.length <= 1 || paused) return;
        const timer = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % activeBanners.length);
        }, ROTATION_INTERVAL);
        return () => clearInterval(timer);
    }, [activeBanners.length, paused]);

    // Reset index si la liste change
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeBanners.length]);

    const goTo = (idx: number) => {
        setCurrentIndex(idx);
        setPaused(true);
        setTimeout(() => setPaused(false), 10_000);
    };

    if (loading) {
        return (
        <div className={`flex-1 flex justify-center ${className}`}>
            <div
            className="relative w-full max-w-2xl h-30 bg-gray-100 rounded-sm border border-gray-200 animate-pulse"
            aria-hidden="true"
            />
        </div>
        );
    }

    if (!zone || !zone.isEnabled || activeBanners.length === 0) {
        // Espace vide pour conserver le layout
        return <div className="flex-1" />;
    }

    const { width: w, height: h } = zone;

    return (
        <div className={`flex-1 flex justify-center w-full ${className}`}>
        <div
            className="relative overflow-hidden rounded-sm border border-gray-300 shadow-sm bg-gray-100"
            style={{ width: "100%", maxWidth: `100%`, minHeight: `170px` }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-label="Espace publicitaire"
        >
            {/* Slides */}
            {activeBanners.map((banner, idx) => (
            <BannerSlide
                key={banner.id}
                banner={banner}
                width={w}
                height={h}
                visible={idx === currentIndex}
            />
            ))}

            {/* Flèches (uniquement si > 1 bannière) */}
            {activeBanners.length > 1 && (
            <>
                <button
                onClick={() =>
                    goTo((currentIndex - 1 + activeBanners.length) % activeBanners.length)
                }
                className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Bannière précédente"
                >
                <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                <button
                onClick={() => goTo((currentIndex + 1) % activeBanners.length)}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Bannière suivante"
                >
                <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </>
            )}

            {/* Points de pagination */}
            {showDots && activeBanners.length > 1 && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {activeBanners.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                        ? "w-3.5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Aller à la bannière ${idx + 1}`}
                />
                ))}
            </div>
            )}

            {/* Barre de progression */}
            {activeBanners.length > 1 && !paused && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full z-10">
                <div
                key={`${currentIndex}-progress`}
                className="h-full bg-white/70"
                style={{
                    animation: `progress-bar ${ROTATION_INTERVAL}ms linear forwards`,
                }}
                />
            </div>
            )}
        </div>

        <style>{`
            @keyframes progress-bar {
            from { width: 0%; }
            to   { width: 100%; }
            }
        `}</style>
        </div>
    );
}