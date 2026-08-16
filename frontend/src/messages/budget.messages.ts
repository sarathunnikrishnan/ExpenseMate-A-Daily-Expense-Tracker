/**
 * @file budget.messages.ts
 * @description Centralized frontend domain messages for budget management operations.
 */

export const BUDGET_MESSAGES = {
  BUDGETS_LOAD_FAILED: 'Failed to load budgets',
  BUDGET_SET_SUCCESS: 'Budget set successfully',
  BUDGET_SET_FAILED: 'Failed to set budget',
  BUDGET_DELETED: 'Budget deleted successfully',
  BUDGET_DELETE_FAILED: 'Failed to delete budget',
  CONFIRM_DELETE: 'Are you sure you want to delete this budget?',
} as const;
