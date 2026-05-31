export const APP_NAME = 'ExpenseMate';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

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
