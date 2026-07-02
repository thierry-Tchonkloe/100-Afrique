// src/hooks/useAdvertising.public.ts
"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";

interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
    officialWebSite: string;
    description: string;
    type: "IMAGE_JPG" | "HTML_JS";
    imageUrl: string | null;
    htmlCode: string | null;
    startDate: string;
    endDate: string;
    status: "ACTIF" | "FUTUR" | "EXPIRE";
}

interface Advertising {
    id: number;
    name: string;
    slug: string;
    width: number;
    height: number;
    path: string;
    isEnabled: boolean;
    banners: Banner[];
    fillRate: number;
}



export function useAdvertising(slug: string) {
    const [zone, setZone] = useState<Advertising | null>(null);
    const [activeBanners, setActiveBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
        try {
            setLoading(true);

            const res = await api.get(`/advertising/${slug}`);
            const data: Advertising = res.data.data;

            if (!cancelled) {
                if (data && data.isEnabled) {
                    const active = data.banners;
                    setZone(data);
                    setActiveBanners(active);
                } else {
                    setZone(null);
                    setActiveBanners([]);
            }
            }
        } catch (err) {
            console.error("Erreur chargement ads:", err);
            if (!cancelled) {
            setZone(null);
            setActiveBanners([]);
            }
        } finally {
            if (!cancelled) setLoading(false);
        }
        }

        load();
        return () => {
        cancelled = true;
        };
    }, [slug]);

    return { zone, activeBanners, loading };
}