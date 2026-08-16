/**
 * @file accountRoutes.ts
 * @description API routes for managing financial accounts.
 */

import express from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAccounts)
  .post(createAccount);

router.route('/:id')
  .put(updateAccount)
  .delete(deleteAccount);

export default router;
