// src/components/AdvertisingBanner.tsx
"use client";

import { useAdvertising } from "@/hooks/useAdvertising.public";
import { useState, useEffect, useCallback } from "react";


interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
    description: string;
    officialWebSite: string;
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
    showOverlayContent = true,
    onImageError,
}: {
    banner: Banner;
    width: number;
    height: number;
    visible: boolean;
    showOverlayContent?: boolean;
    onImageError?: (bannerId: number) => void;
}) {
    const baseClass = `absolute inset-0 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`;

    // FIX : on précharge l'image en JS pour détecter un 404 Cloudinary.
    // Un <div style={{backgroundImage}}> ne déclenche aucune erreur observable
    // par React quand l'URL est cassée — la bannière reste invisible sans que
    // personne ne le sache. On signale l'échec au parent pour l'exclure de la
    // rotation plutôt que de laisser un emplacement vide.
    useEffect(() => {
        if (banner.type !== "IMAGE_JPG" || !banner.imageUrl) return;
        const img = new window.Image();
        img.onerror = () => onImageError?.(banner.id);
        img.src = banner.imageUrl;
    }, [banner.id, banner.type, banner.imageUrl, onImageError]);

    if (banner.type === "HTML_JS" && banner.htmlCode) {
        return (
            <div
                className={baseClass}
                dangerouslySetInnerHTML={{ __html: banner.htmlCode }}
            />
        );
    }

    if (banner.type === "IMAGE_JPG" && banner.imageUrl) {

        // ── Mode "image seule" : toute la bannière est cliquable ──
        if (!showOverlayContent) {
            const ImageContent = (
                <>
                    {/* Image de fond avec zoom au survol */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[0.98]"
                        style={{ backgroundImage: `url(${banner.imageUrl})` }}
                    />
                    {/* Léger voile au survol pour donner un feedback visuel */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Badge "Pub" */}
                    <span className="absolute bottom-1 right-2 text-[9px] text-white/90 select-none tracking-wider drop-shadow">
                        Pub
                    </span>
                </>
            );

            if (banner.officialWebSite) {
                return (
                    <a
                        href={banner.officialWebSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${banner.advertiser} — ${banner.campaign}`}
                        className={`group cursor-pointer overflow-hidden ${baseClass}`}
                    >
                        {ImageContent}
                    </a>
                );
            }

            // Pas de site officiel renseigné → pas de lien, juste l'image
            return <div className={`overflow-hidden ${baseClass}`}>{ImageContent}</div>;
        }

        // ── Mode complet (Annonceur / Titre / Description / CTA) ──
        return (
            <div className={baseClass}>
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${banner.imageUrl})`,
                    }}
                />

                {/* Gradient overlay — gauche opaque, droite transparente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent" />

                {/* Contenu superposé */}
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
    imageOnly = false,
}: {
    zoneSlug: string;
    showDots: boolean;
    className: string;
    imageOnly?: boolean;
}) {
    const { zone, activeBanners: rawBanners, loading } = useAdvertising(zoneSlug);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    // FIX : bannières dont l'image renvoie une 404 Cloudinary — on les exclut
    // de la rotation au lieu d'afficher un emplacement vide.
    const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());

    const activeBanners = rawBanners.filter((b) => !brokenIds.has(b.id));

    const handleImageError = useCallback((bannerId: number) => {
        setBrokenIds((prev) => {
            if (prev.has(bannerId)) return prev;
            const next = new Set(prev);
            next.add(bannerId);
            console.warn(`[AdvertisingBanner] Image cassée pour la bannière #${bannerId} (zone "${zoneSlug}") — exclue de la rotation.`);
            return next;
        });
    }, [zoneSlug]);

    useEffect(() => {
        if (activeBanners.length <= 1 || paused) return;
        const timer = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % activeBanners.length);
        }, ROTATION_INTERVAL);
        return () => clearInterval(timer);
    }, [activeBanners.length, paused]);

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
            {activeBanners.map((banner, idx) => (
            <BannerSlide
                key={banner.id}
                banner={banner}
                width={w}
                height={h}
                visible={idx === currentIndex}
                showOverlayContent={!imageOnly}
                onImageError={handleImageError}
            />
            ))}

            {activeBanners.length > 1 && (
            <>
                <button
                onClick={() =>
                    goTo((currentIndex - 1 + activeBanners.length) % activeBanners.length)
                }
                className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Bannière précédente"
                >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                <button
                onClick={() => goTo((currentIndex + 1) % activeBanners.length)}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Bannière suivante"
                >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </>
            )}

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














