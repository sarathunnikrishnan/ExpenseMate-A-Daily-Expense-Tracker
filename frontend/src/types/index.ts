export interface User {
  _id: string;
  name: string;
  email: string;
  themePreference: 'light' | 'dark';
  profilePhoto?: string;
  reportWidgetOrder?: string[];
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'investment' | 'saving' | 'other';
  investmentBehavior?: 'fixed' | 'market';
  userId: string;
  isDefault?: boolean;
}

export interface Account {
  _id: string;
  name: string;
  type: string;
  initialBalance: number;
  balance?: number; // Calculated balance from backend
  interestRate?: number;
  maturityDate?: string;
  currentValue?: number;
  userId: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'saving' | 'other';
  categoryId: Category; // Populated from backend
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
