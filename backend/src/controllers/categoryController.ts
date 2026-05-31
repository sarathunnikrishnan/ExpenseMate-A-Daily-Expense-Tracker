import { Request, Response } from 'express';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/authMiddleware';
import { DEFAULT_CATEGORIES } from '../constants';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    let categories = await Category.find({ userId: req.user?._id });
    
    // Auto-seed for existing users who don't have default categories yet
    if (categories.length === 0 && req.user) {
      const defaultCategoriesWithUser = DEFAULT_CATEGORIES.map(c => ({ ...c, userId: req.user!._id }));
      await Category.insertMany(defaultCategoriesWithUser);
      categories = await Category.find({ userId: req.user._id });
    }

    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  const { name, icon, color, type, investmentBehavior } = req.body;

  try {
    const category = new Category({
      name,
      icon,
      color,
      type,
      investmentBehavior,
      userId: req.user?._id,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  const { name, icon, color, type } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (category.isDefault) {
      return res.status(403).json({ message: 'Cannot edit default categories' });
    }

    category.name = name || category.name;
    category.icon = icon || category.icon;
    category.color = color || category.color;
    category.type = type || category.type;
    
    const { investmentBehavior } = req.body;
    if (investmentBehavior !== undefined) {
      category.investmentBehavior = investmentBehavior;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (category.isDefault) {
      return res.status(403).json({ message: 'Cannot delete default categories' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