// // src/components/AdvertisingBanner.tsx
// "use client";

// import { useAdvertising } from "@/hooks/useAdvertising.public";
// import { useState, useEffect } from "react";


// interface Banner {
//     id: number;
//     advertiser: string;
//     campaign: string;
//     description: string;
//     officialWebSite: string;
//     type: "IMAGE_JPG" | "HTML_JS";
//     imageUrl: string | null;
//     htmlCode: string | null;
//     startDate: string;
//     endDate: string;
//     status: "ACTIF" | "FUTUR" | "EXPIRE";
// }

// // ─── Constantes ───────────────────────────────────────────────────────────────

// const ROTATION_INTERVAL = 5000; // 5s

// // ─── Composant : Bannière individuelle ───────────────────────────────────────

// function BannerSlide({
//     banner,
//     width,
//     height,
//     visible,
//     showOverlayContent = true,
// }: {
//     banner: Banner;
//     width: number;
//     height: number;
//     visible: boolean;
//     showOverlayContent?: boolean;
// }) {
//     const baseClass = `absolute inset-0 transition-opacity duration-700 ${
//         visible ? "opacity-100" : "opacity-0 pointer-events-none"
//     }`;

//     if (banner.type === "HTML_JS" && banner.htmlCode) {
//         return (
//             <div
//                 className={baseClass}
//                 dangerouslySetInnerHTML={{ __html: banner.htmlCode }}
//             />
//         );
//     }

//     if (banner.type === "IMAGE_JPG" && banner.imageUrl) {

//         // ── Mode "image seule" : toute la bannière est cliquable ──
//         if (!showOverlayContent) {
//             const ImageContent = (
//                 <>
//                     {/* Image de fond avec zoom au survol */}
//                     <div
//                         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[0.98]"
//                         style={{ backgroundImage: `url(${banner.imageUrl})` }}
//                     />
//                     {/* Léger voile au survol pour donner un feedback visuel */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

//                     {/* Badge "Pub" */}
//                     <span className="absolute bottom-1 right-2 text-[9px] text-white/90 select-none tracking-wider drop-shadow">
//                         Pub
//                     </span>
//                 </>
//             );

//             if (banner.officialWebSite) {
//                 return (
//                     <a
//                         href={banner.officialWebSite}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         aria-label={`${banner.advertiser} — ${banner.campaign}`}
//                         className={`group cursor-pointer overflow-hidden ${baseClass}`}
//                     >
//                         {ImageContent}
//                     </a>
//                 );
//             }

//             // Pas de site officiel renseigné → pas de lien, juste l'image
//             return <div className={`overflow-hidden ${baseClass}`}>{ImageContent}</div>;
//         }

//         // ── Mode complet (Annonceur / Titre / Description / CTA) ──
//         return (
//             <div className={baseClass}>
//                 {/* Background image */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center"
//                     style={{
//                         backgroundImage: `url(${banner.imageUrl})`,
//                     }}
//                     onError={() => {}}
//                 />

//                 {/* Gradient overlay — gauche opaque, droite transparente */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent" />

//                 {/* Contenu superposé */}
//                 <div className="absolute inset-0 flex items-center px-6 sm:px-10">
//                     {/* Advertiser — collé à gauche */}
//                     <span className="absolute top-3 lg:top-9 text-white/90 text-[16px] font-bold uppercase tracking-widest shrink-0">
//                         {banner.advertiser}
//                     </span>

//                     {/* Contenu central — vraiment centré sur toute la bannière */}
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
//                         <div className="flex flex-col items-center gap-1.5 text-center max-w-[55%] pointer-events-auto">
//                             {/* Titre principal = campaign */}
//                             <h2
//                                 className="text-white font-extrabold leading-tight drop-shadow"
//                                 style={{
//                                     fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
//                                     textShadow: "0 2px 8px rgba(0,0,0,0.5)",
//                                 }}
//                             >
//                                 {banner.campaign}
//                             </h2>

//                             {/* Description */}
//                             <p
//                                 className="text-white/80 leading-snug"
//                                 style={{ fontSize: "clamp(0.72rem, 1.5vw, 0.975rem)" }}
//                             >
//                                 {banner.description}
//                             </p>

