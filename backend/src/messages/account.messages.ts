/**
 * @file account.messages.ts
 * @description Centralized domain messages for account management operations.
 */

export const ACCOUNT_MESSAGES = {
  ACCOUNT_NOT_FOUND: 'Account not found',
  USER_NOT_AUTHORIZED: 'User not authorized',
  CANNOT_DELETE_WITH_TRANSACTIONS: 'Cannot delete account with existing transactions',
  ACCOUNT_REMOVED: 'Account removed',
} as const;
