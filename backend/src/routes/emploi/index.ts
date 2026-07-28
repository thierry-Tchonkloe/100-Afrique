// src/routes/emploi/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import candidatRoutes from './candidat.routes';
import recruteurRoutes from './recruteur.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/candidat', candidatRoutes);
router.use('/recruteur', recruteurRoutes);
router.use('/', publicRoutes);

export default router;
