import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await Budget.find({ userId: req.user?._id }).sort({ year: -1, month: -1 });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (b) => {
        const startDate = new Date(b.year, b.month - 1, 1);
        const endDate = new Date(b.year, b.month, 0, 23, 59, 59, 999);

        const expenseTxs = await Transaction.find({
          userId: req.user?._id,
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

    res.json(budgetsWithSpent);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  const { month, year, budgetAmount } = req.body;

  try {
    const existingBudget = await Budget.findOne({ month, year, userId: req.user?._id });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this month already exists' });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    const expenseTxs = await Transaction.find({
      userId: req.user?._id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    const initialSpent = expenseTxs.reduce((sum, tx) => sum + tx.amount, 0);

    const budget = new Budget({
      month,
      year,
      budgetAmount,
      spentAmount: initialSpent,
      userId: req.user?._id,
    });

    const createdBudget = await budget.save();
    res.status(201).json(createdBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  const { budgetAmount, spentAmount } = req.body;

  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (budgetAmount !== undefined) budget.budgetAmount = budgetAmount;
    if (spentAmount !== undefined) budget.spentAmount = spentAmount;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user?._id?.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
