export const APP_NAME = 'ExpenseMate';

export const CATEGORY_TYPES = ['income', 'expense', 'investment', 'saving', 'other'] as const;
export const TRANSACTION_TYPES = ['income', 'expense', 'saving', 'other'] as const;
export const INVESTMENT_BEHAVIORS = ['fixed', 'market'] as const;

export const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'utensils', color: '#EF4444', type: 'expense', isDefault: true },
  { name: 'Travel', icon: 'plane', color: '#3B82F6', type: 'expense', isDefault: true },
  { name: 'Shopping', icon: 'shopping-bag', color: '#8B5CF6', type: 'expense', isDefault: true },
  { name: 'Bills', icon: 'file-text', color: '#F59E0B', type: 'expense', isDefault: true },
  { name: 'Entertainment', icon: 'film', color: '#EC4899', type: 'expense', isDefault: true },
  { name: 'Health', icon: 'heart', color: '#10B981', type: 'expense', isDefault: true },
  { name: 'Salary', icon: 'dollar-sign', color: '#10B981', type: 'income', isDefault: true },
  { name: 'Others', icon: 'more-horizontal', color: '#6B7280', type: 'expense', isDefault: true },
];
