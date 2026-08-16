/**
 * @file transaction.messages.ts
 * @description Centralized domain messages for transaction CRUD operations.
 */

export const TRANSACTION_MESSAGES = {
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  USER_NOT_AUTHORIZED: 'User not authorized',
  TRANSACTION_REMOVED: 'Transaction removed',
} as const;
