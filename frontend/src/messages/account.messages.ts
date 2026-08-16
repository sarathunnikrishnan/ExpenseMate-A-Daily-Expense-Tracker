/**
 * @file account.messages.ts
 * @description Centralized frontend domain messages for account management operations.
 */

export const ACCOUNT_MESSAGES = {
  ACCOUNTS_LOAD_FAILED: 'Failed to load accounts',
  ACCOUNT_ADDED: 'Account added successfully',
  ACCOUNT_ADD_FAILED: 'Failed to add account',
  ACCOUNT_DELETED: 'Account deleted successfully',
  ACCOUNT_DELETE_FAILED: 'Failed to delete account',
  CONFIRM_DELETE: 'Delete this account? Ensure no transactions are linked.',
  INVESTMENT_CREATED: 'Investment account created successfully',
  VALUE_UPDATED: 'Current value updated successfully',
  VALUE_UPDATE_FAILED: 'Failed to update current value',
} as const;
