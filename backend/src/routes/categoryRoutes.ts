import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect as any, getCategories as any)
  .post(protect as any, createCategory as any);

router.route('/:id')
  .put(protect as any, updateCategory as any)
  .delete(protect as any, deleteCategory as any);

export default router;
