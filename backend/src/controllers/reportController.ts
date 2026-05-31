import { Response } from 'express';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
  const { month, year, accountId } = req.query;

  try {
    const filter: any = { userId: req.user?._id };
    if (accountId) filter.accountId = accountId;

    if (month && year && month !== 'all' && month !== '0') {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filter)
      .populate('categoryId')
      .populate('accountId');

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = totalIncome - totalExpense;

    const budget = await Budget.findOne({
      userId: req.user?._id,
      month: Number(month),
      year: Number(year),
    });

    res.json({
      totalIncome,
      totalExpense,
      savings,
      budget: budget ? budget.budgetAmount : 0,
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getYearlyReport = async (req: AuthRequest, res: Response) => {
  const { year, accountId } = req.query;

  try {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);

    const filter: any = {
      userId: req.user?._id,
      date: { $gte: startDate, $lte: endDate }
    };
    if (accountId) filter.accountId = accountId;

    const transactions = await Transaction.find(filter);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const month = t.date.getMonth();
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    res.json(monthlyData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryReport = async (req: AuthRequest, res: Response) => {
  const { month, year, accountId } = req.query;

  try {
    const filter: any = {
      userId: req.user?._id,
      type: 'expense'
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
      const catName = (t.categoryId as any).name || 'Unknown';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
    });

    const formattedData = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
    }));

    res.json(formattedData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
