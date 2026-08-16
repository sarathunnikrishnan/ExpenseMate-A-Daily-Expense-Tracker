/**
 * @file transactionRoutes.ts
 * @description API routes for managing income and expense transactions.
 */

import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
