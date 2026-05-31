import express from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect as any, getAccounts as any)
  .post(protect as any, createAccount as any);

router.route('/:id')
  .put(protect as any, updateAccount as any)
  .delete(protect as any, deleteAccount as any);

export default router;
