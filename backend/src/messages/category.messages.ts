/**
 * @file category.messages.ts
 * @description Centralized domain messages for category management operations.
 */

export const CATEGORY_MESSAGES = {
  CATEGORY_NOT_FOUND: 'Category not found',
  USER_NOT_AUTHORIZED: 'User not authorized',
  CANNOT_EDIT_DEFAULT: 'Cannot edit default categories',
  CANNOT_DELETE_DEFAULT: 'Cannot delete default categories',
  CATEGORY_REMOVED: 'Category removed',
} as const;
