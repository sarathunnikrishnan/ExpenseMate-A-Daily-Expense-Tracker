/**
 * @file categoryController.ts
 * @description Controller handling CRUD operations for categories and default category seeding.
 * Delegates data access to CategoryService.
 */

import { Response } from 'express';
import { categoryService } from '../services';
import { AuthRequest } from '../types';
import { CATEGORY_MESSAGES } from '../messages';

export const getCategories = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const categories = await categoryService.getUserCategories(req.user?._id);
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { name, icon, color, type, investmentBehavior } = req.body;
  try {
    const createdCategory = await categoryService.create({
      name,
      icon,
      color,
      type,
      investmentBehavior,
      userId: req.user?._id,
    });
    res.status(201).json(createdCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  const { name, icon, color, type, investmentBehavior } = req.body;
  try {
    const category = await categoryService.findById(req.params.id);
    if (!category) return res.status(404).json({ message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND });
    if (category.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: CATEGORY_MESSAGES.USER_NOT_AUTHORIZED });
    }
    if (category.isDefault) {
      return res.status(403).json({ message: CATEGORY_MESSAGES.CANNOT_EDIT_DEFAULT });
    }

    category.name = name || category.name;
    category.icon = icon || category.icon;
    category.color = color || category.color;
    category.type = type || category.type;
    if (investmentBehavior !== undefined) {
      category.investmentBehavior = investmentBehavior;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const category = await categoryService.findById(req.params.id);
    if (!category) return res.status(404).json({ message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND });
    if (category.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: CATEGORY_MESSAGES.USER_NOT_AUTHORIZED });
    }
    if (category.isDefault) {
      return res.status(403).json({ message: CATEGORY_MESSAGES.CANNOT_DELETE_DEFAULT });
    }

    await categoryService.deleteById(category._id);
    res.json({ message: CATEGORY_MESSAGES.CATEGORY_REMOVED });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
