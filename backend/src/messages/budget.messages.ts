/**
 * @file budget.messages.ts
 * @description Centralized domain messages for monthly budget management operations.
 */

export const BUDGET_MESSAGES = {
  BUDGET_EXISTS: 'Budget for this month already exists',
  BUDGET_NOT_FOUND: 'Budget not found',
  USER_NOT_AUTHORIZED: 'User not authorized',
  BUDGET_REMOVED: 'Budget removed',
} as const;
