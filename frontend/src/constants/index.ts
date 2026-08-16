/**
 * @file index.ts
 * @description Frontend application constants including routes, headers, form keys, month lists, date formatting tokens, and currency configurations.
 */

export const APP_NAME = 'ExpenseMate';

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    SEND_EMAIL_UPDATE_OTP: '/auth/send-email-update-otp',
  },
  ACCOUNTS: '/accounts',
  BUDGETS: '/budgets',
  CATEGORIES: '/categories',
  TRANSACTIONS: '/transactions',
  REPORTS: {
    MONTHLY: '/reports/monthly',
    YEARLY: '/reports/yearly',
    CATEGORY: '/reports/category',
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
  BUDGETS: '/budgets',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  INVESTMENT_TYPES: '/categories/investment-types',
  INVESTMENTS: '/investments',
  PROFILE: '/profile',
} as const;

export const FORM_DATA_KEYS = {
  NAME: 'name',
  EMAIL: 'email',
  OTP: 'otp',
  OLD_PASSWORD: 'oldPassword',
  PASSWORD: 'password',
  PROFILE_PHOTO: 'profilePhoto',
  REMOVE_PROFILE_PHOTO: 'removeProfilePhoto',
  BOOLEAN_TRUE: 'true',
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  MULTIPART_FORM_DATA: 'multipart/form-data',
} as const;

export const ICONS = {
  TAG: 'tag',
  TRENDING_UP: 'trending-up',
} as const;

export const OTP_PURPOSE = {
  SIGNUP: 'signup',
  EMAIL_UPDATE: 'email_update',
  KEYWORD: 'OTP',
} as const;

export const INVESTMENT_BEHAVIOR_ENUM = {
  FIXED: 'fixed',
  MARKET: 'market',
} as const;

export const ACCOUNT_TYPE_ENUM = {
  BANK: 'Bank',
  CASH: 'Cash',
  INVESTMENT: 'Investment',
  FD: 'FD',
  CREDIT: 'Credit',
  OTHER: 'Other',
} as const;

export const CATEGORY_TYPES_ENUM = {
  INCOME: 'income',
  EXPENSE: 'expense',
  INVESTMENT: 'investment',
  SAVING: 'saving',
  OTHER: 'other',
} as const;

export const TRANSACTION_TYPES_ENUM = {
  INCOME: 'income',
  EXPENSE: 'expense',
  SAVING: 'saving',
  OTHER: 'other',
} as const;

export const DEFAULT_COLORS = {
  PRIMARY: '#4F46E5',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  CYAN: '#06B6D4',
  ORANGE: '#F97316',
} as const;

export const CHART_COLORS = [
  DEFAULT_COLORS.PRIMARY,
  DEFAULT_COLORS.SUCCESS,
  DEFAULT_COLORS.WARNING,
  DEFAULT_COLORS.DANGER,
  DEFAULT_COLORS.PURPLE,
  DEFAULT_COLORS.PINK,
  DEFAULT_COLORS.CYAN,
  DEFAULT_COLORS.ORANGE,
];

export const UI_LABELS = {
  ACCOUNT_BALANCE: 'Account Balance',
  TOTAL_BALANCE: 'Total Balance',
  INCOME: 'Income',
  EXPENSES: 'Expenses',
  SAVINGS: 'Savings',
  RECENT_TRANSACTIONS: 'Recent Transactions',
  MY_ACCOUNTS: 'My Accounts',
  ALL_ACCOUNTS: 'All Accounts',
  ALL_TIME: 'All Time',
  TOTAL_INVESTED: 'Total Invested',
  CURRENT_VALUATION: 'Current Valuation',
  TOTAL_RETURNS: 'Total Returns',
  ADD_ASSET: 'Add Asset',
  YOUR_PORTFOLIO: 'Your Portfolio',
  MONTHLY_BUDGETS: 'Monthly Budgets',
  SET_NEW_BUDGET: 'Set New Budget',
  BUDGET_HISTORY: 'Budget History',
  MANAGE_ACCOUNTS: 'Manage Accounts',
  ADD_NEW_ACCOUNT: 'Add New Account',
  YOUR_ACCOUNTS: 'Your Accounts',
  TRANSACTION_CATEGORIES: 'Transaction Categories',
  ADD_CATEGORY: 'Add Category',
  EDIT_CATEGORY: 'Edit Category',
  YOUR_CATEGORIES: 'Your Categories',
  INVESTMENT_TYPES: 'Investment Types',
  ADD_TYPE: 'Add Type',
  EDIT_TYPE: 'Edit Type',
  YOUR_ASSET_CLASSES: 'Your Asset Classes',
  PROFILE_SETTINGS: 'Profile Settings',
  PERSONAL_INFORMATION: 'Personal Information',
  DANGER_ZONE: 'Danger Zone',
  REPORTS_ANALYTICS: 'Reports & Analytics',
  TRANSACTIONS: 'Transactions',
  ADD_TRANSACTION: 'Add Transaction',
  TRANSACTION_HISTORY: 'Transaction History',
} as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 31/12/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 12/31/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-12-31)' },
  { value: 'DD MMM, YYYY', label: 'DD MMM, YYYY (e.g. 31 Dec, 2026)' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (e.g. Dec 31, 2026)' },
  { value: 'DD MMMM YYYY', label: 'DD MMMM YYYY (e.g. 31 December 2026)' },
  { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY (e.g. December 31, 2026)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (e.g. 31-12-2026)' },
  { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY (e.g. 12-31-2026)' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (e.g. 2026/12/31)' },
  { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (e.g. 31.12.2026)' },
  { value: 'YY/MM/DD', label: 'YY/MM/DD (e.g. 26/12/31)' },
];

export const CURRENCIES = [
  { symbol: '₹', name: 'Indian Rupee (INR)' },
  { symbol: '$', name: 'US Dollar (USD)' },
  { symbol: '€', name: 'Euro (EUR)' },
  { symbol: '£', name: 'British Pound (GBP)' },
  { symbol: '¥', name: 'Japanese Yen (JPY)' },
  { symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { symbol: 'C$', name: 'Canadian Dollar (CAD)' },
  { symbol: 'CHF', name: 'Swiss Franc (CHF)' },
];

export const CATEGORY_TYPES = ['income', 'expense', 'investment', 'saving', 'other'] as const;
export const TRANSACTION_TYPES = ['income', 'expense', 'saving', 'other'] as const;
