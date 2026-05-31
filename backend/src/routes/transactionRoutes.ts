import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect as any, getTransactions as any)
  .post(protect as any, createTransaction as any);

router.route('/:id')
  .put(protect as any, updateTransaction as any)
  .delete(protect as any, deleteTransaction as any);

export default router;
