/**
 * @file reportRoutes.ts
 * @description API routes for fetching monthly, yearly, and category analytics reports.
 */

import express from 'express';
import { getMonthlyReport, getYearlyReport, getCategoryReport } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);
router.get('/category', getCategoryReport);

export default router;
