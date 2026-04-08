import { Request, Response } from "express";
import { getSubscribers, getNewsletterStats, deleteSubscriber } from "../../services/admin/newsletter.service";

export const listSubscribers = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const search = req.query.search as string;

    const result = await getSubscribers(page, pageSize, search);

    res.json({
        success: true,
        data: result
    });
};

export const newsletterStats = async (_req: Request, res: Response) => {
    const stats = await getNewsletterStats();

    res.json({
        success: true,
        data: stats
    });
};

export const removeSubscriber = async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    await deleteSubscriber(id);

    res.json({
        success: true,
        message: "Abonné supprimé"
    });
};