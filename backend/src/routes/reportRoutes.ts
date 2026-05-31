import express from 'express';
import { getMonthlyReport, getYearlyReport, getCategoryReport } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/monthly', protect as any, getMonthlyReport as any);
router.get('/yearly', protect as any, getYearlyReport as any);
router.get('/category', protect as any, getCategoryReport as any);

export default router;
