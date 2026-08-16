/**
 * @file budget.service.ts
 * @description BudgetService managing monthly budget configuration and spent amount calculations.
 * Extends BaseService.
 */

import { Types } from 'mongoose';
import { BaseService } from './base.service';
import Budget, { IBudget } from '../models/Budget';
import Transaction from '../models/Transaction';

export class BudgetService extends BaseService<IBudget> {
  constructor() {
    super(Budget);
  }

  async getBudgetsWithSpent(userId: string | Types.ObjectId): Promise<any[]> {
    const budgets = await this.model.find({ userId }).sort({ year: -1, month: -1 });

    return Promise.all(
      budgets.map(async (b) => {
        const startDate = new Date(b.year, b.month - 1, 1);
        const endDate = new Date(b.year, b.month, 0, 23, 59, 59, 999);

        const expenseTxs = await Transaction.find({
          userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        });

        const totalSpent = expenseTxs.reduce((sum, tx) => sum + tx.amount, 0);

        return {
          ...b.toObject(),
          spentAmount: totalSpent,
        };
      })
    );
  }

  async calculateInitialSpent(userId: string | Types.ObjectId, month: number, year: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseTxs = await Transaction.find({
      userId,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    return expenseTxs.reduce((sum, tx) => sum + tx.amount, 0);
  }
}

export const budgetService = new BudgetService();
