/**
 * @file index.ts
 * @description Centralized TypeScript interfaces and type definitions for ExpenseMate frontend application.
 */

import {
  INVESTMENT_BEHAVIOR_ENUM,
  CATEGORY_TYPES_ENUM,
  TRANSACTION_TYPES_ENUM,
} from '../constants';

export type InvestmentBehavior =
  (typeof INVESTMENT_BEHAVIOR_ENUM)[keyof typeof INVESTMENT_BEHAVIOR_ENUM];

export type CategoryType =
  (typeof CATEGORY_TYPES_ENUM)[keyof typeof CATEGORY_TYPES_ENUM];

export type TransactionType =
  (typeof TRANSACTION_TYPES_ENUM)[keyof typeof TRANSACTION_TYPES_ENUM];

export type ThemePreference = 'light' | 'dark';

export interface User {
  _id: string;
  name: string;
  email: string;
  themePreference: ThemePreference;
  profilePhoto?: string;
  reportWidgetOrder?: string[];
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  investmentBehavior?: InvestmentBehavior;
  userId: string;
  isDefault?: boolean;
}

export interface Account {
  _id: string;
  name: string;
  type: string;
  initialBalance: number;
  balance?: number;
  interestRate?: number;
  maturityDate?: string;
  currentValue?: number;
  userId: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: Category;
  accountId: Account;
  notes?: string;
  date: string;
  userId: string;
}

export interface Budget {
  _id: string;
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount: number;
  userId: string;
}

export interface MonthlyReportData {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  budget: number;
  transactions: Transaction[];
}

export interface YearlyReportItem {
  month: number;
  income: number;
  expense: number;
}

export interface CategoryReportItem {
  name: string;
  amount: number;
}