//                             {/* CTA */}
//                             {banner.officialWebSite && (
//                                 <a
//                                     href={banner.officialWebSite}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/80 text-white text-xs font-semibold tracking-wide backdrop-blur-sm bg-white/10 hover:bg-white/25 transition-colors"
//                                     onClick={(e) => e.stopPropagation()}
//                                 >
//                                     Voir plus
//                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                                     </svg>
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Badge "Pub" */}
//                 <span className="absolute bottom-1 right-2 text-[9px] text-white/80 select-none tracking-wider">
//                     Pub
//                 </span>
//             </div>
//         );
//     }

//     return null;
// }


// // ─── Composant : Zone publicitaire ───────────────────────────────────────────

// export function AdvertisingBanner({
//     zoneSlug,
//     showDots,
//     className,
//     imageOnly = false,
// }: {
//     zoneSlug: string;
//     showDots: boolean;
//     className: string;
//     imageOnly?: boolean;
// }) {
//     const { zone, activeBanners, loading } = useAdvertising(zoneSlug);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [paused, setPaused] = useState(false);

//     useEffect(() => {
//         if (activeBanners.length <= 1 || paused) return;
//         const timer = setInterval(() => {
//             setCurrentIndex((i) => (i + 1) % activeBanners.length);
//         }, ROTATION_INTERVAL);
//         return () => clearInterval(timer);
//     }, [activeBanners.length, paused]);

//     useEffect(() => {
//         setCurrentIndex(0);
//     }, [activeBanners.length]);

//     const goTo = (idx: number) => {
//         setCurrentIndex(idx);
//         setPaused(true);
//         setTimeout(() => setPaused(false), 10_000);
//     };

//     if (loading) {
//         return (
//         <div className={`flex-1 flex justify-center ${className}`}>
//             <div
//             className="relative w-full max-w-2xl h-30 bg-gray-100 rounded-sm border border-gray-200 animate-pulse"
//             aria-hidden="true"
//             />
//         </div>
//         );
//     }

//     if (!zone || !zone.isEnabled || activeBanners.length === 0) {
//         return <div className="flex-1" />;
//     }

//     const { width: w, height: h } = zone;

//     return (
//         <div className={`flex-1 flex justify-center w-full ${className}`}>
//         <div
//             className="relative overflow-hidden rounded-sm border border-gray-300 shadow-sm bg-gray-100"
//             style={{ width: "100%", maxWidth: `100%`, minHeight: `170px` }}
//             onMouseEnter={() => setPaused(true)}
//             onMouseLeave={() => setPaused(false)}
//             role="region"
//             aria-label="Espace publicitaire"
//         >
//             {activeBanners.map((banner, idx) => (
//             <BannerSlide
//                 key={banner.id}
//                 banner={banner}
//                 width={w}
//                 height={h}
//                 visible={idx === currentIndex}
//                 showOverlayContent={!imageOnly}
//             />
//             ))}

//             {activeBanners.length > 1 && (
//             <>
//                 <button
//                 onClick={() =>
//                     goTo((currentIndex - 1 + activeBanners.length) % activeBanners.length)
//                 }
//                 className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
//                 aria-label="Bannière précédente"
//                 >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 </button>
//                 <button
//                 onClick={() => goTo((currentIndex + 1) % activeBanners.length)}
//                 className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
//                 aria-label="Bannière suivante"
//                 >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//                 </button>
//             </>
//             )}

//             {showDots && activeBanners.length > 1 && (
//             <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
//                 {activeBanners.map((_, idx) => (
//                 <button
//                     key={idx}
//                     onClick={() => goTo(idx)}
//                     className={`rounded-full transition-all duration-300 ${
//                     idx === currentIndex
//                         ? "w-3.5 h-1.5 bg-white"
//                         : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
//                     }`}
//                     aria-label={`Aller à la bannière ${idx + 1}`}
//                 />
//                 ))}
//             </div>
//             )}

//             {activeBanners.length > 1 && !paused && (
//             <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full z-10">
//                 <div
//                 key={`${currentIndex}-progress`}
//                 className="h-full bg-white/70"
//                 style={{
//                     animation: `progress-bar ${ROTATION_INTERVAL}ms linear forwards`,
//                 }}
//                 />
//             </div>
//             )}
//         </div>

//         <style>{`
//             @keyframes progress-bar {
//             from { width: 0%; }
//             to   { width: 100%; }
//             }
//         `}</style>
//         </div>
//     );
// }













// // src/components/AdvertisingBanner.tsx
// "use client";

// import { useAdvertising } from "@/hooks/useAdvertising.public";
// //import api from "@/lib/api";
// import { useState, useEffect } from "react";


