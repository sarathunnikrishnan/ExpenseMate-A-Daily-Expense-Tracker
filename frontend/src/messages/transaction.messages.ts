/**
 * @file transaction.messages.ts
 * @description Centralized frontend domain messages for transaction management operations.
 */

export const TRANSACTION_MESSAGES = {
  TRANSACTIONS_LOAD_FAILED: 'Failed to load transactions',
  TRANSACTION_ADDED: 'Transaction added successfully',
  TRANSACTION_ADD_FAILED: 'Failed to add transaction',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  TRANSACTION_DELETE_FAILED: 'Failed to delete transaction',
  CONFIRM_DELETE: 'Delete this transaction?',
} as const;
