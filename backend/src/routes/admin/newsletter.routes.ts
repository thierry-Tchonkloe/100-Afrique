import { Router } from "express";
import { listSubscribers, newsletterStats, removeSubscriber } from "../../controllers/admin/newsletter.controller";

import { authenticate } from "../../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/", listSubscribers);

router.get("/stats", newsletterStats);

router.delete("/:id", removeSubscriber);

export default router;