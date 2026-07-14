// src/controllers/admin/advertising.controller.ts
import { Request, Response } from "express";
import { advertisingService, bannerService, thirdPartyService } from "../../services/admin/advertising.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ok = (res: Response, data: unknown, statusCode = 200) =>
    res.status(statusCode).json({ success: true, data });

const fail = (res: Response, error: unknown, statusCode = 500) => {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    const code = message.includes("introuvable") ? 404 : statusCode;
    res.status(code).json({ success: false, message });
};

// ─── AdZone Controllers ───────────────────────────────────────────────────────

export const advertisingController = {
    async getAll(_req: Request, res: Response) {
        try {
        const zones = await advertisingService.findAll();
        ok(res, zones);
        } catch (e) {
        fail(res, e);
        }
    },

    async getStats(_req: Request, res: Response) {
        try {
        const stats = await advertisingService.globalStats();
        ok(res, stats);
        } catch (e) {
        fail(res, e);
        }
    },

    async getOne(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        const zone = await advertisingService.findById(id);
        ok(res, zone);
        } catch (e) {
        fail(res, e);
        }
    },

    async create(req: Request, res: Response) {
        try {
            console.log("BODY REÇU 👉", req.body);
            const zone = await advertisingService.create(req.body);
            ok(res, zone, 201);
        } catch (e) {
        fail(res, e);
        }
    },

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        const zone = await advertisingService.update(id, req.body);
        ok(res, zone);
        } catch (e) {
        fail(res, e);
        }
    },

    async toggle(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        const zone = await advertisingService.toggle(id);
        ok(res, zone);
        } catch (e) {
        fail(res, e);
        }
    },

    async remove(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        await advertisingService.delete(id);
        ok(res, { message: "Zone supprimée" });
        } catch (e) {
        fail(res, e);
        }
    },
};

// ─── Banner Controllers ───────────────────────────────────────────────────────

export const bannerController = {
    async getByZone(req: Request, res: Response) {
        try {
        const banners = await bannerService.findByZone(Number(req.params.zoneId));
        ok(res, banners);
        } catch (e) {
        fail(res, e);
        }
    },

    async create(req: Request, res: Response) {
        try {
            console.log("BODY 👉", req.body);
            console.log("FILE 👉", req.file);
        const banner = await bannerService.create(req.body, req.file);
        ok(res, banner, 201);
        } catch (e) {
        fail(res, e, 422);
        }
    },

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        const banner = await bannerService.update(id, req.body, req.file);
        ok(res, banner);
        } catch (e) {
        fail(res, e, 422);
        }
    },

    async remove(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
        await bannerService.delete(id);
        ok(res, { message: "Bannière supprimée" });
        } catch (e) {
        fail(res, e);
        }
    },

    async refreshStatuses(_req: Request, res: Response) {
        try {
        const result = await bannerService.refreshStatuses();
        ok(res, result);
        } catch (e) {
        fail(res, e);
        }
    },
};

// ─── ThirdPartyCode Controllers ───────────────────────────────────────────────

export const thirdPartyController = {
    async get(_req: Request, res: Response) {
        try {
            const code = await thirdPartyService.get();
            ok(res, code ?? { code: "" });
        } catch (e) {
            fail(res, e);
        }
    },

    async upsert(req: Request, res: Response) {
        try {
            const code = await thirdPartyService.upsert(req.body);
            ok(res, code);
            }
        catch (e) {
            fail(res, e);
        }
    },
};