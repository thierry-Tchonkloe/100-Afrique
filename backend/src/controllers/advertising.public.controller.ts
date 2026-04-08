// src/controllers/advertising.public.controller.ts
import { Request, Response } from "express";
import { advertisingPublicService } from "../services/advertising.public.service";

const ok = (res: Response, data: unknown) =>
    res.status(200).json({ success: true, data });

const fail = (res: Response, error: unknown) => {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    const status = message.includes("introuvable") ? 404 : 500;
    res.status(status).json({ success: false, message });
};

export const advertisingPublicController = {

    /**
     * GET /api/advertising
     * Retourne toutes les zones actives avec leurs bannières actives.
     * Pas d'authentification requise.
     */
    async getActiveZones(_req: Request, res: Response) {
        try {
        const zones = await advertisingPublicService.getActiveZones();
        ok(res, zones);
        } catch (e) {
        fail(res, e);
        }
    },

    /**
     * GET /api/advertising/:slug
     * Retourne une zone active par son slug avec ses bannières actives.
     * Utile pour cibler une zone précise (ex: top-banner-accueil).
     */
    async getActiveZoneBySlug(req: Request, res: Response) {
        try {
        const zone = await advertisingPublicService.getActiveZoneBySlug(
            req.params.slug as string
        );
        ok(res, zone);
        } catch (e) {
        fail(res, e);
        }
    },
};