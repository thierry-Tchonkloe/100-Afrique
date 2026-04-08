"use client";

import { useAdvertising } from "@/hooks/useAdvertising.public";
//import api from "@/lib/api";
import { useState, useEffect } from "react";


interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
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

            <h3 className="bg-transparent">{banner.advertiser} – {banner.campaign}</h3>
            <img
            src={banner.imageUrl}
            alt={`${banner.advertiser} – ${banner.campaign}`}
            width={width}
            height={height}
            onError={(e) => {
                (e.target as HTMLImageElement).src = "https://media.istockphoto.com/id/2241142636/fr/photo/globe-num%C3%A9rique-avec-carte-neon-africa-mettant-en-%C3%A9vidence-la-connectivit%C3%A9-mondiale-de-la.webp?a=1&b=1&s=612x612&w=0&k=20&c=UJFrWe4j4fniMNAThIrcFwirJqmES3twfUUiXFxoC4Y=";
            }}
            className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1.5 text-[9px] text-white/60 select-none">
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
        <div className={`flex-1 flex justify-center ${className}`}>
        <div
            className="relative overflow-hidden rounded-sm border border-gray-300 shadow-sm bg-gray-100"
            style={{ width: "100%", maxWidth: `${w}px`, height: `${h}px` }}
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