// interface Banner {
//     id: number;
//     advertiser: string;
//     campaign: string;
//     description: string;        // ← nouveau
//     officialWebSite: string;    // ← nouveau
//     type: "IMAGE_JPG" | "HTML_JS";
//     imageUrl: string | null;
//     htmlCode: string | null;
//     startDate: string;
//     endDate: string;
//     status: "ACTIF" | "FUTUR" | "EXPIRE";
// }

// // ─── Constantes ───────────────────────────────────────────────────────────────

// const ROTATION_INTERVAL = 5000; // 5s

// // ─── Composant : Bannière individuelle ───────────────────────────────────────


// function BannerSlide({
//     banner,
//     width,
//     height,
//     visible,
// }: {
//     banner: Banner;
//     width: number;
//     height: number;
//     visible: boolean;
// }) {
//     const baseClass = `absolute inset-0 transition-opacity duration-700 ${
//         visible ? "opacity-100" : "opacity-0 pointer-events-none"
//     }`;

//     if (banner.type === "HTML_JS" && banner.htmlCode) {
//         return (
//             <div
//                 className={baseClass}
//                 dangerouslySetInnerHTML={{ __html: banner.htmlCode }}
//             />
//         );
//     }

//     if (banner.type === "IMAGE_JPG" && banner.imageUrl) {
//         return (
//             <div className={baseClass}>
//                 {/* Background image */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center"
//                     style={{
//                         backgroundImage: `url(${banner.imageUrl})`,
//                     }}
//                     onError={() => {}}
//                 />

//                 {/* Gradient overlay — gauche opaque, droite transparente */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-transparent" />

//                 {/* Contenu superposé */}
//                 <div className="absolute inset-0 flex items-center px-6 sm:px-10">
//                     {/* <div className="flex flex-row gap-1.5 max-w-[100%]">
                        
//                         <span className="text-white/85 text-[15px] font-bold uppercase tracking-widest">
//                             {banner.advertiser}
//                         </span>

//                         <div className="mx-xxl-auto max-w-[100%] flex flex-col gap-1.5">
                            
//                             <h2 className="text-white font-extrabold leading-tight drop-shadow"
//                                 style={{
//                                     fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
//                                     textShadow: "0 2px 8px rgba(0,0,0,0.5)",
//                                 }}
//                             >
//                                 {banner.campaign}
//                             </h2>

                           
//                             <p className="text-white/80 leading-snug mt-0.5"
//                                 style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)" }}
//                             >
//                                 {banner.description}
//                             </p>

                            
//                             {banner.officialWebSite && (
//                                 <a
//                                     href={banner.officialWebSite}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="mt-2 self-start inline-flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/80 text-white text-xs font-semibold tracking-wide backdrop-blur-sm bg-white/10 hover:bg-white/25 transition-colors"
//                                     onClick={(e) => e.stopPropagation()}
//                                 >
//                                     Voir plus
//                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                                     </svg>
//                                 </a>
//                             )}
//                         </div>
//                     </div> */}



//                     <div className="absolute inset-0 flex items-center px-6 sm:px-10">
//                         {/* Advertiser — collé à gauche */}
//                         <span className="absolute top-3 lg:top-9 text-white/90 text-[16px] font-bold uppercase tracking-widest shrink-0">
//                             {banner.advertiser}
//                         </span>

//                         {/* Contenu central — vraiment centré sur toute la bannière */}
//                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
//                             <div className="flex flex-col items-center gap-1.5 text-center max-w-[55%] pointer-events-auto">
//                                 {/* Titre principal = campaign */}
//                                 <h2
//                                     className="text-white font-extrabold leading-tight drop-shadow"
//                                     style={{
//                                         fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
//                                         textShadow: "0 2px 8px rgba(0,0,0,0.5)",
//                                     }}
//                                 >
//                                     {banner.campaign}
//                                 </h2>

//                                 {/* Description */}
//                                 <p
//                                     className="text-white/80 leading-snug"
//                                     style={{ fontSize: "clamp(0.72rem, 1.5vw, 0.975rem)" }}
//                                 >
//                                     {banner.description}
//                                 </p>

//                                 {/* CTA */}
//                                 {banner.officialWebSite && (
//                                     <a
//                                         href={banner.officialWebSite}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded border border-white/80 text-white text-xs font-semibold tracking-wide backdrop-blur-sm bg-white/10 hover:bg-white/25 transition-colors"
//                                         onClick={(e) => e.stopPropagation()}
//                                     >
//                                         Voir plus
//                                         <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                                         </svg>
//                                     </a>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Badge "Pub" */}
//                 <span className="absolute bottom-1 right-2 text-[9px] text-white/80 select-none tracking-wider">
//                     Pub
//                 </span>
//             </div>
//         );
//     }

