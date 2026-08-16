/**
 * @file category.service.ts
 * @description CategoryService managing category CRUD, default categories, and auto-seeding.
 * Extends BaseService.
 */

import { Types } from 'mongoose';
import { BaseService } from './base.service';
import Category, { ICategory } from '../models/Category';
import { DEFAULT_CATEGORIES } from '../constants';

export class CategoryService extends BaseService<ICategory> {
  constructor() {
    super(Category);
  }

  async getUserCategories(userId: string | Types.ObjectId): Promise<ICategory[]> {
    let categories = await this.model.find({ userId });

    if (categories.length === 0) {
      const defaultCategoriesWithUser = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId }));
      await this.model.insertMany(defaultCategoriesWithUser);
      categories = await this.model.find({ userId });
    }

    return categories;
  }
}

export const categoryService = new CategoryService();
