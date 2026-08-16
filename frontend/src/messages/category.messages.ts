/**
 * @file category.messages.ts
 * @description Centralized frontend domain messages for category management operations.
 */

export const CATEGORY_MESSAGES = {
  CATEGORIES_LOAD_FAILED: 'Failed to load categories',
  CATEGORY_ADDED: 'Category added successfully',
  CATEGORY_ADD_FAILED: 'Failed to add category',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_UPDATE_FAILED: 'Failed to update category',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_DELETE_FAILED: 'Failed to delete category',
  CONFIRM_DELETE: 'Are you sure you want to delete this category?',
  INVESTMENT_TYPE_ADDED: 'Investment Type added successfully',
  INVESTMENT_TYPE_ADD_FAILED: 'Failed to add investment type',
  INVESTMENT_TYPE_UPDATED: 'Investment Type updated successfully',
  INVESTMENT_TYPE_UPDATE_FAILED: 'Failed to update investment type',
  INVESTMENT_TYPE_DELETED: 'Investment Type deleted successfully',
  INVESTMENT_TYPE_DELETE_FAILED: 'Failed to delete investment type',
  CONFIRM_DELETE_INVESTMENT_TYPE: 'Are you sure you want to delete this investment type?',
} as const;
