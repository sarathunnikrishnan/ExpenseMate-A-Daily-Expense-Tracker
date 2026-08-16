/**
 * @file report.service.ts
 * @description ReportService generating monthly, yearly, and category-wise expense aggregation analytics.
 */

import { Types } from 'mongoose';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

export class ReportService {
  async getMonthlySummary(userId: string | Types.ObjectId, month?: string, year?: string, accountId?: string) {
    const filter: any = { userId };
    if (accountId) filter.accountId = accountId;

    if (month && year && month !== 'all' && month !== '0') {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter).populate('categoryId').populate('accountId');

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;

    const budget = await Budget.findOne({
      userId,
      month: Number(month),
      year: Number(year),
    });

    return {
      totalIncome,
      totalExpense,
      savings,
      budget: budget ? budget.budgetAmount : 0,
      transactions,
    };
  }

  async getYearlySummary(userId: string | Types.ObjectId, year: string, accountId?: string) {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);

    const filter: any = {
      userId,
      date: { $gte: startDate, $lte: endDate },
    };
    if (accountId) filter.accountId = accountId;

    const transactions = await Transaction.find(filter);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const m = t.date.getMonth();
      if (t.type === 'income') {
        monthlyData[m].income += t.amount;
      } else {
        monthlyData[m].expense += t.amount;
      }
    });

    return monthlyData;
  }

  async getCategorySummary(userId: string | Types.ObjectId, month?: string, year?: string, accountId?: string) {
    const filter: any = {
      userId,
      type: 'expense',
    };
    if (accountId) filter.accountId = accountId;

    if (month && year && month !== 'all' && month !== '0') {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter).populate('categoryId');
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      const catName = (t.categoryId as any)?.name || 'Unknown';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
    }));
  }
}

export const reportService = new ReportService();