//     return null;
// }


// // ─── Composant : Zone publicitaire ───────────────────────────────────────────


// export function AdvertisingBanner({
//     zoneSlug,
//     showDots,
//     className,
// }: {
//     zoneSlug: string;
//     showDots: boolean;
//     className: string;
// }) {
//     const { zone, activeBanners, loading } = useAdvertising(zoneSlug);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [paused, setPaused] = useState(false);

//     // Rotation automatique
//     useEffect(() => {
//         if (activeBanners.length <= 1 || paused) return;
//         const timer = setInterval(() => {
//             setCurrentIndex((i) => (i + 1) % activeBanners.length);
//         }, ROTATION_INTERVAL);
//         return () => clearInterval(timer);
//     }, [activeBanners.length, paused]);

//     // Reset index si la liste change
//     useEffect(() => {
//         setCurrentIndex(0);
//     }, [activeBanners.length]);

//     const goTo = (idx: number) => {
//         setCurrentIndex(idx);
//         setPaused(true);
//         setTimeout(() => setPaused(false), 10_000);
//     };

//     if (loading) {
//         return (
//         <div className={`flex-1 flex justify-center ${className}`}>
//             <div
//             className="relative w-full max-w-2xl h-30 bg-gray-100 rounded-sm border border-gray-200 animate-pulse"
//             aria-hidden="true"
//             />
//         </div>
//         );
//     }

//     if (!zone || !zone.isEnabled || activeBanners.length === 0) {
//         // Espace vide pour conserver le layout
//         return <div className="flex-1" />;
//     }

//     const { width: w, height: h } = zone;

//     return (
//         <div className={`flex-1 flex justify-center w-full ${className}`}>
//         <div
//             className="relative overflow-hidden rounded-sm border border-gray-300 shadow-sm bg-gray-100"
//             style={{ width: "100%", maxWidth: `100%`, minHeight: `170px` }}
//             onMouseEnter={() => setPaused(true)}
//             onMouseLeave={() => setPaused(false)}
//             role="region"
//             aria-label="Espace publicitaire"
//         >
//             {/* Slides */}
//             {activeBanners.map((banner, idx) => (
//             <BannerSlide
//                 key={banner.id}
//                 banner={banner}
//                 width={w}
//                 height={h}
//                 visible={idx === currentIndex}
//             />
//             ))}

//             {/* Flèches (uniquement si > 1 bannière) */}
//             {activeBanners.length > 1 && (
//             <>
//                 <button
//                 onClick={() =>
//                     goTo((currentIndex - 1 + activeBanners.length) % activeBanners.length)
//                 }
//                 className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
//                 aria-label="Bannière précédente"
//                 >
//                 <svg
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth={2.5}
//                     viewBox="0 0 24 24"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 </button>
//                 <button
//                 onClick={() => goTo((currentIndex + 1) % activeBanners.length)}
//                 className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
//                 aria-label="Bannière suivante"
//                 >
//                 <svg
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth={2.5}
//                     viewBox="0 0 24 24"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//                 </button>
//             </>
//             )}

//             {/* Points de pagination */}
//             {showDots && activeBanners.length > 1 && (
//             <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
//                 {activeBanners.map((_, idx) => (
//                 <button
//                     key={idx}
//                     onClick={() => goTo(idx)}
//                     className={`rounded-full transition-all duration-300 ${
//                     idx === currentIndex
//                         ? "w-3.5 h-1.5 bg-white"
//                         : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
//                     }`}
//                     aria-label={`Aller à la bannière ${idx + 1}`}
//                 />
//                 ))}
//             </div>
//             )}

//             {/* Barre de progression */}
//             {activeBanners.length > 1 && !paused && (
//             <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full z-10">
//                 <div
//                 key={`${currentIndex}-progress`}
//                 className="h-full bg-white/70"
//                 style={{
//                     animation: `progress-bar ${ROTATION_INTERVAL}ms linear forwards`,
//                 }}
//                 />
//             </div>
//             )}
//         </div>

//         <style>{`
//             @keyframes progress-bar {
//             from { width: 0%; }
//             to   { width: 100%; }
//             }
//         `}</style>
//         </div>
//     );
// }