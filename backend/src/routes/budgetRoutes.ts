import express from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect as any, getBudgets as any)
  .post(protect as any, createBudget as any);

router.route('/:id')
  .put(protect as any, updateBudget as any)
  .delete(protect as any, deleteBudget as any);

export default router;
